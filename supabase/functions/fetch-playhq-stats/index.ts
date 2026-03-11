// supabase/functions/fetch-playhq-stats/index.ts
// ────────────────────────────────────────────────────
// Attempts to fetch cricket stats from a PlayCricket / PlayHQ
// public profile URL and store them in the player_stats tables.
//
// This is a best-effort scraper — PlayCricket profiles are SPAs
// backed by PlayHQ APIs. When direct scraping fails (private profiles,
// SPA rendering, etc.) the function returns a helpful error message
// so the admin can enter stats manually.
// ────────────────────────────────────────────────────

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { cohort_id, profile_url, player_name } = await req.json();

    if (!cohort_id || !profile_url) {
      return new Response(
        JSON.stringify({ success: false, message: "Missing cohort_id or profile_url" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // ── Initialise Supabase client ────────────────────────
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // ── Attempt to detect PlayHQ participant ID from URL ──
    // PlayCricket profile URLs can take several forms:
    //   https://play.cricket.com.au/player/{uuid}/overview
    //   https://www.playhq.com/cricket-australia/org/.../participant/{uuid}
    //   Or just a generic URL the user pasted
    const uuidRegex = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;
    const match = profile_url.match(uuidRegex);

    let statsData = null;

    if (match) {
      const participantId = match[0];

      // ── Try PlayHQ public API ───────────────────────────
      // The public API at api.playhq.com can return participant
      // statistics if we know the org/season/grade structure.
      // For now, attempt a direct profile fetch approach.
      try {
        // Attempt 1: Fetch the profile page HTML
        const pageRes = await fetch(profile_url, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "Accept": "text/html,application/json",
          },
        });

        if (pageRes.ok) {
          const html = await pageRes.text();

          // Try to extract any embedded JSON state (common in SSR/hydrated SPAs)
          const stateMatch = html.match(/__NEXT_DATA__\s*=\s*({.+?})\s*;?\s*<\/script>/s)
            || html.match(/window\.__INITIAL_STATE__\s*=\s*({.+?})\s*;?\s*<\/script>/s)
            || html.match(/"statistics":\s*(\{.+?\})\s*[,}]/s);

          if (stateMatch) {
            try {
              const parsed = JSON.parse(stateMatch[1]);
              // Extract stats from the parsed state — structure depends on PlayHQ's frontend
              statsData = extractStatsFromState(parsed);
            } catch (_e) {
              // JSON parse failed — fall through to manual
            }
          }

          // Attempt 2: Look for stats in HTML tables (older PlayCricket pages)
          if (!statsData) {
            statsData = extractStatsFromHTML(html);
          }
        }
      } catch (fetchErr) {
        console.error("Profile fetch error:", fetchErr);
      }

      // Attempt 3: Try the PlayHQ public stats API directly
      if (!statsData) {
        try {
          const apiRes = await fetch(
            `https://api.playhq.com/v1/participants/${participantId}/statistics`,
            {
              headers: {
                "x-phq-tenant": "ca",
                "Accept": "application/json",
              },
            }
          );
          if (apiRes.ok) {
            const apiData = await apiRes.json();
            statsData = extractStatsFromAPI(apiData);
          }
        } catch (_apiErr) {
          // API call failed — this endpoint may require auth
        }
      }
    }

    // ── If we got stats, store them ──────────────────────
    if (statsData && statsData.seasons && statsData.seasons.length > 0) {
      let seasonsFound = 0;

      for (const season of statsData.seasons) {
        // Upsert season
        const { data: seasonRow, error: sErr } = await supabase
          .from("player_stats_seasons")
          .upsert(
            {
              cohort_id,
              season_name: season.name,
              season_year: season.year || new Date().getFullYear(),
              source: "playhq_fetch",
              fetched_from_url: profile_url,
              last_fetched_at: new Date().toISOString(),
            },
            { onConflict: "cohort_id,season_name" }
          )
          .select()
          .single();

        if (sErr || !seasonRow) continue;
        seasonsFound++;

        // Insert teams for this season
        for (const team of season.teams || []) {
          const { data: teamRow } = await supabase
            .from("player_stats_teams")
            .insert({
              season_id: seasonRow.id,
              team_name: team.team_name || "Unknown Team",
              club_name: team.club_name || null,
              grade: team.grade || null,
              competition: team.competition || null,
              level: team.level || null,
              bat_innings: team.batting?.innings || 0,
              bat_not_outs: team.batting?.not_outs || 0,
              bat_runs: team.batting?.runs || 0,
              bat_highest_score: team.batting?.highest_score || null,
              bat_average: team.batting?.average || null,
              bat_strike_rate: team.batting?.strike_rate || null,
              bat_fifties: team.batting?.fifties || 0,
              bat_hundreds: team.batting?.hundreds || 0,
              bowl_innings: team.bowling?.innings || 0,
              bowl_overs: team.bowling?.overs || 0,
              bowl_maidens: team.bowling?.maidens || 0,
              bowl_runs_conceded: team.bowling?.runs_conceded || 0,
              bowl_wickets: team.bowling?.wickets || 0,
              bowl_average: team.bowling?.average || null,
              bowl_economy: team.bowling?.economy || null,
              bowl_best_figures: team.bowling?.best_figures || null,
              field_catches: team.fielding?.catches || 0,
              field_run_outs: team.fielding?.run_outs || 0,
              field_stumpings: team.fielding?.stumpings || 0,
            })
            .select()
            .single();

          if (!teamRow) continue;

          // Insert individual games if available
          for (const game of team.games || []) {
            await supabase.from("player_stats_games").insert({
              team_id: teamRow.id,
              match_date: game.date || null,
              opponent: game.opponent || null,
              venue: game.venue || null,
              result: game.result || null,
              match_type: game.match_type || null,
              bat_runs: game.batting?.runs ?? null,
              bat_balls_faced: game.batting?.balls_faced ?? null,
              bat_fours: game.batting?.fours ?? null,
              bat_sixes: game.batting?.sixes ?? null,
              bat_how_out: game.batting?.how_out || null,
              bat_position: game.batting?.position ?? null,
              bat_not_out: game.batting?.not_out || false,
              bowl_overs: game.bowling?.overs ?? null,
              bowl_maidens: game.bowling?.maidens ?? null,
              bowl_runs_conceded: game.bowling?.runs_conceded ?? null,
              bowl_wickets: game.bowling?.wickets ?? null,
              field_catches: game.fielding?.catches || 0,
              field_run_outs: game.fielding?.run_outs || 0,
              field_stumpings: game.fielding?.stumpings || 0,
            });
          }
        }
      }

      return new Response(
        JSON.stringify({ success: true, seasons_found: seasonsFound }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ── No stats found ──────────────────────────────────
    return new Response(
      JSON.stringify({
        success: false,
        message: `Could not extract stats from the provided URL. This usually means:\n• The player's PlayCricket profile is set to Private\n• The URL doesn't point to a valid PlayCricket profile\n• The profile page structure has changed\n\nYou can enter stats manually using the forms below.`,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Edge function error:", err);
    return new Response(
      JSON.stringify({ success: false, message: `Server error: ${err.message}` }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});

// ─── Helpers: Extract stats from various source formats ───

function extractStatsFromState(state: any): any {
  // This would parse PlayHQ's __NEXT_DATA__ or similar embedded state.
  // The exact structure depends on PlayHQ's frontend build.
  // Placeholder — update when the actual structure is confirmed.
  try {
    const stats = state?.props?.pageProps?.statistics
      || state?.participant?.statistics
      || state?.statistics;

    if (!stats) return null;

    // Map to our format
    return {
      seasons: Object.entries(stats.seasons || {}).map(([name, data]: [string, any]) => ({
        name,
        year: parseInt(name.split("/")[0]) + 1 || new Date().getFullYear(),
        teams: (data.teams || []).map((t: any) => ({
          team_name: t.teamName || t.name,
          club_name: t.clubName,
          grade: t.gradeName,
          competition: t.competitionName,
          batting: t.batting,
          bowling: t.bowling,
          fielding: t.fielding,
          games: t.games || [],
        })),
      })),
    };
  } catch {
    return null;
  }
}

function extractStatsFromHTML(html: string): any {
  // Basic HTML table extraction for older PlayCricket pages
  // that render stats server-side in table elements.
  // This is a simplified parser — real-world HTML may vary.
  try {
    // Look for stats tables with common class names
    const hasStats = html.includes("career-statistics")
      || html.includes("season-statistics")
      || html.includes("batting-stats")
      || html.includes("stat-table");

    if (!hasStats) return null;

    // For a production scraper, use a proper HTML parser like linkedom.
    // This placeholder returns null to trigger manual entry.
    return null;
  } catch {
    return null;
  }
}

function extractStatsFromAPI(apiData: any): any {
  // Parse the PlayHQ public API participant statistics response.
  // Structure based on PlayHQ API documentation patterns.
  try {
    if (!apiData?.data?.length) return null;

    const seasons: any[] = [];
    for (const entry of apiData.data) {
      seasons.push({
        name: entry.seasonName || entry.season?.name || "Unknown",
        year: entry.seasonYear || new Date().getFullYear(),
        teams: (entry.teams || [entry]).map((t: any) => ({
          team_name: t.teamName || "Unknown",
          club_name: t.clubName || null,
          grade: t.gradeName || null,
          competition: t.competitionName || null,
          batting: {
            innings: t.batting?.innings || 0,
            runs: t.batting?.runs || 0,
            average: t.batting?.average || null,
            strike_rate: t.batting?.strikeRate || null,
            highest_score: t.batting?.highestScore || null,
            not_outs: t.batting?.notOuts || 0,
            fifties: t.batting?.fifties || 0,
            hundreds: t.batting?.hundreds || 0,
          },
          bowling: {
            innings: t.bowling?.innings || 0,
            overs: t.bowling?.overs || 0,
            wickets: t.bowling?.wickets || 0,
            average: t.bowling?.average || null,
            economy: t.bowling?.economy || null,
            best_figures: t.bowling?.bestFigures || null,
            maidens: t.bowling?.maidens || 0,
            runs_conceded: t.bowling?.runsConceded || 0,
          },
          fielding: {
            catches: t.fielding?.catches || 0,
            run_outs: t.fielding?.runOuts || 0,
            stumpings: t.fielding?.stumpings || 0,
          },
          games: [],
        })),
      });
    }

    return { seasons };
  } catch {
    return null;
  }
}
