import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Intro from './components/Intro';
import WhyElite from './components/WhyElite';
import Features from './components/Features';

import ProgramOverview from './components/ProgramOverview';
import Coaches from './components/Coaches';
import SuccessStories from './components/SuccessStories';
import SelectionProcess from './components/SelectionProcess';
import BonusOffer from './components/BonusOffer';
import FAQ from './components/FAQ';
import Apply from './components/Apply';
import Footer from './components/Footer';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsConditions from './components/TermsConditions';
import ComingSoonSplash from './components/ComingSoonSplash';
import OfferResponsePage from './components/offer-response/OfferResponsePage';
import LandingPage2 from './components/landing-page-2/LandingPage2';
import LandingPage3 from './components/landing-page-3/LandingPage3';
import StripeSuccess from './components/landing-page-3/StripeSuccess';
import MasterLandingPage from './components/master-landing-page/MasterLandingPage';
import LittleCrickets from './components/little-crickets/LittleCrickets';
import HolidayPrograms from './components/holiday-programs/HolidayPrograms';
import HolidayProgramSuccess from './components/holiday-programs/HolidayProgramSuccess';
import FemaleCricketIntroduction from './components/female-cricket-introduction/FemaleCricketIntroduction';
import FemaleCricketSuccess from './components/female-cricket-introduction/FemaleCricketSuccess';
import FemaleEmpowerment from './components/female-empowerment/FemaleEmpowerment';
import MasterStripeSuccess from './components/master-landing-page/MasterStripeSuccess';
import HomePage from './components/home-page/HomePage';
import usePageAnalytics from './hooks/usePageAnalytics';
import PostHogPageviewTracker from './components/PostHogPageviewTracker';

// DNA Profile — lazy-loaded so it never impacts landing page bundle size
const DNAProfileRoot = React.lazy(() => import('./DNAProfileApp/App.jsx'));

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

const TRACKED_SECTIONS = [
  'intro', 'success-stories', 'why-elite', 'program',
  'coaches', 'program-overview', 'faq',
  'bonus-offer', 'apply-form',
];

function LandingPage() {
  usePageAnalytics('/LP1/2026', {
    sections: TRACKED_SECTIONS,
  });

  return (
    <>
      <Navbar />
      <Hero />
      <Intro />
      <SuccessStories />
      <WhyElite />
      <Features />

      <Coaches />
      <ProgramOverview />
      <SelectionProcess />
      <FAQ />
      <BonusOffer />
      <Apply />
      <Footer />
    </>
  );
}

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
        <Route path="/master-page" element={<MasterLandingPage />} />
        <Route path="/eliteprogram2026" element={<MasterLandingPage />} />
        <Route path="/eliteprogram2026/success" element={<MasterStripeSuccess />} />
        <Route path="/eliteprogram/2026registration" element={<LandingPage />} />
        <Route path="/eliteprogram/2026registrations" element={<LandingPage />} />
        <Route path="/offer/assessment" element={<LandingPage2 />} />
        <Route path="/offer/acceptance" element={<Navigate to="/eliteprogram2026" replace />} />
        <Route path="/lp3/success" element={<StripeSuccess />} />
        <Route path="/invite" element={<Navigate to="/LP2/2026" replace />} />
        <Route path="/offer/:token" element={<OfferResponsePage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-conditions" element={<TermsConditions />} />
        <Route path="/holiday-programs" element={<HolidayPrograms />} />
        {/* Little Crickets Club — DRAFT: not in nav, Vercel only until go-live instruction */}
        <Route path="/little-crickets" element={<LittleCrickets />} />
        <Route path="/holiday-programs/success" element={<HolidayProgramSuccess />} />
        {/* Female Cricket Introduction — DRAFT: not in nav, Vercel only until go-live instruction */}
        <Route path="/female-cricket-kickstart" element={<FemaleCricketIntroduction />} />
        <Route path="/female-cricket-kickstart/success" element={<FemaleCricketSuccess />} />
        <Route path="/female-empowerment" element={<FemaleEmpowerment />} />

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
      </Routes>
    </div>
  );
}

export default App;
