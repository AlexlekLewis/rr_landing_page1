import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';
import { verifyAdmin, setCors, sendError } from './_lib/auth.js';

// ─── CONFIG ──────────────────────────────────────────────
const PLAYCRICKET_BASE = 'https://play.cricket.com.au';
const TIMEOUT = 45000; // 45s max for page operations
const NAV_TIMEOUT = 30000;

// Hosts the scraper is allowed to navigate to. profile_url is
// user-supplied, so without an allowlist this endpoint is an
// authenticated headless-chromium SSRF that can hit cloud metadata
// (169.254.169.254), internal networks, and any third-party URL.
const ALLOWED_HOSTS = new Set([
    'play.cricket.com.au',
    'www.play.cricket.com.au',
    'playhq.com',
    'www.playhq.com',
]);

function isAllowedProfileUrl(url) {
    try {
        const u = new URL(url);
        if (u.protocol !== 'https:' && u.protocol !== 'http:') return false;
        // Reject IP literals outright — keeps us off link-local and
        // cloud-metadata addresses even if a DNS entry temporarily
        // resolves to them.
        if (/^\d+\.\d+\.\d+\.\d+$/.test(u.hostname)) return false;
        if (u.hostname.includes(':')) return false; // ipv6 literal
        return ALLOWED_HOSTS.has(u.hostname.toLowerCase());
    } catch {
        return false;
    }
}

export default async function handler(req, res) {
    setCors(req, res, { allowMethods: 'POST, OPTIONS' });
    if (req.method === 'OPTIONS') return res.status(204).end();
    if (req.method !== 'POST') return sendError(res, 405, 'Method not allowed');

    try {
        await verifyAdmin(req);
    } catch (err) {
        return sendError(res, 401, 'Unauthorised', err);
    }

    const { player_name, club, profile_url } = req.body || {};

    if (!player_name || typeof player_name !== 'string') {
        return sendError(res, 400, 'player_name is required');
    }
    if (profile_url && !isAllowedProfileUrl(profile_url)) {
        return sendError(res, 400, 'profile_url must point to play.cricket.com.au or playhq.com');
    }

    let browser = null;

    try {
        // ── Launch headless Chrome ─────────────────────────
        browser = await puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath(),
            headless: chromium.headless,
        });

        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(NAV_TIMEOUT);
        page.setDefaultTimeout(TIMEOUT);

        // Set a realistic user agent
        await page.setUserAgent(
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        );

        let profileUrl = profile_url || null;

        // ── STEP 1: Find the player's profile URL ──────────
        if (!profileUrl) {
            // Try to find via PlayCricket search
            profileUrl = await findPlayerProfile(page, player_name, club);
        }

        if (!profileUrl) {
            return res.status(200).json({
                success: false,
                message: `Could not find a PlayCricket profile for "${player_name}"${club ? ` at ${club}` : ''}. The player may not have a public profile, or their name may be spelled differently on PlayCricket.`,
            });
        }

        // findPlayerProfile reads links out of HTML it scraped, so its
        // output is technically untrusted. Re-check the allowlist before
        // we let the headless browser navigate there.
        if (!isAllowedProfileUrl(profileUrl)) {
            return sendError(res, 400, 'Resolved profile URL is outside the allowlist');
        }

        // ── STEP 2: Navigate to profile and extract stats ──
        // Ensure we're on the career/stats tab
        const statsUrl = ensureStatsTab(profileUrl);
        console.log('Navigating to:', statsUrl);

        // Navigate and wait for the SPA to fully load
        await page.goto(statsUrl, { waitUntil: 'networkidle0', timeout: NAV_TIMEOUT });

        // Wait for the page content to render (SPA)
        // PlayCricket profiles load player name first, then stats async
        const playerNameOnPage = await page.waitForFunction(
            (name) => {
                const body = document.body?.innerText || '';
                // Check if we see the player's name or stats-related content
                const nameParts = name.toLowerCase().split(' ');
                const hasName = nameParts.some(p => body.toLowerCase().includes(p));
                const hasStats = body.includes('Innings') || body.includes('Batting') ||
                                 body.includes('Bowling') || body.includes('Runs') ||
                                 body.includes('Wickets') || body.includes('Average');
                const hasPrivate = body.includes('Private') || body.includes('No statistics');
                return hasName || hasStats || hasPrivate;
            },
            { timeout: TIMEOUT },
            player_name || ''
        ).catch(() => null);

        // Wait for stats widgets to fully load
        await new Promise(r => setTimeout(r, 6000));

        // Try clicking Career/Statistics tabs
        await page.evaluate(() => {
            // Look for tab-like elements
            const clickables = document.querySelectorAll('a, button, [role="tab"], [class*="tab"], nav a');
            clickables.forEach(el => {
                const text = (el.innerText || el.textContent || '').trim().toLowerCase();
                if (text === 'career' || text === 'statistics' || text === 'stats') {
                    el.click();
                }
            });
        }).catch(() => null);

        // Wait after tab click for content to load
        await new Promise(r => setTimeout(r, 4000));

        // ── STEP 3: Extract stats from rendered page ───────
        const statsData = await page.evaluate(() => {
            const result = {
                player_found: false,
                profile_private: false,
                seasons: [],
                raw_text: '',
            };

            const bodyText = document.body?.innerText || '';
            result.raw_text = bodyText.substring(0, 5000); // For debugging

            // Check if profile is private
            if (bodyText.includes('Private') && bodyText.includes('Profile')) {
                result.profile_private = true;
                return result;
            }

            // Check if there are any stats
            if (bodyText.includes('No statistics') || bodyText.includes('no statistics')) {
                result.player_found = true;
                return result;
            }

            // ── Try to extract stats from rendered content ──
            // PlayCricket uses a SPA that renders stats in various formats.
            // We'll look for common patterns in the rendered DOM.

            // Look for stat tables
            const tables = document.querySelectorAll('table');
            const statSections = document.querySelectorAll('[class*="stat"], [class*="Stat"], [data-testid*="stat"]');
            const seasonElements = document.querySelectorAll('[class*="season"], [class*="Season"]');

            // Try to extract from tables
            if (tables.length > 0) {
                result.player_found = true;

                tables.forEach((table, tableIdx) => {
                    const headers = [];
                    const rows = [];

                    // Get headers
                    table.querySelectorAll('thead th, thead td').forEach(th => {
                        headers.push(th.innerText.trim());
                    });

                    // Get rows
                    table.querySelectorAll('tbody tr').forEach(tr => {
                        const cells = [];
                        tr.querySelectorAll('td, th').forEach(td => {
                            cells.push(td.innerText.trim());
                        });
                        if (cells.length > 0) rows.push(cells);
                    });

                    if (headers.length > 0 || rows.length > 0) {
                        result.seasons.push({
                            table_index: tableIdx,
                            headers,
                            rows,
                            type: detectTableType(headers),
                        });
                    }
                });
            }

            // Also try extracting from non-table stat displays
            // (some stats might be in divs/spans rather than tables)
            const allStatValues = [];
            document.querySelectorAll('[class*="stat-value"], [class*="StatValue"], [class*="stat_value"]').forEach(el => {
                const label = el.previousElementSibling?.innerText?.trim() ||
                              el.closest('[class*="stat"]')?.querySelector('[class*="label"]')?.innerText?.trim();
                allStatValues.push({
                    label: label || 'unknown',
                    value: el.innerText.trim(),
                });
            });

            if (allStatValues.length > 0) {
                result.player_found = true;
                result.stat_values = allStatValues;
            }

            // Extract overview/career stats if visible
            const overviewSection = document.querySelector('[class*="overview"], [class*="Overview"], [class*="career"], [class*="Career"]');
            if (overviewSection) {
                result.player_found = true;
                result.overview_text = overviewSection.innerText.substring(0, 2000);
            }

            // Detect table type from headers
            function detectTableType(headers) {
                const h = headers.join(' ').toLowerCase();
                if (h.includes('wicket') || h.includes('bowling') || h.includes('economy') || h.includes('overs')) return 'bowling';
                if (h.includes('catch') || h.includes('fielding') || h.includes('run out') || h.includes('stumping')) return 'fielding';
                if (h.includes('run') || h.includes('batting') || h.includes('innings') || h.includes('average')) return 'batting';
                return 'unknown';
            }

            return result;
        });

        // ── STEP 4: Parse the extracted data into our format ─
        const parsed = parseExtractedStats(statsData, player_name);

        await browser.close();
        browser = null;

        return res.status(200).json({
            success: parsed.seasons.length > 0 || statsData.player_found,
            profile_url: statsUrl,
            player_found: statsData.player_found,
            profile_private: statsData.profile_private,
            seasons: parsed.seasons,
            raw_tables: statsData.seasons, // Include raw data so admin can see what was extracted
            raw_text: statsData.raw_text || '', // Page text for debugging
            stat_values: statsData.stat_values || [],
            overview_text: statsData.overview_text || '',
            message: statsData.profile_private
                ? 'This player\'s profile is set to Private on PlayCricket. Stats cannot be extracted. Ask the player to make their profile public, or enter stats manually.'
                : parsed.seasons.length > 0
                    ? `Found ${parsed.seasons.length} season(s) of stats.`
                    : statsData.player_found
                        ? 'Profile found but no statistics available. The player may not have played any scored matches yet.'
                        : 'Could not extract stats from the page. The page may still be loading or the format may have changed. Try opening the profile link directly to verify.',
        });

    } catch (err) {
        console.error('Scraper error:', err);
        return res.status(200).json({
            success: false,
            message: 'Scraper error — this might be a timeout. PlayCricket pages can be slow to load. Try again, or enter stats manually.',
        });
    } finally {
        if (browser) {
            try { await browser.close(); } catch (_) {}
        }
    }
}

// ─── HELPERS ──────────────────────────────────────────────

function ensureStatsTab(url) {
    try {
        const u = new URL(url);
        u.searchParams.set('tab', 'career');
        return u.toString();
    } catch {
        // If it's not a valid URL, try prepending the base
        if (url.startsWith('/')) {
            return `${PLAYCRICKET_BASE}${url}?tab=career`;
        }
        return url;
    }
}

async function findPlayerProfile(page, playerName, club) {
    try {
        // Approach 1: Try the PlayCricket search page
        const searchQuery = encodeURIComponent(playerName);
        await page.goto(`${PLAYCRICKET_BASE}/search/?query=${searchQuery}`, {
            waitUntil: 'networkidle2',
            timeout: NAV_TIMEOUT,
        });

        // Wait for search results to render
        await new Promise(r => setTimeout(r, 3000));

        // Look for player links in search results
        const playerLink = await page.evaluate((name, clubName) => {
            const nameLC = name.toLowerCase();
            const clubLC = (clubName || '').toLowerCase();

            // Find all links that look like player profile links
            const links = document.querySelectorAll('a[href*="/player/"]');
            let bestMatch = null;
            let bestScore = 0;

            links.forEach(link => {
                const linkText = (link.innerText || link.textContent || '').toLowerCase();
                const href = link.getAttribute('href') || '';

                // Check if the link text matches the player name
                let score = 0;

                // Name match
                const nameParts = nameLC.split(' ');
                nameParts.forEach(part => {
                    if (linkText.includes(part)) score += 2;
                    if (href.toLowerCase().includes(part)) score += 1;
                });

                // Club match (look at surrounding context)
                if (clubLC) {
                    const parent = link.closest('div, li, tr, section');
                    const context = (parent?.innerText || '').toLowerCase();
                    const clubParts = clubLC.split(/[,.\s]+/).filter(p => p.length > 3);
                    clubParts.forEach(part => {
                        if (context.includes(part)) score += 3;
                    });
                }

                if (score > bestScore) {
                    bestScore = score;
                    bestMatch = href;
                }
            });

            return bestScore >= 3 ? bestMatch : null;
        }, playerName, club);

        if (playerLink) {
            // Make sure it's an absolute URL
            if (playerLink.startsWith('/')) {
                return `${PLAYCRICKET_BASE}${playerLink}`;
            }
            return playerLink;
        }

        // Approach 2: Try constructing a URL from the player name
        // PlayCricket URLs follow: /player/{uuid}/{slug-name}
        // We can't guess the UUID, but Google might help
        // For now, return null — the admin can add the link manually
        return null;

    } catch (err) {
        console.error('Search error:', err);
        return null;
    }
}

function parseExtractedStats(statsData, playerName) {
    const result = { seasons: [] };

    if (!statsData.seasons || statsData.seasons.length === 0) {
        // Try to parse from overview text if available
        if (statsData.overview_text) {
            const parsed = parseOverviewText(statsData.overview_text);
            if (parsed) result.seasons.push(parsed);
        }
        return result;
    }

    // Group tables by type and try to build season/team structure
    const battingTables = statsData.seasons.filter(t => t.type === 'batting');
    const bowlingTables = statsData.seasons.filter(t => t.type === 'bowling');
    const fieldingTables = statsData.seasons.filter(t => t.type === 'fielding');

    // Try to extract structured stats from tables
    battingTables.forEach(table => {
        table.rows.forEach(row => {
            const teamData = extractRowData(table.headers, row, 'batting');
            if (teamData) {
                // Find or create season entry
                let season = result.seasons.find(s => s.name === teamData.season);
                if (!season) {
                    season = { name: teamData.season || 'Unknown Season', year: extractYear(teamData.season), teams: [] };
                    result.seasons.push(season);
                }

                // Find or create team entry within season
                let team = season.teams.find(t => t.team_name === teamData.team);
                if (!team) {
                    team = { team_name: teamData.team || 'Unknown Team', club_name: teamData.club, grade: teamData.grade, batting: {}, bowling: {}, fielding: {} };
                    season.teams.push(team);
                }

                team.batting = teamData.stats;
            }
        });
    });

    bowlingTables.forEach(table => {
        table.rows.forEach(row => {
            const teamData = extractRowData(table.headers, row, 'bowling');
            if (teamData) {
                // Try to match to existing season/team
                result.seasons.forEach(season => {
                    season.teams.forEach(team => {
                        if (isSameTeam(team, teamData)) {
                            team.bowling = teamData.stats;
                        }
                    });
                });
            }
        });
    });

    fieldingTables.forEach(table => {
        table.rows.forEach(row => {
            const teamData = extractRowData(table.headers, row, 'fielding');
            if (teamData) {
                result.seasons.forEach(season => {
                    season.teams.forEach(team => {
                        if (isSameTeam(team, teamData)) {
                            team.fielding = teamData.stats;
                        }
                    });
                });
            }
        });
    });

    return result;
}

function extractRowData(headers, row, type) {
    if (!headers.length || !row.length) return null;

    const data = {};
    headers.forEach((h, i) => {
        if (i < row.length) {
            data[h.toLowerCase().replace(/\s+/g, '_')] = row[i];
        }
    });

    const result = {
        season: data.season || data.year || null,
        team: data.team || data.team_name || data.grade || null,
        club: data.club || data.organisation || null,
        grade: data.grade || data.competition || null,
        stats: {},
    };

    if (type === 'batting') {
        result.stats = {
            innings: parseInt(data.innings || data.inn || data.mat || 0) || 0,
            not_outs: parseInt(data.no || data.not_out || data.not_outs || 0) || 0,
            runs: parseInt(data.runs || data.r || 0) || 0,
            highest_score: data.hs || data.highest || data.high || null,
            average: parseFloat(data.avg || data.ave || data.average || 0) || null,
            strike_rate: parseFloat(data.sr || data.strike_rate || 0) || null,
            fifties: parseInt(data['50'] || data['50s'] || data.fifties || 0) || 0,
            hundreds: parseInt(data['100'] || data['100s'] || data.hundreds || 0) || 0,
            fours: parseInt(data['4s'] || data.fours || 0) || 0,
            sixes: parseInt(data['6s'] || data.sixes || 0) || 0,
        };
    } else if (type === 'bowling') {
        result.stats = {
            innings: parseInt(data.innings || data.inn || data.mat || 0) || 0,
            overs: parseFloat(data.overs || data.o || 0) || 0,
            maidens: parseInt(data.maidens || data.m || data.mdns || 0) || 0,
            runs_conceded: parseInt(data.runs || data.r || data.runs_conceded || 0) || 0,
            wickets: parseInt(data.wickets || data.w || data.wkts || 0) || 0,
            average: parseFloat(data.avg || data.ave || data.average || 0) || null,
            economy: parseFloat(data.econ || data.economy || data.er || 0) || null,
            best_figures: data.best || data.bbi || data.best_figures || null,
        };
    } else if (type === 'fielding') {
        result.stats = {
            catches: parseInt(data.catches || data.ct || data.c || 0) || 0,
            run_outs: parseInt(data.run_outs || data.ro || data['run outs'] || 0) || 0,
            stumpings: parseInt(data.stumpings || data.st || data.s || 0) || 0,
        };
    }

    return result;
}

function isSameTeam(existingTeam, newData) {
    if (existingTeam.team_name && newData.team) {
        return existingTeam.team_name.toLowerCase().includes(newData.team.toLowerCase()) ||
               newData.team.toLowerCase().includes(existingTeam.team_name.toLowerCase());
    }
    return false;
}

function extractYear(seasonStr) {
    if (!seasonStr) return new Date().getFullYear();
    const match = seasonStr.match(/(\d{4})/);
    return match ? parseInt(match[1]) + 1 : new Date().getFullYear();
}

function parseOverviewText(text) {
    // Try to parse career overview text into structured stats
    // This is a fallback when tables aren't available
    const numbers = {};
    const patterns = [
        [/(\d+)\s*innings/i, 'innings'],
        [/(\d+)\s*runs/i, 'runs'],
        [/(\d+)\s*wickets/i, 'wickets'],
        [/(\d+)\s*catches/i, 'catches'],
        [/average[:\s]*(\d+\.?\d*)/i, 'average'],
        [/strike rate[:\s]*(\d+\.?\d*)/i, 'strike_rate'],
        [/economy[:\s]*(\d+\.?\d*)/i, 'economy'],
    ];

    patterns.forEach(([regex, key]) => {
        const match = text.match(regex);
        if (match) numbers[key] = parseFloat(match[1]);
    });

    if (Object.keys(numbers).length === 0) return null;

    return {
        name: 'Career',
        year: new Date().getFullYear(),
        teams: [{
            team_name: 'Career Overview',
            batting: {
                innings: numbers.innings || 0,
                runs: numbers.runs || 0,
                average: numbers.average || null,
                strike_rate: numbers.strike_rate || null,
            },
            bowling: {
                wickets: numbers.wickets || 0,
                economy: numbers.economy || null,
            },
            fielding: {
                catches: numbers.catches || 0,
            },
        }],
    };
}
