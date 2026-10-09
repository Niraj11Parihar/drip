import React, { useState } from 'react';
import { trackEvent } from '../utils/analytics';

export default function PriceValidation({ cms }) {
  const isEnabled = cms?.price_validation_enabled === 'true';
  const currency = cms?.price_validation_currency || 'USD';
  const rangesStr = cms?.price_validation_ranges || '$2.00 - $2.50, $2.50 - $3.00, $3.00 - $3.50, $3.50+';
  const ranges = rangesStr.split(',').map(r => r.trim());

  const [selectedRange, setSelectedRange] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  if (!isEnabled) return null;

  const handleSelect = (range) => {
    setSelectedRange(range);
    setSubmitted(true);
    trackEvent('price_validation_response', { range, currency });
  };

  return (
    <section className="section-spacing" style={{ backgroundColor: '#FDF7EC', borderTop: '1px solid #FCD34D', borderBottom: '1px solid #FCD34D' }}>
      <div className="container" style={{ maxWidth: '720px', textAlign: 'center' }}>
        <span className="eyebrow" style={{ color: '#B45309' }}>PRICE VALIDATION RESEARCH</span>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.75rem' }}>
          WHAT WOULD YOU REASONABLY PAY FOR ONE PREMIUM HONEY ENERGY GEL?
        </h2>
        <p style={{ fontSize: '0.95rem', color: '#57564E', marginBottom: '2rem' }}>
          Help us price Bruin's Energy Honey fairly for endurance athletes.
        </p>

        {!submitted ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
            {ranges.map((r, idx) => (
              <button
                key={idx}
                className="btn btn-secondary"
                onClick={() => handleSelect(r)}
                style={{ backgroundColor: '#FFFFFF', borderColor: '#D89A27', fontWeight: 700 }}
              >
                {r}
              </button>
            ))}
          </div>
        ) : (
          <div style={{ color: '#B45309', fontWeight: 700, fontSize: '1.05rem' }}>
            ✓ Thank you! Your pricing feedback has been logged.
          </div>
        )}
      </div>
    </section>
  );
}
