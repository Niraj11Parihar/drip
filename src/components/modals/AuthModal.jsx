import React, { useState } from 'react';
import { X, Eye, EyeOff, User, Mail, Phone, Lock, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AuthModal({ isOpen, onClose, defaultTab = 'login' }) {
  const { login, register } = useAuth();
  const [tab, setTab] = useState(defaultTab);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPwd, setShowPwd] = useState(false);

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [regForm, setRegForm] = useState({ name: '', email: '', phone: '', password: '' });

  if (!isOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(loginForm.email, loginForm.password);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (regForm.phone.length !== 10 || !/^\d+$/.test(regForm.phone)) {
      setError('Enter a valid 10-digit phone number.');
      return;
    }
    if (regForm.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      await register(regForm.name, regForm.email, regForm.phone, regForm.password);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const switchTab = (t) => { setTab(t); setError(''); };

  return (
    <div className="modal-overlay" style={{ zIndex: 900 }} onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '420px', borderRadius: '16px', overflow: 'visible' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ padding: '1.5rem 1.5rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <button
              onClick={() => switchTab('login')}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: 'Montserrat, sans-serif', fontWeight: '800',
                fontSize: '1.1rem', color: tab === 'login' ? 'var(--primary)' : '#9ca3af',
                borderBottom: tab === 'login' ? '2px solid var(--primary)' : '2px solid transparent',
                paddingBottom: '0.35rem', transition: 'all 0.15s'
              }}
            >
              Sign In
            </button>
            <button
              onClick={() => switchTab('register')}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: 'Montserrat, sans-serif', fontWeight: '800',
                fontSize: '1.1rem', color: tab === 'register' ? 'var(--primary)' : '#9ca3af',
                borderBottom: tab === 'register' ? '2px solid var(--primary)' : '2px solid transparent',
                paddingBottom: '0.35rem', transition: 'all 0.15s'
              }}
            >
              Register
            </button>
          </div>
          <button className="qty-btn" onClick={onClose} style={{ border: 'none' }}><X size={18} /></button>
        </div>

        <div style={{ padding: '1.25rem 1.5rem 1.5rem' }}>
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
            <img src="/logo.png" alt="DiecastXpress" style={{ height: 40, objectFit: 'contain' }} />
            <p style={{ fontSize: '0.78rem', color: '#9ca3af', marginTop: '0.3rem' }}>
              {tab === 'login' ? 'Welcome back, collector!' : 'Join India\'s diecast community!'}
            </p>
          </div>

          {/* Error box */}
          {error && (
            <div style={{ background: '#fff5f5', border: '1px solid #fecaca', color: '#dc2626', borderRadius: '8px', padding: '0.6rem 0.85rem', fontSize: '0.82rem', marginBottom: '1rem', fontWeight: '600' }}>
              {error}
            </div>
          )}

          {/* ── LOGIN FORM ── */}
          {tab === 'login' && (
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div className="auth-input-wrap">
                <Mail size={16} className="auth-input-icon" />
                <input
                  type="email" placeholder="Email address" required
                  className="form-control auth-input"
                  value={loginForm.email}
                  onChange={e => setLoginForm(p => ({ ...p, email: e.target.value }))}
                />
              </div>
              <div className="auth-input-wrap">
                <Lock size={16} className="auth-input-icon" />
                <input
                  type={showPwd ? 'text' : 'password'} placeholder="Password" required
                  className="form-control auth-input"
                  value={loginForm.password}
                  onChange={e => setLoginForm(p => ({ ...p, password: e.target.value }))}
                />
                <button type="button" className="auth-eye" onClick={() => setShowPwd(p => !p)}>
                  {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              <button type="submit" className="btn btn-buy" style={{ marginTop: '0.25rem' }} disabled={loading}>
                {loading ? 'Signing in...' : <><LogIn size={16} /> Sign In</>}
              </button>
              <p style={{ textAlign: 'center', fontSize: '0.78rem', color: '#9ca3af' }}>
                No account?{' '}
                <span style={{ color: 'var(--primary)', fontWeight: '700', cursor: 'pointer' }} onClick={() => switchTab('register')}>
                  Create one free
                </span>
              </p>
            </form>
          )}

          {/* ── REGISTER FORM ── */}
          {tab === 'register' && (
            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div className="auth-input-wrap">
                <User size={16} className="auth-input-icon" />
                <input
                  type="text" placeholder="Full name" required
                  className="form-control auth-input"
                  value={regForm.name}
                  onChange={e => setRegForm(p => ({ ...p, name: e.target.value }))}
                />
              </div>
              <div className="auth-input-wrap">
                <Mail size={16} className="auth-input-icon" />
                <input
                  type="email" placeholder="Email address" required
                  className="form-control auth-input"
                  value={regForm.email}
                  onChange={e => setRegForm(p => ({ ...p, email: e.target.value }))}
                />
              </div>
              <div className="auth-input-wrap">
                <Phone size={16} className="auth-input-icon" />
                <input
                  type="tel" placeholder="10-digit mobile number" required maxLength={10}
                  className="form-control auth-input"
                  value={regForm.phone}
                  onChange={e => setRegForm(p => ({ ...p, phone: e.target.value.replace(/\D/g, '') }))}
                />
              </div>
              <div className="auth-input-wrap">
                <Lock size={16} className="auth-input-icon" />
                <input
                  type={showPwd ? 'text' : 'password'} placeholder="Create password (min 6 chars)" required
                  className="form-control auth-input"
                  value={regForm.password}
                  onChange={e => setRegForm(p => ({ ...p, password: e.target.value }))}
                />
                <button type="button" className="auth-eye" onClick={() => setShowPwd(p => !p)}>
                  {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              <button type="submit" className="btn btn-buy" style={{ marginTop: '0.25rem' }} disabled={loading}>
                {loading ? 'Creating account...' : <><UserPlus size={16} /> Create Account</>}
              </button>
              <p style={{ textAlign: 'center', fontSize: '0.78rem', color: '#9ca3af' }}>
                Already registered?{' '}
                <span style={{ color: 'var(--primary)', fontWeight: '700', cursor: 'pointer' }} onClick={() => switchTab('login')}>
                  Sign in
                </span>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
