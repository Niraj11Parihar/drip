import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { trackEvent } from '../utils/analytics';

const learningPoints = [
  {
    number: '01',
    title: 'How you currently fuel',
    text: 'What you already use during training and endurance activity.',
  },
  {
    number: '02',
    title: 'What matters to you',
    text: 'Ingredients, taste, digestion, caffeine and convenience.',
  },
  {
    number: '03',
    title: 'Would you actually try DRIP?',
    text: 'Your feedback helps us decide what deserves to get built next.',
  },
];

export default function ValidationCTA({ onOpenResearchModal }) {
  const handleJoin = () => {
    trackEvent('interest_cta_click', {
      response: 'join_athlete_test',
      source: 'validation_section',
    });

    onOpenResearchModal('Both');
  };

  return (
    <section id="feedback" className="drip-validation">
      <div className="drip-validation__mesh" aria-hidden="true" />

      <div className="container">
        <div className="drip-validation__inner">
          <div className="drip-validation__content">
            <span className="drip-validation__eyebrow">BUILT WITH ATHLETES</span>

            <h2 className="drip-validation__title">
              HELP SHAPE
              <br />
              <span>WHAT DRIP BECOMES.</span>
            </h2>

            <p className="drip-validation__description">
              DRIP is still in its early testing phase. We're working with active athletes to understand what works, what doesn't, and what deserves to make it into the final product.
            </p>

            <button
              type="button"
              className="drip-validation__cta"
              onClick={handleJoin}
              id="val-yes-btn"
            >
              JOIN ATHLETE TESTING
              <ArrowUpRight size={17} />
            </button>
          </div>

          <div className="drip-validation__side">
            <div className="drip-validation__side-header">
              <span className="drip-validation__side-label">WHAT WE WANT TO LEARN</span>
              <span className="drip-validation__side-count">03 SIGNALS</span>
            </div>

            <div className="drip-validation__points">
              {learningPoints.map((point) => (
                <div className="drip-validation__point" key={point.number}>
                  <div className="drip-validation__check">{point.number}</div>
                  <div>
                    <strong>{point.title}</strong>
                    <span>{point.text}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="drip-validation__status">
              <span className="drip-validation__pulse" />
              <div>
                <strong>EARLY PRODUCT TESTING</strong>
                <span>DRIP is currently in development.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
