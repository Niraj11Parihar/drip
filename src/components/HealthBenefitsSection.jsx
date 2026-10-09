import React from 'react';
import { trackEvent } from '../utils/analytics';

const benefits = [
  {
    id: 'honey-energy',
    number: '01',
    glyph: 'HNY',
    title: 'REAL HONEY ENERGY',
    description:
      'Each DRIP sachet starts with 30g of honey. Honey is the fuel base — not a flavor note added to a long formula.',
    featured: true,
  },
  {
    id: 'electrolytes',
    number: '02',
    glyph: 'Na+',
    title: 'ELECTROLYTE SUPPORT',
    description:
      '200mg of electrolytes, supported by magnesium and potassium, in the same compact sachet.',
  },
  {
    id: 'simple-formula',
    number: '03',
    glyph: '03',
    title: 'SIMPLE FORMULA',
    description:
      'A honey-first ingredient story that is easy to understand instead of building the product around maltodextrin.',
  },
  {
    id: 'caffeine-choice',
    number: '04',
    glyph: '50',
    title: 'YOUR CAFFEINE CHOICE',
    description:
      'Choose RAW with 0mg caffeine or RUSH with 50mg caffeine depending on the session and your preference.',
  },
];

export default function HealthBenefitsSection() {
  const handleBenefitClick = (benefit) => {
    trackEvent('health_benefits_card_click', { benefitId: benefit.id });
  };

  return (
    <section id="health-benefits" className="drip-benefits">
      <div className="container">
        <div className="drip-benefits__layout">
          <div className="drip-benefits__intro">
            <span className="drip-benefits__eyebrow">BUILT FOR MOVEMENT</span>

            <h2 className="drip-benefits__title">
              SIMPLE FUEL.
              <br />
              <span>NOT A SCIENCE PROJECT.</span>
            </h2>

            <p className="drip-benefits__description">
              DRIP keeps endurance fueling straightforward: real honey, electrolytes, essential minerals and the option to add caffeine when you want it.
            </p>

            <div className="drip-benefits__formula" aria-label="DRIP formula summary">
              <div className="drip-benefits__formula-primary">
                <strong>30g</strong>
                <span>REAL HONEY</span>
              </div>
              <div><strong>200mg</strong><span>ELECTROLYTES</span></div>
              <div><strong>20mg</strong><span>MAGNESIUM</span></div>
              <div><strong>80mg</strong><span>POTASSIUM</span></div>
            </div>
          </div>

          <div className="drip-benefits__grid">
            {benefits.map((benefit) => (
              <button
                type="button"
                key={benefit.id}
                className={`drip-benefit-card ${benefit.featured ? 'drip-benefit-card--featured' : ''}`}
                onClick={() => handleBenefitClick(benefit)}
              >
                <div className="drip-benefit-card__top">
                  <div className="drip-benefit-card__glyph" aria-hidden="true">
                    {benefit.glyph}
                  </div>
                  <span className="drip-benefit-card__number">{benefit.number}</span>
                </div>

                <div className="drip-benefit-card__content">
                  <h3>{benefit.title}</h3>
                  <p>{benefit.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
