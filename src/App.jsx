import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Intro from './components/Intro';
import WhyElite from './components/WhyElite';
import Features from './components/Features';
import Director from './components/Director';
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

// Admin components
import AdminLogin from './components/admin/AdminLogin';
import AdminLayout from './components/admin/AdminLayout';
import DashboardOverview from './components/admin/DashboardOverview';
import KanbanBoard from './components/admin/KanbanBoard';
import ApplicationsTable from './components/admin/ApplicationsTable';
import AnalyticsPanel from './components/admin/AnalyticsPanel';
import PagesManager from './components/admin/PagesManager';
import SettingsPanel from './components/admin/SettingsPanel';
import SelectionAnalytics from './components/admin/SelectionAnalytics';

function LandingPage() {
  return (
    <>
      <Navbar />
      <Hero />
      <Intro />
      <SuccessStories />
      <WhyElite />
      <Features />
      <Director />
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
        {/* Public routes — UNCHANGED */}
        <Route path="/" element={<ComingSoonSplash />} />
        <Route path="/eliteprogram/2026registration" element={<LandingPage />} />
        <Route path="/eliteprogram/2026registrations" element={<LandingPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-conditions" element={<TermsConditions />} />

        {/* Admin routes */}
        <Route path="/rramadmin_26" element={<AdminLogin />} />
        <Route path="/rramadmin_26/dashboard" element={<AdminLayout><DashboardOverview /></AdminLayout>} />
        <Route path="/rramadmin_26/pipeline" element={<AdminLayout><KanbanBoard /></AdminLayout>} />
        <Route path="/rramadmin_26/applications" element={<AdminLayout><ApplicationsTable /></AdminLayout>} />
        <Route path="/rramadmin_26/analytics" element={<AdminLayout><AnalyticsPanel /></AdminLayout>} />
        <Route path="/rramadmin_26/pages" element={<AdminLayout><PagesManager /></AdminLayout>} />
        <Route path="/rramadmin_26/selection" element={<AdminLayout><SelectionAnalytics /></AdminLayout>} />
        <Route path="/rramadmin_26/settings" element={<AdminLayout><SettingsPanel /></AdminLayout>} />
      </Routes>
    </div>
  );
}

export default App;
