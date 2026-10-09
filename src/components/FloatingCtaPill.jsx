import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { trackEvent } from '../utils/analytics';

export default function FloatingCtaPill({ onOpenResearchModal }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 450);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="drip-floating-cta-wrap">
      <button
        onClick={() => {
          trackEvent('floating_cta_click');
          onOpenResearchModal('Both');
        }}
        className="drip-floating-cta"
      >
        <Sparkles size={15} />
        <span>JOIN ATHLETE TEST</span>
        <ArrowUpRight size={16} />
      </button>
    </div>
  );
}
