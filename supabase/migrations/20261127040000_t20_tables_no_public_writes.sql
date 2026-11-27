-- T20 statistics tables (27 Nov 2026): the "Allow service insert/update"
-- policies were granted to PUBLIC, so anyone (signed in or not) could add or
-- change rows. The Cricsheet sync uses the service key, which bypasses RLS and
-- needs no policy, and neither app writes these tables. Public read stays.
do $$
declare r record;
begin
  for r in select c.relname from pg_class c
           where c.relnamespace = 'public'::regnamespace and c.relkind = 'r' and c.relname like 't20\_%' loop
    execute format('drop policy if exists %I on public.%I', 'Allow service insert', r.relname);
    execute format('drop policy if exists %I on public.%I', 'Allow service update', r.relname);
  end loop;
end
$$;
