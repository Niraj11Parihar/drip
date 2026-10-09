import React, { useState } from 'react';
import { ArrowRight, Check, Sparkles, Zap } from 'lucide-react';
import { trackEvent, getVisitorId, getUtmParams } from '../utils/analytics';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function EarlyTesterCTA() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    sport: 'Runner',
    trainingFrequency: '3–4 days/week',
    selectedProduct: 'Both',
    marketingConsent: true,
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email) return;
    setLoading(true);

    try {
      const visitorId = getVisitorId();
      const utm = getUtmParams();
      const res = await fetch(`${API_BASE}/api/tester`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          anonymousVisitorId: visitorId,
          utmSource: utm.utm_source,
          utmMedium: utm.utm_medium,
          utmCampaign: utm.utm_campaign,
        }),
      });

      if (!res.ok) throw new Error('Submission failed');
      setSubmitted(true);
      trackEvent('tester_cta_click', {
        sport: formData.sport,
        selectedProduct: formData.selectedProduct,
      });
    } catch (err) {
      console.error('Tester application error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="drip-tester">
      <div className="container">
        <div className="drip-tester__panel">
          <div className="drip-tester__intro">
            <div className="drip-tester__eyebrow">
              <Sparkles size={14} />
              EARLY ATHLETE TESTING
            </div>

            <h2 className="drip-tester__title">
              APPLY FOR AN
              <br />
              <span>EARLY SAMPLE.</span>
            </h2>

            <p className="drip-tester__description">
              We're preparing early DRIP samples for active athletes who are willing to test the product and share genuine feedback.
            </p>

            <div className="drip-tester__products">
              <div className="drip-tester-product">
                <span className="drip-tester-product__name">RAW</span>
                <div>
                  <strong>0mg Caffeine</strong>
                  <span>Honey-first everyday fuel</span>
                </div>
              </div>

              <div className="drip-tester-product drip-tester-product--rush">
                <span className="drip-tester-product__name">RUSH</span>
                <div>
                  <strong><Zap size={13} /> 50mg Caffeine</strong>
                  <span>Honey energy + extra focus</span>
                </div>
              </div>
            </div>

            <div className="drip-tester__note">
              <Check size={15} />
              <span>Selected testers may be contacted when prototype batches are available.</span>
            </div>
          </div>

          <div className="drip-tester__form-card">
            <div className="drip-tester__form-texture" aria-hidden="true" />

            {!submitted ? (
              <form onSubmit={handleSubmit} className="drip-tester__form">
                <div className="drip-tester__form-header">
                  <span>SAMPLE APPLICATION</span>
                  <h3>Tell us a little about you.</h3>
                </div>

                <div className="drip-field">
                  <label>First Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Alex"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="drip-field">
                  <label>Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="alex@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="drip-tester__form-grid">
                  <div className="drip-field">
                    <label>Primary Sport</label>
                    <select
                      value={formData.sport}
                      onChange={(e) => setFormData({ ...formData, sport: e.target.value })}
                    >
                      <option value="Runner">Runner</option>
                      <option value="Cyclist">Cyclist</option>
                      <option value="Triathlete">Triathlete</option>
                      <option value="Gym / Functional Fitness">Gym / Functional Fitness</option>
                      <option value="Hiker / Trekker">Hiker / Trekker</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="drip-field">
                    <label>Preferred Version</label>
                    <select
                      value={formData.selectedProduct}
                      onChange={(e) => setFormData({ ...formData, selectedProduct: e.target.value })}
                    >
                      <option value="RAW — Caffeine Free">RAW — Caffeine Free</option>
                      <option value="RUSH — 50mg Caffeine">RUSH — 50mg Caffeine</option>
                      <option value="Both">Both</option>
                    </select>
                  </div>
                </div>

                <label className="drip-tester__consent">
                  <input
                    type="checkbox"
                    checked={formData.marketingConsent}
                    onChange={(e) => setFormData({ ...formData, marketingConsent: e.target.checked })}
                  />
                  <span>I agree to be contacted by email about DRIP sample testing and product updates.</span>
                </label>

                <button type="submit" className="drip-tester__submit" disabled={loading}>
                  {loading ? 'SUBMITTING...' : 'APPLY FOR EARLY SAMPLE'}
                  {!loading && <ArrowRight size={17} />}
                </button>
              </form>
            ) : (
              <div className="drip-tester-success">
                <div className="drip-tester-success__icon"><Check size={27} /></div>
                <span className="drip-tester-success__eyebrow">APPLICATION RECEIVED</span>
                <h3>YOU'RE ON THE LIST.</h3>
                <p>
                  Thanks for your interest in testing DRIP. We'll contact <strong>{formData.email}</strong> when a suitable prototype batch becomes available.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
