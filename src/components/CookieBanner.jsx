import React, { useState, useEffect } from 'react';
import { Shield, Check, X } from 'lucide-react';
import { trackEvent, getVisitorId } from '../utils/analytics';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function CookieBanner({ isPreferencesOpen, onClosePreferences }) {
  const [showBanner, setShowBanner] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const [preferences, setPreferences] = useState({
    essential: true,
    analytics: true,
    marketing: false
  });

  useEffect(() => {
    const stored = localStorage.getItem('bb_cookie_consent');
    if (!stored) {
      setShowBanner(true);
      trackEvent('cookie_banner_view');
    } else {
      try {
        setPreferences(JSON.parse(stored));
      } catch (e) { }
    }
  }, []);

  useEffect(() => {
    if (isPreferencesOpen) {
      setModalOpen(true);
    }
  }, [isPreferencesOpen]);

  const saveConsent = (analyticsConsent, marketingConsent, actionName) => {
    const consentData = {
      essential: true,
      analytics: Boolean(analyticsConsent),
      marketing: Boolean(marketingConsent),
      version: '1.0',
      timestamp: new Date().toISOString()
    };

    localStorage.setItem('bb_cookie_consent', JSON.stringify(consentData));
    setShowBanner(false);
    setModalOpen(false);
    if (onClosePreferences) onClosePreferences();

    trackEvent(actionName, { analyticsConsent, marketingConsent });

    // Send record to backend API
    fetch(`${API_BASE}/api/consent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        anonymousVisitorId: getVisitorId(),
        analyticsConsent: Boolean(analyticsConsent),
        marketingConsent: Boolean(marketingConsent),
        consentVersion: '1.0'
      })
    }).catch(() => { });
  };

  const handleAcceptAll = () => saveConsent(true, true, 'analytics_accept');
  const handleRejectOptional = () => saveConsent(false, false, 'analytics_reject');
  const handleSaveCustom = () => saveConsent(preferences.analytics, preferences.marketing, 'cookie_preferences_updated');

  return (
    <>
      {/* Bottom Sticky Consent Banner */}
      {showBanner && (
        <div className="cookie-banner">
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: '0.88rem', lineHeight: 1.45 }}>
              We use optional analytics to understand how athletes interact with drip and improve the product experience.
            </p>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
            <button className="btn btn-accent" onClick={handleAcceptAll} style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
              ACCEPT ANALYTICS
            </button>
            <button className="btn btn-secondary" onClick={handleRejectOptional} style={{ fontSize: '0.8rem', padding: '0.5rem 1rem', color: '#F7F5EF', borderColor: '#57564E' }}>
              REJECT OPTIONAL
            </button>
            <button className="btn" onClick={() => setModalOpen(true)} style={{ fontSize: '0.8rem', padding: '0.5rem 0.8rem', color: '#87857A', textDecoration: 'underline' }}>
              CUSTOMIZE
            </button>
          </div>
        </div>
      )}

      {/* Preferences Modal */}
      {modalOpen && (
        <div className="modal-backdrop" onClick={() => { setModalOpen(false); if (onClosePreferences) onClosePreferences(); }}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '540px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Shield size={20} color="#D89A27" />
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Cookie Preferences</h3>
              </div>
              <button onClick={() => { setModalOpen(false); if (onClosePreferences) onClosePreferences(); }} style={{ padding: '0.4rem', color: '#87857A' }}>
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '0.9rem', color: '#57564E', marginBottom: '1.5rem' }}>
              Manage how cookies and tracking technologies are used during your session.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>

              <div style={{ backgroundColor: '#EEEAE0', borderRadius: '10px', padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.92rem' }}>Essential Cookies</span>
                  <span className="badge" style={{ backgroundColor: '#171714', color: '#F7F5EF', fontSize: '0.7rem' }}>Always Active</span>
                </div>
                <p style={{ fontSize: '0.82rem', color: '#57564E' }}>
                  Required for security, form functionality, session integrity, and privacy preferences.
                </p>
              </div>

              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '10px', padding: '1rem', border: '1px solid #E2DDD2' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.92rem' }}>Analytics Cookies</span>
                  <input
                    type="checkbox"
                    checked={preferences.analytics}
                    onChange={e => setPreferences({ ...preferences, analytics: e.target.checked })}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                </div>
                <p style={{ fontSize: '0.82rem', color: '#57564E' }}>
                  Allows us to measure traffic, session engagement time, scroll depth, and athlete research funnels.
                </p>
              </div>

              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '10px', padding: '1rem', border: '1px solid #E2DDD2' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.92rem' }}>Marketing Cookies</span>
                  <input
                    type="checkbox"
                    checked={preferences.marketing}
                    onChange={e => setPreferences({ ...preferences, marketing: e.target.checked })}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                </div>
                <p style={{ fontSize: '0.82rem', color: '#57564E' }}>
                  Used for future campaign tracking and social acquisition attribution.
                </p>
              </div>

            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button className="btn btn-secondary" onClick={handleRejectOptional}>Reject All Optional</button>
              <button className="btn btn-accent" onClick={handleSaveCustom}>Save My Preferences</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
