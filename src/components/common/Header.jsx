import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, ClipboardList, ChevronDown, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import AuthModal from '../modals/AuthModal';

export default function Header({ cartItemCount, onOpenCart, showSearch, searchValue, onSearchChange }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState('login');
  const [dropOpen, setDropOpen] = useState(false);

  const openLogin    = () => { setAuthTab('login');    setAuthOpen(true); setDropOpen(false); };
  const openRegister = () => { setAuthTab('register'); setAuthOpen(true); };

  const handleLogout = () => {
    logout();
    setDropOpen(false);
    navigate('/');
  };

  return (
    <>
      <div className="announcement-bar">
        🔥 Free Shipping on Orders Over ₹999 &bull; 100% Authentic Diecast Cars &bull; COD Available Across India
      </div>

      <header className="header">
        <div className="header-container">
          {/* Logo */}
          <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <img src="/logo.png" alt="DiecastXpress Logo" />
            <div className="logo-text"><span>Diecast</span>Xpress</div>
          </div>

          {/* Search (optional) */}
          {showSearch && (
            <div style={{ position: 'relative', width: '320px' }}>
              <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} size={16} />
              <input
                type="search"
                placeholder="Search Hot Wheels, Majorette, Matchbox..."
                className="form-control"
                style={{ paddingLeft: '36px', height: '40px', fontSize: '0.83rem' }}
                value={searchValue}
                onChange={e => onSearchChange(e.target.value)}
              />
            </div>
          )}

          <div className="header-actions">
            {/* Cart */}
            <button className="cart-trigger" onClick={onOpenCart} id="cart-button" aria-label="Open cart">
              <ShoppingCart size={22} />
              {cartItemCount > 0 && <span className="cart-count">{cartItemCount}</span>}
            </button>

            {/* Auth area */}
            {user ? (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setDropOpen(d => !d)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.45rem',
                    background: '#f9fafb', border: '1px solid #e5e7eb',
                    borderRadius: '8px', padding: '0.4rem 0.75rem', cursor: 'pointer',
                    fontFamily: 'Outfit, sans-serif', fontWeight: '600', fontSize: '0.82rem',
                    color: '#1f2937', transition: 'all 0.15s',
                  }}
                >
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '800', fontSize: '0.75rem', flexShrink: 0 }}>
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span style={{ maxWidth: 90, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user.name?.split(' ')[0]}
                  </span>
                  <ChevronDown size={14} style={{ transition: 'transform 0.2s', transform: dropOpen ? 'rotate(180deg)' : 'none' }} />
                </button>

                {dropOpen && (
                  <div style={{
                    position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                    background: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.10)', zIndex: 500, minWidth: 180,
                    animation: 'slideUp 0.15s ease',
                  }}>
                    <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #f3f4f6' }}>
                      <p style={{ fontWeight: '700', fontSize: '0.85rem', color: '#1f2937' }}>{user.name}</p>
                      <p style={{ fontSize: '0.72rem', color: '#9ca3af', marginTop: '1px' }}>{user.email}</p>
                    </div>
                    <div style={{ padding: '0.4rem' }}>
                      <button
                        onClick={() => { navigate('/orders'); setDropOpen(false); }}
                        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.55rem 0.75rem', background: 'none', border: 'none', cursor: 'pointer', borderRadius: '7px', fontSize: '0.82rem', fontWeight: '600', color: '#374151', transition: 'background 0.1s' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
                        onMouseLeave={e => e.currentTarget.style.background = 'none'}
                      >
                        <ClipboardList size={15} /> My Orders
                      </button>
                      <button
                        onClick={handleLogout}
                        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.55rem 0.75rem', background: 'none', border: 'none', cursor: 'pointer', borderRadius: '7px', fontSize: '0.82rem', fontWeight: '600', color: '#dc2626', transition: 'background 0.1s' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#fff5f5'}
                        onMouseLeave={e => e.currentTarget.style.background = 'none'}
                      >
                        <LogOut size={15} /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={openLogin}
                  style={{ background: 'none', border: '1px solid #e5e7eb', borderRadius: '7px', padding: '0.4rem 0.85rem', cursor: 'pointer', fontFamily: 'Outfit, sans-serif', fontWeight: '700', fontSize: '0.8rem', color: '#374151', transition: 'all 0.15s' }}
                >
                  Sign In
                </button>
                <button
                  onClick={openRegister}
                  className="btn btn-buy"
                  style={{ width: 'auto', padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} defaultTab={authTab} />
    </>
  );
}
