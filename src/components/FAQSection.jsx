import React, { useState } from 'react';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { trackEvent } from '../utils/analytics';

const faqs = [
  {
    q: 'What is DRIP?',
    a: 'DRIP is a honey-based endurance fuel concept built around a simple formula for people who train, race, ride, run, hike, and stay active.',
  },
  {
    q: 'What is inside one DRIP sachet?',
    a: 'Each sachet contains 30g of honey, 200mg of electrolytes, 20mg of magnesium, 80mg of potassium, and either 0mg or 50mg of caffeine depending on the version.',
  },
  {
    q: 'What is the difference between RAW and RUSH?',
    a: 'RAW contains 0mg caffeine. RUSH contains 50mg caffeine. Both use the same honey-first electrolyte and mineral foundation.',
  },
  {
    q: 'Does DRIP contain maltodextrin?',
    a: 'Based on the current prototype formulation, DRIP does not use maltodextrin as an ingredient.',
  },
  {
    q: 'Is honey a source of sugar?',
    a: 'Yes. Honey naturally contains sugars including glucose and fructose, which provide carbohydrates that can be used as fuel during physical activity.',
  },
  {
    q: 'When should I use DRIP?',
    a: 'Fueling needs depend on your activity, duration, intensity, body size, diet, and individual tolerance. Final usage guidance will be confirmed as product testing and formulation development progress.',
  },
  {
    q: 'How much caffeine is in RUSH?',
    a: 'RUSH contains 50mg caffeine per sachet. RAW contains 0mg caffeine. Your total daily caffeine intake and individual tolerance should always be considered.',
  },
  {
    q: 'What is the net weight of one sachet?',
    a: 'Each DRIP sachet is designed as a 31g net-weight serving.',
  },
  {
    q: 'Can I test DRIP before launch?',
    a: 'Yes. We are currently collecting athlete feedback and applications for early product testing.',
    hasCta: true,
  },
];

export default function FAQSection({ onOpenResearchModal }) {
  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = (index, question) => {
    if (openIndex === index) {
      setOpenIndex(null);
      return;
    }

    setOpenIndex(index);
    trackEvent('faq_expand', { question });
  };

  const handleTesterClick = (e) => {
    e.stopPropagation();
    trackEvent('faq_tester_click');
    onOpenResearchModal('Both');
  };

  return (
    <section id="faq" className="drip-faq">
      <div className="container">
        <div className="drip-faq__layout">
          <div className="drip-faq__intro">
            <span className="drip-faq__eyebrow">GOT QUESTIONS?</span>

            <h2 className="drip-faq__title">
              THE DRIP
              <br />
              <span>FAQ.</span>
            </h2>

            <p className="drip-faq__description">
              The important stuff about the formula, RAW, RUSH, caffeine, testing, and what we're currently building.
            </p>

            <div className="drip-faq__mini-info">
              <div><strong>RAW</strong><span>0mg Caffeine</span></div>
              <div className="drip-faq__mini-divider" />
              <div><strong>RUSH</strong><span>50mg Caffeine</span></div>
            </div>
          </div>

          <div className="drip-faq__list">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;

              return (
                <div key={faq.q} className={`drip-faq-item ${isOpen ? 'drip-faq-item--open' : ''}`}>
                  <button
                    type="button"
                    className="drip-faq-item__question"
                    onClick={() => handleToggle(index, faq.q)}
                    aria-expanded={isOpen}
                  >
                    <div className="drip-faq-item__question-left">
                      <span className="drip-faq-item__number">{String(index + 1).padStart(2, '0')}</span>
                      <span className="drip-faq-item__question-text">{faq.q}</span>
                    </div>

                    <div className="drip-faq-item__toggle">
                      <ChevronDown size={18} />
                    </div>
                  </button>

                  <div className="drip-faq-item__answer-wrap">
                    <div className="drip-faq-item__answer">
                      <p>{faq.a}</p>

                      {faq.hasCta && (
                        <button type="button" className="drip-faq-item__cta" onClick={handleTesterClick}>
                          JOIN ATHLETE TESTING
                          <ArrowRight size={15} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
