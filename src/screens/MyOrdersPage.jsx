import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PackageCheck, Clock, Truck, ChevronDown, ChevronUp, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Header from '../components/common/Header';

const STATUS_STYLES = {
  'Pending':    { bg: '#fef9c3', color: '#854d0e', icon: <Clock size={12} /> },
  'Processing': { bg: '#dbeafe', color: '#1e40af', icon: <PackageCheck size={12} /> },
  'Shipped':    { bg: '#e0f2fe', color: '#0369a1', icon: <Truck size={12} /> },
  'Delivered':  { bg: '#dcfce7', color: '#166534', icon: <PackageCheck size={12} /> },
  'Cancelled':  { bg: '#fee2e2', color: '#991b1b', icon: <Clock size={12} /> },
};

export default function MyOrdersPage({ cartItemCount, onOpenCart }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    document.title = 'My Orders | DiecastXpress';
  }, []);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    const fetchOrders = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/orders?email=${encodeURIComponent(user.email)}`);
        const data = await res.json();
        setOrders(data);
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  return (
    <>
      <Header cartItemCount={cartItemCount} onOpenCart={onOpenCart} />

      {/* Breadcrumb */}
      <div style={{ background: '#f8f9fa', borderBottom: '1px solid var(--border-color)', padding: '0.65rem 0' }}>
        <div className="container">
          <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            <span style={{ cursor: 'pointer', color: 'var(--primary)', fontWeight: '600' }} onClick={() => navigate('/')}>Home</span>
            <span>›</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>My Orders</span>
          </nav>
        </div>
      </div>

      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem', minHeight: '70vh' }}>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '1.6rem', fontWeight: '900', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              My Orders
            </h1>
            {user && <p style={{ fontSize: '0.82rem', color: '#9ca3af', marginTop: '0.2rem' }}>Signed in as {user.email}</p>}
          </div>
          <button
            className="btn"
            onClick={() => navigate('/')}
            style={{ background: 'none', border: '1px solid #e5e7eb', color: '#374151', padding: '0.5rem 1rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: '600', fontSize: '0.82rem', cursor: 'pointer' }}
          >
            <ArrowLeft size={14} /> Continue Shopping
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#9ca3af', fontSize: '0.9rem' }}>
            Loading your orders...
          </div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 2rem', background: '#fff', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
            <ShoppingBag size={52} style={{ margin: '0 auto 1rem', opacity: 0.15, color: 'var(--primary)' }} />
            <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: '700', fontSize: '1.1rem', color: '#374151' }}>No Orders Yet</h3>
            <p style={{ color: '#9ca3af', fontSize: '0.88rem', marginTop: '0.4rem', marginBottom: '1.5rem' }}>
              Start your collection — browse Hot Wheels and diecast imports!
            </p>
            <button className="btn btn-buy" style={{ width: 'auto', padding: '0.75rem 2rem' }} onClick={() => navigate('/')}>
              Shop Now
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[...orders].reverse().map(order => {
              const statusStyle = STATUS_STYLES[order.status] || STATUS_STYLES['Pending'];
              const isExp = expanded === order.id;
              return (
                <div key={order.id} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow-subtle)', transition: 'box-shadow 0.2s' }}>

                  {/* Order Header Row */}
                  <div
                    style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', flexWrap: 'wrap', gap: '0.75rem' }}
                    onClick={() => setExpanded(isExp ? null : order.id)}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                      <span style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: '800', fontSize: '0.9rem', color: '#1f2937' }}>
                        {order.id}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                      {/* Status badge */}
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: statusStyle.bg, color: statusStyle.color, fontSize: '0.72rem', fontWeight: '800', padding: '0.3rem 0.65rem', borderRadius: '999px' }}>
                        {statusStyle.icon} {order.status}
                      </span>

                      {/* Payment method */}
                      {order.paymentMethod && (
                        <span style={{ fontSize: '0.72rem', fontWeight: '700', background: '#f3f4f6', color: '#4b5563', padding: '0.3rem 0.65rem', borderRadius: '999px' }}>
                          {order.paymentMethod.toUpperCase()}
                        </span>
                      )}

                      {/* Total */}
                      <span style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: '900', color: 'var(--primary)', fontSize: '1rem' }}>
                        ₹{order.total.toFixed(2)}
                      </span>

                      {/* Expand icon */}
                      <span style={{ color: '#9ca3af' }}>
                        {isExp ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </span>
                    </div>
                  </div>

                  {/* Expandable Order Details */}
                  {isExp && (
                    <div style={{ borderTop: '1px solid #f3f4f6', padding: '1rem 1.25rem', background: '#fafafa', animation: 'slideUp 0.15s ease' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem', fontSize: '0.82rem' }}>
                        <div>
                          <p style={{ color: '#9ca3af', fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.2rem' }}>Delivery Address</p>
                          <p style={{ color: '#374151', fontWeight: '600', lineHeight: '1.4' }}>{order.address}</p>
                        </div>
                        {order.phone && (
                          <div>
                            <p style={{ color: '#9ca3af', fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.2rem' }}>Contact</p>
                            <p style={{ color: '#374151', fontWeight: '600' }}>+91 {order.phone}</p>
                          </div>
                        )}
                      </div>

                      <p style={{ color: '#9ca3af', fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>Items Ordered</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        {order.items.map((item, idx) => (
                          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '0.6rem 0.85rem', fontSize: '0.83rem' }}>
                            <span style={{ fontWeight: '600', color: '#1f2937' }}>
                              {item.name}
                              <span style={{ color: 'var(--primary)', fontWeight: '800', marginLeft: '6px' }}>×{item.quantity}</span>
                            </span>
                            <span style={{ fontWeight: '700' }}>₹{(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-inner">
          <p style={{ color: '#fff', fontWeight: '900', fontSize: '1.4rem', marginBottom: '0.5rem', fontFamily: 'Montserrat, sans-serif' }}>
            Diecast<span style={{ color: 'var(--primary)' }}>Xpress</span>
          </p>
          <p style={{ fontSize: '0.82rem', color: '#9ca3af' }}>India's Premier Destination for Hot Wheels &amp; Diecast Collectibles</p>
          <div className="footer-links" style={{ marginTop: '0.75rem' }}>
            <a href="/">Home</a><a href="#">Track Order</a><a href="#">Contact Us</a>
          </div>
          <p style={{ fontSize: '0.72rem', opacity: 0.5, marginTop: '1rem' }}>© {new Date().getFullYear()} DiecastXpress. All Rights Reserved.</p>
        </div>
      </footer>
    </>
  );
}
