import React, { useState } from 'react';
import { ArrowLeft, ShoppingCart, ShieldAlert, Award, Tag, Sparkles } from 'lucide-react';

const ProductScreen = ({ product, onBack, onAddToCart, allProducts, onViewProduct }) => {
  const [qty, setQty] = useState(1);

  if (!product) return null;

  // Calculate discount percentage
  const discount = product.comparePrice 
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  // Find related products (same category/brand, excluding current)
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
    alert(`${qty} x ${product.name} added to your cart!`);
  };

  return (
    <div className="container" style={{ padding: '2rem 1.5rem', minHeight: '80vh' }}>
      
      {/* SEO Breadcrumbs */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
        <span style={{ cursor: 'pointer' }} onClick={onBack}>Home</span>
        <span>/</span>
        <span style={{ cursor: 'pointer' }} onClick={onBack}>Hot Wheels Collections</span>
        <span>/</span>
        <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>{product.name}</span>
      </nav>

      {/* Main product columns */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '3rem', marginBottom: '4rem' }}>
        
        {/* Product Images with Collector Badges */}
        <div style={{ position: 'relative' }}>
          <div style={{ border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden', backgroundColor: '#ffffff', padding: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: 'var(--shadow-premium)' }}>
            <img
              src={product.images?.[0]?.url || product.imageUrl || 'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?q=80&w=600&auto=format&fit=crop'}
              alt={`${product.name} 1:64 Scale Hot Wheels Diecast Model`}
              style={{ width: '100%', maxHeight: '420px', objectFit: 'contain', transition: 'transform 0.3s ease' }}
              className="product-zoom-img"
            />
          </div>
          
          {/* Card Condition Badge */}
          <div style={{ position: 'absolute', top: '15px', left: '15px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <span style={{ background: '#1f2937', color: 'white', fontSize: '0.75rem', fontWeight: '700', padding: '0.3rem 0.75rem', borderRadius: '4px' }}>
              {product.condition}
            </span>
            {product.category.includes('Treasure') && (
              <span style={{ background: '#f59e0b', color: '#111827', fontSize: '0.7rem', fontWeight: '800', padding: '0.35rem 0.75rem', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <Sparkles size={11} /> Rare Find
              </span>
            )}
          </div>
        </div>

        {/* Product Details Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Title & Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <span>{product.brand}</span>
              <span>&bull;</span>
              <span>{product.scale} Scale</span>
            </div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: '800', color: 'var(--text-main)', marginTop: '0.5rem', lineHeight: '1.2' }}>
              {product.name}
            </h1>
          </div>

          {/* Pricing */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '1.25rem' }}>
            <span style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--primary)' }}>
              ${product.price.toFixed(2)}
            </span>
            {product.comparePrice && (
              <>
                <span style={{ fontSize: '1.25rem', textDecoration: 'line-through', color: 'var(--text-muted)' }}>
                  ${product.comparePrice.toFixed(2)}
                </span>
                <span style={{ background: 'rgba(220, 38, 38, 0.1)', color: '#dc2626', fontSize: '0.75rem', fontWeight: '800', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>
                  SAVE {discount}%
                </span>
              </>
            )}
          </div>

          {/* Core Collector Specs Quick view */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: '#f9fafb', border: '1px solid var(--border)', borderRadius: '12px', padding: '1rem', color: '#1f2937' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase' }}>Packaging Condition</span>
              <div style={{ fontSize: '0.9rem', fontWeight: '700', marginTop: '0.1rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Award size={14} style={{ color: 'var(--primary)' }} /> {product.condition}
              </div>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase' }}>Release Year</span>
              <div style={{ fontSize: '0.9rem', fontWeight: '700', marginTop: '0.1rem' }}>
                {product.year} Series
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.5rem' }}>Collector Description</h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              {product.description || "Premium scale diecast collector vehicle. Intricate decals, metal chassis, and official licensed designs."}
            </p>
          </div>

          {/* Add to Cart Actions */}
          <div style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '1.25rem 0', display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            {product.stock > 0 ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', border: '1px solid var(--border)', borderRadius: '10px', padding: '0.25rem' }}>
                  <button className="qty-btn" onClick={() => handleQtyChange(-1)} disabled={qty <= 1}>-</button>
                  <span style={{ width: '40px', textAlign: 'center', fontWeight: '700', fontSize: '0.95rem' }}>{qty}</span>
                  <button className="qty-btn" onClick={() => handleQtyChange(1)} disabled={qty >= product.stock}>+</button>
                </div>
                
                <button className="btn btn-buy" onClick={handleAddClick} style={{ flex: 1, padding: '0.9rem' }}>
                  <ShoppingCart size={18} /> Add To Collector's Cart
                </button>
              </>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444', fontWeight: '700', fontSize: '1.1rem' }}>
                <ShieldAlert size={20} /> Out of Stock (Notify Me)
              </div>
            )}
          </div>

          {/* Collector Card condition policy note */}
          <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
            <ShieldAlert size={16} style={{ flexShrink: 0, color: 'var(--primary)' }} />
            <span>
              <strong>Note on Card Condition:</strong> We inspect cards carefully. For {product.condition} items, we pack in bubble wrap inside heavy corrugated boxes to ensure no damage during shipment transit.
            </span>
          </div>

        </div>
      </div>

      {/* Specifications Table */}
      <div style={{ marginBottom: '4rem' }}>
        <h2 style={{ fontSize: '1.5rem', borderBottom: '2px solid var(--primary)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>Product Specifications</h2>
        <div style={{ border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '0.75rem 1rem', background: '#f9fafb', width: '25%', fontWeight: '600', color: '#4b5563' }}>Brand</td>
                <td style={{ padding: '0.75rem 1rem' }}>{product.brand}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '0.75rem 1rem', background: '#f9fafb', fontWeight: '600', color: '#4b5563' }}>Scale</td>
                <td style={{ padding: '0.75rem 1rem' }}>{product.scale}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '0.75rem 1rem', background: '#f9fafb', fontWeight: '600', color: '#4b5563' }}>Card Condition</td>
                <td style={{ padding: '0.75rem 1rem' }}>{product.condition}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '0.75rem 1rem', background: '#f9fafb', fontWeight: '600', color: '#4b5563' }}>Release Year</td>
                <td style={{ padding: '0.75rem 1rem' }}>{product.year}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '0.75rem 1rem', background: '#f9fafb', fontWeight: '600', color: '#4b5563' }}>Category Series</td>
                <td style={{ padding: '0.75rem 1rem' }}>{product.category}</td>
              </tr>
              <tr>
                <td style={{ padding: '0.75rem 1rem', background: '#f9fafb', fontWeight: '600', color: '#4b5563' }}>Material</td>
                <td style={{ padding: '0.75rem 1rem' }}>Diecast Metal Body with Plastic Parts</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Related Products Section */}
      {related.length > 0 && (
        <div>
          <h2 style={{ fontSize: '1.5rem', borderBottom: '2px solid var(--primary)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>Related Hot Wheels Cars</h2>
          <div className="store-grid">
            {related.map(item => {
              const itemDiscount = item.comparePrice 
                ? Math.round(((item.comparePrice - item.price) / item.comparePrice) * 100)
                : 0;

              return (
                <div key={item.id} className="product-card" onClick={() => onViewProduct(item)} style={{ cursor: 'pointer' }}>
                  <div className="product-card-image-box">
                    <img src={item.images?.[0]?.url || item.imageUrl} alt={item.name} className="product-card-image" />
                    <span style={{ position: 'absolute', top: '10px', left: '10px', background: '#1f2937', color: 'white', fontSize: '0.65rem', fontWeight: '700', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                      {item.condition}
                    </span>
                  </div>
                  <div className="product-card-body">
                    <span className="product-card-category">{item.category}</span>
                    <h3 className="product-card-title">{item.name}</h3>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <span style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--primary)' }}>${item.price.toFixed(2)}</span>
                      {item.comparePrice && (
                        <span style={{ textDecoration: 'line-through', fontSize: '0.85rem', color: 'var(--text-muted)' }}>${item.comparePrice.toFixed(2)}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};

export default ProductScreen;
