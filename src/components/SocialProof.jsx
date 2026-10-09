import React, { useState, useEffect } from 'react';
import { Quote } from 'lucide-react';
import { trackEvent } from '../utils/analytics';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function SocialProof() {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/api/testimonials/public`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setTestimonials(data);
      })
      .catch(() => {});
  }, []);

  if (testimonials.length === 0) return null;

  return (
    <section className="section-spacing">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span className="eyebrow">ATHLETE INPUT</span>
          <h2 className="section-title">BUILT WITH ATHLETES, NOT JUST FOR THEM.</h2>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            Real feedback collected during our early product validation phase.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem'
        }}>
          {testimonials.map(item => (
            <div
              key={item.id}
              className="card"
              onClick={() => trackEvent('testimonial_view', { displayName: item.displayName })}
              style={{
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between',
                borderLeft: '4px solid #D89A27'
              }}
            >
              <div>
                <Quote size={28} color="#D89A27" style={{ marginBottom: '1rem', opacity: 0.6 }} />
                <p style={{ fontSize: '0.95rem', color: '#171714', lineHeight: 1.6, fontStyle: 'italic', marginBottom: '1.5rem' }}>
                  "{item.quote}"
                </p>
              </div>

              <div style={{ borderTop: '1px solid #E2DDD2', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 800, fontSize: '0.92rem', color: '#171714' }}>
                  {item.displayName}
                </span>
                <span className="badge" style={{ backgroundColor: '#EEEAE0', color: '#74785A', fontSize: '0.72rem' }}>
                  {item.sport}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
