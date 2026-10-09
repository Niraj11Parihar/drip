import React, { useState } from 'react';

const honeyReasons = [
  {
    number: '01',
    title: 'HONEY IS THE FUEL BASE',
    description:
      'DRIP starts with 30g of real honey rather than adding a small amount only for flavor. Honey is the core carbohydrate ingredient in every sachet.',
  },
  {
    number: '02',
    title: 'GLUCOSE + FRUCTOSE',
    description:
      'Honey naturally contains both glucose and fructose, giving DRIP a naturally occurring mix of carbohydrates in one familiar ingredient.',
  },
  {
    number: '03',
    title: 'KEEP THE FORMULA SIMPLE',
    description:
      'The goal is straightforward endurance fuel with an ingredient list that is easy to understand: honey, electrolytes and essential minerals.',
  },
];

export default function WhyHoney() {
  const [visualSrc, setVisualSrc] = useState('/images/honey-macro.png');

  return (
    <section id="why-honey" className="drip-honey">
      <div className="container">
        <div className="drip-honey__layout">
          <div className="drip-honey__visual-inner">
            <div className="drip-honey__hex drip-honey__hex--one" />
            <div className="drip-honey__hex drip-honey__hex--two" />
            <div className="drip-honey__hex drip-honey__hex--three" />

            <div className="drip-honey__photo-frame">
              <img
                src={visualSrc}
                alt="Golden honey texture"
                className="drip-honey__macro-image"
                onError={() => setVisualSrc('/images/honey-drop.png')}
              />
              <div className="drip-honey__photo-shade" />

              <div className="drip-honey__drop-content">
                <span className="drip-honey__drop-label">EACH SACHET STARTS WITH</span>
                <strong>30g</strong>
                <span className="drip-honey__drop-title">REAL HONEY</span>
              </div>
            </div>

            <div className="drip-honey__small-note">
              The foundation behind both <strong>RAW</strong> and <strong>RUSH</strong>.
            </div>
          </div>

          <div className="drip-honey__content">
            <span className="drip-honey__eyebrow">WHY HONEY?</span>

            <h2 className="drip-honey__title">
              START WITH
              <br />
              <span>THE SIMPLE STUFF.</span>
            </h2>

            <p className="drip-honey__intro">
              We wanted the energy source in DRIP to be something people already recognize. That is why every sachet begins with real honey.
            </p>

            <div className="drip-honey__reasons">
              {honeyReasons.map((reason) => (
                <div key={reason.number} className="drip-honey-reason">
                  <div className="drip-honey-reason__badge" aria-hidden="true">
                    {reason.number}
                  </div>

                  <div className="drip-honey-reason__content">
                    <h3>{reason.title}</h3>
                    <p>{reason.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
