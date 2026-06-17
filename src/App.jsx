import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ShoppingCart, X, Trash, ArrowRight, ShoppingBag } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import CheckoutModal from './components/modals/CheckoutModal';
import AuthModal from './components/modals/AuthModal';
import HomePage from './screens/HomePage';
import ProductPage from './screens/ProductPage';
import MyOrdersPage from './screens/MyOrdersPage';

// Inner app wrapped inside AuthProvider so useAuth() works
function AppInner() {
  const { user } = useAuth();

  const [settings, setSettings] = useState(null);
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  // Auth gate: when user tries to checkout and isn't logged in
  const [authGateOpen, setAuthGateOpen] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);

  const fetchData = async () => {
    try {
      const [settingsRes, productsRes, brandsRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/settings`),
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/products`),
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/brands`)
      ]);
      if (!settingsRes.ok || !productsRes.ok) throw new Error('Backend unreachable');
      setSettings(await settingsRes.json());
      setProducts(await productsRes.json());

      if (brandsRes.ok) {
        setBrands(await brandsRes.json());
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // ─── Cart Handlers ───────────────────────────────────────────────
  const handleAddToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) { alert(`Only ${product.stock} units in stock.`); return prev; }
        return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleUpdateQty = (id, delta) => {
    setCart(prev =>
      prev.map(item => {
        if (item.id !== id) return item;
        const next = item.quantity + delta;
        if (next <= 0) return null;
        if (next > item.stock) { alert(`Only ${item.stock} in stock.`); return item; }
        return { ...item, quantity: next };
      }).filter(Boolean)
    );
  };

  const handleRemoveFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id));

  const cartTotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const cartItemCount = cart.reduce((s, i) => s + i.quantity, 0);

  // Checkout CTA — require login
  const handleGoToCheckout = () => {
    setCartOpen(false);
    if (!user) {
      setAuthGateOpen(true); // Show login gate
      return;
    }
    setCheckoutOpen(true);
  };

  // When auth modal closes after login (user is now set), proceed to checkout
  const handleAuthClose = () => {
    setAuthGateOpen(false);
    // If user just logged in, open checkout automatically
    if (user) setCheckoutOpen(true);
  };

  const handleOrderSuccess = (order) => {
    setCheckoutOpen(false);
    setCart([]);
    setOrderSuccess(order);
    fetchData();
  };

  // ─── Loading / Error screens ─────────────────────────────────────
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#f8f9fa' }}>
        <img src="/logo.png" alt="DiecastXpress" style={{ height: 60, marginBottom: '1rem', opacity: 0.85 }} />
        <p style={{ color: '#9ca3af', fontSize: '0.85rem', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'Outfit, sans-serif' }}>Loading catalog...</p>
      </div>
    );
  }

  if (!settings) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#f8f9fa', padding: '2rem', textAlign: 'center' }}>
        <h2 style={{ color: '#dc2626', marginBottom: '0.75rem', fontFamily: 'Montserrat, sans-serif' }}>Connection Error</h2>
        <p style={{ color: '#6b7280', lineHeight: '1.6', fontSize: '0.9rem', maxWidth: '480px' }}>
          Backend is currently unreachable or experiencing an error. Please check if the server is running and configured correctly.
        </p>
        <button className="btn btn-buy" onClick={fetchData} style={{ marginTop: '1.5rem', width: 'auto', padding: '0.75rem 2rem' }}>
          Retry Connection
        </button>
      </div>
    );
  }

  const brandStyle = { '--primary': settings.primaryColor || '#dc2626', '--primary-hover': '#b91c1c' };

  const sharedProps = {
    settings,
    products,
    brands,
    cart,
    cartItemCount,
    onAddToCart: handleAddToCart,
    onOpenCart: () => setCartOpen(true),
    fetchData,
  };

  return (
    <div style={brandStyle}>

      {/* ── ROUTES ── */}
      <Routes>
        <Route path="/" element={<HomePage {...sharedProps} />} />
        <Route path="/product/:productId" element={<ProductPage {...sharedProps} />} />
        <Route path="/orders" element={<MyOrdersPage cartItemCount={cartItemCount} onOpenCart={() => setCartOpen(true)} />} />
        <Route path="*" element={<HomePage {...sharedProps} />} />
      </Routes>

      {/* ── GLOBAL CART DRAWER ── */}
      {cartOpen && (
        <div className="cart-overlay" onClick={() => setCartOpen(false)}>
          <div className="cart-drawer" onClick={e => e.stopPropagation()}>
            <div className="cart-header">
              <h2>
                Shopping Cart
                {cartItemCount > 0 && (
                  <span style={{ fontSize: '0.78rem', fontWeight: '600', color: 'var(--primary)', background: '#fff5f5', padding: '0.15rem 0.5rem', borderRadius: '999px', border: '1px solid rgba(220,38,38,0.2)', marginLeft: '0.5rem' }}>
                    {cartItemCount} items
                  </span>
                )}
              </h2>
              <button className="qty-btn" onClick={() => setCartOpen(false)} style={{ border: 'none' }}>
                <X size={18} />
              </button>
            </div>

            <div className="cart-items-list">
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', marginTop: '4rem', color: 'var(--text-muted)' }}>
                  <ShoppingBag size={48} style={{ margin: '0 auto 1rem auto', opacity: 0.25 }} />
                  <p style={{ fontWeight: '600' }}>Your cart is empty</p>
                  <p style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>Add some diecast cars to get started!</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="cart-item">
                    <img src={item.images?.[0]?.url || item.imageUrl || ''} alt={item.name} className="cart-item-img" />
                    <div className="cart-item-info">
                      <div className="cart-item-name">{item.name}</div>
                      <div className="cart-item-price">₹{item.price.toFixed(2)}</div>
                      <div className="cart-item-qty">
                        <button className="qty-btn" onClick={() => handleUpdateQty(item.id, -1)} style={{ width: '24px', height: '24px' }}>-</button>
                        <span style={{ fontWeight: '700', fontSize: '0.85rem', minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                        <button className="qty-btn" onClick={() => handleUpdateQty(item.id, 1)} style={{ width: '24px', height: '24px' }}>+</button>
                        <button
                          className="qty-btn"
                          onClick={() => handleRemoveFromCart(item.id)}
                          style={{ marginLeft: 'auto', color: '#dc2626', border: 'none', background: '#fff5f5', width: '24px', height: '24px' }}
                        >
                          <Trash size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="cart-footer">
                <div className="cart-total-row">
                  <span>Subtotal:</span>
                  <span style={{ color: 'var(--primary)' }}>₹{cartTotal.toFixed(2)}</span>
                </div>

                {/* If not logged in, show login prompt */}
                {!user && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#fffbeb', border: '1px solid #fcd34d', borderRadius: '8px', padding: '0.6rem 0.75rem', marginBottom: '0.75rem', fontSize: '0.78rem', color: '#92400e', fontWeight: '600' }}>
                    🔒 Login required to place an order
                  </div>
                )}

                <button
                  className="btn btn-buy"
                  style={{ width: '100%' }}
                  onClick={handleGoToCheckout}
                  id="checkout-btn"
                >
                  {user ? <>Proceed to Checkout <ArrowRight size={16} /></> : <>Sign In to Checkout <ArrowRight size={16} /></>}
                </button>
                <p style={{ textAlign: 'center', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.6rem' }}>
                  Free shipping on orders above ₹999
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── AUTH GATE MODAL (when trying to checkout without login) ── */}
      <AuthModal
        isOpen={authGateOpen}
        onClose={handleAuthClose}
        defaultTab="login"
      />

      {/* ── CHECKOUT MODAL ── */}
      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        onBackToCart={() => { setCheckoutOpen(false); setCartOpen(true); }}
        cart={cart}
        total={cartTotal}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* ── ORDER SUCCESS NOTIFICATION ── */}
      {orderSuccess && (
        <div className="modal-overlay" style={{ zIndex: 1001 }}>
          <div className="modal-content" style={{ maxWidth: '420px', textAlign: 'center', padding: '2rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🏎️🎉</div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '900', marginBottom: '0.5rem', fontFamily: 'Montserrat, sans-serif' }}>Order Confirmed!</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem', lineHeight: '1.5' }}>
              Your order <code style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{orderSuccess.id}</code> has been placed. Check your phone for an SMS confirmation.
            </p>
            <button className="btn btn-buy" style={{ width: '100%', marginBottom: '0.5rem' }} onClick={() => { setOrderSuccess(null); }}>
              Continue Shopping
            </button>
            <button
              className="btn"
              style={{ width: '100%', background: 'none', border: '1px solid #e5e7eb', color: '#374151', padding: '0.6rem', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontSize: '0.82rem' }}
              onClick={() => { setOrderSuccess(null); window.location.href = '/orders'; }}
            >
              View My Orders
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

// Root app wraps everything in AuthProvider
function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}

export default App;
