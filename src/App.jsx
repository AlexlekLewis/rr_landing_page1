import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsConditions from './components/TermsConditions';
import ComingSoonSplash from './components/ComingSoonSplash';
import OfferResponsePage from './components/offer-response/OfferResponsePage';
import StripeSuccess from './components/landing-page-3/StripeSuccess';
import LittleCrickets from './components/little-crickets/LittleCrickets';
import JRSuccess from './components/little-crickets/JRSuccess';
import HolidayPrograms from './components/holiday-programs/HolidayPrograms';
import HolidayProgramSuccess from './components/holiday-programs/HolidayProgramSuccess';
import FemaleCricketIntroduction from './components/female-cricket-introduction/FemaleCricketIntroduction';
import FemaleCricketSuccess from './components/female-cricket-introduction/FemaleCricketSuccess';
import FemaleEmpowerment from './components/female-empowerment/FemaleEmpowerment';
import CoachingOpportunities from './components/coaching-opportunities/CoachingOpportunities';
import PowerGame from './components/power-game/PowerGame';
import IndiaTour2026 from './components/india-tour-2026/IndiaTour2026';
import HomePage from './components/home-page/HomePage';
import PostHogPageviewTracker from './components/PostHogPageviewTracker';

// DNA Profile — lazy-loaded so it never impacts landing page bundle size
const DNAProfileRoot = React.lazy(() => import('./DNAProfileApp/App.jsx'));

// Power Game apply funnel — lazy-loaded (qualify → place → pay registration)
const PowerGameApply = React.lazy(() => import('./components/power-game/apply/ApplyFlow'));
const PowerGameApplySuccess = React.lazy(() => import('./components/power-game/apply/PowerGameSuccess'));
const PowerGamePlayground = React.lazy(() => import('./components/power-game/apply/PlacementPlayground'));
const PowerGameSquadsAdmin = React.lazy(() => import('./components/power-game/apply/PowerGameSquads'));

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
import TextUsButton from './components/TextUsButton';
// Academy Shop — hidden from nav, accessible via direct URL only
import AcademyShop from './components/academy-shop/AcademyShop';
import ShopSuccess from './components/academy-shop/ShopSuccess';

function App() {
  return (
    <div className="font-sans antialiased text-rr-dark bg-white selection:bg-rr-pink selection:text-white">
      <PostHogPageviewTracker />
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
        {/* Junior Royals — DRAFT: not in nav, Vercel only until go-live instruction */}
        <Route path="/junior-royals" element={<LittleCrickets />} />
        <Route path="/junior-royals/success" element={<JRSuccess />} />
        <Route path="/junior-royals-holiday/success" element={<HolidayProgramSuccess />} />
        {/* Female Cricket Introduction — DRAFT: not in nav, Vercel only until go-live instruction */}
        <Route path="/female-cricket-kickstart" element={<FemaleCricketIntroduction />} />
        <Route path="/female-cricket-kickstart/success" element={<FemaleCricketSuccess />} />
        <Route path="/female-empowerment" element={<FemaleEmpowerment />} />
        {/* Coaching Opportunities — HIDDEN from nav, accessible via direct URL only */}
        <Route path="/coaching-opportunities" element={<CoachingOpportunities />} />

        {/* Power Game Program — hidden from nav, accessible via direct URL only */}
        <Route path="/PGP2026" element={<PowerGame />} />
        {/* Power Game apply funnel — qualify → place → secure (the live registration + payment) */}
        <Route path="/PGP2026/apply" element={<React.Suspense fallback={<div className="min-h-screen bg-rr-dark" />}><PowerGameApply /></React.Suspense>} />
        <Route path="/PGP2026/apply/success" element={<React.Suspense fallback={<div className="min-h-screen bg-rr-dark" />}><PowerGameApplySuccess /></React.Suspense>} />
        <Route path="/PGP2026/playground" element={<React.Suspense fallback={<div className="min-h-screen bg-rr-dark" />}><PowerGamePlayground /></React.Suspense>} />
        <Route path="/PGP2026/admin" element={<React.Suspense fallback={<div className="min-h-screen bg-rr-dark" />}><PowerGameSquadsAdmin /></React.Suspense>} />
        {/* India Tour 2026 — PRIVATE, invite-only EOI. Not in nav; gated by a referral code (?ref=). */}
        <Route path="/india-tour-2026" element={<IndiaTour2026 />} />
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
      </Routes>
      <TextUsButton />
    </div>
  );
}

export default App;
