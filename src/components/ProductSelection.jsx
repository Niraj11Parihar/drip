import React, { useState } from 'react';
import {
  ArrowRight,
  Check,
  Info,
  X,
  Zap,
  Feather,
} from 'lucide-react';
import { trackEvent } from '../utils/analytics';

export default function ProductSelection({ onSelectProduct }) {
  const [detailProduct, setDetailProduct] = useState(null);

  const products = [
    {
      id: 'raw',
      variant: 'RAW',
      eyebrow: 'CAFFEINE FREE',
      caffeine: '0mg Caffeine',
      caffeineMg: 0,
      energyLabel: 'CALM FUEL',
      tagline: 'PURE ENERGY. ANYTIME.',
      description:
        'Simple honey-based endurance fuel for training, long sessions, evening workouts, or athletes who prefer to fuel without caffeine.',
      image: '/images/raw-pack.png',
      className: 'drip-product--raw',
      icon: Feather,
    },
    {
      id: 'rush',
      variant: 'RUSH',
      eyebrow: 'WITH CAFFEINE',
      caffeine: '50mg Caffeine',
      caffeineMg: 50,
      energyLabel: 'FOCUS FUEL',
      tagline: 'ENERGY WITH EXTRA FOCUS.',
      description:
        'The same honey-first formula with 50mg caffeine for race day, harder training sessions, early starts, and moments when focus matters.',
      image: '/images/rush-pack.png',
      className: 'drip-product--rush',
      icon: Zap,
    },
  ];

  const handleTryProduct = (product) => {
    trackEvent('product_selected', {
      variant: product.variant,
      caffeineMg: product.caffeineMg,
    });

    onSelectProduct(
      product.caffeineMg > 0 ? 'Caffeinated — 50mg' : 'Caffeine Free'
    );
  };

  const handleDetails = (product) => {
    trackEvent('product_detail_open', { variant: product.variant });
    setDetailProduct(product);
  };

  return (
    <section id="products" className="drip-products">
      <div className="container">
        <div className="drip-products__header">
          <span className="drip-products__eyebrow">TWO WAYS TO FUEL</span>
          <h2 className="drip-products__title">
            CHOOSE YOUR<span> DRIP.</span>
          </h2>
          <p className="drip-products__subtitle">
            Same honey-first foundation. Two very different energy modes — choose caffeine based on how and when you move.
          </p>
        </div>

        <div className="drip-products__grid">
          {products.map((product) => {
            const ProductIcon = product.icon;

            return (
              <article key={product.id} className={`drip-product ${product.className}`}>
                <div className="drip-product__texture" aria-hidden="true" />

                <div className="drip-product__content">
                  <div className="drip-product__top">
                    <span className="drip-product__type">{product.eyebrow}</span>
                    <span className="drip-product__caffeine">
                      <ProductIcon size={14} strokeWidth={2.3} />
                      {product.caffeine}
                    </span>
                  </div>

                  <div className="drip-product__energy-label">
                    <span />
                    {product.energyLabel}
                  </div>

                  <h3 className="drip-product__name">{product.variant}</h3>
                  <p className="drip-product__tagline">{product.tagline}</p>
                  <p className="drip-product__description">{product.description}</p>

                  <div className="drip-product__formula">
                    <div><strong>30g</strong><span>Honey</span></div>
                    <div><strong>200mg</strong><span>Electrolytes</span></div>
                    <div><strong>20mg</strong><span>Magnesium</span></div>
                    <div><strong>80mg</strong><span>Potassium</span></div>
                  </div>

                  <div className="drip-product__actions">
                    <button
                      type="button"
                      className="drip-product__primary"
                      onClick={() => handleTryProduct(product)}
                    >
                      I'D TRY {product.variant}
                      <ArrowRight size={16} />
                    </button>

                    <button
                      type="button"
                      className="drip-product__secondary"
                      onClick={() => handleDetails(product)}
                    >
                      <Info size={15} />
                      VIEW FORMULA
                    </button>
                  </div>
                </div>

                <div className="drip-product__visual">
                  <div className="drip-product__visual-circle" />
                  <div className="drip-product__orbit drip-product__orbit--one" />
                  <div className="drip-product__orbit drip-product__orbit--two" />
                  <span className="drip-product__watermark">{product.variant}</span>

                  <img
                    src={product.image}
                    alt={`DRIP ${product.variant} honey energy pack`}
                    className="drip-product__image"
                  />

                  <div className="drip-product__pack-shadow" />

                  <div className="drip-product__weight">
                    <strong>31g</strong>
                    <span>NET WT.</span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <p className="drip-products__note">
          Both variants use the same honey, electrolyte, magnesium and potassium foundation. RUSH adds 50mg caffeine; RAW contains 0mg.
        </p>
      </div>

      {detailProduct && (
        <div className="drip-product-modal" onClick={() => setDetailProduct(null)}>
          <div className="drip-product-modal__content" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="drip-product-modal__close"
              onClick={() => setDetailProduct(null)}
              aria-label="Close"
            >
              <X size={20} />
            </button>

            <span className="drip-product-modal__eyebrow">DRIP ENERGY HONEY</span>
            <h3>{detailProduct.variant}</h3>
            <p className="drip-product-modal__description">{detailProduct.description}</p>

            <div className="drip-product-modal__formula">
              <div className="drip-product-modal__row">
                <span><Check size={15} />Honey</span><strong>30g</strong>
              </div>
              <div className="drip-product-modal__row">
                <span><Check size={15} />Electrolytes</span><strong>200mg</strong>
              </div>
              <div className="drip-product-modal__row">
                <span><Check size={15} />Magnesium</span><strong>20mg</strong>
              </div>
              <div className="drip-product-modal__row">
                <span><Check size={15} />Potassium</span><strong>80mg</strong>
              </div>
              <div className="drip-product-modal__row">
                <span><Check size={15} />Caffeine</span><strong>{detailProduct.caffeine}</strong>
              </div>
              <div className="drip-product-modal__row">
                <span><Check size={15} />Net Weight</span><strong>31g</strong>
              </div>
            </div>

            <button
              type="button"
              className="drip-product-modal__cta"
              onClick={() => {
                const product = detailProduct;
                setDetailProduct(null);
                handleTryProduct(product);
              }}
            >
              I'D TRY {detailProduct.variant}
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
