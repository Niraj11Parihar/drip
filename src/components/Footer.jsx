import React from 'react';
import { Mail } from 'lucide-react';
import { trackEvent } from '../utils/analytics';

export default function Footer({ onOpenCookiePreferences, onOpenLegalModal }) {
  const handleLegalClick = (type, title) => {
    trackEvent('footer_click', { type, title });
    onOpenLegalModal(type, title);
  };

  const navLinks = [
    { label: 'Products', href: '#products' },
    { label: 'Benefits', href: '#health-benefits' },
    { label: 'Why Honey', href: '#why-honey' },
    { label: 'FAQ', href: '#faq' },
  ];

  const trustSignals = [
    { label: 'STATUS', value: 'Prototype / Athlete Testing' },
    { label: 'HONEY FIRST', value: '30g Honey Per Sachet' },
    { label: 'TWO FORMULAS', value: '0mg / 50mg Caffeine' },
  ];

  return (
    <footer className="bb-footer">
      <div className="container">
        <div className="bb-footer__top">
          <div className="bb-footer__brand-column">
            <div className="bb-footer__brand" style={{ fontFamily: "'Baloo 2', cursive", fontSize: '2.5rem', fontWeight: 900, textTransform: 'lowercase', lineHeight: 1 }}>drip</div>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.12em', color: 'var(--bb-amber)', textTransform: 'uppercase', marginBottom: '0.85rem' }}>ENERGY HONEY</div>
            <p className="bb-footer__tagline">Real honey energy for people who move.</p>
            <p className="bb-footer__description">
              A simple honey-first endurance fuel available in two purposeful options: RAW without caffeine and RUSH with 50mg caffeine.
            </p>

            <div className="bb-footer__socials">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="bb-footer__social"
                aria-label="Instagram"
                onClick={() => trackEvent('outbound_social_click', { platform: 'instagram' })}
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>

              <a
                href="mailto:hello@bruinebee.com"
                className="bb-footer__social"
                aria-label="Email"
                onClick={() => trackEvent('outbound_social_click', { platform: 'email' })}
              >
                <Mail size={17} />
              </a>
            </div>
          </div>

          <div className="bb-footer__column">
            <span className="bb-footer__column-title">EXPLORE</span>
            <div className="bb-footer__links">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => trackEvent('footer_click', { type: 'navigation', title: link.label })}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div className="bb-footer__column bb-footer__trust-column">
            <span className="bb-footer__column-title">WHY TRUST THE CONCEPT</span>
            <div className="bb-footer__trust-list">
              {trustSignals.map((item) => (
                <div className="bb-footer__trust-item" key={item.label}>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>
          </div>

          <div className="bb-footer__column">
            <span className="bb-footer__column-title">INFORMATION</span>
            <div className="bb-footer__links">
              <button type="button" onClick={() => handleLegalClick('privacy', 'Privacy Policy')}>Privacy Policy</button>
              <button type="button" onClick={() => handleLegalClick('cookies', 'Cookie Policy')}>Cookie Policy</button>
              <button type="button" onClick={() => handleLegalClick('terms', 'Terms of Service')}>Terms of Service</button>
              <button type="button" onClick={() => handleLegalClick('disclaimer', 'Health Disclaimer')}>Health Disclaimer</button>
              <button type="button" className="bb-footer__cookie-link" onClick={onOpenCookiePreferences}>Cookie Preferences</button>
            </div>
          </div>
        </div>

        <div className="bb-footer__divider" />

        <div className="bb-footer__bottom">
          <p>© {new Date().getFullYear()} DRIP. All rights reserved.</p>

          <div className="bb-footer__formula">
            <span>30g Honey</span><span>•</span>
            <span>20mg Magnesium</span><span>•</span>
            <span>80mg Potassium</span><span>•</span>
            <span>200mg Electrolytes</span>
          </div>

          <p className="bb-footer__status">31g Net Wt. · Prototype</p>
        </div>
      </div>
    </footer>
  );
}
