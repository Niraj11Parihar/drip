import React from 'react';
import { ArrowRight, Zap } from 'lucide-react';
import { trackEvent } from '../utils/analytics';

export default function Hero({ cms }) {
  const heroImage = '/images/hero-right.png';

  const handleExploreClick = () => {
    trackEvent('hero_cta_click', { cta: 'explore_raw_rush' });
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="hero-v2">
      <div className="container hero-v2__grid">
        <div className="hero-v2__content">
          <div className="hero-v2__topline">
            <span className="hero-v2__dot" />
            CLEAN HONEY-BASED ENDURANCE FUEL
          </div>

          <h1 className="hero-v2__title">
            ENERGY FROM
            <br />
            <span>REAL HONEY.</span>
          </h1>

          <p className="hero-v2__description">
            Simple fuel built around 30g of honey, electrolytes and essential minerals — made for training, racing and everything in between.
          </p>

          <div className="hero-v2__actions">
            <button type="button" className="hero-v2__button" onClick={handleExploreClick}>
              EXPLORE RAW &amp; RUSH
              <ArrowRight size={17} />
            </button>
            <span className="hero-v2__microcopy">Two formulas. One honey-first base.</span>
          </div>

          <div className="hero-v2__variants" aria-label="DRIP product highlights">
            <div className="hero-v2__variant hero-v2__variant--raw">
              <span className="hero-v2__variant-kicker">CAFFEINE FREE</span>
              <strong>RAW</strong>
              <span>0mg Caffeine</span>
            </div>

            <div className="hero-v2__variant hero-v2__variant--rush">
              <span className="hero-v2__variant-kicker"><Zap size={12} /> FOCUS</span>
              <strong>RUSH</strong>
              <span>50mg Caffeine</span>
            </div>

            <div className="hero-v2__variant hero-v2__variant--weight">
              <span className="hero-v2__variant-kicker">ONE SACHET</span>
              <strong>31g</strong>
              <span>Net Weight</span>
            </div>
          </div>
        </div>

        <div className="hero-v2__visual">
          <div className="hero-v2__scene">
            <img
              src="/images/hero-athlete.png"
              alt="Athlete training outdoors"
              className="hero-v2__athlete-photo"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
            <div className="hero-v2__scene-overlay" />
            <div className="hero-v2__speed-line hero-v2__speed-line--one" />
            <div className="hero-v2__speed-line hero-v2__speed-line--two" />
            <div className="hero-v2__honey-streak" />

            <div className="hero-v2__visual-copy">
              <span>FIELD FUEL // 01</span>
              <strong>RUN / RIDE / TRAIN</strong>
            </div>

            <img
              src={heroImage}
              alt="DRIP RAW and RUSH honey energy sachets"
              className="hero-v2__image"
            />

            <div className="hero-v2__ground-shadow" />
            <div className="hero-v2__visual-badge">
              <span>HONEY FIRST</span>
              <strong>30g</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
