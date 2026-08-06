import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import RouteSeo from './seo/RouteSeo';
import NotFound from './components/NotFound';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsConditions from './components/TermsConditions';
import ComingSoonSplash from './components/ComingSoonSplash';
import OfferResponsePage from './components/offer-response/OfferResponsePage';
import StripeSuccess from './components/landing-page-3/StripeSuccess';
import LittleCrickets from './components/little-crickets/LittleCrickets';
import JRSuccess from './components/little-crickets/JRSuccess';
import JuniorRoyalsT3 from './components/junior-royals-t3/JuniorRoyalsT3';
import JRT3Success from './components/junior-royals-t3/JRT3Success';
import HolidayPrograms from './components/holiday-programs/HolidayPrograms';
import HolidayProgramSuccess from './components/holiday-programs/HolidayProgramSuccess';
import FemaleCricketIntroduction from './components/female-cricket-introduction/FemaleCricketIntroduction';
import FemaleCricketSuccess from './components/female-cricket-introduction/FemaleCricketSuccess';
import FemaleEmpowerment from './components/female-empowerment/FemaleEmpowerment';
import CoachingOpportunities from './components/coaching-opportunities/CoachingOpportunities';
import PowerGame from './components/power-game/PowerGame';
import MicklehamOpenDay from './components/mickleham-open-day/MicklehamOpenDay';
import OpenDay from './components/open-day/OpenDay';
import OpenDaySuccess from './components/open-day/OpenDaySuccess';
import { WILLIAMSTOWN_OPEN_DAY, HALLAM_OPEN_DAY, MICKLEHAM_ELITE, MICKLEHAM_JUNIOR } from './components/open-day/configs';
import EntryPage from './components/open-day/EntryPage';
import { MICKLEHAM_ENTRY, WILLIAMSTOWN_ENTRY, HALLAM_ENTRY } from './components/open-day/entryConfigs';
import IndiaTour2026 from './components/india-tour-2026/IndiaTour2026';
// India Tour deposit pages retired 2026-08-05 — routes now 410 via api/gone.js.
// Components left in src/components/india-tour-deposit/ in case the flow is ever
// revived, but they are no longer imported or reachable.
import HomePage from './components/home-page/HomePage';
import InductionPage from './components/induction/InductionPage';
import CoachesDay from './components/coaches-day/CoachesDay';
import CoachesPage from './components/coaches/CoachesPage';
import PrivateCoaching from './components/private-coaching/PrivateCoaching';
import MicklehamLaunch from './components/mickleham-launch/MicklehamLaunch';
import Reviews from './components/reviews/Reviews';
import ProgramFeedback from './components/program-feedback/ProgramFeedback';
import PostHogPageviewTracker from './components/PostHogPageviewTracker';

// DNA Profile — lazy-loaded so it never impacts landing page bundle size
const DNAProfileRoot = React.lazy(() => import('./DNAProfileApp/App.jsx'));

// Power Game apply funnel — lazy-loaded (qualify → place → pay registration)
const PowerGameApply = React.lazy(() => import('./components/power-game/apply/ApplyFlow'));
const PowerGameApplySuccess = React.lazy(() => import('./components/power-game/apply/PowerGameSuccess'));
const PowerGamePlayground = React.lazy(() => import('./components/power-game/apply/PlacementPlayground'));
const PowerGameSquadsAdmin = React.lazy(() => import('./components/power-game/apply/PowerGameSquads'));
// Returning Elite players — private, passcode-gated express re-signup (details + pay).
const PowerGameReturning = React.lazy(() => import('./components/power-game/returning/ReturningSignup'));
// Accepted review/callback players — private, passcode-gated express spot confirmation.
const PowerGameConfirm = React.lazy(() => import('./components/power-game/returning/AcceptedSignup'));
// Scholarship players — private express confirmation; program discount via promo code, kit mandatory.
const PowerGameScholarship = React.lazy(() => import('./components/power-game/returning/ScholarshipSignup'));
const PowerGameFullRide = React.lazy(() => import('./components/power-game/returning/FullRideSignup'));

// Admin components
import AdminLogin from './components/admin/AdminLogin';
import AdminLayout from './components/admin/AdminLayout';
import DashboardOverview from './components/admin/DashboardOverview';
import KanbanBoard from './components/admin/KanbanBoard';
import ApplicationsTable from './components/admin/ApplicationsTable';
import AnalyticsPanel from './components/admin/AnalyticsPanel';
import PageAnalyticsPanel from './components/admin/PageAnalyticsPanel';
import PagesManager from './components/admin/PagesManager';
import SettingsPanel from './components/admin/SettingsPanel';
import SelectionAnalytics from './components/admin/SelectionAnalytics';
import TokenGenerator from './components/admin/TokenGenerator';
import RSVPResponses from './components/admin/RSVPResponses';
import LP3Inquiries from './components/admin/LP3Inquiries';
import PlayerProfiles from './components/admin/PlayerProfiles';
import HomeLeadsDashboard from './components/admin/HomeLeadsDashboard';
import PowerGameInquiries from './components/admin/PowerGameInquiries';
import ShopOrdersDashboard from './components/admin/ShopOrdersDashboard';
import ProgramRegistrationsDashboard from './components/admin/ProgramRegistrationsDashboard';
import HolidaySubProgramDashboard from './components/admin/HolidaySubProgramDashboard';
import IndiaTour2026Dashboard from './components/admin/IndiaTour2026Dashboard';
import IndiaTourEOIDashboard from './components/admin/IndiaTourEOIDashboard';
import ReviewsModeration from './components/admin/ReviewsModeration';
import ProgramFeedbackDashboard from './components/admin/ProgramFeedbackDashboard';
import ProgramFeedbackResponses from './components/admin/ProgramFeedbackResponses';
import PowerLeagueDashboard from './components/admin/PowerLeagueDashboard';
import TextUsButton from './components/TextUsButton';
// Academy Shop — hidden from nav, accessible via direct URL only
import AcademyShop from './components/academy-shop/AcademyShop';
import ShopSuccess from './components/academy-shop/ShopSuccess';

// Recover from a stale lazy-chunk load after a deploy (an already-open tab requests an old
// chunk hash that no longer exists). Without a boundary, a failed dynamic import unmounts the
// whole React tree → blank white screen. On a chunk error we reload ONCE to pull the fresh
// build; a sessionStorage guard prevents a reload loop if the failure isn't transient.
class ChunkReloadBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error) {
    const msg = String((error && (error.message || error.toString())) || '');
    const isChunkError = /dynamically imported module|Importing a module script failed|ChunkLoadError|Loading (chunk|CSS chunk)|error loading dynamically|Failed to fetch/i.test(msg);
    if (isChunkError) {
      try {
        if (!sessionStorage.getItem('chunk_reloaded')) {
          sessionStorage.setItem('chunk_reloaded', '1');
          window.location.reload();
        }
      } catch (_) { /* sessionStorage blocked — fall through to the fallback UI */ }
    }
  }
  render() {
    if (this.state.failed) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#111921', color: '#fff', fontFamily: 'sans-serif', textAlign: 'center', padding: 24 }}>
          <div>
            <p style={{ fontWeight: 800, fontSize: 18, marginBottom: 4 }}>Sorry — something went wrong loading the page.</p>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, marginBottom: 16 }}>A quick refresh usually fixes it.</p>
            <button
              onClick={() => { try { sessionStorage.removeItem('chunk_reloaded'); } catch (_) { /* ignore */ } window.location.reload(); }}
              style={{ background: '#E50695', color: '#fff', border: 'none', borderRadius: 9999, padding: '12px 28px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer' }}
            >
              Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  return (
    <div className="font-sans antialiased text-rr-dark bg-white selection:bg-rr-pink selection:text-white">
      <PostHogPageviewTracker />
      <RouteSeo />
      <ChunkReloadBoundary>
      <Routes>
        {/* DNA Profile App — lazy-loaded portal at /eliteprogram/playerDNAprofile */}
        <Route path="/eliteprogram2026/playerDNAprofile/*" element={
          <React.Suspense fallback={
            <div style={{minHeight:'100vh',background:'linear-gradient(135deg,#0a0a14,#1a1a2e)',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <div style={{color:'rgba(255,255,255,0.5)',fontSize:13,fontFamily:"'Montserrat',sans-serif",fontWeight:600}}>Loading Player DNA Profile...</div>
            </div>
          }>
            <DNAProfileRoot />
          </React.Suspense>
        } />

        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/splash" element={<ComingSoonSplash />} />
        {/* Elite Program 2026 — ARCHIVED (2026 intake closed). These routes were retired; the
            URLs (/eliteprogram2026, /master-page, /eliteprogram2026/success,
            /eliteprogram/2026registration[s], /offer/assessment, /invite) now return HTTP 410
            Gone via api/gone.js — see vercel.json rewrites — so they can't be visited or indexed. */}
        <Route path="/offer/acceptance" element={<Navigate to="/" replace />} />
        <Route path="/lp3/success" element={<StripeSuccess />} />
        <Route path="/offer/:token" element={<OfferResponsePage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-conditions" element={<TermsConditions />} />
        <Route path="/junior-royals-holiday" element={<HolidayPrograms />} />
        {/* Junior Royals Term 2 — archived */}
        <Route path="/junior-royals-term2" element={<LittleCrickets />} />
        <Route path="/junior-royals-term2/success" element={<JRSuccess />} />
        {/* Junior Royals Term 3 — active */}
        <Route path="/junior-royals" element={<JuniorRoyalsT3 />} />
        <Route path="/junior-royals/success" element={<JRT3Success />} />
        <Route path="/junior-royals-holiday/success" element={<HolidayProgramSuccess />} />
        {/* Female Cricket Introduction — DRAFT: not in nav, Vercel only until go-live instruction */}
        <Route path="/female-cricket-kickstart" element={<FemaleCricketIntroduction />} />
        <Route path="/female-cricket-kickstart/success" element={<FemaleCricketSuccess />} />
        <Route path="/female-empowerment" element={<FemaleEmpowerment />} />
        {/* Coaching Opportunities — HIDDEN from nav, accessible via direct URL only */}
        <Route path="/coaching-opportunities" element={<CoachingOpportunities />} />
        {/* Player Induction — generic, reusable form for ad-hoc program launches. Hidden from
            nav; share the link directly (optionally /induction?program=Name). Writes to program_inductions. */}
        <Route path="/induction" element={<InductionPage />} />

        {/* The Coaches — leadership tiers, coaching mission + full bios. Info page, no form. */}
        <Route path="/coaches" element={<CoachesPage />} />
        {/* Private Coaching at Mickleham. EOI form → Head Coach assigns a coach.
            Writes to private_coaching_eoi (anon insert only). Canonical URL is
            /mickleham (per Alex); /private-coaching 308s in vercel.json, with a
            client redirect here for any in-app navigations. */}
        <Route path="/mickleham" element={<PrivateCoaching />} />
        <Route path="/Mickleham" element={<PrivateCoaching />} />
        <Route path="/private-coaching" element={<Navigate to="/mickleham" replace />} />
        {/* Mickleham 30-Day Launch Special — campaign page for the front-desk flyer
            QR code + Instagram link. /Mickleham_Launch is the published short link;
            /launch kept as a fallback so nothing already shared breaks. */}
        <Route path="/mickleham-launch" element={<MicklehamLaunch />} />
        <Route path="/Mickleham_Launch" element={<MicklehamLaunch />} />
        <Route path="/launch" element={<MicklehamLaunch />} />
        {/* An Afternoon for Coaches — free coaches afternoon, junior & senior (Sun 26 Jul 2026).
            Standalone registration, writes to coaches_day_registrations. Share the link directly. */}
        <Route path="/coaches-day" element={<CoachesDay />} />
        {/* Reviews — public, moderated testimonial wall + submit form. Linkable from anywhere. */}
        <Route path="/reviews" element={<Reviews />} />
        {/* Elite Program feedback + win-back survey — private link shared with the 2026 cohort.
            Not in nav; writes to program_feedback via the service-role /api/program-feedback. */}
        <Route path="/elite-feedback" element={<ProgramFeedback />} />

        {/* Power Game Program — hidden from nav, accessible via direct URL only */}
        <Route path="/elite-royals" element={<PowerGame />} />
        <Route path="/PGP2026" element={<PowerGame />} />
        {/* Mickleham Open Day — turn-up-and-play + Elite Program trial registration */}
        <Route path="/PGP2026/mickleham" element={<MicklehamOpenDay />} />
        <Route path="/PGP2026/mickleham/success" element={<OpenDaySuccess config={MICKLEHAM_ELITE} />} />
        <Route path="/PGP2026/mickleham/junior/success" element={<OpenDaySuccess config={MICKLEHAM_JUNIOR} audience="junior" />} />

        {/* Williamstown + Hallam Open Days (Fri 10 July) — same two-part format, shared components */}
        <Route path="/PGP2026/williamstown" element={<OpenDay config={WILLIAMSTOWN_OPEN_DAY} />} />
        <Route path="/PGP2026/williamstown/success" element={<OpenDaySuccess config={WILLIAMSTOWN_OPEN_DAY} />} />
        <Route path="/PGP2026/williamstown/junior/success" element={<OpenDaySuccess config={WILLIAMSTOWN_OPEN_DAY.junior} audience="junior" />} />
        <Route path="/PGP2026/hallam" element={<OpenDay config={HALLAM_OPEN_DAY} />} />
        <Route path="/PGP2026/hallam/success" element={<OpenDaySuccess config={HALLAM_OPEN_DAY} />} />
        <Route path="/PGP2026/hallam/junior/success" element={<OpenDaySuccess config={HALLAM_OPEN_DAY.junior} audience="junior" />} />

        {/* Onsite "Register for Entry" QR check-in — one fast form for EVERY attendee
            (Junior + Elite), capturing details + all three compliances. Writes into the
            same per-centre {centre}_open_day_registrations table (source=*-entry). */}
        <Route path="/PGP2026/mickleham/entry" element={<EntryPage config={MICKLEHAM_ENTRY} />} />
        <Route path="/PGP2026/williamstown/entry" element={<EntryPage config={WILLIAMSTOWN_ENTRY} />} />
        <Route path="/PGP2026/hallam/entry" element={<EntryPage config={HALLAM_ENTRY} />} />
        {/* Power Game apply funnel — qualify → place → secure (the live registration + payment) */}
        <Route path="/PGP2026/apply" element={<React.Suspense fallback={<div className="min-h-screen bg-rr-dark" />}><PowerGameApply /></React.Suspense>} />
        <Route path="/PGP2026/apply/success" element={<React.Suspense fallback={<div className="min-h-screen bg-rr-dark" />}><PowerGameApplySuccess /></React.Suspense>} />
        <Route path="/PGP2026/success" element={<React.Suspense fallback={<div className="min-h-screen bg-rr-dark" />}><PowerGameApplySuccess /></React.Suspense>} />
        <Route path="/elite-royals/success" element={<React.Suspense fallback={<div className="min-h-screen bg-rr-dark" />}><PowerGameApplySuccess /></React.Suspense>} />
        {/* Returning players — passcode-gated express re-signup. Not in nav; share the link directly. */}
        <Route path="/PGP2026/returning" element={<React.Suspense fallback={<div className="min-h-screen bg-rr-dark" />}><PowerGameReturning /></React.Suspense>} />
        {/* Accepted review/callback players — passcode-gated express confirmation. Not in nav; share the link directly. */}
        <Route path="/PGP2026/confirm" element={<React.Suspense fallback={<div className="min-h-screen bg-rr-dark" />}><PowerGameConfirm /></React.Suspense>} />
        {/* Scholarship players — passcode-gated express confirmation; kit mandatory, program discount via promo code. Not in nav; share the link directly. */}
        <Route path="/PGP2026/scholarship" element={<React.Suspense fallback={<div className="min-h-screen bg-rr-dark" />}><PowerGameScholarship /></React.Suspense>} />
        <Route path="/PGP2026/fullride" element={<React.Suspense fallback={<div className="min-h-screen bg-rr-dark" />}><PowerGameFullRide /></React.Suspense>} />
        <Route path="/PGP2026/playground" element={<React.Suspense fallback={<div className="min-h-screen bg-rr-dark" />}><PowerGamePlayground /></React.Suspense>} />
        <Route path="/PGP2026/admin" element={<React.Suspense fallback={<div className="min-h-screen bg-rr-dark" />}><PowerGameSquadsAdmin /></React.Suspense>} />
        {/* High Performance Centre Camp — PUBLIC program page at the canonical /tours.
            Any ?ref= is captured for attribution only; it no longer gates access.
            /india-tour-2026 was the old URL and has been shared, so it redirects here
            (308 in vercel.json for direct hits, Navigate for in-app navigation). The
            search string is carried across so referral attribution survives. */}
        <Route path="/tours" element={<IndiaTour2026 />} />
        <Route
          path="/india-tour-2026"
          element={<Navigate to={{ pathname: '/tours', search: window.location.search }} replace />}
        />
        {/* India Tour 2026 deposit — RETIRED 2026-08-05 (Alex: "that page is redundant").
            It charged a $2,200 "deposit", but the tour is not sold that way: the high performance
            cost ($2,100 / $2,700) is paid IN FULL UP FRONT once a place is confirmed, and flights
            are paid separately via the group booking link. /india-tour-2026/deposit and
            .../deposit/success now return HTTP 410 Gone via api/gone.js — see vercel.json rewrites.
            The india_tour_2026_deposits table and its data are deliberately KEPT. */}
        {/* Academy Shop — hidden from nav. Share URL directly with participants only. */}
        <Route path="/academy-shop" element={<AcademyShop />} />
        <Route path="/academy-shop/success" element={<ShopSuccess />} />

        {/* Admin routes */}
        <Route path="/rramadmin_26" element={<AdminLogin />} />
        <Route path="/rramadmin_26/dashboard" element={<AdminLayout><DashboardOverview /></AdminLayout>} />
        <Route path="/rramadmin_26/pipeline" element={<AdminLayout><KanbanBoard /></AdminLayout>} />
        <Route path="/rramadmin_26/applications" element={<AdminLayout><ApplicationsTable /></AdminLayout>} />
        <Route path="/rramadmin_26/lp3-acceptances" element={<AdminLayout><LP3Inquiries /></AdminLayout>} />
        <Route path="/rramadmin_26/player-profiles" element={<AdminLayout><PlayerProfiles /></AdminLayout>} />
        <Route path="/rramadmin_26/analytics" element={<AdminLayout><AnalyticsPanel /></AdminLayout>} />
        <Route path="/rramadmin_26/page-analytics" element={<Navigate to="/rramadmin_26/analytics" replace />} />
        <Route path="/rramadmin_26/tokens" element={<AdminLayout><TokenGenerator /></AdminLayout>} />
        <Route path="/rramadmin_26/selection" element={<AdminLayout><SelectionAnalytics /></AdminLayout>} />
        <Route path="/rramadmin_26/settings" element={<AdminLayout><SettingsPanel /></AdminLayout>} />
        <Route path="/rramadmin_26/rsvp" element={<AdminLayout><RSVPResponses /></AdminLayout>} />
        <Route path="/rramadmin_26/home-leads" element={<AdminLayout><HomeLeadsDashboard /></AdminLayout>} />
        <Route path="/rramadmin_26/power-game" element={<AdminLayout><PowerGameInquiries /></AdminLayout>} />
        <Route path="/rramadmin_26/shop-orders" element={<AdminLayout><ShopOrdersDashboard /></AdminLayout>} />
        <Route path="/rramadmin_26/program-registrations" element={<AdminLayout><ProgramRegistrationsDashboard /></AdminLayout>} />
        <Route path="/rramadmin_26/holiday/:programSlug" element={<AdminLayout><HolidaySubProgramDashboard /></AdminLayout>} />
        <Route path="/rramadmin_26/india-tour-2026" element={<AdminLayout><IndiaTour2026Dashboard /></AdminLayout>} />
        <Route path="/rramadmin_26/india-tour-eoi" element={<AdminLayout><IndiaTourEOIDashboard /></AdminLayout>} />
        <Route path="/rramadmin_26/reviews" element={<AdminLayout><ReviewsModeration /></AdminLayout>} />
        <Route path="/rramadmin_26/feedback" element={<AdminLayout><ProgramFeedbackDashboard /></AdminLayout>} />
        <Route path="/rramadmin_26/feedback/responses" element={<AdminLayout><ProgramFeedbackResponses /></AdminLayout>} />
        <Route path="/rramadmin_26/power-league" element={<AdminLayout><PowerLeagueDashboard /></AdminLayout>} />

        {/* 404 — MUST be last. Unknown URLs render NotFound (full nav + footer + links home). */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      </ChunkReloadBoundary>
      <TextUsButton />
    </div>
  );
}

export default App;
