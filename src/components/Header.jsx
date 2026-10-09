import React, { useEffect, useState } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { trackEvent } from '../utils/analytics';

export default function Header({ onOpenResearchModal }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 18);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#products', label: 'Products' },
    { href: '#health-benefits', label: 'Benefits' },
    { href: '#why-honey', label: 'Why Honey' },
    { href: '#faq', label: 'FAQ' },
  ];

  const handleNavClick = (target, label) => {
    trackEvent('navigation_click', { label, target });
    setMobileMenuOpen(false);
  };

  const handleResearchClick = () => {
    trackEvent('hero_cta_click', {
      source: 'header_nav',
      cta: 'join_athlete_test',
    });

    onOpenResearchModal();
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className={`bb-header ${scrolled ? 'bb-header--scrolled' : ''}`}>
        <div className="container bb-header__inner">
          <a href="#" className="bb-header__brand" aria-label="DRIP home">
            <span className="bb-header__brand-name">DRIP</span>
            <span className="bb-header__brand-mark" aria-hidden="true" />
          </a>

          <nav className="bb-header__desktop-nav" aria-label="Main navigation">
            <div className="bb-header__links">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="bb-header__link"
                  onClick={() => handleNavClick(link.href, link.label)}
                >
                  {link.label}
                </a>
              ))}
            </div>

            <button
              type="button"
              className="bb-header__cta"
              onClick={handleResearchClick}
              id="header-cta-btn"
            >
              JOIN ATHLETE TEST
              <ArrowUpRight size={15} strokeWidth={2.2} />
            </button>
          </nav>

          <button
            type="button"
            className="bb-header__menu-button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        <div className={`bb-mobile-nav ${mobileMenuOpen ? 'bb-mobile-nav--open' : ''}`}>
          <div className="container bb-mobile-nav__inner">
            <nav className="bb-mobile-nav__links">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="bb-mobile-nav__link"
                  onClick={() => handleNavClick(link.href, link.label)}
                >
                  <span>{link.label}</span>
                  <span className="bb-mobile-nav__arrow">↗</span>
                </a>
              ))}
            </nav>

            <button type="button" className="bb-mobile-nav__cta" onClick={handleResearchClick}>
              JOIN ATHLETE TEST
              <ArrowUpRight size={16} />
            </button>

            <p className="bb-mobile-nav__note">
              RAW · 0mg caffeine &nbsp;&nbsp; / &nbsp;&nbsp; RUSH · 50mg caffeine
            </p>
          </div>
        </div>
      </header>
    </>
  );
}
