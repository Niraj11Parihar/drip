import React, { useState, useEffect } from 'react';
import {
  X, ArrowLeft, ArrowRight, MapPin, CheckCircle,
  Smartphone, CreditCard, Building2, Loader2,
  MessageSquare, ShieldCheck, PackageCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

// --- Pincode serviceability check ---
// Checks first digit: 1-8 = deliverable major Indian zones, 9 = not serviceable
const checkPincode = (pin) => {
  if (!/^\d{6}$/.test(pin)) return { ok: false, msg: 'Enter a valid 6-digit pincode.' };
  const first = parseInt(pin[0]);
  if (first === 0 || first === 9) return { ok: false, msg: `Sorry, we don\'t deliver to pincode ${pin} yet.` };
  const areas = {
    1: 'Delhi / NCR Region',
    2: 'UP / Uttarakhand',
    3: 'Rajasthan / Gujarat',
    4: 'Maharashtra / Goa',
    5: 'Andhra / Telangana / Karnataka',
    6: 'Tamil Nadu / Kerala',
    7: 'West Bengal / Odisha / NE',
    8: 'Bihar / Jharkhand / MP',
  };
  return { ok: true, msg: `✓ Delivery available to ${areas[first] || 'your area'}` };
};

const STEPS = ['details', 'payment', 'processing', 'success'];

export default function CheckoutModal({ isOpen, onClose, cart, total, onOrderSuccess, onBackToCart }) {
  const { user, token } = useAuth();

  const [step, setStep] = useState('details');
  const [pincodeResult, setPincodeResult] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [processingDots, setProcessingDots] = useState('');
  const [placedOrder, setPlacedOrder] = useState(null);

  const [details, setDetails] = useState({
    name: '', email: '', phone: '', address: '', pincode: '',
  });

  const [payDetails, setPayDetails] = useState({
    upiId: '', cardNumber: '', cardExpiry: '', cardCvv: '', cardName: '', bank: 'sbi',
  });

  // Prefill from logged-in user
  useEffect(() => {
    if (user) {
      setDetails(d => ({
        ...d,
        name: user.name || d.name,
        email: user.email || d.email,
        phone: user.phone || d.phone,
        address: user.address || d.address,
      }));
    }
  }, [user, isOpen]);

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setStep('details');
      setPincodeResult(null);
      setPlacedOrder(null);
    }
  }, [isOpen]);

  // Processing animation dots
  useEffect(() => {
    if (step !== 'processing') return;
    const timer = setInterval(() => setProcessingDots(d => d.length >= 3 ? '' : d + '.'), 500);
    // Auto-place order after 3 seconds
    const placeTimer = setTimeout(() => placeOrder(), 3000);
    return () => { clearInterval(timer); clearTimeout(placeTimer); };
  }, [step]);

  if (!isOpen) return null;

  const handlePincodeCheck = () => {
    setPincodeResult(checkPincode(details.pincode));
  };

  const handleDetailsNext = (e) => {
    e.preventDefault();
    if (!pincodeResult || !pincodeResult.ok) {
      setPincodeResult({ ok: false, msg: 'Please check your pincode first.' });
      return;
    }
    setStep('payment');
  };

  const handlePayNow = (e) => {
    e.preventDefault();
    setStep('processing');
  };

  const placeOrder = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/orders`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          customerName: details.name,
          email: details.email,
          phone: details.phone,
          address: `${details.address}, Pincode: ${details.pincode}`,
          pincode: details.pincode,
          paymentMethod,
          paymentStatus: 'Paid',
          items: cart.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity })),
          total,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setPlacedOrder(data.order);
        setStep('success');
        onOrderSuccess(data.order);
      } else {
        alert(data.error || 'Order failed. Try again.');
        setStep('payment');
      }
    } catch {
      alert('Server error. Please check your connection.');
      setStep('payment');
    }
  };

  const stepIndex = STEPS.indexOf(step);

  return (
    <div className="modal-overlay" style={{ zIndex: 800, alignItems: 'center' }} onClick={() => {}}>
      <div className="modal-content" style={{ maxWidth: '520px', maxHeight: '92vh', display: 'flex', flexDirection: 'column' }}>

        {/* ── HEADER ── */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Back arrow for payment step */}
            {step === 'payment' && (
              <button className="qty-btn" onClick={() => setStep('details')} style={{ border: 'none' }} title="Back to details">
                <ArrowLeft size={16} />
              </button>
            )}
            <div>
              <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '1rem', fontWeight: '800' }}>
                {step === 'details' && 'Delivery Details'}
                {step === 'payment' && 'Choose Payment'}
                {step === 'processing' && 'Processing Payment'}
                {step === 'success' && 'Order Confirmed! 🎉'}
              </h2>
              {step !== 'processing' && step !== 'success' && (
                <p style={{ fontSize: '0.72rem', color: '#9ca3af', marginTop: '1px' }}>
                  Step {stepIndex + 1} of 2
                </p>
              )}
            </div>
          </div>
          {step !== 'processing' && step !== 'success' && (
            <button className="qty-btn" onClick={onClose} style={{ border: 'none' }}>
              <X size={18} />
            </button>
          )}
        </div>

        {/* ── STEP PROGRESS BAR ── */}
        {(step === 'details' || step === 'payment') && (
          <div style={{ display: 'flex', gap: 0, background: '#f3f4f6' }}>
            {['Delivery Info', 'Payment'].map((label, i) => (
              <div
                key={label}
                style={{
                  flex: 1, padding: '0.4rem', textAlign: 'center',
                  fontSize: '0.7rem', fontWeight: '700',
                  background: i <= stepIndex ? 'var(--primary)' : '#f3f4f6',
                  color: i <= stepIndex ? '#fff' : '#9ca3af',
                  transition: 'all 0.3s'
                }}
              >
                {label}
              </div>
            ))}
          </div>
        )}

        <div style={{ overflowY: 'auto', flex: 1 }}>

          {/* ═══ STEP 1: DETAILS ═══ */}
          {step === 'details' && (
            <form id="details-form" onSubmit={handleDetailsNext}>
              <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                {/* Order summary strip */}
                <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '0.85rem 1rem' }}>
                  <p style={{ fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6b7280', marginBottom: '0.5rem' }}>Order Summary</p>
                  {cart.map((item, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.83rem', color: '#374151', marginBottom: '0.2rem' }}>
                      <span>{item.name} <strong style={{ color: 'var(--primary)' }}>×{item.quantity}</strong></span>
                      <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <div style={{ borderTop: '1px dashed #e5e7eb', marginTop: '0.5rem', paddingTop: '0.5rem', display: 'flex', justifyContent: 'space-between', fontWeight: '800', fontFamily: 'Montserrat, sans-serif', fontSize: '0.95rem' }}>
                    <span>Total</span>
                    <span style={{ color: 'var(--primary)' }}>₹{total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Name + Phone row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label htmlFor="co-name">Full Name *</label>
                    <input id="co-name" type="text" className="form-control" required
                      placeholder="Rajesh Kumar"
                      value={details.name}
                      onChange={e => setDetails(d => ({ ...d, name: e.target.value }))} />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label htmlFor="co-phone">Mobile Number *</label>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.82rem', fontWeight: '700', color: '#6b7280' }}>+91</span>
                      <input id="co-phone" type="tel" className="form-control" required maxLength={10}
                        placeholder="9876543210"
                        style={{ paddingLeft: '36px' }}
                        value={details.phone}
                        onChange={e => setDetails(d => ({ ...d, phone: e.target.value.replace(/\D/g, '') }))} />
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="form-group" style={{ margin: 0 }}>
                  <label htmlFor="co-email">Email Address *</label>
                  <input id="co-email" type="email" className="form-control" required
                    placeholder="rajesh@example.com"
                    value={details.email}
                    onChange={e => setDetails(d => ({ ...d, email: e.target.value }))} />
                </div>

                {/* Address */}
                <div className="form-group" style={{ margin: 0 }}>
                  <label htmlFor="co-address">Delivery Address *</label>
                  <textarea id="co-address" className="form-control" required rows={3}
                    placeholder="House No., Street, Locality, City, State"
                    value={details.address}
                    onChange={e => setDetails(d => ({ ...d, address: e.target.value }))} />
                </div>

                {/* Pincode checker */}
                <div className="form-group" style={{ margin: 0 }}>
                  <label htmlFor="co-pin">
                    <MapPin size={13} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                    Pincode — Check Delivery Availability *
                  </label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input id="co-pin" type="text" className="form-control" maxLength={6}
                      placeholder="e.g. 400001"
                      value={details.pincode}
                      onChange={e => { setDetails(d => ({ ...d, pincode: e.target.value.replace(/\D/, '') })); setPincodeResult(null); }} />
                    <button type="button" className="btn"
                      onClick={handlePincodeCheck}
                      style={{ flexShrink: 0, background: '#1f2937', color: '#fff', padding: '0 1rem', borderRadius: '7px', fontWeight: '700', fontSize: '0.8rem', cursor: 'pointer' }}>
                      Check
                    </button>
                  </div>
                  {pincodeResult && (
                    <p style={{ marginTop: '0.4rem', fontSize: '0.78rem', fontWeight: '700', color: pincodeResult.ok ? '#16a34a' : '#dc2626' }}>
                      {pincodeResult.msg}
                    </p>
                  )}
                </div>

              </div>
            </form>
          )}

          {/* ═══ STEP 2: PAYMENT ═══ */}
          {step === 'payment' && (
            <form id="payment-form" onSubmit={handlePayNow}>
              <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                {/* Amount strip */}
                <div style={{ background: '#fff5f5', border: '1px solid rgba(220,38,38,0.2)', borderRadius: '10px', padding: '0.75rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.83rem', fontWeight: '600', color: '#4b5563' }}>Amount to Pay</span>
                  <span style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: '900', fontSize: '1.25rem', color: 'var(--primary)' }}>₹{total.toFixed(2)}</span>
                </div>

                {/* Payment method selector */}
                <div>
                  <p style={{ fontSize: '0.72rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6b7280', marginBottom: '0.6rem' }}>Payment Method</p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.6rem' }}>
                    {[
                      { id: 'upi',        icon: <Smartphone size={20} />, label: 'UPI' },
                      { id: 'card',       icon: <CreditCard size={20} />, label: 'Debit/Credit Card' },
                      { id: 'netbanking', icon: <Building2 size={20} />,  label: 'Net Banking' },
                    ].map(m => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setPaymentMethod(m.id)}
                        style={{
                          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem',
                          padding: '0.85rem 0.5rem', borderRadius: '10px', cursor: 'pointer',
                          border: paymentMethod === m.id ? '2px solid var(--primary)' : '1px solid #e5e7eb',
                          background: paymentMethod === m.id ? '#fff5f5' : '#fff',
                          color: paymentMethod === m.id ? 'var(--primary)' : '#6b7280',
                          fontWeight: '700', fontSize: '0.7rem', transition: 'all 0.15s',
                        }}
                      >
                        {m.icon}
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* UPI details */}
                {paymentMethod === 'upi' && (
                  <div style={{ animation: 'slideUp 0.2s ease' }}>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label htmlFor="upi-id">UPI ID *</label>
                      <input id="upi-id" type="text" className="form-control" required
                        placeholder="yourname@upi  (e.g. 9876543210@paytm)"
                        value={payDetails.upiId}
                        onChange={e => setPayDetails(d => ({ ...d, upiId: e.target.value }))} />
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
                      {['GPay', 'PhonePe', 'Paytm', 'BHIM'].map(app => (
                        <span key={app} style={{ fontSize: '0.72rem', fontWeight: '700', background: '#f3f4f6', padding: '0.3rem 0.65rem', borderRadius: '20px', color: '#374151' }}>{app}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Card details */}
                {paymentMethod === 'card' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', animation: 'slideUp 0.2s ease' }}>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label htmlFor="card-num">Card Number *</label>
                      <input id="card-num" type="text" className="form-control" required
                        placeholder="1234 5678 9012 3456" maxLength={19}
                        value={payDetails.cardNumber}
                        onChange={e => setPayDetails(d => ({ ...d, cardNumber: e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim() }))} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                      <div className="form-group" style={{ margin: 0 }}>
                        <label htmlFor="card-exp">Expiry *</label>
                        <input id="card-exp" type="text" className="form-control" required placeholder="MM/YY" maxLength={5}
                          value={payDetails.cardExpiry}
                          onChange={e => setPayDetails(d => ({ ...d, cardExpiry: e.target.value }))} />
                      </div>
                      <div className="form-group" style={{ margin: 0 }}>
                        <label htmlFor="card-cvv">CVV *</label>
                        <input id="card-cvv" type="password" className="form-control" required placeholder="•••" maxLength={4}
                          value={payDetails.cardCvv}
                          onChange={e => setPayDetails(d => ({ ...d, cardCvv: e.target.value.replace(/\D/g, '') }))} />
                      </div>
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label htmlFor="card-name">Name on Card *</label>
                      <input id="card-name" type="text" className="form-control" required placeholder="RAJESH KUMAR"
                        value={payDetails.cardName}
                        onChange={e => setPayDetails(d => ({ ...d, cardName: e.target.value.toUpperCase() }))} />
                    </div>
                  </div>
                )}

                {/* Net Banking */}
                {paymentMethod === 'netbanking' && (
                  <div style={{ animation: 'slideUp 0.2s ease' }}>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label htmlFor="bank-sel">Select Bank *</label>
                      <select id="bank-sel" className="form-control" value={payDetails.bank}
                        onChange={e => setPayDetails(d => ({ ...d, bank: e.target.value }))}>
                        <option value="sbi">State Bank of India (SBI)</option>
                        <option value="hdfc">HDFC Bank</option>
                        <option value="icici">ICICI Bank</option>
                        <option value="axis">Axis Bank</option>
                        <option value="kotak">Kotak Mahindra Bank</option>
                        <option value="pnb">Punjab National Bank</option>
                        <option value="bob">Bank of Baroda</option>
                        <option value="yes">Yes Bank</option>
                      </select>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.5rem' }}>
                      You will be redirected to your bank's secure portal to complete payment.
                    </p>
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.72rem', color: '#6b7280', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '0.5rem 0.75rem' }}>
                  <ShieldCheck size={14} style={{ color: '#16a34a', flexShrink: 0 }} />
                  256-bit SSL encrypted. Your payment info is 100% secure.
                </div>
              </div>
            </form>
          )}

          {/* ═══ STEP 3: PROCESSING ═══ */}
          {step === 'processing' && (
            <div style={{ padding: '3rem 1.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
              <div style={{ position: 'relative', width: 80, height: 80 }}>
                <div style={{
                  width: 80, height: 80, borderRadius: '50%',
                  border: '4px solid #f3f4f6',
                  borderTop: '4px solid var(--primary)',
                  animation: 'spin 0.9s linear infinite'
                }} />
                <Loader2 style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', color: 'var(--primary)' }} size={28} />
              </div>
              <div>
                <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: '800', fontSize: '1.1rem', color: '#1f2937' }}>
                  Processing Payment{processingDots}
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#9ca3af', marginTop: '0.4rem' }}>
                  Please do not close this window.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                {['Verifying payment', 'Confirming stock', 'Placing order'].map((t, i) => (
                  <span key={t} style={{ fontSize: '0.72rem', fontWeight: '600', background: '#f3f4f6', padding: '0.3rem 0.7rem', borderRadius: '20px', color: '#6b7280' }}>
                    ✓ {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* ═══ STEP 4: SUCCESS ═══ */}
          {step === 'success' && placedOrder && (
            <div style={{ padding: '2rem 1.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle size={40} style={{ color: '#16a34a' }} />
              </div>
              <div>
                <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: '900', fontSize: '1.3rem', color: '#1f2937' }}>Order Placed Successfully!</h3>
                <code style={{ display: 'block', color: 'var(--primary)', fontWeight: '700', marginTop: '0.3rem', fontSize: '0.9rem' }}>
                  {placedOrder.id}
                </code>
              </div>

              {/* Simulated SMS notification */}
              <div style={{ width: '100%', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '0.85rem 1rem', textAlign: 'left' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: '800', color: '#166534', marginBottom: '0.4rem' }}>
                  <MessageSquare size={14} /> SMS Confirmation Sent
                </div>
                <p style={{ fontSize: '0.78rem', color: '#374151', lineHeight: '1.5' }}>
                  <strong>DiecastXpress:</strong> Hi {placedOrder.customerName.split(' ')[0]}! Your order <strong>{placedOrder.id}</strong> for ₹{placedOrder.total.toFixed(2)} is confirmed. 
                  We'll pack it securely and ship it soon. Track your order on our website. Thank you! 🏎️
                </p>
                <p style={{ fontSize: '0.7rem', color: '#6b7280', marginTop: '0.3rem' }}>
                  → Sent to +91 {details.phone}
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', width: '100%' }}>
                {[
                  { icon: <PackageCheck size={14} />, label: 'Payment', value: 'Successful ✓' },
                  { icon: <ShieldCheck size={14} />,  label: 'Method',  value: paymentMethod.toUpperCase() },
                ].map(row => (
                  <div key={row.label} style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '0.65rem 0.85rem' }}>
                    <div style={{ fontSize: '0.68rem', color: '#9ca3af', fontWeight: '700', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.2rem' }}>
                      {row.icon} {row.label}
                    </div>
                    <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#1f2937' }}>{row.value}</div>
                  </div>
                ))}
              </div>

              <button className="btn btn-buy" style={{ width: '100%' }} onClick={onClose}>
                Continue Shopping
              </button>
            </div>
          )}

        </div>

        {/* ── FOOTER ACTIONS ── */}
        {(step === 'details' || step === 'payment') && (
          <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #e5e7eb', display: 'flex', gap: '0.75rem' }}>
            {step === 'details' && (
              <>
                <button
                  type="button"
                  className="btn btn-outline"
                  style={{ flex: '0 0 auto' }}
                  onClick={onBackToCart}
                >
                  <ArrowLeft size={15} /> Back to Cart
                </button>
                <button
                  type="submit"
                  form="details-form"
                  className="btn btn-buy"
                  style={{ flex: 1 }}
                >
                  Continue to Payment <ArrowRight size={15} />
                </button>
              </>
            )}
            {step === 'payment' && (
              <button
                type="submit"
                form="payment-form"
                className="btn btn-buy"
                style={{ width: '100%' }}
              >
                <ShieldCheck size={16} /> Pay ₹{total.toFixed(2)} Securely
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
