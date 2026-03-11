-- ============================================================
-- Player Cricket Stats — 3-tier hierarchy
-- Season → Team/Grade → Individual Games
-- ============================================================

-- 1. Seasons
CREATE TABLE IF NOT EXISTS player_stats_seasons (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    cohort_id UUID NOT NULL REFERENCES official_cohort_2026(id) ON DELETE CASCADE,
    season_name TEXT NOT NULL,          -- e.g. "2024/25"
    season_year INT NOT NULL,           -- e.g. 2025 (for sorting)
    source TEXT DEFAULT 'manual',       -- 'manual' | 'playhq_fetch'
    fetched_from_url TEXT,              -- PlayCricket profile URL used
    last_fetched_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(cohort_id, season_name)
);

-- 2. Teams within a season
CREATE TABLE IF NOT EXISTS player_stats_teams (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    season_id UUID NOT NULL REFERENCES player_stats_seasons(id) ON DELETE CASCADE,
    team_name TEXT NOT NULL,             -- e.g. "Melbourne CC - 1st XI"
    club_name TEXT,                      -- e.g. "Melbourne Cricket Club"
    grade TEXT,                          -- e.g. "Premier 1st XI"
    competition TEXT,                    -- e.g. "Victorian Premier Cricket"
    level TEXT,                          -- "Premier" | "District" | "Junior" | "Representative" | "School" | "Other"

    -- Batting aggregates
    bat_innings INT DEFAULT 0,
    bat_not_outs INT DEFAULT 0,
    bat_runs INT DEFAULT 0,
    bat_highest_score TEXT,              -- TEXT to handle "102*" style notation
    bat_average NUMERIC(6,2),
    bat_strike_rate NUMERIC(6,2),
    bat_fifties INT DEFAULT 0,
    bat_hundreds INT DEFAULT 0,
    bat_ducks INT DEFAULT 0,
    bat_fours INT DEFAULT 0,
    bat_sixes INT DEFAULT 0,
    bat_balls_faced INT DEFAULT 0,

    -- Bowling aggregates
    bowl_innings INT DEFAULT 0,
    bowl_overs NUMERIC(6,1) DEFAULT 0,
    bowl_maidens INT DEFAULT 0,
    bowl_runs_conceded INT DEFAULT 0,
    bowl_wickets INT DEFAULT 0,
    bowl_average NUMERIC(6,2),
    bowl_economy NUMERIC(6,2),
    bowl_best_figures TEXT,              -- e.g. "5/23"
    bowl_five_fers INT DEFAULT 0,

    -- Fielding aggregates
    field_catches INT DEFAULT 0,
    field_run_outs INT DEFAULT 0,
    field_stumpings INT DEFAULT 0,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Individual games within a team
CREATE TABLE IF NOT EXISTS player_stats_games (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    team_id UUID NOT NULL REFERENCES player_stats_teams(id) ON DELETE CASCADE,
    match_date DATE,
    opponent TEXT,
    venue TEXT,
    result TEXT,                          -- "Won" | "Lost" | "Draw" | "Tied" | "No Result"
    match_type TEXT,                      -- "One Day" | "Two Day" | "T20" | "Other"

    -- Batting
    bat_runs INT,
    bat_balls_faced INT,
    bat_fours INT,
    bat_sixes INT,
    bat_how_out TEXT,                     -- "Caught" | "Bowled" | "LBW" | "Run Out" | "Not Out" etc.
    bat_position INT,                     -- batting order position
    bat_not_out BOOLEAN DEFAULT FALSE,

    -- Bowling
    bowl_overs NUMERIC(4,1),
    bowl_maidens INT,
    bowl_runs_conceded INT,
    bowl_wickets INT,

    -- Fielding
    field_catches INT DEFAULT 0,
    field_run_outs INT DEFAULT 0,
    field_stumpings INT DEFAULT 0,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Indexes
-- ============================================================
CREATE INDEX idx_stats_seasons_cohort ON player_stats_seasons(cohort_id);
CREATE INDEX idx_stats_teams_season ON player_stats_teams(season_id);
CREATE INDEX idx_stats_games_team ON player_stats_games(team_id);

-- ============================================================
-- RLS Policies  (match existing admin auth pattern)
-- ============================================================
ALTER TABLE player_stats_seasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_stats_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_stats_games ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users (admin dashboard users) full access
CREATE POLICY "Admin full access on player_stats_seasons"
    ON player_stats_seasons FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin full access on player_stats_teams"
    ON player_stats_teams FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin full access on player_stats_games"
    ON player_stats_games FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_seasons
    BEFORE UPDATE ON player_stats_seasons
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_updated_at_teams
    BEFORE UPDATE ON player_stats_teams
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
