import React from 'react';
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

function App() {
  return (
    <div className="font-sans antialiased text-rr-dark bg-white selection:bg-rr-pink selection:text-white">
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
    </div>
  );
}

export default App;
