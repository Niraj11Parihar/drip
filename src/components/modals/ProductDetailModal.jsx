import React from 'react';
import { X, ShoppingCart, Tag, Box } from 'lucide-react';

const ProductDetailModal = ({ isOpen, onClose, product, onAddToCart }) => {
  if (!isOpen || !product) return null;

  return (
    <div className="modal-overlay" style={{ zIndex: 600 }}>
      <div className="modal-content" style={{ maxWidth: '680px' }}>
        <div className="modal-header">
          <h2>Product Details</h2>
          <button className="qty-btn" onClick={onClose} style={{ border: 'none' }}>
            <X size={20} />
          </button>
        </div>
        
        <div className="modal-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '1.5rem', padding: '1.5rem' }}>
          <div>
            <img
              src={product.images?.[0]?.url || product.imageUrl || 'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?q=80&w=600&auto=format&fit=crop'}
              alt={product.name}
              style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '12px', border: '1px solid var(--border)' }}
            />
            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <Tag size={14} style={{ color: 'var(--primary)' }} />
                <span>Category: <strong>{product.category}</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <Box size={14} style={{ color: 'var(--primary)' }} />
                <span>Stock: <strong>{product.stock > 0 ? `${product.stock} units` : 'Out of stock'}</strong></span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '800', lineHeight: '1.2' }}>{product.name}</h3>
              <p style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-main)', fontFamily: 'var(--font-title)' }}>
                ${product.price.toFixed(2)}
              </p>
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
                <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Description</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                  {product.description || 'No description provided.'}
                </p>
              </div>
            </div>

            <button
              className="btn btn-buy"
              onClick={() => {
                onAddToCart(product);
                onClose();
              }}
              style={{ width: '100%', marginTop: '1.5rem' }}
              disabled={product.stock === 0}
            >
              <ShoppingCart size={18} /> {product.stock === 0 ? 'Out of stock' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
