import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import UseCases from './components/UseCases';
import Pricing from './components/Pricing';
import About from './components/About';
import CTA from './components/CTA';
import Footer from './components/Footer';
import './landingPage.css';

const LandingPage: React.FC = () => {
    return (
        <div className="landing-page min-h-screen bg-[#020617] text-slate-200 selection:bg-violet-500/30 selection:text-white">
            <Navbar />

            <main>
                <Hero />
                <Features />
                <HowItWorks />
                <UseCases />
                <Pricing />
                <About />
                <CTA />
            </main>

            <Footer />
        </div>
    );
};

export default LandingPage;
