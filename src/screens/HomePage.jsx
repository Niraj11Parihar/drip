import React, { useState, useMemo, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingBag, ArrowRight, Shield, Star, Truck, SlidersHorizontal,
  ChevronLeft, ChevronRight, Flame, Sparkles, Package, Phone, Mail, MapPin
} from 'lucide-react';
import Header from '../components/common/Header';

const ITEMS_PER_PAGE = 12;

// Lazy image component with intersection observer
function LazyImage({ src, alt, className, style }) {
  const imgRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  return (
    <img
      ref={imgRef}
      src={src}
      alt={alt}
      className={className}
      style={{ ...style, transition: 'opacity 0.3s', opacity: loaded ? 1 : 0.6 }}
      loading="lazy"
      decoding="async"
      onLoad={() => setLoaded(true)}
    />
  );
}

// Single product card (memoized to prevent unnecessary re-renders)
const ProductCard = React.memo(({ product, onAddToCart, onNavigate }) => {
  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  return (
    <article className="product-card" id={`product-${product.id}`}>
      <div
        className="product-card-image-box"
        style={{ cursor: 'pointer' }}
        onClick={() => onNavigate(product.id)}
      >
        <LazyImage
          src={product.images?.[0]?.url || product.imageUrl || 'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?q=80&w=400&auto=format&fit=crop'}
          alt={`${product.brand} ${product.name} diecast`}
          className="product-card-image"
        />
        <span style={{ position: 'absolute', top: '8px', left: '8px', background: '#1f2937', color: '#fff', fontSize: '0.62rem', fontWeight: '700', padding: '0.2rem 0.45rem', borderRadius: '4px', letterSpacing: '0.04em' }}>
          {product.condition}
        </span>
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
          onClick={() => onNavigate(product.id)}
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
});

export default function HomePage({ settings, products, brands, cartItemCount, onAddToCart, onOpenCart }) {
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedScales, setSelectedScales] = useState([]);
  const [selectedConditions, setSelectedConditions] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [sortOption, setSortOption] = useState('featured');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // SEO
  React.useEffect(() => {
    document.title = `${settings.storeName || 'DiecastXpress'} – Buy Hot Wheels, Majorette & Diecast Cars Online India`;
  }, [settings]);

  const shopSchema = {
    '@context': 'https://schema.org',
    '@type': 'Store',
    name: settings.storeName || 'DiecastXpress',
    description: 'Buy Hot Wheels, Majorette, Matchbox & rare diecast cars online in India. 1:64 scale collectibles, Super Treasure Hunts, Car Culture and more.',
    url: 'https://diecastxpress.com',
    image: 'https://diecastxpress.com/logo.png',
    priceRange: '₹₹',
    telephone: '+91-98765-43210',
    email: 'support@diecastxpress.in',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Mumbai',
      addressRegion: 'Maharashtra',
      postalCode: '400001',
      addressCountry: 'IN',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '10:00',
        closes: '20:00',
      },
    ],
    currenciesAccepted: 'INR',
    paymentAccepted: 'Cash, Credit Card, UPI',
    areaServed: 'IN',
  };

  // Filter options (memoized)
  const uniqueBrands     = useMemo(() => [...new Set(products.map(p => p.brand).filter(Boolean))], [products]);
  const uniqueScales     = useMemo(() => [...new Set(products.map(p => p.scale).filter(Boolean))], [products]);
  const uniqueConditions = useMemo(() => [...new Set(products.map(p => p.condition).filter(Boolean))], [products]);
  const uniqueCategories = useMemo(() => [...new Set(products.map(p => p.category).filter(Boolean))], [products]);

  const toggleFilter = useCallback((list, setList, val) =>
    setList(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]), []);

  const clearFilters = useCallback(() => {
    setSelectedBrands([]);
    setSelectedScales([]);
    setSelectedConditions([]);
    setSelectedCategories([]);
    setPriceMin('');
    setPriceMax('');
    setOnlyInStock(false);
    setSearch('');
    setCurrentPage(1);
  }, []);

  // Filtered + sorted list (memoized — only recalculates when filters change)
  const sorted = useMemo(() => {
    const q = search.toLowerCase();
    const filtered = products.filter(p => {
      if (q && !p.name.toLowerCase().includes(q) && !(p.description || '').toLowerCase().includes(q)) return false;
      if (selectedBrands.length && !selectedBrands.includes(p.brand)) return false;
      if (selectedScales.length && !selectedScales.includes(p.scale)) return false;
      if (selectedConditions.length && !selectedConditions.includes(p.condition)) return false;
      if (selectedCategories.length && !selectedCategories.includes(p.category)) return false;
      if (priceMin !== '' && p.price < parseFloat(priceMin)) return false;
      if (priceMax !== '' && p.price > parseFloat(priceMax)) return false;
      if (onlyInStock && p.stock <= 0) return false;
      return true;
    });
    return [...filtered].sort((a, b) => {
      switch (sortOption) {
        case 'price-asc':  return a.price - b.price;
        case 'price-desc': return b.price - a.price;
        case 'name-asc':   return a.name.localeCompare(b.name);
        case 'name-desc':  return b.name.localeCompare(a.name);
        case 'year-desc':  return (b.year || 0) - (a.year || 0);
        default: return 0;
      }
    });
  }, [products, search, selectedBrands, selectedScales, selectedConditions, selectedCategories, priceMin, priceMax, onlyInStock, sortOption]);

  // Pagination
  const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE);
  const paginated = useMemo(() =>
    sorted.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE),
    [sorted, currentPage]
  );

  const handlePageChange = useCallback((p) => {
    setCurrentPage(p);
    document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  // Reset page when filters change
  React.useEffect(() => { setCurrentPage(1); }, [sorted.length]);

  const handleNavigate = useCallback((id) => navigate(`/product/${id}`), [navigate]);
  const handleAddToCart = useCallback((product) => onAddToCart(product), [onAddToCart]);

  // Derived sections (memoized)
  const newArrivals = useMemo(() =>
    products.filter(p => p.stock > 0).slice(0, 8), [products]);

  const displayBrands = brands || [];
  const minItemsInHalf = 20;
  const halfCopies = Math.max(1, Math.ceil(minItemsInHalf / Math.max(1, displayBrands.length)));
  const tickerBrands = useMemo(() =>
    Array(halfCopies * 2).fill(displayBrands).flat(),
    [displayBrands, halfCopies]
  );

  // Promo banner data
  const promoBanners = [
    { label: 'New Arrivals', icon: <Sparkles size={22} />, color: '#dc2626', bg: 'linear-gradient(135deg,#dc2626,#7f1d1d)', desc: 'Latest drops just landed' },
    { label: 'JDM Classics', icon: <Flame size={22} />,     color: '#d97706', bg: 'linear-gradient(135deg,#d97706,#78350f)', desc: 'Japanese legends in 1:64' },
    { label: 'Deals & Sales', icon: <Package size={22} />,  color: '#059669', bg: 'linear-gradient(135deg,#059669,#064e3b)', desc: 'Up to 40% off on select models' },
  ];

  return (
    <>
      <script type="application/ld+json">{JSON.stringify(shopSchema)}</script>

      {/* ── HEADER ── */}
      <Header
        cartItemCount={cartItemCount}
        onOpenCart={onOpenCart}
        showSearch={true}
        searchValue={search}
        onSearchChange={(v) => { setSearch(v); setCurrentPage(1); }}
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
                onClick={() => document.getElementById('new-arrivals')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Shop Now <ArrowRight size={16} />
              </button>
              <button
                className="btn"
                style={{ width: 'auto', padding: '0.85rem 2rem', background: 'rgba(255,255,255,0.15)', border: '2px solid rgba(255,255,255,0.5)', color: '#fff', backdropFilter: 'blur(4px)', cursor: 'pointer', borderRadius: '8px', fontFamily: 'Outfit,sans-serif', fontWeight: '700', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                onClick={() => document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                View Catalog
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

      {/* ── PROMO BANNERS ── */}
      <section className="promo-banners-section">
        <div className="container">
          <div className="promo-banners-grid">
            {promoBanners.map((banner, i) => (
              <div
                key={i}
                className="promo-banner-card"
                style={{ background: banner.bg }}
                onClick={() => document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <div className="promo-banner-icon">{banner.icon}</div>
                <div>
                  <div className="promo-banner-label">{banner.label}</div>
                  <div className="promo-banner-desc">{banner.desc}</div>
                </div>
                <ArrowRight size={18} style={{ marginLeft: 'auto', opacity: 0.8, flexShrink: 0 }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BRAND TICKER ── */}
      <div className="brand-ticker" title="Hover to pause">
        <div className="brand-ticker-track">
          {tickerBrands.map((b, i) => (
            <div className="brand-ticker-item" key={`${b.id || b.name}-${i}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
              <LazyImage
                src={b.imageUrl || 'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?q=80&w=200&auto=format&fit=crop'}
                alt={b.name}
                style={{ width: '90px', height: '90px', objectFit: 'contain' }}
              />
              <span className="brand-ticker-name" style={{ fontSize: '0.82rem' }}>{b.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── NEW ARRIVALS ── */}
      {newArrivals.length > 0 && (
        <section id="new-arrivals" style={{ padding: '3rem 0', background: '#fff' }}>
          <div className="container">
            <div className="section-header" style={{ marginBottom: '1.5rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <Sparkles size={18} style={{ color: 'var(--primary)' }} />
                  <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--primary)' }}>Just Dropped</span>
                </div>
                <h2 className="section-title">New <span>Arrivals</span></h2>
                <div className="section-divider" />
              </div>
              <a href="/#catalog-section" className="see-all-link">
                See All <ArrowRight size={14} />
              </a>
            </div>
            <div className="horizontal-scroll-grid">
              {newArrivals.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onNavigate={handleNavigate}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FULL CATALOG ── */}
      <div id="catalog-section" style={{ background: 'var(--bg-main)' }}>
        <div className="container">
          <div className="section-header" style={{ paddingTop: '3rem', marginBottom: '1rem' }}>
            <div>
              <h2 className="section-title">Shop All <span>Collections</span></h2>
              <div className="section-divider" />
            </div>
          </div>
        </div>

        <main className="container catalog-split">

          {/* Filter Overlay for Mobile */}
          {isMobileFilterOpen && (
            <div className="filter-overlay" onClick={() => setIsMobileFilterOpen(false)} />
          )}

          {/* Sidebar */}
          <aside className={`filter-sidebar ${isMobileFilterOpen ? 'mobile-open' : ''}`}>
            <div className="filter-sidebar-header">
              <span className="filter-sidebar-title">Filters</span>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <button className="filter-clear-btn" onClick={clearFilters}>Clear All</button>
                <button onClick={() => setIsMobileFilterOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.4rem', lineHeight: 1, padding: '0 0.2rem', color: '#6b7280' }}>&times;</button>
              </div>
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
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span className="results-count">
                  Showing <strong>{sorted.length}</strong> products
                  {totalPages > 1 && <span style={{ color: 'var(--text-muted)', fontWeight: '400' }}> · Page {currentPage} of {totalPages}</span>}
                </span>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <button
                    className="btn btn-outline filter-mobile-btn"
                    onClick={() => setIsMobileFilterOpen(true)}
                    style={{ padding: '0.4rem 0.85rem', fontSize: '0.75rem', height: '36px', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                  >
                    <SlidersHorizontal size={14} /> Filters
                  </button>
                  <select className="sort-select" style={{ height: '36px' }} value={sortOption} onChange={e => { setSortOption(e.target.value); setCurrentPage(1); }}>
                    <option value="featured">Featured</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="name-asc">Name: A–Z</option>
                    <option value="name-desc">Name: Z–A</option>
                    <option value="year-desc">Newest First</option>
                  </select>
                </div>
              </div>
            </div>

            {sorted.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '5rem 0', background: '#fff', border: '1px solid var(--border-color)', borderRadius: '10px', color: 'var(--text-secondary)' }}>
                <ShoppingBag size={48} style={{ margin: '0 auto 1rem', opacity: 0.2, color: 'var(--primary)' }} />
                <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: '700' }}>No Collectibles Found</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Try changing your filters or search terms.</p>
                <button className="btn btn-outline" style={{ marginTop: '1rem', padding: '0.5rem 1.5rem' }} onClick={clearFilters}>Clear Filters</button>
              </div>
            ) : (
              <>
                <div className="store-grid">
                  {paginated.map(product => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={handleAddToCart}
                      onNavigate={handleNavigate}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="pagination">
                    <button
                      className="pagination-btn"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft size={16} /> Prev
                    </button>

                    <div className="pagination-pages">
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2)
                        .reduce((acc, p, idx, arr) => {
                          if (idx > 0 && p - arr[idx - 1] > 1) acc.push('...');
                          acc.push(p);
                          return acc;
                        }, [])
                        .map((p, idx) =>
                          p === '...'
                            ? <span key={`ellipsis-${idx}`} className="pagination-ellipsis">…</span>
                            : <button
                                key={p}
                                className={`pagination-page ${p === currentPage ? 'active' : ''}`}
                                onClick={() => handlePageChange(p)}
                              >{p}</button>
                        )
                      }
                    </div>

                    <button
                      className="pagination-btn"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </>
            )}
          </section>

        </main>
      </div>

      {/* ── TRUST STRIP ── */}
      <section className="trust-strip">
        <div className="container">
          <div className="trust-grid">
            {[
              { icon: <Truck size={28} />, title: 'Free Shipping', desc: 'On orders above ₹999 Pan India' },
              { icon: <Shield size={28} />, title: '100% Authentic', desc: 'Every model is original & verified' },
              { icon: <Star size={28} />, title: 'Rare Imports', desc: 'Exclusive models from Japan & USA' },
              { icon: <Package size={28} />, title: 'Safe Packaging', desc: 'Bubble-wrap & corrugated boxes' },
            ].map((item, i) => (
              <div key={i} className="trust-item">
                <div className="trust-icon">{item.icon}</div>
                <div>
                  <div className="trust-title">{item.title}</div>
                  <div className="trust-desc">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOT WHEELS SEO CONTENT SECTION ── */}
      <section
        id="hot-wheels-collection"
        style={{ background: '#fff', padding: '3.5rem 0', borderTop: '1px solid var(--border-color)' }}
        aria-label="Hot Wheels Diecast Cars Collection India"
      >
        <div className="container">
          <div style={{ maxWidth: '860px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2rem' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--primary)', display: 'block', marginBottom: '0.4rem' }}>🚗 Collector's Guide</span>
              <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '1.75rem', fontWeight: '900', color: 'var(--text-primary)', lineHeight: '1.2', marginBottom: '0.75rem' }}>
                Buy <span style={{ color: 'var(--primary)' }}>Hot Wheels Diecast Cars</span> Online in India
              </h2>
              <div style={{ width: '48px', height: '4px', background: 'var(--primary)', borderRadius: '2px' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              {[
                { emoji: '🏎️', title: 'Hot Wheels Mainline', desc: 'The classic 1:64 scale cars updated every year. Affordable collectibles for every budget.' },
                { emoji: '⭐', title: 'Hot Wheels Premium', desc: 'Car Culture, Boulevard & premium series with real-rider wheels and detailed interiors.' },
                { emoji: '💎', title: 'Treasure Hunts', desc: 'Super Treasure Hunts are rare chase cars — the most sought-after finds in every case.' },
                { emoji: '🌏', title: 'Import Exclusives', desc: 'Japan, USA & European exclusive models not easily found in Indian retail stores.' },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{ background: '#f9fafb', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.25rem', cursor: 'pointer', transition: 'all 0.2s ease' }}
                  onClick={() => document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' })}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(220,38,38,0.1)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{item.emoji}</div>
                  <div style={{ fontWeight: '800', fontSize: '0.9rem', marginBottom: '0.3rem', fontFamily: 'Montserrat, sans-serif' }}>{item.title}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>{item.desc}</div>
                </div>
              ))}
            </div>

            <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.85', display: 'grid', gap: '1rem' }}>
              <p>
                Hot Wheels is one of the most popular diecast car brands for collectors and kids across India.
                At <strong>DiecastXpress</strong>, you can explore the full range of <strong>Hot Wheels 1:64 scale cars</strong>,
                premium series like <strong>Car Culture</strong>, <strong>Boulevard</strong>, <strong>Fast & Furious</strong>,
                character cars, limited editions, and the latest diecast models — all at competitive prices with
                safe bubble-wrap packaging and pan-India delivery.
              </p>
              <p>
                We regularly update our <strong>Hot Wheels collection in India</strong> with new mainline arrivals,
                Super Treasure Hunts, and collector-friendly products. Whether you're looking for
                <strong> buy Hot Wheels cars online India</strong> for your personal collection or gifting,
                DiecastXpress is your most trusted destination. Our catalog includes models across series such as
                HW Race Day, HW Screen Time, HW Exotics, HW Turbo, and many more.
              </p>
              <p>
                Looking for <strong>Hot Wheels premium cars India</strong>? Our premium selection includes Real Riders,
                detailed engine bays, authentic rubber tires, and licensed body shapes straight from renowned car manufacturers.
                These are perfect for display collectors who want showpiece-quality diecast models.
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <strong>Popular searches:</strong> buy hot wheels cars online india · hot wheels diecast cars india ·
                hot wheels premium cars india · hot wheels 1:64 scale · hot wheels collection india ·
                super treasure hunt india · majorette diecast india · matchbox cars online india
              </p>
            </div>

            <div style={{ marginTop: '1.75rem', textAlign: 'center' }}>
              <button
                className="btn btn-buy"
                style={{ width: 'auto', padding: '0.85rem 2.5rem' }}
                onClick={() => document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Browse All Hot Wheels Cars <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer" id="contact">
        <div className="footer-inner">
          <div className="footer-grid">
            {/* Brand Column */}
            <div className="footer-brand-col">
              <p style={{ color: '#fff', fontWeight: '900', fontSize: '1.5rem', marginBottom: '0.5rem', fontFamily: 'Montserrat, sans-serif', letterSpacing: '-0.02em' }}>
                Diecast<span style={{ color: 'var(--primary)' }}>Xpress</span>
              </p>
              <p style={{ fontSize: '0.82rem', color: '#9ca3af', marginBottom: '1.25rem', lineHeight: '1.6', maxWidth: '260px' }}>
                India's Premier Destination for Hot Wheels & Diecast Collectibles. Serving passionate collectors since 2020.
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                {['Instagram', 'Facebook', 'YouTube'].map(name => (
                  <a key={name} href="#" className="social-btn" aria-label={name} style={{ fontSize: '0.65rem', fontWeight: '700', letterSpacing: '0.03em', padding: '0 0.5rem', width: 'auto', minWidth: 34 }}>{name.slice(0, 2).toUpperCase()}</a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <p className="footer-heading">Quick Links</p>
              <div className="footer-links-col">
                <a href="/">Home</a>
                <a href="/#catalog-section">Shop All</a>
                <a href="/#new-arrivals">New Arrivals</a>
                <a href="/#pre-order">Pre-Orders</a>
              </div>
            </div>

            {/* Customer Service */}
            <div>
              <p className="footer-heading">Customer Care</p>
              <div className="footer-links-col">
                <a href="#">Track Order</a>
                <a href="#">Returns & Exchange</a>
                <a href="#">FAQ</a>
                <a href="#">Privacy Policy</a>
              </div>
            </div>

            {/* Contact */}
            <div>
              <p className="footer-heading">Contact Us</p>
              <div className="footer-contact-list">
                <div className="footer-contact-item">
                  <Phone size={14} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                  <span>+91 98765 43210</span>
                </div>
                <div className="footer-contact-item">
                  <Mail size={14} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                  <span>support@diecastxpress.in</span>
                </div>
                <div className="footer-contact-item" style={{ alignItems: 'flex-start' }}>
                  <MapPin size={14} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
                  <span>Mumbai, Maharashtra, India</span>
                </div>
              </div>
              {/* Newsletter */}
              <div style={{ marginTop: '1.25rem' }}>
                <p style={{ fontSize: '0.78rem', color: '#d1d5db', fontWeight: '600', marginBottom: '0.5rem' }}>Stay Updated</p>
                <div className="newsletter-form">
                  <input type="email" placeholder="Your email..." className="newsletter-input" />
                  <button className="newsletter-btn">Subscribe</button>
                </div>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} DiecastXpress. All Rights Reserved.</p>
            <p style={{ fontSize: '0.7rem', color: '#6b7280' }}>Made with ❤️ for Diecast Collectors across India</p>
          </div>
        </div>
      </footer>
    </>
  );
}
