import React, { useState } from 'react';
import { ArrowLeft, ShoppingCart, ShieldAlert, Award, Sparkles, AlertTriangle, CheckCircle, Truck, RotateCcw } from 'lucide-react';

const ProductScreen = ({ product, onBack, onAddToCart, allProducts, onViewProduct, settings }) => {
  const [qty, setQty] = useState(1);
  const [addedFeedback, setAddedFeedback] = useState(false);

  if (!product) return null;

  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  const related = allProducts
    .filter(p => p.id !== product.id && (p.category === product.category || p.brand === product.brand))
    .slice(0, 4);

  const handleQtyChange = (val) => {
    const next = qty + val;
    if (next > 0 && next <= product.stock) {
      setQty(next);
    }
  };

  const handleAddClick = () => {
    for (let i = 0; i < qty; i++) {
      onAddToCart(product);
    }
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 2000);
  };

  return (
    <div style={{ minHeight: '80vh', paddingBottom: '4rem' }}>

      {/* Breadcrumb */}
      <div style={{ background: '#f8f9fa', borderBottom: '1px solid var(--border-color)', padding: '0.65rem 0' }}>
        <div className="container">
          <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            <span style={{ cursor: 'pointer', color: 'var(--primary)', fontWeight: '600' }} onClick={onBack}>Home</span>
            <span>›</span>
            <span style={{ cursor: 'pointer', color: 'var(--primary)', fontWeight: '600' }} onClick={onBack}>Collections</span>
            <span>›</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container" style={{ paddingTop: '2rem' }}>

        {/* Main Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '3rem', marginBottom: '3.5rem' }}>

          {/* Left: Product Image */}
          <div style={{ position: 'relative' }}>
            <div style={{
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
              overflow: 'hidden',
              backgroundColor: '#f9fafb',
              padding: '2rem',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '400px',
              boxShadow: 'var(--shadow-premium)'
            }}>
              <img
                src={product.imageUrl || 'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?q=80&w=600&auto=format&fit=crop'}
                alt={`${product.name} 1:64 Scale Hot Wheels Diecast Model - Buy Online India`}
                style={{ width: '100%', maxHeight: '420px', objectFit: 'contain' }}
                className="product-zoom-img"
              />
            </div>

            {/* Badges */}
            <div style={{ position: 'absolute', top: '15px', left: '15px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <span style={{ background: '#1f2937', color: 'white', fontSize: '0.75rem', fontWeight: '700', padding: '0.3rem 0.75rem', borderRadius: '4px' }}>
                {product.condition}
              </span>
              {(product.category || '').includes('Treasure') && (
                <span style={{ background: '#f59e0b', color: '#111827', fontSize: '0.7rem', fontWeight: '800', padding: '0.35rem 0.75rem', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '0.2rem', textTransform: 'uppercase' }}>
                  <Sparkles size={11} /> Rare Find
                </span>
              )}
              {discount > 0 && (
                <span style={{ background: 'var(--primary)', color: 'white', fontSize: '0.7rem', fontWeight: '800', padding: '0.35rem 0.75rem', borderRadius: '4px' }}>
                  -{discount}% OFF
                </span>
              )}
            </div>
          </div>

          {/* Right: Product Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>

            {/* Brand + Name */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', fontWeight: '700', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.5rem' }}>
                <span>{product.brand}</span>
                <span>•</span>
                <span>{product.scale} Scale</span>
                {product.year && <><span>•</span><span>{product.year}</span></>}
              </div>
              <h1 style={{ fontFamily: 'var(--font-title)', fontSize: '2rem', fontWeight: '900', color: 'var(--text-primary)', lineHeight: '1.15', letterSpacing: '-0.02em' }}>
                {product.name}
              </h1>
            </div>

            {/* ⚠️ WARNING NOTE BOX - shown only if warningNote is set */}
            {product.warningNote && (
              <div className="product-warning-box">
                <AlertTriangle size={18} />
                <div>
                  <strong>Product Notice:</strong> {product.warningNote}
                </div>
              </div>
            )}

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.1rem' }}>
              <span style={{ fontFamily: 'var(--font-title)', fontSize: '2.25rem', fontWeight: '900', color: 'var(--primary)' }}>
                ₹{product.price.toFixed(2)}
              </span>
              {product.comparePrice && (
                <>
                  <span style={{ fontSize: '1.25rem', textDecoration: 'line-through', color: 'var(--text-muted)' }}>
                    ₹{product.comparePrice.toFixed(2)}
                  </span>
                  <span style={{ background: 'rgba(220, 38, 38, 0.1)', color: '#dc2626', fontSize: '0.75rem', fontWeight: '800', padding: '0.3rem 0.6rem', borderRadius: '4px' }}>
                    SAVE {discount}%
                  </span>
                </>
              )}
            </div>

            {/* Quick Specs */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', background: '#f9fafb', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.7rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: '600' }}>Condition</span>
                <div style={{ fontSize: '0.88rem', fontWeight: '700', marginTop: '0.15rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Award size={14} style={{ color: 'var(--primary)' }} /> {product.condition}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.7rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: '600' }}>Release Year</span>
                <div style={{ fontSize: '0.88rem', fontWeight: '700', marginTop: '0.15rem' }}>
                  {product.year || 'N/A'}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.7rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: '600' }}>Scale</span>
                <div style={{ fontSize: '0.88rem', fontWeight: '700', marginTop: '0.15rem' }}>
                  {product.scale}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.7rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: '600' }}>Availability</span>
                <div style={{ fontSize: '0.88rem', fontWeight: '700', marginTop: '0.15rem', color: product.stock === 0 ? '#ef4444' : product.stock <= 5 ? '#f59e0b' : '#10b981' }}>
                  {product.stock === 0 ? 'Out of Stock' : product.stock <= 5 ? `Only ${product.stock} left` : 'In Stock'}
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '0.5rem', fontFamily: 'var(--font-title)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Description</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.65' }}>
                {product.description || 'Premium scale diecast collector vehicle. Intricate decals, metal chassis, and official licensed designs.'}
              </p>
            </div>

            {/* Add to Cart Row */}
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.1rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              {product.stock > 0 ? (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.25rem', background: '#f9fafb' }}>
                    <button className="qty-btn" onClick={() => handleQtyChange(-1)} disabled={qty <= 1}>-</button>
                    <span style={{ width: '40px', textAlign: 'center', fontWeight: '800', fontSize: '1rem', fontFamily: 'var(--font-title)' }}>{qty}</span>
                    <button className="qty-btn" onClick={() => handleQtyChange(1)} disabled={qty >= product.stock}>+</button>
                  </div>

                  <button
                    className="btn btn-buy"
                    onClick={handleAddClick}
                    style={{ flex: 1, padding: '0.85rem', fontSize: '0.85rem', background: addedFeedback ? '#10b981' : 'var(--primary)' }}
                  >
                    {addedFeedback ? (
                      <><CheckCircle size={18} /> Added to Cart!</>
                    ) : (
                      <><ShoppingCart size={18} /> Add to Cart</>
                    )}
                  </button>
                </>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444', fontWeight: '700', fontSize: '1rem', padding: '0.75rem', background: '#fff5f5', borderRadius: '8px', border: '1px solid #fecaca', width: '100%' }}>
                  <ShieldAlert size={20} /> Out of Stock – Check back soon
                </div>
              )}
            </div>

            {/* Trust Icons */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem' }}>
              {[
                { icon: <Truck size={16} />, text: 'Free Ship above ₹999' },
                { icon: <RotateCcw size={16} />, text: '7-Day Returns' },
                { icon: <CheckCircle size={16} />, text: '100% Authentic' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem', textAlign: 'center', background: '#f9fafb', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.6rem 0.4rem', fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
                  <span style={{ color: 'var(--primary)' }}>{item.icon}</span>
                  {item.text}
                </div>
              ))}
            </div>

            {/* Shipping Note */}
            <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.4', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '0.65rem 0.85rem' }}>
              <ShieldAlert size={15} style={{ flexShrink: 0, color: '#16a34a', marginTop: '1px' }} />
              <span>
                <strong style={{ color: '#166534' }}>Packaging Guarantee:</strong> We carefully inspect all products and pack them in bubble wrap inside reinforced corrugated boxes to ensure safe delivery.
              </span>
            </div>

          </div>
        </div>

        {/* Specs Table */}
        <div style={{ marginBottom: '3.5rem' }}>
          <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '1.4rem', fontWeight: '800', borderBottom: '3px solid var(--primary)', paddingBottom: '0.6rem', marginBottom: '1.5rem', display: 'inline-block' }}>
            Product Specifications
          </h2>
          <div style={{ border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow-subtle)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <tbody>
                {[
                  ['Brand', product.brand],
                  ['Scale', product.scale],
                  ['Card Condition', product.condition],
                  ['Release Year', product.year],
                  ['Category / Series', product.category],
                  ['Material', 'Diecast Metal Body with Plastic Parts'],
                ].map(([label, value], idx) => (
                  <tr key={idx} style={{ borderBottom: idx < 5 ? '1px solid var(--border-color)' : 'none' }}>
                    <td style={{ padding: '0.8rem 1.2rem', background: '#f9fafb', width: '28%', fontWeight: '700', color: '#4b5563', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</td>
                    <td style={{ padding: '0.8rem 1.2rem', color: 'var(--text-primary)', fontWeight: '500' }}>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div>
            <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '1.4rem', fontWeight: '800', borderBottom: '3px solid var(--primary)', paddingBottom: '0.6rem', marginBottom: '1.5rem', display: 'inline-block' }}>
              Related Collectibles
            </h2>
            <div className="store-grid">
              {related.map(item => {
                const itemDiscount = item.comparePrice
                  ? Math.round(((item.comparePrice - item.price) / item.comparePrice) * 100)
                  : 0;

                return (
                  <article key={item.id} className="product-card" onClick={() => onViewProduct(item)} style={{ cursor: 'pointer' }}>
                    <div className="product-card-image-box">
                      <img src={item.imageUrl} alt={item.name} className="product-card-image" />
                      <span style={{ position: 'absolute', top: '8px', left: '8px', background: '#1f2937', color: 'white', fontSize: '0.62rem', fontWeight: '700', padding: '0.2rem 0.45rem', borderRadius: '4px' }}>
                        {item.condition}
                      </span>
                      {itemDiscount > 0 && (
                        <span style={{ position: 'absolute', top: '8px', right: '8px', background: 'var(--primary)', color: 'white', fontSize: '0.62rem', fontWeight: '800', padding: '0.2rem 0.45rem', borderRadius: '4px' }}>
                          -{itemDiscount}%
                        </span>
                      )}
                    </div>
                    <div className="product-card-body">
                      <span className="product-card-category">{item.category}</span>
                      <h3 className="product-card-title">{item.name}</h3>
                      <div className="product-card-price-row">
                        <span className="product-price-current">₹{item.price.toFixed(2)}</span>
                        {item.comparePrice && (
                          <span className="product-price-old">₹{item.comparePrice.toFixed(2)}</span>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProductScreen;
