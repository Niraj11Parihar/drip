import React, { useState, useEffect } from 'react';
import { X, ArrowRight, ArrowLeft, Check, Copy, Share2, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { trackEvent, getVisitorId, getUtmParams } from '../utils/analytics';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function AthleteResearchForm({ isOpen, onClose, initialPreference = 'Both' }) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    sport: 'Runner',
    trainingFrequency: '3–4 days/week',
    currentGelUsage: 'Sometimes',
    currentFuel: ['Energy gels', 'Electrolyte drinks'],
    purchasePriorities: ['Ingredient simplicity', 'Easy digestion'],
    productPreference: initialPreference,
    interestScore: 4,
    hesitationReason: '',
    switchReason: '',
    name: '',
    email: '',
    instagram: '',
    cityCountry: '',
    earlyTester: true,
    marketingConsent: true
  });

  useEffect(() => {
    if (isOpen) {
      trackEvent('survey_start', { initialPreference });
      setFormData(prev => ({ ...prev, productPreference: initialPreference }));
    }
  }, [isOpen, initialPreference]);

  if (!isOpen) return null;

  const handleNext = () => {
    trackEvent('survey_step_complete', { step, sport: formData.sport });
    setStep(prev => prev + 1);
  };

  const handlePrev = () => {
    setStep(prev => Math.max(1, prev - 1));
  };

  const toggleMultiSelect = (field, value, max = 99) => {
    setFormData(prev => {
      const current = prev[field] || [];
      if (current.includes(value)) {
        return { ...prev, [field]: current.filter(v => v !== value) };
      }
      if (current.length >= max) return prev;
      return { ...prev, [field]: [...current, value] };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const visitorId = getVisitorId();
      const utm = getUtmParams();

      const payload = {
        ...formData,
        anonymousVisitorId: visitorId,
        utmSource: utm.utm_source,
        utmMedium: utm.utm_medium,
        utmCampaign: utm.utm_campaign
      };

      const res = await fetch(`${API_BASE}/api/survey`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Failed to submit survey');

      setSubmitted(true);
      trackEvent('survey_submit', { interestScore: formData.interestScore, sport: formData.sport });

      // Trigger Confetti
      try {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      } catch (err) { }

    } catch (err) {
      console.error('Survey submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    trackEvent('share_validation_link');
    setTimeout(() => setCopiedLink(false), 3000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '680px', padding: '2.5rem' }}>

        {/* Close Button */}
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', padding: '0.5rem', color: '#87857A' }}
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {!submitted ? (
          <div>
            {/* Progress indicator */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <span className="eyebrow" style={{ margin: 0 }}>ATHLETE RESEARCH • STEP {step} OF 10</span>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#87857A' }}>
                {Math.round((step / 10) * 100)}% Complete
              </span>
            </div>

            <div style={{ height: '4px', backgroundColor: '#EEEAE0', borderRadius: '999px', marginBottom: '2rem', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                backgroundColor: '#D89A27',
                width: `${(step / 10) * 100}%`,
                transition: 'width 0.3s ease'
              }} />
            </div>

            {/* STEP 1: SPORT */}
            {step === 1 && (
              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>What best describes you?</h3>
                <p style={{ fontSize: '0.9rem', color: '#57564E', marginBottom: '1.5rem' }}>Select your primary activity.</p>
                <div className="option-grid">
                  {['Runner', 'Cyclist', 'Triathlete', 'Gym / Functional Fitness', 'Team Sport Athlete', 'Hiker / Trekker', 'Other'].map(item => (
                    <button
                      key={item}
                      type="button"
                      className={`option-btn ${formData.sport === item ? 'selected' : ''}`}
                      onClick={() => setFormData({ ...formData, sport: item })}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2: TRAINING FREQUENCY */}
            {step === 2 && (
              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>How often do you train?</h3>
                <p style={{ fontSize: '0.9rem', color: '#57564E', marginBottom: '1.5rem' }}>Select your weekly frequency.</p>
                <div className="option-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                  {['1–2 days/week', '3–4 days/week', '5–6 days/week', 'Daily / competitive athlete'].map(item => (
                    <button
                      key={item}
                      type="button"
                      className={`option-btn ${formData.trainingFrequency === item ? 'selected' : ''}`}
                      onClick={() => setFormData({ ...formData, trainingFrequency: item })}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 3: CURRENT GEL USAGE */}
            {step === 3 && (
              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Do you currently use energy gels?</h3>
                <p style={{ fontSize: '0.9rem', color: '#57564E', marginBottom: '1.5rem' }}>Choose one option.</p>
                <div className="option-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                  {['Regularly', 'Sometimes', 'Rarely', 'Never'].map(item => (
                    <button
                      key={item}
                      type="button"
                      className={`option-btn ${formData.currentGelUsage === item ? 'selected' : ''}`}
                      onClick={() => setFormData({ ...formData, currentGelUsage: item })}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 4: CURRENT FUEL */}
            {step === 4 && (
              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>What do you currently use during longer training?</h3>
                <p style={{ fontSize: '0.9rem', color: '#57564E', marginBottom: '1.5rem' }}>Select all that apply.</p>
                <div className="option-grid">
                  {['Energy gels', 'Sports drinks', 'Electrolyte drinks', 'Fruit', 'Dates', 'Honey', 'Energy chews', 'Homemade fuel', 'Nothing', 'Other'].map(item => {
                    const isSel = formData.currentFuel?.includes(item);
                    return (
                      <button
                        key={item}
                        type="button"
                        className={`option-btn ${isSel ? 'selected' : ''}`}
                        onClick={() => toggleMultiSelect('currentFuel', item)}
                      >
                        {isSel ? `✓ ${item}` : item}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 5: PRIORITIES */}
            {step === 5 && (
              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>What matters most when choosing a sports gel?</h3>
                <p style={{ fontSize: '0.9rem', color: '#57564E', marginBottom: '1.5rem' }}>Select up to 3 priority factors.</p>
                <div className="option-grid">
                  {['Performance', 'Ingredient simplicity', 'Taste', 'Easy digestion', 'Price', 'Electrolytes', 'Caffeine', 'Natural ingredients', 'Portability', 'Brand trust'].map(item => {
                    const isSel = formData.purchasePriorities?.includes(item);
                    return (
                      <button
                        key={item}
                        type="button"
                        className={`option-btn ${isSel ? 'selected' : ''}`}
                        onClick={() => toggleMultiSelect('purchasePriorities', item, 3)}
                      >
                        {isSel ? `✓ ${item}` : item}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 6: PRODUCT INTEREST */}
            {step === 6 && (
              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Which drip product interests you?</h3>
                <p style={{ fontSize: '0.9rem', color: '#57564E', marginBottom: '1.5rem' }}>Select your preferred version.</p>
                <div className="option-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                  {['Caffeinated — 50mg', 'Caffeine Free', 'Both', 'Neither'].map(item => (
                    <button
                      key={item}
                      type="button"
                      className={`option-btn ${formData.productPreference === item ? 'selected' : ''}`}
                      onClick={() => setFormData({ ...formData, productPreference: item })}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 7: INTEREST SCALE */}
            {step === 7 && (
              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>How interested are you?</h3>
                <p style={{ fontSize: '0.9rem', color: '#57564E', marginBottom: '1.5rem' }}>1 = Not interested, 5 = I would definitely try it.</p>
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', margin: '2rem 0' }}>
                  {[1, 2, 3, 4, 5].map(score => (
                    <button
                      key={score}
                      type="button"
                      onClick={() => setFormData({ ...formData, interestScore: score })}
                      style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '50%',
                        fontWeight: 900,
                        fontSize: '1.25rem',
                        border: '2px solid',
                        borderColor: formData.interestScore === score ? '#D89A27' : '#E2DDD2',
                        backgroundColor: formData.interestScore === score ? '#D89A27' : '#FFFFFF',
                        color: formData.interestScore === score ? '#FFFFFF' : '#171714',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {score}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 8: HESITATION */}
            {step === 8 && (
              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>What would stop you from trying this product?</h3>
                <p style={{ fontSize: '0.9rem', color: '#57564E', marginBottom: '1.25rem' }}>Optional, but extremely helpful for our product team.</p>
                <textarea
                  className="form-control"
                  placeholder="e.g. Sweetness profile, price point, sachet packaging..."
                  value={formData.hesitationReason}
                  onChange={e => setFormData({ ...formData, hesitationReason: e.target.value })}
                />
              </div>
            )}

            {/* STEP 9: SWITCH TRIGGER */}
            {step === 9 && (
              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>What would make you choose this instead of your current energy gel?</h3>
                <p style={{ fontSize: '0.9rem', color: '#57564E', marginBottom: '1.25rem' }}>Optional open feedback.</p>
                <textarea
                  className="form-control"
                  placeholder="e.g. Clean natural honey base, gastrointestinal comfort..."
                  value={formData.switchReason}
                  onChange={e => setFormData({ ...formData, switchReason: e.target.value })}
                />
              </div>
            )}

            {/* STEP 10: CONTACT & CONSENT */}
            {step === 10 && (
              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Get Early Access & Sample Testing</h3>
                <p style={{ fontSize: '0.9rem', color: '#57564E', marginBottom: '1.25rem' }}>Optional contact details to join our testing pool.</p>

                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Alex Rivera"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="alex@example.com"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Instagram (Optional)</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="@athlete"
                      value={formData.instagram}
                      onChange={e => setFormData({ ...formData, instagram: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">City / Country (Optional)</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Boston, USA"
                      value={formData.cityCountry}
                      onChange={e => setFormData({ ...formData, cityCountry: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem', fontSize: '0.85rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.earlyTester}
                      onChange={e => setFormData({ ...formData, earlyTester: e.target.checked })}
                    />
                    I would be interested in testing an early sample.
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.marketingConsent}
                      onChange={e => setFormData({ ...formData, marketingConsent: e.target.checked })}
                    />
                    Send me launch updates and product testing news.
                  </label>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2.5rem', paddingTop: '1.25rem', borderTop: '1px solid #E2DDD2' }}>
              {step > 1 ? (
                <button type="button" className="btn btn-secondary" onClick={handlePrev}>
                  <ArrowLeft size={16} /> Back
                </button>
              ) : <div />}

              {step < 10 ? (
                <button type="button" className="btn btn-accent" onClick={handleNext}>
                  Next <ArrowRight size={16} />
                </button>
              ) : (
                <button type="button" className="btn btn-accent" onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? 'SENDING...' : 'SEND MY FEEDBACK'} <Check size={18} />
                </button>
              )}
            </div>
          </div>
        ) : (
          /* SUCCESS SCREEN */
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <div style={{
              backgroundColor: '#FDF7EC',
              color: '#D89A27',
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem auto'
            }}>
              <Sparkles size={36} />
            </div>

            <h2 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '0.75rem' }}>YOU'RE IN.</h2>
            <p style={{ fontSize: '1.05rem', color: '#57564E', lineHeight: 1.6, marginBottom: '2rem', maxWidth: '480px', margin: '0 auto 2rem auto' }}>
              Thanks for helping shape drip. Your feedback will directly influence what we build next.
            </p>

            <div style={{
              backgroundColor: '#EEEAE0',
              borderRadius: '12px',
              padding: '1.5rem',
              marginBottom: '2rem'
            }}>
              <p style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.85rem' }}>
                Know another athlete who would have an opinion?
              </p>

              <button className="btn btn-primary" onClick={handleCopyLink} style={{ margin: '0 auto' }}>
                {copiedLink ? <><Check size={16} /> LINK COPIED!</> : <><Copy size={16} /> COPY TESTING LINK</>}
              </button>
            </div>

            <button className="btn btn-secondary" onClick={onClose}>
              Close Window
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
