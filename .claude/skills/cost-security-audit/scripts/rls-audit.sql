-- ============================================================================
-- rls-audit.sql — Supabase RLS / view / grant / function exposure checks
--
-- Run each query via the Supabase MCP (mcp__Supabase*__execute_sql, project_id =
-- the subdomain of VITE_SUPABASE_URL) or psql against the project DB.
-- Pair with mcp__Supabase*__get_advisors {type:"security"} for the full linter.
-- All read-only. Interpret with SKILL.md Pillar 3b.
-- ============================================================================

-- Q1. Tables WITHOUT RLS enabled (should be empty in a locked-down project).
select n.nspname, c.relname
from pg_class c join pg_namespace n on n.oid=c.relnamespace
where n.nspname='public' and c.relkind='r' and c.relrowsecurity=false
order by c.relname;

-- Q2. VIEWS: the SECURITY DEFINER trap. security_invoker=false + anon/auth SELECT
--     => that role bypasses underlying-table RLS and reads ALL rows.
--     Anything with anon_select=true OR auth_select=true here needs review.
select c.relname as view_name,
  coalesce((select o.option_value from pg_options_to_table(c.reloptions) o
            where o.option_name='security_invoker'),'false') as security_invoker,
  has_table_privilege('anon', c.oid, 'SELECT')          as anon_select,
  has_table_privilege('authenticated', c.oid, 'SELECT') as auth_select
from pg_class c join pg_namespace n on n.oid=c.relnamespace
where n.nspname='public' and c.relkind='v'
order by anon_select desc, auth_select desc, c.relname;

-- Q3. RLS policies that grant SELECT/ALL to anon or public (read-exposure surface).
--     Reference data with USING(true) may be intentional; PII tables are not.
select pp.tablename, pp.policyname, pp.cmd, pp.roles::text,
       pg_get_expr(pol.polqual, pol.polrelid) as using_expr
from pg_policies pp
join pg_policy pol on pol.polname=pp.policyname
join pg_class c on c.oid=pol.polrelid and c.relname=pp.tablename
where pp.schemaname='public' and pp.cmd in ('SELECT','ALL')
  and (pp.roles && array['anon','public']::name[])
order by pp.tablename, pp.policyname;

-- Q4. WRITE-open policies (INSERT/UPDATE/DELETE/ALL with USING/CHECK = true) for
--     anon/public => bots can inject or wipe rows. Matches advisor rls_policy_always_true.
select pp.tablename, pp.policyname, pp.cmd, pp.roles::text,
       pg_get_expr(pol.polqual, pol.polrelid)      as using_expr,
       pg_get_expr(pol.polwithcheck, pol.polrelid) as with_check
from pg_policies pp
join pg_policy pol on pol.polname=pp.policyname
join pg_class c on c.oid=pol.polrelid and c.relname=pp.tablename
where pp.schemaname='public' and pp.cmd in ('INSERT','UPDATE','DELETE','ALL')
  and (pp.roles && array['anon','public']::name[])
  and (coalesce(pg_get_expr(pol.polqual,pol.polrelid),'true')='true'
       or coalesce(pg_get_expr(pol.polwithcheck,pol.polrelid),'true')='true')
order by pp.tablename, pp.cmd;

-- Q5. Client-readable columns that look like credentials/secrets (plaintext leak).
--     Cross-check the table against Q2/Q3 — if the table is anon/auth readable, this is CRITICAL.
select table_name, column_name, data_type
from information_schema.columns
where table_schema='public'
  and column_name ~* '(^|_)(pass|password|passwd|secret|api_?key|private_?key|hash|salt)(_|$)'
order by table_name, column_name;

-- Q6. SECURITY DEFINER functions executable by anon/authenticated via the REST API.
--     These run elevated; review exports/lookups. Matches advisor *_security_definer_*.
select p.proname,
       pg_get_function_identity_arguments(p.oid) as args,
       has_function_privilege('anon', p.oid, 'EXECUTE')          as anon_exec,
       has_function_privilege('authenticated', p.oid, 'EXECUTE') as auth_exec
from pg_proc p join pg_namespace n on n.oid=p.pronamespace
where n.nspname='public' and p.prosecdef=true
  and (has_function_privilege('anon', p.oid, 'EXECUTE')
       or has_function_privilege('authenticated', p.oid, 'EXECUTE'))
order by anon_exec desc, p.proname;

-- Q7. Public storage buckets + broad object-listing policies (file enumeration).
select b.id as bucket, b.public,
       (select count(*) from pg_policies p
        where p.schemaname='storage' and p.tablename='objects' and p.cmd in ('SELECT','ALL')
       ) as object_select_policies
from storage.buckets b
order by b.public desc, b.id;
