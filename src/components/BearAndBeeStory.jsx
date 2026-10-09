import React from 'react';
import { Sparkles, Shield, Compass, HeartPulse } from 'lucide-react';

export default function BearAndBeeStory() {
  return (
    <section id="bear-and-bee-story" className="section-spacing" style={{ backgroundColor: '#FAF7F2' }}>
      <div className="container">

        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span className="eyebrow">OUR BRAND CONCEPT</span>
          <h2 className="section-title">
            THE BEAR'S STRENGTH.<br />
            <span className="gradient-text">THE BEE'S CRAFT.</span>
          </h2>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            In nature, the bear ("Bruin") seeks pure raw honey for relentless power. Endurance athletes are no different.
          </p>
        </div>

        {/* 2 Column Concept Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem',
          maxWidth: '1080px',
          margin: '0 auto 3rem auto'
        }}>

          {/* Card 1: BRUIN — THE BEAR */}
          <div className="card" style={{
            backgroundColor: '#FFFFFF',
            borderTop: '4px solid #2A1D15',
            padding: '2.5rem',
            position: 'relative'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🐻</div>
            <span style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '0.75rem',
              fontWeight: 800,
              color: '#8C7B6E',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: '0.25rem'
            }}>
              SYMBOL OF THE ATHLETE
            </span>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#2A1D15', marginBottom: '0.85rem' }}>
              BRUIN (THE BEAR)
            </h3>
            <p style={{ fontSize: '0.95rem', color: '#5C4A3E', lineHeight: 1.65, marginBottom: '1.25rem' }}>
              Bears endure harsh wilderness, long distances, and intense physical demands. In nature, when a bear needs instantaneous, nutrient-rich stamina, it instinctively searches for pure wild honey.
            </p>
            <div style={{
              backgroundColor: '#FAF7F2',
              borderRadius: '12px',
              padding: '1rem 1.25rem',
              borderLeft: '3px solid #2A1D15',
              fontSize: '0.88rem',
              fontWeight: 700,
              color: '#2A1D15'
            }}>
              "The Athlete: Relentless, strong, hunting for clean natural fuel to go farther."
            </div>
          </div>

          {/* Card 2: THE BEE — THE CRAFTSMAN */}
          <div className="card" style={{
            backgroundColor: '#FFFFFF',
            borderTop: '4px solid #D9961A',
            padding: '2.5rem',
            position: 'relative'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🐝</div>
            <span style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '0.75rem',
              fontWeight: 800,
              color: '#D9961A',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: '0.25rem'
            }}>
              MASTER OF NATURE'S ENERGY
            </span>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#2A1D15', marginBottom: '0.85rem' }}>
              THE BEE (THE CRAFTSMAN)
            </h3>
            <p style={{ fontSize: '0.95rem', color: '#5C4A3E', lineHeight: 1.65, marginBottom: '1.25rem' }}>
              Bees transform floral nectar into nature's most efficient, dual-source carbohydrate matrix (glucose + fructose). Pre-digested by nature, honey requires zero artificial processing.
            </p>
            <div style={{
              backgroundColor: '#FFF8EA',
              borderRadius: '12px',
              padding: '1rem 1.25rem',
              borderLeft: '3px solid #D9961A',
              fontSize: '0.88rem',
              fontWeight: 700,
              color: '#9C6700'
            }}>
              "The Honey Gel: Pure, pre-digested energy created without lab chemicals or maltodextrin."
            </div>
          </div>

        </div>

        {/* Center Quote Banner */}
        <div style={{
          backgroundColor: '#F3ECE0',
          borderRadius: '20px',
          border: '1px solid #EAE3D5',
          padding: '2.5rem 3rem',
          textAlign: 'center',
          maxWidth: '900px',
          margin: '0 auto'
        }}>
          <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#2A1D15', marginBottom: '0.5rem' }}>
            NATURE'S ORIGINAL ENDURANCE ENERGY
          </h4>
          <p style={{ fontSize: '0.95rem', color: '#5C4A3E', lineHeight: 1.6, maxWidth: '720px', margin: '0 auto' }}>
            Bruin &amp; Bee pairs the athlete's drive with nature's pure honeycraft. We take pure raw honey, add 3 essential mineral electrolytes (Sodium, Magnesium, Potassium), and create a stomach-friendly pouch for runners, cyclists, and outdoor athletes.
          </p>
        </div>

      </div>
    </section>
  );
}
