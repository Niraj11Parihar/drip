import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ShoppingCart, ShieldAlert, Award, Sparkles,
  AlertTriangle, CheckCircle, Truck, RotateCcw
} from 'lucide-react';
import Header from '../components/common/Header';

export default function ProductPage({ settings, products, cartItemCount, onAddToCart, onOpenCart }) {
  const { productId } = useParams();   // reads /product/:productId from URL
  const navigate      = useNavigate();

  const [qty, setQty] = useState(1);
  const [addedFeedback, setAddedFeedback] = useState(false);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);

  const product = products.find(p => p.id === productId);

  // Update page title + SEO whenever product changes
  useEffect(() => {
    if (!product || !settings) return;
    document.title = `${product.name} (1:64 Diecast) | Buy Online India - ${settings.storeName}`;
  }, [product, settings]);

  // If product not found yet (loading) or invalid ID
  if (!product) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '1rem', textAlign: 'center', padding: '2rem' }}>
        <p style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Product not found.</p>
        <button className="btn btn-buy" style={{ width: 'auto', padding: '0.75rem 2rem' }} onClick={() => navigate('/')}>
          ← Back to Shop
        </button>
      </div>
    );
  }

  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  const related = products
    .filter(p => p.id !== product.id && (p.category === product.category || p.brand === product.brand))
    .slice(0, 4);

  const handleQtyChange = (delta) => {
    const next = qty + delta;
    if (next >= 1 && next <= product.stock) setQty(next);
  };

  const handleAddClick = () => {
    for (let i = 0; i < qty; i++) onAddToCart(product);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 2000);
  };

  // JSON-LD product schema
  const productSchema = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    image: product.images && product.images.length > 0 ? product.images.map(img => img.url) : [product.imageUrl],
    description: product.description,
    sku: product.id,
    brand: { '@type': 'Brand', name: product.brand },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'INR',
      price: product.price,
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
  };

  return (
    <>
      <script type="application/ld+json">{JSON.stringify(productSchema)}</script>

      {/* ── HEADER (shared, auth-aware) ── */}
      <Header cartItemCount={cartItemCount} onOpenCart={onOpenCart} />

      {/* ── BREADCRUMB ── */}
      <div style={{ background: '#f8f9fa', borderBottom: '1px solid var(--border-color)', padding: '0.65rem 0' }}>
        <div className="container">
          <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: 'var(--text-muted)' }} aria-label="Breadcrumb">
            {/* clicking breadcrumb items uses navigate() → pushes to history */}
            <span style={{ cursor: 'pointer', color: 'var(--primary)', fontWeight: '600' }} onClick={() => navigate('/')}>Home</span>
            <span>›</span>
            <span style={{ cursor: 'pointer', color: 'var(--primary)', fontWeight: '600' }} onClick={() => navigate('/')}>Collections</span>
            <span>›</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>{product.name}</span>
          </nav>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{ minHeight: '80vh', paddingBottom: '4rem' }}>
        <div className="container" style={{ paddingTop: '2rem' }}>

          {/* Product columns */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '3rem', marginBottom: '3.5rem' }}>

            {/* Left: Image */}
            <div style={{ position: 'relative' }}>
              <div style={{
                border: '1px solid var(--border-color)', borderRadius: '16px',
                overflow: 'hidden', backgroundColor: '#f9fafb', padding: '2rem',
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                minHeight: '400px', boxShadow: 'var(--shadow-premium)'
              }}>
                <img
                  src={product.images?.[selectedImageIdx]?.url || product.imageUrl || 'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?q=80&w=600&auto=format&fit=crop'}
                  alt={`${product.name} 1:64 Scale Hot Wheels Diecast – Buy Online India`}
                  style={{ width: '100%', maxHeight: '420px', objectFit: 'contain' }}
                  className="product-zoom-img"
                />
              </div>

              {/* Thumbnails Gallery */}
              {product.images && product.images.length > 1 && (
                <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                  {product.images.map((img, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => setSelectedImageIdx(idx)}
                      style={{ 
                        width: '70px', height: '70px', borderRadius: '8px', overflow: 'hidden', 
                        border: selectedImageIdx === idx ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                        cursor: 'pointer', flexShrink: 0, transition: 'all 0.2s ease',
                        opacity: selectedImageIdx === idx ? 1 : 0.6
                      }}
                    >
                      <img src={img.url} alt={`Thumbnail ${idx+1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ))}
                </div>
              )}

              {/* Floating badges */}
              <div style={{ position: 'absolute', top: '15px', left: '15px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <span style={{ background: '#1f2937', color: '#fff', fontSize: '0.75rem', fontWeight: '700', padding: '0.3rem 0.75rem', borderRadius: '4px' }}>
                  {product.condition}
                </span>
                {(product.category || '').includes('Treasure') && (
                  <span style={{ background: '#f59e0b', color: '#111827', fontSize: '0.7rem', fontWeight: '800', padding: '0.35rem 0.75rem', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '0.2rem', textTransform: 'uppercase' }}>
                    <Sparkles size={11} /> Rare Find
                  </span>
                )}
                {discount > 0 && (
                  <span style={{ background: 'var(--primary)', color: '#fff', fontSize: '0.7rem', fontWeight: '800', padding: '0.35rem 0.75rem', borderRadius: '4px' }}>
                    -{discount}% OFF
                  </span>
                )}
              </div>
            </div>

            {/* Right: Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>

              {/* Brand + Title */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', fontWeight: '700', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.5rem' }}>
                  <span>{product.brand}</span>
                  <span>•</span>
                  <span>{product.scale} Scale</span>
                  {product.year && <><span>•</span><span>{product.year}</span></>}
                </div>
                <h1 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '2rem', fontWeight: '900', color: 'var(--text-primary)', lineHeight: '1.15', letterSpacing: '-0.02em' }}>
                  {product.name}
                </h1>
              </div>

              {/* ⚠️ WARNING NOTE — shown only when set */}
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
                <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '2.25rem', fontWeight: '900', color: 'var(--primary)' }}>
                  ₹{product.price.toFixed(2)}
                </span>
                {product.comparePrice && (
                  <>
                    <span style={{ fontSize: '1.25rem', textDecoration: 'line-through', color: 'var(--text-muted)' }}>
                      ₹{product.comparePrice.toFixed(2)}
                    </span>
                    <span style={{ background: 'rgba(220,38,38,0.1)', color: '#dc2626', fontSize: '0.75rem', fontWeight: '800', padding: '0.3rem 0.6rem', borderRadius: '4px' }}>
                      SAVE {discount}%
                    </span>
                  </>
                )}
              </div>

              {/* Quick specs */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', background: '#f9fafb', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '1rem' }}>
                {[
                  ['Condition', <><Award size={14} style={{ color: 'var(--primary)' }} /> {product.condition}</>],
                  ['Year', product.year || 'N/A'],
                  ['Scale', product.scale],
                  ['Stock', product.stock === 0 ? <span style={{ color: '#ef4444' }}>Out of Stock</span> : product.stock <= 5 ? <span style={{ color: '#f59e0b' }}>Only {product.stock} left</span> : <span style={{ color: '#10b981' }}>In Stock</span>],
                ].map(([label, val]) => (
                  <div key={label}>
                    <span style={{ fontSize: '0.7rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: '600' }}>{label}</span>
                    <div style={{ fontSize: '0.88rem', fontWeight: '700', marginTop: '0.15rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>{val}</div>
                  </div>
                ))}
              </div>

              {/* Description */}
              <div>
                <h3 style={{ fontSize: '0.85rem', fontWeight: '800', marginBottom: '0.5rem', fontFamily: 'Montserrat, sans-serif', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Description</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.65' }}>
                  {product.description || 'Premium scale diecast collector vehicle with intricate decals, metal chassis, and official licensed designs.'}
                </p>
              </div>

              {/* Add to cart */}
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.1rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                {product.stock > 0 ? (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.25rem', background: '#f9fafb' }}>
                      <button className="qty-btn" onClick={() => handleQtyChange(-1)} disabled={qty <= 1}>-</button>
                      <span style={{ width: '40px', textAlign: 'center', fontWeight: '800', fontSize: '1rem', fontFamily: 'Montserrat, sans-serif' }}>{qty}</span>
                      <button className="qty-btn" onClick={() => handleQtyChange(1)} disabled={qty >= product.stock}>+</button>
                    </div>
                    <button
                      className="btn btn-buy"
                      onClick={handleAddClick}
                      style={{ flex: 1, padding: '0.85rem', background: addedFeedback ? '#10b981' : 'var(--primary)', transition: 'background 0.3s' }}
                    >
                      {addedFeedback
                        ? <><CheckCircle size={18} /> Added to Cart!</>
                        : <><ShoppingCart size={18} /> Add to Cart</>}
                    </button>
                  </>
                ) : (
                  <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444', fontWeight: '700', padding: '0.75rem', background: '#fff5f5', borderRadius: '8px', border: '1px solid #fecaca' }}>
                    <ShieldAlert size={20} /> Out of Stock – Check back soon
                  </div>
                )}
              </div>

              {/* Trust icons */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem' }}>
                {[
                  { icon: <Truck size={16} />,      text: 'Free Ship ₹999+' },
                  { icon: <RotateCcw size={16} />,  text: '7-Day Returns' },
                  { icon: <CheckCircle size={16} />, text: '100% Authentic' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem', textAlign: 'center', background: '#f9fafb', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.6rem 0.4rem', fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
                    <span style={{ color: 'var(--primary)' }}>{item.icon}</span>
                    {item.text}
                  </div>
                ))}
              </div>

              {/* Packaging note */}
              <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.4', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '0.65rem 0.85rem' }}>
                <ShieldAlert size={15} style={{ flexShrink: 0, color: '#16a34a', marginTop: '1px' }} />
                <span>
                  <strong style={{ color: '#166534' }}>Packaging Guarantee:</strong> All items are bubble-wrapped inside reinforced corrugated boxes for safe, damage-free delivery.
                </span>
              </div>

            </div>
          </div>

          {/* Specs table */}
          <div style={{ marginBottom: '3.5rem' }}>
            <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '1.4rem', fontWeight: '800', borderBottom: '3px solid var(--primary)', paddingBottom: '0.6rem', marginBottom: '1.5rem', display: 'inline-block' }}>
              Product Specifications
            </h2>
            <div style={{ border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow-subtle)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <tbody>
                  {[
                    ['Brand',            product.brand],
                    ['Scale',            product.scale],
                    ['Card Condition',   product.condition],
                    ['Release Year',     product.year],
                    ['Category / Series', product.category],
                    ['Material',         'Diecast Metal Body with Plastic Parts'],
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

          {/* Related products */}
          {related.length > 0 && (
            <div>
              <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '1.4rem', fontWeight: '800', borderBottom: '3px solid var(--primary)', paddingBottom: '0.6rem', marginBottom: '1.5rem', display: 'inline-block' }}>
                Related Collectibles
              </h2>
              <div className="store-grid">
                {related.map(item => {
                  const d = item.comparePrice
                    ? Math.round(((item.comparePrice - item.price) / item.comparePrice) * 100)
                    : 0;
                  return (
                    <article
                      key={item.id}
                      className="product-card"
                      style={{ cursor: 'pointer' }}
                      onClick={() => navigate(`/product/${item.id}`)}  // ← uses navigate
                    >
                      <div className="product-card-image-box">
                        <img src={item.images?.[0]?.url || item.imageUrl} alt={item.name} className="product-card-image" />
                        <span style={{ position: 'absolute', top: '8px', left: '8px', background: '#1f2937', color: '#fff', fontSize: '0.62rem', fontWeight: '700', padding: '0.2rem 0.45rem', borderRadius: '4px' }}>
                          {item.condition}
                        </span>
                        {d > 0 && (
                          <span style={{ position: 'absolute', top: '8px', right: '8px', background: 'var(--primary)', color: '#fff', fontSize: '0.62rem', fontWeight: '800', padding: '0.2rem 0.45rem', borderRadius: '4px' }}>
                            -{d}%
                          </span>
                        )}
                      </div>
                      <div className="product-card-body">
                        <span className="product-card-category">{item.category}</span>
                        <h3 className="product-card-title">{item.name}</h3>
                        <div className="product-card-price-row">
                          <span className="product-price-current">₹{item.price.toFixed(2)}</span>
                          {item.comparePrice && <span className="product-price-old">₹{item.comparePrice.toFixed(2)}</span>}
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

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="footer-inner">
          <p style={{ color: '#fff', fontWeight: '900', fontSize: '1.4rem', marginBottom: '0.5rem', fontFamily: 'Montserrat, sans-serif', letterSpacing: '-0.02em' }}>
            Diecast<span style={{ color: 'var(--primary)' }}>Xpress</span>
          </p>
          <p style={{ fontSize: '0.82rem', color: '#9ca3af', marginBottom: '1rem' }}>
            India's Premier Destination for Hot Wheels &amp; Diecast Collectibles
          </p>
          <div className="footer-links">
            <a href="/">Home</a>
            <a href="/#catalog-section">Collections</a>
            <a href="#">Track Order</a>
            <a href="#">Contact Us</a>
          </div>
          <p style={{ fontSize: '0.72rem', opacity: 0.5, marginTop: '1rem' }}>
            © {new Date().getFullYear()} DiecastXpress. All Rights Reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
