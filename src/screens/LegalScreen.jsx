import React from 'react';
import { X } from 'lucide-react';

export default function LegalModal({ isOpen, type, title, onClose }) {
  if (!isOpen) return null;

  const renderContent = () => {
    switch (type) {
      case 'privacy':
        return (
          <div>
            <p style={{ marginBottom: '1rem' }}>
              BRUINE & BEE values your privacy. This website is an early-stage product validation platform designed to gather athlete feedback.
            </p>
            <h4 style={{ fontWeight: 800, marginTop: '1rem', marginBottom: '0.5rem' }}>Data Collected</h4>
            <p style={{ marginBottom: '1rem' }}>
              We collect voluntary survey responses, email addresses for early testing requests, and anonymous behavioral analytics (such as page scroll depth and CTA clicks).
            </p>
            <h4 style={{ fontWeight: 800, marginTop: '1rem', marginBottom: '0.5rem' }}>Data Use</h4>
            <p style={{ marginBottom: '1rem' }}>
              Collected data is used strictly for product evaluation, sample testing coordination, and improving our energy gel formulation. We do not sell personal data to third parties.
            </p>
          </div>
        );
      case 'cookies':
        return (
          <div>
            <p style={{ marginBottom: '1rem' }}>
              We use essential cookies to maintain session security and privacy preferences, as well as optional analytics cookies to measure engagement and survey completion.
            </p>
            <p style={{ marginBottom: '1rem' }}>
              You can update or revoke your consent anytime using the "Cookie Preferences" link located in the website footer.
            </p>
          </div>
        );
      case 'terms':
        return (
          <div>
            <p style={{ marginBottom: '1rem' }}>
              By interacting with this website, you acknowledge that BRUINE & BEE is currently in an early product validation stage.
            </p>
            <p style={{ marginBottom: '1rem' }}>
              Products featured on this website represent prototype formulations, and final specifications or commercial availability may change prior to commercial launch.
            </p>
          </div>
        );
      case 'disclaimer':
        return (
          <div>
            <p style={{ marginBottom: '1rem', fontWeight: 600 }}>
              Health & Nutritional Information Disclaimer
            </p>
            <p style={{ marginBottom: '1rem' }}>
              Ingredient information on this website is for educational purposes only and does not constitute medical advice or guaranteed athletic performance outcomes.
            </p>
            <p style={{ marginBottom: '1rem' }}>
              Athletes should consult with a qualified healthcare or sports nutrition specialist before introducing new energy supplements into their training routine.
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #E2DDD2', paddingBottom: '0.85rem' }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{title}</h3>
          <button onClick={onClose} style={{ padding: '0.4rem', color: '#87857A' }}>
            <X size={20} />
          </button>
        </div>
        
        <div style={{ fontSize: '0.92rem', color: '#57564E', lineHeight: 1.6 }}>
          {renderContent()}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
          <button className="btn btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
