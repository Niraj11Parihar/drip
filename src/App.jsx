import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Footer from './components/Footer';
import ProductSelection from './components/ProductSelection';
import HealthBenefitsSection from './components/HealthBenefitsSection';
import WhyHoney from './components/WhyHoney';
import ValidationCTA from './components/ValidationCTA';
import PriceValidation from './components/PriceValidation';
import EarlyTesterCTA from './components/EarlyTesterCTA';
import SocialProof from './components/SocialProof';
import FAQSection from './components/FAQSection';
import FloatingCtaPill from './components/FloatingCtaPill';
import CookieBanner from './components/CookieBanner';
import AthleteResearchForm from './components/AthleteResearchForm';
import LegalModal from './screens/LegalScreen';

import { initEngagementTracking, initScrollTracking, trackEvent } from './utils/analytics';
import PerformanceBanner from './components/PerformanceBanner';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function App() {
  const [products, setProducts] = useState([]);
  const [cms, setCms] = useState({});
  const [researchModalOpen, setResearchModalOpen] = useState(false);
  const [initialPreference, setInitialPreference] = useState('Both');

  const [cookiePrefOpen, setCookiePrefOpen] = useState(false);
  const [legalModalState, setLegalModalState] = useState({ isOpen: false, type: '', title: '' });

  useEffect(() => {
    // Fetch CMS Content & Active Products
    fetch(`${API_BASE}/api/cms`)
      .then(res => res.json())
      .then(data => {
        if (data.products) setProducts(data.products);
        if (data.cms) setCms(data.cms);
      })
      .catch(err => console.error('Error loading CMS data:', err));

    // Initialize Analytics
    trackEvent('page_view', { path: window.location.pathname });
    initEngagementTracking();
    initScrollTracking();
  }, []);

  const handleOpenResearch = (preference = 'Both') => {
    setInitialPreference(preference);
    setResearchModalOpen(true);
  };

  const handleOpenLegal = (type, title) => {
    setLegalModalState({ isOpen: true, type, title });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>



      {/* Header Navigation */}
      <Header onOpenResearchModal={() => handleOpenResearch('Both')} />

      {/* Main Page Sections */}
      <main style={{ flex: 1 }}>
        <Hero cms={cms} onOpenResearchModal={() => handleOpenResearch('Both')} />
        <ProductSelection products={products} onSelectProduct={(pref) => handleOpenResearch(pref)} />
        <HealthBenefitsSection />
        <PerformanceBanner />
        <WhyHoney />
        <ValidationCTA onOpenResearchModal={(pref) => handleOpenResearch(pref)} />
        <PriceValidation cms={cms} />
        <EarlyTesterCTA />
        <SocialProof />
        <FAQSection onOpenResearchModal={() => handleOpenResearch('Both')} />
      </main>

      {/* Sticky Floating CTA */}
      <FloatingCtaPill onOpenResearchModal={(pref) => handleOpenResearch(pref)} />

      {/* Footer */}
      <Footer
        onOpenCookiePreferences={() => setCookiePrefOpen(true)}
        onOpenLegalModal={handleOpenLegal}
      />

      {/* Modals & Cookie Banner */}
      <CookieBanner
        isPreferencesOpen={cookiePrefOpen}
        onClosePreferences={() => setCookiePrefOpen(false)}
      />

      <AthleteResearchForm
        isOpen={researchModalOpen}
        onClose={() => setResearchModalOpen(false)}
        initialPreference={initialPreference}
      />

      <LegalModal
        isOpen={legalModalState.isOpen}
        type={legalModalState.type}
        title={legalModalState.title}
        onClose={() => setLegalModalState({ isOpen: false, type: '', title: '' })}
      />

    </div>
  );
}
