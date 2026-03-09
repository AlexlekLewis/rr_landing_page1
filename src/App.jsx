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
import HolidayPrograms from './components/holiday-programs/HolidayPrograms';
import MasterStripeSuccess from './components/master-landing-page/MasterStripeSuccess';
import usePageAnalytics from './hooks/usePageAnalytics';

// DNA Profile Import
// import DNAProfileRoot from './DNAProfileApp/App.jsx';

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

const TRACKED_SECTIONS = [
  'intro', 'success-stories', 'why-elite', 'program',
  'coaches', 'program-overview', 'faq',
  'bonus-offer', 'apply-form',
];

function LandingPage() {
  usePageAnalytics('/eliteprogram/2026registration', {
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
      <Routes>
        {/* DNA Profile App Route (standalone portal) */}
        {/* <Route path="/Onboarding/DNAProfile/*" element={<DNAProfileRoot />} /> */}

        {/* Public routes */}
        <Route path="/" element={<ComingSoonSplash />} />
        <Route path="/master-page" element={<MasterLandingPage />} />
        <Route path="/eliteprogram2026" element={<MasterLandingPage />} />
        <Route path="/eliteprogram2026/success" element={<MasterStripeSuccess />} />
        <Route path="/eliteprogram/2026registration" element={<LandingPage />} />
        <Route path="/eliteprogram/2026registrations" element={<LandingPage />} />
        <Route path="/offer/assessment" element={<LandingPage2 />} />
        <Route path="/offer/acceptance" element={<Navigate to="/eliteprogram2026" replace />} />
        <Route path="/lp3/success" element={<StripeSuccess />} />
        <Route path="/invite" element={<Navigate to="/offer/assessment" replace />} />
        <Route path="/landing_page2/Preview" element={<LandingPage2 />} />
        <Route path="/offer/:token" element={<OfferResponsePage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-conditions" element={<TermsConditions />} />
        <Route path="/holiday-programs" element={<HolidayPrograms />} />

        {/* Admin routes */}
        <Route path="/rramadmin_26" element={<AdminLogin />} />
        <Route path="/rramadmin_26/dashboard" element={<AdminLayout><DashboardOverview /></AdminLayout>} />
        <Route path="/rramadmin_26/pipeline" element={<AdminLayout><KanbanBoard /></AdminLayout>} />
        <Route path="/rramadmin_26/applications" element={<AdminLayout><ApplicationsTable /></AdminLayout>} />
        <Route path="/rramadmin_26/lp3-acceptances" element={<AdminLayout><LP3Inquiries /></AdminLayout>} />
        <Route path="/rramadmin_26/analytics" element={<AdminLayout><AnalyticsPanel /></AdminLayout>} />
        <Route path="/rramadmin_26/page-analytics" element={<AdminLayout><PageAnalyticsPanel /></AdminLayout>} />
        <Route path="/rramadmin_26/tokens" element={<AdminLayout><TokenGenerator /></AdminLayout>} />
        <Route path="/rramadmin_26/pages" element={<AdminLayout><PagesManager /></AdminLayout>} />
        <Route path="/rramadmin_26/selection" element={<AdminLayout><SelectionAnalytics /></AdminLayout>} />
        <Route path="/rramadmin_26/settings" element={<AdminLayout><SettingsPanel /></AdminLayout>} />
        <Route path="/rramadmin_26/rsvp" element={<AdminLayout><RSVPResponses /></AdminLayout>} />
      </Routes>
    </div>
  );
}

export default App;
