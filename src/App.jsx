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
        <Route path="/" element={<LandingPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-conditions" element={<TermsConditions />} />
      </Routes>
    </div>
  );
}

export default App;
