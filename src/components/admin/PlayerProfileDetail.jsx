import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, User, Phone, Mail, MapPin, Calendar, ExternalLink,
    FileText, Activity, RefreshCw, Plus, ChevronDown, ChevronRight,
    Edit3, Trash2, Save, Loader2, AlertCircle, CheckCircle2,
    Target, Award, Shield
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { formatDate, formatDateShort } from './dateUtils';

/* ════════════════════════════════════════════════════════════
   Shared UI helpers
   ════════════════════════════════════════════════════════════ */

const DetailRow = ({ icon: Icon, label, value, isLink }) => {
    if (!value) return null;
    return (
        <div className="flex items-start gap-3 py-2">
            <Icon className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
            <div className="min-w-0">
                <p className="text-slate-500 text-xs uppercase tracking-wider mb-0.5">{label}</p>
                {isLink ? (
                    <a href={value} target="_blank" rel="noopener noreferrer" className="text-rr-pink text-sm hover:underline flex items-center gap-1">
                        {value.length > 50 ? value.substring(0, 50) + '…' : value}
                        <ExternalLink className="w-3 h-3" />
                    </a>
                ) : (
                    <p className="text-white text-sm">{value}</p>
                )}
            </div>
        </div>
    );
};

const StatBox = ({ label, value, small = false }) => (
    <div className={`text-center ${small ? 'px-2 py-1.5' : 'px-3 py-2'}`}>
        <p className={`font-black text-white ${small ? 'text-sm' : 'text-lg'}`}>{value ?? '—'}</p>
        <p className="text-slate-500 text-[10px] uppercase tracking-wider mt-0.5">{label}</p>
    </div>
);

const LEVELS = ['Premier', 'District', 'Junior', 'Representative', 'School', 'Other'];
const MATCH_TYPES = ['One Day', 'Two Day', 'T20', 'Other'];
const RESULTS = ['Won', 'Lost', 'Draw', 'Tied', 'No Result'];
const DISMISSALS = ['Caught', 'Bowled', 'LBW', 'Run Out', 'Stumped', 'Hit Wicket', 'Retired', 'Not Out', 'Did Not Bat'];

/* ════════════════════════════════════════════════════════════
   Main Component
   ════════════════════════════════════════════════════════════ */

const PlayerProfileDetail = ({ player, onClose, onStatsUpdated }) => {
    const [activeTab, setActiveTab] = useState('info');

    // Stats data
    const [seasons, setSeasons] = useState([]);
    const [teamsMap, setTeamsMap] = useState({});  // season_id → teams[]
    const [gamesMap, setGamesMap] = useState({});  // team_id → games[]
    const [loadingStats, setLoadingStats] = useState(true);
    const [activeSeasonId, setActiveSeasonId] = useState(null);
    const [expandedTeams, setExpandedTeams] = useState(new Set());

    // Forms
    const [showAddSeason, setShowAddSeason] = useState(false);
    const [showAddTeam, setShowAddTeam] = useState(null);   // season_id or null
    const [showAddGame, setShowAddGame] = useState(null);    // team_id or null
    const [editingTeam, setEditingTeam] = useState(null);    // team object or null
    const [saving, setSaving] = useState(false);

    // PlayHQ fetch
    const [fetching, setFetching] = useState(false);
    const [fetchResult, setFetchResult] = useState(null);  // full result from scraper

    /* ── Fetch all stats for this player ──────────────────── */
    const fetchStats = useCallback(async () => {
        setLoadingStats(true);
        try {
            const { data: seasonsData } = await supabase
                .from('player_stats_seasons')
                .select('*')
                .eq('cohort_id', player.id)
                .order('season_year', { ascending: false });

            const sList = seasonsData || [];
            setSeasons(sList);

            if (sList.length > 0 && !activeSeasonId) {
                setActiveSeasonId(sList[0].id);
            }

            // Fetch teams for all seasons
            const seasonIds = sList.map(s => s.id);
            if (seasonIds.length > 0) {
                const { data: teamsData } = await supabase
                    .from('player_stats_teams')
                    .select('*')
                    .in('season_id', seasonIds)
                    .order('created_at', { ascending: true });

                const tMap = {};
                (teamsData || []).forEach(t => {
                    if (!tMap[t.season_id]) tMap[t.season_id] = [];
                    tMap[t.season_id].push(t);
                });
                setTeamsMap(tMap);

                // Fetch games for all teams
                const teamIds = (teamsData || []).map(t => t.id);
                if (teamIds.length > 0) {
                    const { data: gamesData } = await supabase
                        .from('player_stats_games')
                        .select('*')
                        .in('team_id', teamIds)
                        .order('match_date', { ascending: false });

                    const gMap = {};
                    (gamesData || []).forEach(g => {
                        if (!gMap[g.team_id]) gMap[g.team_id] = [];
                        gMap[g.team_id].push(g);
                    });
                    setGamesMap(gMap);
                }
            }
        } catch (err) {
            console.error('Error fetching stats:', err);
        } finally {
            setLoadingStats(false);
        }
    }, [player.id, activeSeasonId]);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    /* ── Toggle game expansion ────────────────────────────── */
    const toggleTeamExpand = (teamId) => {
        setExpandedTeams(prev => {
            const next = new Set(prev);
            if (next.has(teamId)) next.delete(teamId);
            else next.add(teamId);
            return next;
        });
    };

    /* ── PlayHQ Chrome Fetch ─────────────────────────────── */
    const handleFetchPlayHQ = async () => {
        setFetching(true);
        setFetchResult(null);

        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error('Not signed in');
            const response = await fetch('/api/fetch-playhq-stats', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session.access_token}`,
                },
                body: JSON.stringify({
                    player_name: player.player_name,
                    club: player.club,
                    profile_url: player.profile_link || null,
                }),
            });

            const data = await response.json();
            setFetchResult(data);

            // If we got seasons data, auto-save to Supabase
            if (data.success && data.seasons?.length > 0) {
                await saveFetchedStats(data.seasons);
            }
        } catch (err) {
            console.error('Fetch error:', err);
            setFetchResult({
                success: false,
                message: 'Could not connect to the stats service. This may mean the function hasn\'t been deployed yet, or there\'s a network issue. Try again or enter stats manually.',
            });
        } finally {
            setFetching(false);
        }
    };

    const saveFetchedStats = async (fetchedSeasons) => {
        try {
            for (const season of fetchedSeasons) {
                // Upsert season
                const { data: seasonRow, error: sErr } = await supabase
                    .from('player_stats_seasons')
                    .upsert({
                        cohort_id: player.id,
                        season_name: season.name || 'Unknown Season',
                        season_year: season.year || new Date().getFullYear(),
                        source: 'playhq_fetch',
                        fetched_from_url: player.profile_link || null,
                        last_fetched_at: new Date().toISOString(),
                    }, { onConflict: 'cohort_id,season_name' })
                    .select()
                    .single();

                if (sErr || !seasonRow) continue;

                // Insert teams
                for (const team of season.teams || []) {
                    await supabase.from('player_stats_teams').insert({
                        season_id: seasonRow.id,
                        team_name: team.team_name || 'Unknown Team',
                        club_name: team.club_name || null,
                        grade: team.grade || null,
                        level: team.level || null,
                        bat_innings: team.batting?.innings || 0,
                        bat_not_outs: team.batting?.not_outs || 0,
                        bat_runs: team.batting?.runs || 0,
                        bat_highest_score: team.batting?.highest_score || null,
                        bat_average: team.batting?.average || null,
                        bat_strike_rate: team.batting?.strike_rate || null,
                        bat_fifties: team.batting?.fifties || 0,
                        bat_hundreds: team.batting?.hundreds || 0,
                        bat_fours: team.batting?.fours || 0,
                        bat_sixes: team.batting?.sixes || 0,
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
                    });
                }
            }

            // Refresh stats display
            await fetchStats();
            onStatsUpdated?.();
        } catch (err) {
            console.error('Error saving fetched stats:', err);
        }
    };

    /* ── CRUD: Add Season ─────────────────────────────────── */
    const handleAddSeason = async (formData) => {
        setSaving(true);
        try {
            const { error } = await supabase.from('player_stats_seasons').insert({
                cohort_id: player.id,
                season_name: formData.season_name,
                season_year: parseInt(formData.season_year),
                source: 'manual',
            });
            if (error) throw error;
            setShowAddSeason(false);
            await fetchStats();
            onStatsUpdated?.();
        } catch (err) {
            console.error('Error adding season:', err);
            alert('Error adding season: ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    /* ── CRUD: Add Team ───────────────────────────────────── */
    const handleAddTeam = async (formData) => {
        setSaving(true);
        try {
            const payload = {
                season_id: showAddTeam,
                team_name: formData.team_name,
                club_name: formData.club_name,
                grade: formData.grade,
                competition: formData.competition,
                level: formData.level,
                bat_innings: parseInt(formData.bat_innings) || 0,
                bat_not_outs: parseInt(formData.bat_not_outs) || 0,
                bat_runs: parseInt(formData.bat_runs) || 0,
                bat_highest_score: formData.bat_highest_score || null,
                bat_average: parseFloat(formData.bat_average) || null,
                bat_strike_rate: parseFloat(formData.bat_strike_rate) || null,
                bat_fifties: parseInt(formData.bat_fifties) || 0,
                bat_hundreds: parseInt(formData.bat_hundreds) || 0,
                bat_ducks: parseInt(formData.bat_ducks) || 0,
                bat_fours: parseInt(formData.bat_fours) || 0,
                bat_sixes: parseInt(formData.bat_sixes) || 0,
                bat_balls_faced: parseInt(formData.bat_balls_faced) || 0,
                bowl_innings: parseInt(formData.bowl_innings) || 0,
                bowl_overs: parseFloat(formData.bowl_overs) || 0,
                bowl_maidens: parseInt(formData.bowl_maidens) || 0,
                bowl_runs_conceded: parseInt(formData.bowl_runs_conceded) || 0,
                bowl_wickets: parseInt(formData.bowl_wickets) || 0,
                bowl_average: parseFloat(formData.bowl_average) || null,
                bowl_economy: parseFloat(formData.bowl_economy) || null,
                bowl_best_figures: formData.bowl_best_figures || null,
                bowl_five_fers: parseInt(formData.bowl_five_fers) || 0,
                field_catches: parseInt(formData.field_catches) || 0,
                field_run_outs: parseInt(formData.field_run_outs) || 0,
                field_stumpings: parseInt(formData.field_stumpings) || 0,
            };

            const { error } = await supabase.from('player_stats_teams').insert(payload);
            if (error) throw error;
            setShowAddTeam(null);
            await fetchStats();
            onStatsUpdated?.();
        } catch (err) {
            console.error('Error adding team:', err);
            alert('Error adding team: ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    /* ── CRUD: Update Team ────────────────────────────────── */
    const handleUpdateTeam = async (formData) => {
        if (!editingTeam) return;
        setSaving(true);
        try {
            const payload = {
                team_name: formData.team_name,
                club_name: formData.club_name,
                grade: formData.grade,
                competition: formData.competition,
                level: formData.level,
                bat_innings: parseInt(formData.bat_innings) || 0,
                bat_not_outs: parseInt(formData.bat_not_outs) || 0,
                bat_runs: parseInt(formData.bat_runs) || 0,
                bat_highest_score: formData.bat_highest_score || null,
                bat_average: parseFloat(formData.bat_average) || null,
                bat_strike_rate: parseFloat(formData.bat_strike_rate) || null,
                bat_fifties: parseInt(formData.bat_fifties) || 0,
                bat_hundreds: parseInt(formData.bat_hundreds) || 0,
                bat_ducks: parseInt(formData.bat_ducks) || 0,
                bat_fours: parseInt(formData.bat_fours) || 0,
                bat_sixes: parseInt(formData.bat_sixes) || 0,
                bat_balls_faced: parseInt(formData.bat_balls_faced) || 0,
                bowl_innings: parseInt(formData.bowl_innings) || 0,
                bowl_overs: parseFloat(formData.bowl_overs) || 0,
                bowl_maidens: parseInt(formData.bowl_maidens) || 0,
                bowl_runs_conceded: parseInt(formData.bowl_runs_conceded) || 0,
                bowl_wickets: parseInt(formData.bowl_wickets) || 0,
                bowl_average: parseFloat(formData.bowl_average) || null,
                bowl_economy: parseFloat(formData.bowl_economy) || null,
                bowl_best_figures: formData.bowl_best_figures || null,
                bowl_five_fers: parseInt(formData.bowl_five_fers) || 0,
                field_catches: parseInt(formData.field_catches) || 0,
                field_run_outs: parseInt(formData.field_run_outs) || 0,
                field_stumpings: parseInt(formData.field_stumpings) || 0,
            };

            const { error } = await supabase.from('player_stats_teams').update(payload).eq('id', editingTeam.id);
            if (error) throw error;
            setEditingTeam(null);
            await fetchStats();
            onStatsUpdated?.();
        } catch (err) {
            console.error('Error updating team:', err);
            alert('Error updating team: ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    /* ── CRUD: Add Game ───────────────────────────────────── */
    const handleAddGame = async (formData) => {
        setSaving(true);
        try {
            const payload = {
                team_id: showAddGame,
                match_date: formData.match_date || null,
                opponent: formData.opponent,
                venue: formData.venue,
                result: formData.result,
                match_type: formData.match_type,
                bat_runs: formData.bat_runs !== '' ? parseInt(formData.bat_runs) : null,
                bat_balls_faced: formData.bat_balls_faced !== '' ? parseInt(formData.bat_balls_faced) : null,
                bat_fours: formData.bat_fours !== '' ? parseInt(formData.bat_fours) : null,
                bat_sixes: formData.bat_sixes !== '' ? parseInt(formData.bat_sixes) : null,
                bat_how_out: formData.bat_how_out,
                bat_position: formData.bat_position !== '' ? parseInt(formData.bat_position) : null,
                bat_not_out: formData.bat_how_out === 'Not Out' || formData.bat_how_out === 'Did Not Bat',
                bowl_overs: formData.bowl_overs !== '' ? parseFloat(formData.bowl_overs) : null,
                bowl_maidens: formData.bowl_maidens !== '' ? parseInt(formData.bowl_maidens) : null,
                bowl_runs_conceded: formData.bowl_runs_conceded !== '' ? parseInt(formData.bowl_runs_conceded) : null,
                bowl_wickets: formData.bowl_wickets !== '' ? parseInt(formData.bowl_wickets) : null,
                field_catches: parseInt(formData.field_catches) || 0,
                field_run_outs: parseInt(formData.field_run_outs) || 0,
                field_stumpings: parseInt(formData.field_stumpings) || 0,
            };

            const { error } = await supabase.from('player_stats_games').insert(payload);
            if (error) throw error;
            setShowAddGame(null);
            await fetchStats();
        } catch (err) {
            console.error('Error adding game:', err);
            alert('Error adding game: ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    /* ── CRUD: Delete helpers ─────────────────────────────── */
    const handleDeleteSeason = async (seasonId) => {
        if (!window.confirm('Delete this season and all its teams/games?')) return;
        await supabase.from('player_stats_seasons').delete().eq('id', seasonId);
        setActiveSeasonId(null);
        await fetchStats();
        onStatsUpdated?.();
    };

    const handleDeleteTeam = async (teamId) => {
        if (!window.confirm('Delete this team and all its game records?')) return;
        await supabase.from('player_stats_teams').delete().eq('id', teamId);
        await fetchStats();
        onStatsUpdated?.();
    };

    const handleDeleteGame = async (gameId) => {
        if (!window.confirm('Delete this game record?')) return;
        await supabase.from('player_stats_games').delete().eq('id', gameId);
        await fetchStats();
    };

    /* ── Derived ──────────────────────────────────────────── */
    const name = player.player_name || `${player.first_name || ''} ${player.last_name || ''}`.trim();
    const activeSeason = seasons.find(s => s.id === activeSeasonId);
    const activeTeams = teamsMap[activeSeasonId] || [];

    /* ════════════════════════════════════════════════════════
       RENDER
       ════════════════════════════════════════════════════════ */
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex justify-end"
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            {/* Panel */}
            <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="relative w-full max-w-3xl bg-slate-900 border-l border-white/10 overflow-y-auto"
            >
                {/* Header */}
                <div className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur-sm border-b border-white/10 p-6">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rr-pink/30 to-rr-blue/30 flex items-center justify-center text-white text-xl font-black shrink-0">
                                {player.first_name?.charAt(0)}{player.last_name?.charAt(0)}
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-white tracking-wide">{name}</h2>
                                <p className="text-slate-400 text-sm">{player.club || 'No club'} · {player.cricket_type || 'Unknown type'}</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/10 transition-colors text-slate-400 hover:text-white">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-1 bg-white/5 rounded-xl p-1">
                        {[
                            { id: 'info', label: 'Player Info', icon: User },
                            { id: 'stats', label: 'Cricket Stats', icon: Activity },
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all flex-1 justify-center ${
                                    activeTab === tab.id
                                        ? 'bg-white/10 text-white'
                                        : 'text-slate-500 hover:text-slate-300'
                                }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {activeTab === 'info' && (
                        <InfoTab player={player} />
                    )}

                    {activeTab === 'stats' && (
                        <StatsTab
                            player={player}
                            seasons={seasons}
                            activeSeasonId={activeSeasonId}
                            setActiveSeasonId={setActiveSeasonId}
                            activeTeams={activeTeams}
                            gamesMap={gamesMap}
                            expandedTeams={expandedTeams}
                            toggleTeamExpand={toggleTeamExpand}
                            loadingStats={loadingStats}
                            fetching={fetching}
                            fetchResult={fetchResult}
                            onFetchPlayHQ={handleFetchPlayHQ}
                            onAddSeason={() => setShowAddSeason(true)}
                            onAddTeam={(seasonId) => setShowAddTeam(seasonId)}
                            onAddGame={(teamId) => setShowAddGame(teamId)}
                            onEditTeam={(team) => setEditingTeam(team)}
                            onDeleteSeason={handleDeleteSeason}
                            onDeleteTeam={handleDeleteTeam}
                            onDeleteGame={handleDeleteGame}
                            activeSeason={activeSeason}
                        />
                    )}
                </div>

                {/* ── Modal Forms ─────────────────────────────── */}
                <AnimatePresence>
                    {showAddSeason && (
                        <FormModal title="Add Season" onClose={() => setShowAddSeason(false)}>
                            <SeasonForm onSubmit={handleAddSeason} saving={saving} />
                        </FormModal>
                    )}
                    {showAddTeam && (
                        <FormModal title="Add Team" onClose={() => setShowAddTeam(null)}>
                            <TeamForm onSubmit={handleAddTeam} saving={saving} />
                        </FormModal>
                    )}
                    {editingTeam && (
                        <FormModal title="Edit Team Stats" onClose={() => setEditingTeam(null)}>
                            <TeamForm onSubmit={handleUpdateTeam} saving={saving} initialData={editingTeam} />
                        </FormModal>
                    )}
                    {showAddGame && (
                        <FormModal title="Add Game" onClose={() => setShowAddGame(null)}>
                            <GameForm onSubmit={handleAddGame} saving={saving} />
                        </FormModal>
                    )}
                </AnimatePresence>
            </motion.div>
        </motion.div>
    );
};

/* ════════════════════════════════════════════════════════════
   INFO TAB
   ════════════════════════════════════════════════════════════ */

const InfoTab = ({ player }) => (
    <div className="space-y-6">
        {/* Player details */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Player Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                <DetailRow icon={User} label="Full Name" value={player.player_name} />
                <DetailRow icon={Calendar} label="Date of Birth" value={player.dob ? formatDate(player.dob + 'T00:00:00') : null} />
                <DetailRow icon={User} label="Age" value={player.age?.toString()} />
                <DetailRow icon={MapPin} label="Suburb" value={player.suburb} />
                <DetailRow icon={Activity} label="Club" value={player.club} />
                <DetailRow icon={Shield} label="Cricket Type" value={player.cricket_type} />
                <DetailRow icon={Mail} label="Player Email" value={player.player_email} />
                <DetailRow icon={Phone} label="Player Phone" value={player.player_phone} />
                <DetailRow icon={ExternalLink} label="PlayCricket Profile" value={player.profile_link} isLink />
                <DetailRow icon={FileText} label="CV" value={player.cv_url} isLink />
            </div>
        </div>

        {/* Bio / History / Goals */}
        {(player.history || player.bio || player.goals) && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Cricket Background</h3>
                {player.history && (
                    <div>
                        <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">History</p>
                        <p className="text-white text-sm leading-relaxed">{player.history}</p>
                    </div>
                )}
                {player.bio && (
                    <div>
                        <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Bio</p>
                        <p className="text-white text-sm leading-relaxed">{player.bio}</p>
                    </div>
                )}
                {player.goals && (
                    <div>
                        <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Goals</p>
                        <p className="text-white text-sm leading-relaxed">{player.goals}</p>
                    </div>
                )}
            </div>
        )}

        {/* Parent / Guardian */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Parent / Guardian</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                <DetailRow icon={User} label="Parent 1" value={player.parent1_name} />
                <DetailRow icon={Mail} label="Parent 1 Email" value={player.parent1_email} />
                <DetailRow icon={Phone} label="Parent 1 Phone" value={player.parent1_phone} />
                <DetailRow icon={User} label="Parent 2" value={player.parent2_name} />
                <DetailRow icon={Mail} label="Parent 2 Email" value={player.parent2_email} />
                <DetailRow icon={Phone} label="Parent 2 Phone" value={player.parent2_phone} />
            </div>
        </div>

        {/* Enrolment info */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Enrolment</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                <DetailRow icon={FileText} label="Source" value={player.source} />
                <DetailRow icon={FileText} label="Payment Status" value={player.payment_status} />
                <DetailRow icon={FileText} label="Payment Plan" value={player.payment_option_selected || player.payment_plan_selected} />
                <DetailRow icon={Calendar} label="Enrolled" value={player.created_at ? formatDate(player.created_at) : null} />
            </div>
        </div>
    </div>
);

/* ════════════════════════════════════════════════════════════
   STATS TAB
   ════════════════════════════════════════════════════════════ */

const StatsTab = ({
    player, seasons, activeSeasonId, setActiveSeasonId, activeTeams, gamesMap,
    expandedTeams, toggleTeamExpand, loadingStats, fetching, fetchResult,
    onFetchPlayHQ, onAddSeason, onAddTeam, onAddGame, onEditTeam,
    onDeleteSeason, onDeleteTeam, onDeleteGame, activeSeason
}) => {

    if (loadingStats) {
        return (
            <div className="flex items-center justify-center h-32">
                <Loader2 className="w-6 h-6 text-rr-pink animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-5">
            {/* Action bar */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2 flex-wrap">
                        <button
                            onClick={onFetchPlayHQ}
                            disabled={fetching}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rr-pink/20 border border-rr-pink/30 text-rr-pink hover:bg-rr-pink/30 transition-all text-sm font-medium disabled:opacity-50"
                        >
                            {fetching ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                            {fetching ? 'Searching PlayCricket...' : 'Fetch from PlayCricket'}
                        </button>
                        {player.profile_link && (
                            <a
                                href={player.profile_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-slate-500 hover:text-rr-pink text-xs flex items-center gap-1 transition-colors"
                            >
                                Open profile <ExternalLink className="w-3 h-3" />
                            </a>
                        )}
                    </div>
                    <button
                        onClick={onAddSeason}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all text-sm"
                    >
                        <Plus className="w-4 h-4" />
                        Add Season
                    </button>
                </div>
                {fetching && (
                    <div className="mt-3 flex items-center gap-2 text-xs p-3 rounded-xl bg-blue-500/10 text-blue-400">
                        <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
                        <p>Opening headless Chrome, navigating to PlayCricket, and extracting stats... This can take 15–30 seconds.</p>
                    </div>
                )}
                {fetchResult && !fetching && (
                    <div className={`mt-3 flex items-start gap-2 text-sm p-3 rounded-xl ${
                        fetchResult.success ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                    }`}>
                        {fetchResult.success ? <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" /> : <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />}
                        <p>{fetchResult.message}</p>
                    </div>
                )}
            </div>

            {/* No seasons yet */}
            {seasons.length === 0 && (
                <div className="text-center py-12 bg-white/5 border border-white/10 rounded-2xl">
                    <Target className="w-8 h-8 text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-500 text-sm">No cricket stats yet</p>
                    <p className="text-slate-600 text-xs mt-1">Open their PlayCricket profile and add stats manually using "Add Season" above</p>
                </div>
            )}

            {/* Season tabs */}
            {seasons.length > 0 && (
                <>
                    <div className="flex gap-1 bg-white/5 rounded-xl p-1 overflow-x-auto">
                        {seasons.map(s => (
                            <button
                                key={s.id}
                                onClick={() => setActiveSeasonId(s.id)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                                    activeSeasonId === s.id
                                        ? 'bg-white/10 text-white'
                                        : 'text-slate-500 hover:text-slate-300'
                                }`}
                            >
                                {s.season_name}
                            </button>
                        ))}
                    </div>

                    {/* Active season content */}
                    {activeSeason && (
                        <div className="space-y-4">
                            {/* Season header */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <h3 className="text-white font-bold text-sm">{activeSeason.season_name}</h3>
                                    <span className="text-slate-600 text-xs">
                                        {activeSeason.source === 'playhq_fetch' ? 'Fetched from PlayHQ' : 'Manual entry'}
                                        {activeSeason.last_fetched_at && ` · ${formatDate(activeSeason.last_fetched_at)}`}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => onAddTeam(activeSeason.id)}
                                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white text-xs transition-all"
                                    >
                                        <Plus className="w-3 h-3" /> Add Team
                                    </button>
                                    <button
                                        onClick={() => onDeleteSeason(activeSeason.id)}
                                        className="p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>

                            {/* Teams list */}
                            {activeTeams.length === 0 && (
                                <div className="text-center py-8 bg-white/5 border border-white/10 rounded-2xl">
                                    <p className="text-slate-500 text-sm">No teams added for this season</p>
                                </div>
                            )}

                            {activeTeams.map(team => (
                                <TeamCard
                                    key={team.id}
                                    team={team}
                                    games={gamesMap[team.id] || []}
                                    expanded={expandedTeams.has(team.id)}
                                    onToggle={() => toggleTeamExpand(team.id)}
                                    onEdit={() => onEditTeam(team)}
                                    onDelete={() => onDeleteTeam(team.id)}
                                    onAddGame={() => onAddGame(team.id)}
                                    onDeleteGame={onDeleteGame}
                                />
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

/* ════════════════════════════════════════════════════════════
   TEAM CARD (with expandable games)
   ════════════════════════════════════════════════════════════ */

const TeamCard = ({ team, games, expanded, onToggle, onEdit, onDelete, onAddGame, onDeleteGame }) => (
    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        {/* Team header */}
        <div className="p-4 flex items-start justify-between">
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-white font-bold text-sm truncate">{team.team_name}</h4>
                    {team.level && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rr-pink/10 text-rr-pink border border-rr-pink/20">
                            {team.level}
                        </span>
                    )}
                </div>
                <p className="text-slate-500 text-xs">
                    {[team.club_name, team.grade, team.competition].filter(Boolean).join(' · ')}
                </p>
            </div>
            <div className="flex items-center gap-1 shrink-0 ml-3">
                <button onClick={onEdit} className="p-1.5 rounded-lg text-slate-600 hover:text-white hover:bg-white/10 transition-all">
                    <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button onClick={onDelete} className="p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all">
                    <Trash2 className="w-3.5 h-3.5" />
                </button>
            </div>
        </div>

        {/* Aggregate stats */}
        <div className="px-4 pb-3 space-y-3">
            {/* Batting */}
            <div>
                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1.5">Batting</p>
                <div className="flex flex-wrap gap-0 bg-white/5 rounded-xl divide-x divide-white/5">
                    <StatBox label="Inn" value={team.bat_innings} small />
                    <StatBox label="NO" value={team.bat_not_outs} small />
                    <StatBox label="Runs" value={team.bat_runs} small />
                    <StatBox label="HS" value={team.bat_highest_score} small />
                    <StatBox label="Avg" value={team.bat_average} small />
                    <StatBox label="SR" value={team.bat_strike_rate} small />
                    <StatBox label="50s" value={team.bat_fifties} small />
                    <StatBox label="100s" value={team.bat_hundreds} small />
                    <StatBox label="4s" value={team.bat_fours} small />
                    <StatBox label="6s" value={team.bat_sixes} small />
                </div>
            </div>

            {/* Bowling */}
            <div>
                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1.5">Bowling</p>
                <div className="flex flex-wrap gap-0 bg-white/5 rounded-xl divide-x divide-white/5">
                    <StatBox label="Inn" value={team.bowl_innings} small />
                    <StatBox label="Overs" value={team.bowl_overs} small />
                    <StatBox label="Mdns" value={team.bowl_maidens} small />
                    <StatBox label="Runs" value={team.bowl_runs_conceded} small />
                    <StatBox label="Wkts" value={team.bowl_wickets} small />
                    <StatBox label="Avg" value={team.bowl_average} small />
                    <StatBox label="Econ" value={team.bowl_economy} small />
                    <StatBox label="Best" value={team.bowl_best_figures} small />
                    <StatBox label="5W" value={team.bowl_five_fers} small />
                </div>
            </div>

            {/* Fielding */}
            <div>
                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1.5">Fielding</p>
                <div className="flex flex-wrap gap-0 bg-white/5 rounded-xl divide-x divide-white/5">
                    <StatBox label="Catches" value={team.field_catches} small />
                    <StatBox label="Run Outs" value={team.field_run_outs} small />
                    <StatBox label="Stumpings" value={team.field_stumpings} small />
                </div>
            </div>
        </div>

        {/* Games toggle */}
        <div className="border-t border-white/5">
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between px-4 py-2.5 text-slate-500 hover:text-slate-300 transition-colors text-xs"
            >
                <span className="font-medium">{games.length} game{games.length !== 1 ? 's' : ''}</span>
                <div className="flex items-center gap-2">
                    <button
                        onClick={(e) => { e.stopPropagation(); onAddGame(); }}
                        className="px-2 py-1 rounded-md bg-white/5 hover:bg-white/10 text-slate-500 hover:text-white transition-all flex items-center gap-1"
                    >
                        <Plus className="w-3 h-3" /> Add
                    </button>
                    {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </div>
            </button>

            {/* Expanded games */}
            <AnimatePresence>
                {expanded && games.length > 0 && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs text-left">
                                <thead>
                                    <tr className="border-t border-white/5 bg-white/3">
                                        <th className="p-2 pl-4 text-slate-600 font-bold uppercase tracking-wider">Date</th>
                                        <th className="p-2 text-slate-600 font-bold uppercase tracking-wider">vs</th>
                                        <th className="p-2 text-slate-600 font-bold uppercase tracking-wider">Result</th>
                                        <th className="p-2 text-slate-600 font-bold uppercase tracking-wider">Bat</th>
                                        <th className="p-2 text-slate-600 font-bold uppercase tracking-wider">Bowl</th>
                                        <th className="p-2 text-slate-600 font-bold uppercase tracking-wider">Field</th>
                                        <th className="p-2 pr-4 text-slate-600 font-bold uppercase tracking-wider w-8"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/3">
                                    {games.map(game => (
                                        <tr key={game.id} className="hover:bg-white/3 transition-colors">
                                            <td className="p-2 pl-4 text-slate-400 whitespace-nowrap">
                                                {game.match_date ? formatDateShort(game.match_date + 'T00:00:00') : '—'}
                                            </td>
                                            <td className="p-2 text-white whitespace-nowrap">{game.opponent || '—'}</td>
                                            <td className="p-2">
                                                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                                    game.result === 'Won' ? 'bg-emerald-500/10 text-emerald-400'
                                                    : game.result === 'Lost' ? 'bg-red-500/10 text-red-400'
                                                    : 'bg-slate-500/10 text-slate-400'
                                                }`}>
                                                    {game.result || '—'}
                                                </span>
                                            </td>
                                            <td className="p-2 text-slate-300 whitespace-nowrap">
                                                {game.bat_runs != null ? (
                                                    <>
                                                        {game.bat_runs}{game.bat_not_out ? '*' : ''}
                                                        <span className="text-slate-600 ml-1">
                                                            ({game.bat_balls_faced || '?'}b)
                                                        </span>
                                                    </>
                                                ) : '—'}
                                            </td>
                                            <td className="p-2 text-slate-300 whitespace-nowrap">
                                                {game.bowl_wickets != null && game.bowl_runs_conceded != null ? (
                                                    <>
                                                        {game.bowl_wickets}/{game.bowl_runs_conceded}
                                                        <span className="text-slate-600 ml-1">
                                                            ({game.bowl_overs || '?'}ov)
                                                        </span>
                                                    </>
                                                ) : '—'}
                                            </td>
                                            <td className="p-2 text-slate-400 whitespace-nowrap">
                                                {(game.field_catches || game.field_run_outs || game.field_stumpings) ? (
                                                    [
                                                        game.field_catches ? `${game.field_catches}ct` : null,
                                                        game.field_run_outs ? `${game.field_run_outs}ro` : null,
                                                        game.field_stumpings ? `${game.field_stumpings}st` : null,
                                                    ].filter(Boolean).join(' ')
                                                ) : '—'}
                                            </td>
                                            <td className="p-2 pr-4">
                                                <button
                                                    onClick={() => onDeleteGame(game.id)}
                                                    className="p-1 rounded text-slate-700 hover:text-red-400 transition-colors"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    </div>
);

/* ════════════════════════════════════════════════════════════
   MODAL WRAPPER
   ════════════════════════════════════════════════════════════ */

const FormModal = ({ title, onClose, children }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex items-center justify-center p-4"
    >
        <div className="absolute inset-0 bg-black/70" onClick={onClose} />
        <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative bg-slate-900 border border-white/10 rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto p-6"
        >
            <div className="flex items-center justify-between mb-5">
                <h3 className="text-white font-bold text-lg">{title}</h3>
                <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                    <X className="w-4 h-4" />
                </button>
            </div>
            {children}
        </motion.div>
    </motion.div>
);

/* ── Shared form input ────────────────────────────────────── */
const FInput = ({ label, name, value, onChange, type = 'text', placeholder = '', half = false }) => (
    <div className={half ? 'flex-1 min-w-[120px]' : 'w-full'}>
        <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block mb-1">{label}</label>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-rr-pink/50"
        />
    </div>
);

const FSelect = ({ label, name, value, onChange, options, half = false }) => (
    <div className={half ? 'flex-1 min-w-[120px]' : 'w-full'}>
        <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block mb-1">{label}</label>
        <select
            name={name}
            value={value}
            onChange={onChange}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-rr-pink/50 cursor-pointer"
        >
            <option value="" className="bg-slate-900">—</option>
            {options.map(o => <option key={o} value={o} className="bg-slate-900">{o}</option>)}
        </select>
    </div>
);

/* ════════════════════════════════════════════════════════════
   FORMS
   ════════════════════════════════════════════════════════════ */

const SeasonForm = ({ onSubmit, saving }) => {
    const currentYear = new Date().getFullYear();
    const [form, setForm] = useState({
        season_name: `${currentYear - 1}/${String(currentYear).slice(-2)}`,
        season_year: currentYear.toString(),
    });
    const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    return (
        <div className="space-y-4">
            <div className="flex gap-3">
                <FInput label="Season Name" name="season_name" value={form.season_name} onChange={handleChange} placeholder="e.g. 2024/25" />
                <FInput label="Year (for sorting)" name="season_year" value={form.season_year} onChange={handleChange} type="number" half />
            </div>
            <button
                onClick={() => onSubmit(form)}
                disabled={saving || !form.season_name}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rr-pink text-white font-medium text-sm hover:bg-rr-pink/80 transition-all disabled:opacity-50"
            >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Add Season
            </button>
        </div>
    );
};

const TeamForm = ({ onSubmit, saving, initialData = null }) => {
    const [form, setForm] = useState({
        team_name: initialData?.team_name || '',
        club_name: initialData?.club_name || '',
        grade: initialData?.grade || '',
        competition: initialData?.competition || '',
        level: initialData?.level || '',
        bat_innings: initialData?.bat_innings?.toString() || '0',
        bat_not_outs: initialData?.bat_not_outs?.toString() || '0',
        bat_runs: initialData?.bat_runs?.toString() || '0',
        bat_highest_score: initialData?.bat_highest_score || '',
        bat_average: initialData?.bat_average?.toString() || '',
        bat_strike_rate: initialData?.bat_strike_rate?.toString() || '',
        bat_fifties: initialData?.bat_fifties?.toString() || '0',
        bat_hundreds: initialData?.bat_hundreds?.toString() || '0',
        bat_ducks: initialData?.bat_ducks?.toString() || '0',
        bat_fours: initialData?.bat_fours?.toString() || '0',
        bat_sixes: initialData?.bat_sixes?.toString() || '0',
        bat_balls_faced: initialData?.bat_balls_faced?.toString() || '0',
        bowl_innings: initialData?.bowl_innings?.toString() || '0',
        bowl_overs: initialData?.bowl_overs?.toString() || '0',
        bowl_maidens: initialData?.bowl_maidens?.toString() || '0',
        bowl_runs_conceded: initialData?.bowl_runs_conceded?.toString() || '0',
        bowl_wickets: initialData?.bowl_wickets?.toString() || '0',
        bowl_average: initialData?.bowl_average?.toString() || '',
        bowl_economy: initialData?.bowl_economy?.toString() || '',
        bowl_best_figures: initialData?.bowl_best_figures || '',
        bowl_five_fers: initialData?.bowl_five_fers?.toString() || '0',
        field_catches: initialData?.field_catches?.toString() || '0',
        field_run_outs: initialData?.field_run_outs?.toString() || '0',
        field_stumpings: initialData?.field_stumpings?.toString() || '0',
    });
    const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    return (
        <div className="space-y-5">
            {/* Team info */}
            <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Team Details</p>
                <div className="space-y-3">
                    <FInput label="Team Name" name="team_name" value={form.team_name} onChange={handleChange} placeholder="e.g. Melbourne CC - 1st XI" />
                    <div className="flex gap-3 flex-wrap">
                        <FInput label="Club" name="club_name" value={form.club_name} onChange={handleChange} half />
                        <FInput label="Grade" name="grade" value={form.grade} onChange={handleChange} half />
                    </div>
                    <div className="flex gap-3 flex-wrap">
                        <FInput label="Competition" name="competition" value={form.competition} onChange={handleChange} half />
                        <FSelect label="Level" name="level" value={form.level} onChange={handleChange} options={LEVELS} half />
                    </div>
                </div>
            </div>

            {/* Batting */}
            <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Batting</p>
                <div className="flex gap-3 flex-wrap">
                    <FInput label="Inn" name="bat_innings" value={form.bat_innings} onChange={handleChange} type="number" half />
                    <FInput label="NO" name="bat_not_outs" value={form.bat_not_outs} onChange={handleChange} type="number" half />
                    <FInput label="Runs" name="bat_runs" value={form.bat_runs} onChange={handleChange} type="number" half />
                    <FInput label="HS" name="bat_highest_score" value={form.bat_highest_score} onChange={handleChange} half />
                </div>
                <div className="flex gap-3 flex-wrap mt-3">
                    <FInput label="Avg" name="bat_average" value={form.bat_average} onChange={handleChange} half />
                    <FInput label="SR" name="bat_strike_rate" value={form.bat_strike_rate} onChange={handleChange} half />
                    <FInput label="50s" name="bat_fifties" value={form.bat_fifties} onChange={handleChange} type="number" half />
                    <FInput label="100s" name="bat_hundreds" value={form.bat_hundreds} onChange={handleChange} type="number" half />
                </div>
                <div className="flex gap-3 flex-wrap mt-3">
                    <FInput label="4s" name="bat_fours" value={form.bat_fours} onChange={handleChange} type="number" half />
                    <FInput label="6s" name="bat_sixes" value={form.bat_sixes} onChange={handleChange} type="number" half />
                    <FInput label="Balls" name="bat_balls_faced" value={form.bat_balls_faced} onChange={handleChange} type="number" half />
                    <FInput label="Ducks" name="bat_ducks" value={form.bat_ducks} onChange={handleChange} type="number" half />
                </div>
            </div>

            {/* Bowling */}
            <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Bowling</p>
                <div className="flex gap-3 flex-wrap">
                    <FInput label="Inn" name="bowl_innings" value={form.bowl_innings} onChange={handleChange} type="number" half />
                    <FInput label="Overs" name="bowl_overs" value={form.bowl_overs} onChange={handleChange} half />
                    <FInput label="Maidens" name="bowl_maidens" value={form.bowl_maidens} onChange={handleChange} type="number" half />
                    <FInput label="Runs" name="bowl_runs_conceded" value={form.bowl_runs_conceded} onChange={handleChange} type="number" half />
                </div>
                <div className="flex gap-3 flex-wrap mt-3">
                    <FInput label="Wickets" name="bowl_wickets" value={form.bowl_wickets} onChange={handleChange} type="number" half />
                    <FInput label="Avg" name="bowl_average" value={form.bowl_average} onChange={handleChange} half />
                    <FInput label="Econ" name="bowl_economy" value={form.bowl_economy} onChange={handleChange} half />
                    <FInput label="Best" name="bowl_best_figures" value={form.bowl_best_figures} onChange={handleChange} placeholder="e.g. 5/23" half />
                </div>
                <div className="flex gap-3 flex-wrap mt-3">
                    <FInput label="5-fers" name="bowl_five_fers" value={form.bowl_five_fers} onChange={handleChange} type="number" half />
                </div>
            </div>

            {/* Fielding */}
            <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Fielding</p>
                <div className="flex gap-3 flex-wrap">
                    <FInput label="Catches" name="field_catches" value={form.field_catches} onChange={handleChange} type="number" half />
                    <FInput label="Run Outs" name="field_run_outs" value={form.field_run_outs} onChange={handleChange} type="number" half />
                    <FInput label="Stumpings" name="field_stumpings" value={form.field_stumpings} onChange={handleChange} type="number" half />
                </div>
            </div>

            <button
                onClick={() => onSubmit(form)}
                disabled={saving || !form.team_name}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rr-pink text-white font-medium text-sm hover:bg-rr-pink/80 transition-all disabled:opacity-50"
            >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {initialData ? 'Update Team' : 'Add Team'}
            </button>
        </div>
    );
};

const GameForm = ({ onSubmit, saving }) => {
    const [form, setForm] = useState({
        match_date: '', opponent: '', venue: '', result: '', match_type: '',
        bat_runs: '', bat_balls_faced: '', bat_fours: '', bat_sixes: '',
        bat_how_out: '', bat_position: '',
        bowl_overs: '', bowl_maidens: '', bowl_runs_conceded: '', bowl_wickets: '',
        field_catches: '0', field_run_outs: '0', field_stumpings: '0',
    });
    const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    return (
        <div className="space-y-5">
            {/* Match details */}
            <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Match Details</p>
                <div className="flex gap-3 flex-wrap">
                    <FInput label="Date" name="match_date" value={form.match_date} onChange={handleChange} type="date" half />
                    <FInput label="Opponent" name="opponent" value={form.opponent} onChange={handleChange} half />
                </div>
                <div className="flex gap-3 flex-wrap mt-3">
                    <FInput label="Venue" name="venue" value={form.venue} onChange={handleChange} half />
                    <FSelect label="Result" name="result" value={form.result} onChange={handleChange} options={RESULTS} half />
                </div>
                <div className="flex gap-3 flex-wrap mt-3">
                    <FSelect label="Match Type" name="match_type" value={form.match_type} onChange={handleChange} options={MATCH_TYPES} half />
                </div>
            </div>

            {/* Batting */}
            <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Batting</p>
                <div className="flex gap-3 flex-wrap">
                    <FInput label="Runs" name="bat_runs" value={form.bat_runs} onChange={handleChange} type="number" half />
                    <FInput label="Balls Faced" name="bat_balls_faced" value={form.bat_balls_faced} onChange={handleChange} type="number" half />
                    <FInput label="4s" name="bat_fours" value={form.bat_fours} onChange={handleChange} type="number" half />
                    <FInput label="6s" name="bat_sixes" value={form.bat_sixes} onChange={handleChange} type="number" half />
                </div>
                <div className="flex gap-3 flex-wrap mt-3">
                    <FSelect label="How Out" name="bat_how_out" value={form.bat_how_out} onChange={handleChange} options={DISMISSALS} half />
                    <FInput label="Batting Position" name="bat_position" value={form.bat_position} onChange={handleChange} type="number" half />
                </div>
            </div>

            {/* Bowling */}
            <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Bowling</p>
                <div className="flex gap-3 flex-wrap">
                    <FInput label="Overs" name="bowl_overs" value={form.bowl_overs} onChange={handleChange} half />
                    <FInput label="Maidens" name="bowl_maidens" value={form.bowl_maidens} onChange={handleChange} type="number" half />
                    <FInput label="Runs" name="bowl_runs_conceded" value={form.bowl_runs_conceded} onChange={handleChange} type="number" half />
                    <FInput label="Wickets" name="bowl_wickets" value={form.bowl_wickets} onChange={handleChange} type="number" half />
                </div>
            </div>

            {/* Fielding */}
            <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Fielding</p>
                <div className="flex gap-3 flex-wrap">
                    <FInput label="Catches" name="field_catches" value={form.field_catches} onChange={handleChange} type="number" half />
                    <FInput label="Run Outs" name="field_run_outs" value={form.field_run_outs} onChange={handleChange} type="number" half />
                    <FInput label="Stumpings" name="field_stumpings" value={form.field_stumpings} onChange={handleChange} type="number" half />
                </div>
            </div>

            <button
                onClick={() => onSubmit(form)}
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rr-pink text-white font-medium text-sm hover:bg-rr-pink/80 transition-all disabled:opacity-50"
            >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Add Game
            </button>
        </div>
    );
};

export default PlayerProfileDetail;
