import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingBag, ArrowRight, Shield, Star, Truck, AlertTriangle
} from 'lucide-react';
import Header from '../components/common/Header';

export default function HomePage({ settings, products, brands, cartItemCount, onAddToCart, onOpenCart }) {
  const navigate = useNavigate();

  const [search, setSearch]               = useState('');
  const [selectedBrands, setSelectedBrands]         = useState([]);
  const [selectedScales, setSelectedScales]         = useState([]);
  const [selectedConditions, setSelectedConditions] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceMin, setPriceMin]           = useState('');
  const [priceMax, setPriceMax]           = useState('');
  const [onlyInStock, setOnlyInStock]     = useState(false);
  const [sortOption, setSortOption]       = useState('featured');

  // Dynamic page title
  useEffect(() => {
    document.title = `${settings.storeName || 'DiecastXpress'} - Buy Hot Wheels, Majorette & Diecast Cars Online India`;
  }, [settings]);

  // JSON-LD schema
  const shopSchema = {
    '@context': 'https://schema.org',
    '@type': 'Store',
    name: settings.storeName,
    description:
      'Buy Hot Wheels, Majorette, Matchbox & rare diecast cars online in India.',
    url: window.location.origin,
    priceRange: '₹₹',
  };

  // Unique filter values
  const uniqueBrands     = [...new Set(products.map(p => p.brand).filter(Boolean))];
  const uniqueScales     = [...new Set(products.map(p => p.scale).filter(Boolean))];
  const uniqueConditions = [...new Set(products.map(p => p.condition).filter(Boolean))];
  const uniqueCategories = [...new Set(products.map(p => p.category).filter(Boolean))];

  const toggleFilter = (list, setList, val) =>
    setList(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);

  const clearFilters = () => {
    setSelectedBrands([]);
    setSelectedScales([]);
    setSelectedConditions([]);
    setSelectedCategories([]);
    setPriceMin('');
    setPriceMax('');
    setOnlyInStock(false);
    setSearch('');
  };

  // Filter
  const filtered = products.filter(p => {
    const q = search.toLowerCase();
    if (q && !p.name.toLowerCase().includes(q) && !(p.description || '').toLowerCase().includes(q)) return false;
    if (selectedBrands.length     && !selectedBrands.includes(p.brand))     return false;
    if (selectedScales.length     && !selectedScales.includes(p.scale))     return false;
    if (selectedConditions.length && !selectedConditions.includes(p.condition)) return false;
    if (selectedCategories.length && !selectedCategories.includes(p.category)) return false;
    if (priceMin !== '' && p.price < parseFloat(priceMin)) return false;
    if (priceMax !== '' && p.price > parseFloat(priceMax)) return false;
    if (onlyInStock && p.stock <= 0) return false;
    return true;
  });

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    switch (sortOption) {
      case 'price-asc':  return a.price - b.price;
      case 'price-desc': return b.price - a.price;
      case 'name-asc':   return a.name.localeCompare(b.name);
      case 'name-desc':  return b.name.localeCompare(a.name);
      case 'year-desc':  return (b.year || 0) - (a.year || 0);
      default:           return 0;
    }
  });

  const displayBrands = brands || [];
  
  // double for infinite loop (or triple if list is very short)
  const tickerBrands = [...displayBrands, ...displayBrands, ...displayBrands]; 

  return (
    <>
      <script type="application/ld+json">{JSON.stringify(shopSchema)}</script>

      {/* ── HEADER (shared, auth-aware) ── */}
      <Header
        cartItemCount={cartItemCount}
        onOpenCart={onOpenCart}
        showSearch={true}
        searchValue={search}
        onSearchChange={setSearch}
      />

      {/* ── HERO BANNER ── */}
      <div
        className="hero-banner"
        style={{ backgroundImage: `url(${settings.bannerImage || 'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?q=80&w=1400&auto=format&fit=crop'})` }}
      >
        <div className="container">
          <div className="hero-content">
            <span className="hero-eyebrow">🏎️ India's #1 Diecast Store</span>
            <h1 className="hero-title">
              {settings.bannerTitle || <>Premium <span>Hot Wheels</span> &amp; Diecast Collectibles</>}
            </h1>
            <p className="hero-subtitle">
              {settings.bannerSubtitle || 'Discover rare Mainlines, Super Treasure Hunts, Car Culture, and premium diecast imports. Curated for serious collectors.'}
            </p>
            <div className="hero-cta-group">
              <button
                className="btn btn-buy"
                style={{ width: 'auto', padding: '0.85rem 2rem' }}
                onClick={() => document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Shop Now <ArrowRight size={16} />
              </button>
            </div>
            <div className="hero-badge-row">
              <span className="hero-badge"><Truck size={15} /> Free Ship above ₹999</span>
              <span className="hero-badge"><Shield size={15} /> 100% Authentic</span>
              <span className="hero-badge"><Star size={15} /> Rare Imports</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── BRAND TICKER ── */}
      <div className="brand-ticker" title="Hover to pause">
        <div className="brand-ticker-track">
          {tickerBrands.map((b, i) => (
            <div className="brand-ticker-item" key={`${b.id || b.name}-${i}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <img src={b.imageUrl || 'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?q=80&w=200&auto=format&fit=crop'} alt={b.name} style={{ width: '50px', height: '50px', objectFit: 'contain' }} />
              <span className="brand-ticker-name" style={{ fontSize: '0.85rem' }}>{b.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── CATALOG ── */}
      <div id="catalog-section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Our <span>Collection</span></h2>
              <div className="section-divider" />
            </div>
          </div>
        </div>

        <main className="container catalog-split">

          {/* Sidebar */}
          <aside className="filter-sidebar">
            <div className="filter-sidebar-header">
              <span className="filter-sidebar-title">Filters</span>
              <button className="filter-clear-btn" onClick={clearFilters}>Clear All</button>
            </div>

            {uniqueBrands.length > 0 && (
              <div className="filter-group">
                <h3 className="filter-group-title">Brand</h3>
                <div className="filter-options">
                  {uniqueBrands.map(b => (
                    <label key={b} className="filter-checkbox-label">
                      <input type="checkbox" checked={selectedBrands.includes(b)} onChange={() => toggleFilter(selectedBrands, setSelectedBrands, b)} />
                      {b}
                    </label>
                  ))}
                </div>
              </div>
            )}

            {uniqueScales.length > 0 && (
              <div className="filter-group">
                <h3 className="filter-group-title">Scale</h3>
                <div className="filter-options">
                  {uniqueScales.map(s => (
                    <label key={s} className="filter-checkbox-label">
                      <input type="checkbox" checked={selectedScales.includes(s)} onChange={() => toggleFilter(selectedScales, setSelectedScales, s)} />
                      {s}
                    </label>
                  ))}
                </div>
              </div>
            )}

            {uniqueConditions.length > 0 && (
              <div className="filter-group">
                <h3 className="filter-group-title">Condition</h3>
                <div className="filter-options">
                  {uniqueConditions.map(c => (
                    <label key={c} className="filter-checkbox-label">
                      <input type="checkbox" checked={selectedConditions.includes(c)} onChange={() => toggleFilter(selectedConditions, setSelectedConditions, c)} />
                      {c}
                    </label>
                  ))}
                </div>
              </div>
            )}

            {uniqueCategories.length > 0 && (
              <div className="filter-group">
                <h3 className="filter-group-title">Series / Type</h3>
                <div className="filter-options">
                  {uniqueCategories.map(c => (
                    <label key={c} className="filter-checkbox-label">
                      <input type="checkbox" checked={selectedCategories.includes(c)} onChange={() => toggleFilter(selectedCategories, setSelectedCategories, c)} />
                      {c}
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className="filter-group">
              <h3 className="filter-group-title">Price Range (₹)</h3>
              <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                <input type="number" placeholder="Min" className="form-control" style={{ padding: '0.4rem 0.5rem', fontSize: '0.8rem' }} value={priceMin} onChange={e => setPriceMin(e.target.value)} />
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', flexShrink: 0 }}>to</span>
                <input type="number" placeholder="Max" className="form-control" style={{ padding: '0.4rem 0.5rem', fontSize: '0.8rem' }} value={priceMax} onChange={e => setPriceMax(e.target.value)} />
              </div>
            </div>

            <div className="filter-group">
              <label className="filter-checkbox-label" style={{ fontWeight: '700', color: 'var(--secondary)' }}>
                <input type="checkbox" checked={onlyInStock} onChange={e => setOnlyInStock(e.target.checked)} />
                In-Stock Only
              </label>
            </div>
          </aside>

          {/* Product grid */}
          <section>
            <div className="catalog-header-bar">
              <span className="results-count">
                Showing <strong>{sorted.length}</strong> products
              </span>
              <select className="sort-select" style={{ height: '36px' }} value={sortOption} onChange={e => setSortOption(e.target.value)}>
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A–Z</option>
                <option value="name-desc">Name: Z–A</option>
                <option value="year-desc">Newest First</option>
              </select>
            </div>

            {sorted.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '5rem 0', background: '#fff', border: '1px solid var(--border-color)', borderRadius: '10px', color: 'var(--text-secondary)' }}>
                <ShoppingBag size={48} style={{ margin: '0 auto 1rem', opacity: 0.2, color: 'var(--primary)' }} />
                <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: '700' }}>No Collectibles Found</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Try changing your filters or search terms.</p>
              </div>
            ) : (
              <div className="store-grid">
                {sorted.map(product => {
                  const discount = product.comparePrice
                    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
                    : 0;

                  return (
                    <article key={product.id} className="product-card" id={`product-${product.id}`}>

                      {/* Image → navigate to product page */}
                      <div
                        className="product-card-image-box"
                        style={{ cursor: 'pointer' }}
                        onClick={() => navigate(`/product/${product.id}`)}
                      >
                        <img
                          src={product.images?.[0]?.url || product.imageUrl || 'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?q=80&w=600&auto=format&fit=crop'}
                          alt={`${product.brand} ${product.name} 1:64 Scale diecast`}
                          className="product-card-image"
                        />
                        {/* Condition badge */}
                        <span style={{ position: 'absolute', top: '8px', left: '8px', background: '#1f2937', color: '#fff', fontSize: '0.62rem', fontWeight: '700', padding: '0.2rem 0.45rem', borderRadius: '4px', letterSpacing: '0.04em' }}>
                          {product.condition}
                        </span>
                        {/* Discount badge */}
                        {discount > 0 && (
                          <span style={{ position: 'absolute', top: '8px', right: '8px', background: 'var(--primary)', color: '#fff', fontSize: '0.62rem', fontWeight: '800', padding: '0.2rem 0.45rem', borderRadius: '4px' }}>
                            -{discount}%
                          </span>
                        )}

                      </div>

                      <div className="product-card-body">
                        <span className="product-card-category">{product.category}</span>
                        <h3
                          className="product-card-title"
                          style={{ cursor: 'pointer' }}
                          onClick={() => navigate(`/product/${product.id}`)}
                        >
                          {product.name}
                        </h3>
                        <div className="product-card-price-row">
                          <span className="product-price-current">₹{product.price.toFixed(2)}</span>
                          {product.comparePrice && (
                            <span className="product-price-old">₹{product.comparePrice.toFixed(2)}</span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.72rem', marginTop: '0.1rem', fontWeight: '700', color: product.stock === 0 ? '#ef4444' : product.stock <= 5 ? '#f59e0b' : '#10b981' }}>
                          {product.stock === 0 ? '✕ Out of Stock' : product.stock <= 5 ? `⚡ Only ${product.stock} left` : '✓ In Stock'}
                        </div>
                        <button
                          className="btn btn-buy"
                          style={{ marginTop: '0.6rem' }}
                          onClick={() => onAddToCart(product)}
                          disabled={product.stock === 0}
                        >
                          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                        </button>
                      </div>

                    </article>
                  );
                })}
              </div>
            )}
          </section>

        </main>
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
            <a href="#catalog-section">Collections</a>
            <a href="#">Track Order</a>
            <a href="#">Contact Us</a>
            <a href="#">Privacy Policy</a>
          </div>
          <p style={{ fontSize: '0.72rem', opacity: 0.5, marginTop: '1rem' }}>
            © {new Date().getFullYear()} DiecastXpress. All Rights Reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
