import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Eye, ArrowRight, Tag, BookOpen, Flame, Star, Search, ChevronRight, Home } from 'lucide-react';
import Header from '../components/common/Header';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const CATEGORY_COLORS = {
  'Hot Wheels': { bg: '#dc2626', light: '#fef2f2', text: '#991b1b' },
  'Majorette':  { bg: '#7c3aed', light: '#f5f3ff', text: '#5b21b6' },
  'Matchbox':   { bg: '#0891b2', light: '#ecfeff', text: '#155e75' },
  'Collecting Tips': { bg: '#d97706', light: '#fffbeb', text: '#92400e' },
  'New Arrivals': { bg: '#059669', light: '#ecfdf5', text: '#065f46' },
  'Reviews':    { bg: '#db2777', light: '#fdf2f8', text: '#9d174d' },
  'Events':     { bg: '#ea580c', light: '#fff7ed', text: '#9a3412' },
  'General':    { bg: '#6b7280', light: '#f9fafb', text: '#374151' },
};

const CATEGORIES = ['All', 'Hot Wheels', 'Majorette', 'Matchbox', 'Collecting Tips', 'New Arrivals', 'Reviews', 'Events', 'General'];

// Format date nicely
const fmtDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

// ── Featured Hero Card ────────────────────────────────────────────────────
function FeaturedCard({ post, onClick }) {
  const col = CATEGORY_COLORS[post.category] || CATEGORY_COLORS.General;
  return (
    <article
      onClick={onClick}
      style={{
        borderRadius: '20px', overflow: 'hidden', cursor: 'pointer', position: 'relative',
        minHeight: '420px', display: 'flex', alignItems: 'flex-end',
        background: post.coverImage ? `url(${post.coverImage}) center/cover` : 'linear-gradient(135deg,#1f2937,#111827)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.01)'; e.currentTarget.style.boxShadow = '0 30px 80px rgba(0,0,0,0.4)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.3)'; }}
    >
      {/* Gradient overlay */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0) 100%)' }} />
      
      {/* Featured badge */}
      <div style={{ position: 'absolute', top: '20px', left: '20px', display: 'flex', gap: '0.5rem' }}>
        <span style={{ background: '#f59e0b', color: '#111', fontSize: '0.7rem', fontWeight: '800', padding: '0.3rem 0.75rem', borderRadius: '999px', display: 'flex', alignItems: 'center', gap: '0.3rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          <Star size={11} fill="currentColor" /> Featured
        </span>
        <span style={{ background: col.bg, color: '#fff', fontSize: '0.7rem', fontWeight: '700', padding: '0.3rem 0.75rem', borderRadius: '999px', letterSpacing: '0.03em' }}>
          {post.category}
        </span>
      </div>

      {/* Content */}
      <div style={{ position: 'relative', padding: '2rem', zIndex: 1, width: '100%' }}>
        <h2 style={{ fontFamily: 'Montserrat,sans-serif', fontSize: 'clamp(1.3rem,3vw,2rem)', fontWeight: '900', color: '#fff', lineHeight: '1.2', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
          {post.title}
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.75)', marginBottom: '1.25rem', lineHeight: '1.6', maxWidth: '640px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {post.excerpt}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Clock size={13} /> {post.readTime} min read
          </span>
          <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Eye size={13} /> {post.views || 0} views
          </span>
          <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>✍ {post.author}</span>
          <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginLeft: 'auto' }}>{fmtDate(post.createdAt)}</span>
        </div>
        <div style={{ marginTop: '1.25rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'var(--primary, #dc2626)', color: '#fff', padding: '0.65rem 1.4rem', borderRadius: '8px', fontWeight: '700', fontSize: '0.85rem' }}>
          Read Article <ArrowRight size={15} />
        </div>
      </div>
    </article>
  );
}

// ── Blog Card ─────────────────────────────────────────────────────────────
function BlogCard({ post, onClick }) {
  const col = CATEGORY_COLORS[post.category] || CATEGORY_COLORS.General;
  return (
    <article
      onClick={onClick}
      style={{
        background: '#fff', border: '1px solid #e5e7eb', borderRadius: '16px', overflow: 'hidden',
        cursor: 'pointer', transition: 'all 0.3s ease', display: 'flex', flexDirection: 'column',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 36px rgba(0,0,0,0.12)'; e.currentTarget.style.borderColor = col.bg + '40'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)'; e.currentTarget.style.borderColor = '#e5e7eb'; }}
    >
      {/* Image */}
      <div style={{ height: '200px', overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
        {post.coverImage ? (
          <img src={post.coverImage} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'} />
        ) : (
          <div style={{ width: '100%', height: '100%', background: `linear-gradient(135deg, ${col.bg}30, ${col.bg}10)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BookOpen size={48} style={{ color: col.bg, opacity: 0.3 }} />
          </div>
        )}
        <span style={{ position: 'absolute', top: '12px', left: '12px', background: col.bg, color: '#fff', fontSize: '0.65rem', fontWeight: '800', padding: '0.25rem 0.6rem', borderRadius: '999px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          {post.category}
        </span>
      </div>

      {/* Body */}
      <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.72rem', color: '#9ca3af' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={11} /> {post.readTime} min</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Eye size={11} /> {post.views || 0}</span>
        </div>
        <h3 style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: '800', fontSize: '1rem', color: '#111827', lineHeight: '1.35', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {post.title}
        </h3>
        <p style={{ fontSize: '0.82rem', color: '#6b7280', lineHeight: '1.6', flex: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {post.excerpt}
        </p>
        {post.tags?.length > 0 && (
          <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
            {post.tags.slice(0, 3).map(tag => (
              <span key={tag} style={{ background: col.light, color: col.text, fontSize: '0.65rem', fontWeight: '700', padding: '0.2rem 0.5rem', borderRadius: '4px', border: `1px solid ${col.bg}30` }}>
                #{tag}
              </span>
            ))}
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid #f3f4f6', marginTop: 'auto' }}>
          <span style={{ fontSize: '0.72rem', color: '#9ca3af' }}>✍ {post.author} · {fmtDate(post.createdAt)}</span>
          <span style={{ color: col.bg, fontWeight: '700', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
            Read <ArrowRight size={12} />
          </span>
        </div>
      </div>
    </article>
  );
}

// ── Full Article View ─────────────────────────────────────────────────────
function ArticleView({ post, onBack, relatedPosts }) {
  const col = CATEGORY_COLORS[post.category] || CATEGORY_COLORS.General;
  const navigate = useNavigate();

  // Render simple markdown-like content
  const renderContent = (text) => {
    if (!text) return null;
    return text.replace(/\r\n/g, '\n').split('\n').map((line, i) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('# ')) return <h1 key={i} style={{ fontFamily: 'Montserrat,sans-serif', fontSize: '2rem', fontWeight: '900', color: '#111827', margin: '2rem 0 1rem', lineHeight: '1.2' }}>{trimmed.slice(2)}</h1>;
      if (trimmed.startsWith('## ')) return <h2 key={i} style={{ fontFamily: 'Montserrat,sans-serif', fontSize: '1.5rem', fontWeight: '800', color: '#1f2937', margin: '1.75rem 0 0.75rem', borderBottom: `3px solid ${col.bg}`, paddingBottom: '0.4rem', display: 'inline-block' }}>{trimmed.slice(3)}</h2>;
      if (trimmed.startsWith('### ')) return <h3 key={i} style={{ fontFamily: 'Montserrat,sans-serif', fontSize: '1.15rem', fontWeight: '800', color: '#374151', margin: '1.25rem 0 0.5rem' }}>{trimmed.slice(4)}</h3>;
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) return <li key={i} style={{ marginBottom: '0.4rem', color: '#374151', lineHeight: '1.7' }}>{trimmed.slice(2)}</li>;
      if (trimmed.startsWith('> ')) return <blockquote key={i} style={{ borderLeft: `4px solid ${col.bg}`, paddingLeft: '1rem', margin: '1.25rem 0', color: '#6b7280', fontStyle: 'italic', fontSize: '1.05rem' }}>{trimmed.slice(2)}</blockquote>;
      if (trimmed.startsWith('**') && trimmed.endsWith('**')) return <p key={i} style={{ fontWeight: '800', color: '#111827', margin: '0.5rem 0', lineHeight: '1.7' }}>{trimmed.slice(2, -2)}</p>;
      if (trimmed === '') return <div key={i} style={{ height: '0.75rem' }} />;
      return <p key={i} style={{ color: '#374151', lineHeight: '1.85', margin: '0.4rem 0', fontSize: '1rem' }}>{line}</p>;
    });
  };

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ background: '#f8f9fa', borderBottom: '1px solid #e5e7eb', padding: '0.65rem 0' }}>
        <div className="container">
          <nav style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: '#6b7280' }}>
            <span style={{ cursor: 'pointer', color: 'var(--primary)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.25rem' }} onClick={() => navigate('/')}><Home size={12} /> Home</span>
            <ChevronRight size={12} />
            <span style={{ cursor: 'pointer', color: 'var(--primary)', fontWeight: '600' }} onClick={onBack}>Blog</span>
            <ChevronRight size={12} />
            <span style={{ color: '#374151', fontWeight: '600' }}>{post.title.slice(0, 40)}{post.title.length > 40 ? '...' : ''}</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      {post.coverImage && (
        <div style={{ height: '420px', overflow: 'hidden', position: 'relative' }}>
          <img src={post.coverImage} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0) 40%, rgba(0,0,0,0.7) 100%)' }} />
        </div>
      )}

      <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>

          {/* Meta header */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '1.25rem' }}>
            <span style={{ background: col.bg, color: '#fff', fontSize: '0.72rem', fontWeight: '800', padding: '0.3rem 0.75rem', borderRadius: '999px' }}>{post.category}</span>
            {post.tags?.map(t => (
              <span key={t} style={{ background: col.light, color: col.text, fontSize: '0.68rem', fontWeight: '700', padding: '0.25rem 0.6rem', borderRadius: '4px', border: `1px solid ${col.bg}30` }}>#{t}</span>
            ))}
          </div>

          <h1 style={{ fontFamily: 'Montserrat,sans-serif', fontSize: 'clamp(1.75rem,4vw,2.75rem)', fontWeight: '900', color: '#111827', lineHeight: '1.15', letterSpacing: '-0.02em', marginBottom: '1rem' }}>
            {post.title}
          </h1>

          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center', paddingBottom: '1.5rem', borderBottom: '2px solid #f3f4f6', marginBottom: '2rem', fontSize: '0.83rem', color: '#6b7280' }}>
            <span style={{ fontWeight: '700', color: '#374151' }}>✍ {post.author}</span>
            <span><Clock size={13} style={{ display: 'inline', marginRight: '0.25rem' }} />{post.readTime} min read</span>
            <span><Eye size={13} style={{ display: 'inline', marginRight: '0.25rem' }} />{post.views || 0} views</span>
            <span style={{ marginLeft: 'auto' }}>{fmtDate(post.createdAt)}</span>
          </div>

          {/* Excerpt highlight */}
          {post.excerpt && (
            <div style={{ background: `${col.bg}08`, borderLeft: `4px solid ${col.bg}`, padding: '1rem 1.25rem', borderRadius: '0 10px 10px 0', marginBottom: '2rem', fontSize: '1.05rem', color: '#374151', lineHeight: '1.7', fontStyle: 'italic' }}>
              {post.excerpt}
            </div>
          )}

          {/* Content */}
          <div style={{ fontSize: '1rem', lineHeight: '1.85', color: '#374151' }}>
            {post.content ? renderContent(post.content) : (
              <p style={{ color: '#9ca3af', textAlign: 'center', padding: '2rem 0' }}>No content available for this post.</p>
            )}
          </div>

          {/* Back button */}
          <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '2px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <button
              onClick={onBack}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f3f4f6', border: 'none', borderRadius: '8px', padding: '0.75rem 1.25rem', fontWeight: '700', cursor: 'pointer', fontSize: '0.85rem', color: '#374151' }}
            >
              ← Back to Blog
            </button>
            <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.8rem', color: '#6b7280' }}>
              <span>Share:</span>
              {['WhatsApp', 'Instagram', 'Facebook'].map(s => (
                <span key={s} style={{ background: '#f3f4f6', padding: '0.3rem 0.6rem', borderRadius: '5px', cursor: 'pointer', fontWeight: '600', fontSize: '0.72rem' }}>{s}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Related posts */}
        {relatedPosts.length > 0 && (
          <div style={{ marginTop: '4rem', paddingTop: '2.5rem', borderTop: '2px solid #f3f4f6' }}>
            <h2 style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: '800', fontSize: '1.4rem', color: '#111827', marginBottom: '1.5rem' }}>
              More Articles <span style={{ color: col.bg }}>You'll Love</span>
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px,1fr))', gap: '1.25rem' }}>
              {relatedPosts.map(p => <BlogCard key={p.id} post={p} onClick={() => onBack(p)} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main BlogPage ─────────────────────────────────────────────────────────
export default function BlogPage({ cartItemCount, onOpenCart }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [openPost, setOpenPost] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Diecast Blog – Hot Wheels Collecting Tips & News | DiecastXpress';
    fetch(`${API}/api/blogs`)
      .then(r => r.json())
      .then(data => setPosts(Array.isArray(data) ? data : []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (openPost) {
      document.title = `${openPost.title} | DiecastXpress Blog`;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      document.title = 'Diecast Blog – Hot Wheels Collecting Tips & News | DiecastXpress';
    }
  }, [openPost]);

  const filtered = posts.filter(p => {
    const matchCat = activeCategory === 'All' || p.category === activeCategory;
    const q = search.toLowerCase();
    const matchQ = !q || p.title.toLowerCase().includes(q) || (p.excerpt || '').toLowerCase().includes(q);
    return matchCat && matchQ;
  });

  const featured = filtered.find(p => p.featured);
  const regularPosts = filtered.filter(p => !p.featured || openPost);

  const handleOpenPost = async (post) => {
    try {
      const res = await fetch(`${API}/api/blogs/${post.slug}`);
      if (res.ok) {
        const fullPost = await res.json();
        setOpenPost(fullPost);
      } else {
        setOpenPost(post);
      }
    } catch (err) {
      console.error('Error fetching full blog post:', err);
      setOpenPost(post);
    }
  };

  const handleBack = (post) => {
    if (post && post.id) {
      handleOpenPost(post);
      return;
    }
    setOpenPost(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const relatedPosts = openPost
    ? posts.filter(p => p.id !== openPost.id && (p.category === openPost.category || p.featured)).slice(0, 3)
    : [];

  return (
    <>
      <Header cartItemCount={cartItemCount} onOpenCart={onOpenCart} />

      {openPost ? (
        <ArticleView post={openPost} onBack={handleBack} relatedPosts={relatedPosts} />
      ) : (
        <>
          {/* ── PAGE HERO ── */}
          <div style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
            padding: '4rem 0 3rem', textAlign: 'center', position: 'relative', overflow: 'hidden'
          }}>
            {/* Background racing stripes */}
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(45deg, rgba(220,38,38,0.03) 0px, rgba(220,38,38,0.03) 1px, transparent 1px, transparent 40px)', pointerEvents: 'none' }} />
            <div className="container" style={{ position: 'relative' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(220,38,38,0.15)', border: '1px solid rgba(220,38,38,0.3)', borderRadius: '999px', padding: '0.4rem 1rem', fontSize: '0.75rem', fontWeight: '700', color: '#f87171', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
                <Flame size={13} /> Collector's Journal
              </div>
              <h1 style={{ fontFamily: 'Montserrat,sans-serif', fontSize: 'clamp(2rem,5vw,3.5rem)', fontWeight: '900', color: '#fff', lineHeight: '1.1', letterSpacing: '-0.03em', marginBottom: '1rem' }}>
                DiecastXpress <span style={{ color: '#dc2626' }}>Blog</span>
              </h1>
              <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.6)', maxWidth: '520px', margin: '0 auto 2rem', lineHeight: '1.65' }}>
                Collecting guides, news, reviews & tips for Hot Wheels fans and diecast collectors across India.
              </p>
              {/* Search */}
              <div style={{ maxWidth: '440px', margin: '0 auto', position: 'relative' }}>
                <Search style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }} size={17} />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{ width: '100%', padding: '0.85rem 1rem 0.85rem 2.75rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.07)', color: '#fff', fontSize: '0.9rem', backdropFilter: 'blur(6px)', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              {/* Stats bar */}
              <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', marginTop: '2rem', flexWrap: 'wrap' }}>
                {[
                  { label: 'Articles', value: posts.length },
                  { label: 'Categories', value: CATEGORIES.length - 1 },
                  { label: 'Total Reads', value: posts.reduce((s, p) => s + (p.views || 0), 0).toLocaleString() },
                ].map(s => (
                  <div key={s.label} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#dc2626', fontFamily: 'Montserrat,sans-serif' }}>{s.value}</div>
                    <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── CATEGORY PILLS ── */}
          <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '0.75rem 0', position: 'sticky', top: 0, zIndex: 40, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <div className="container">
              <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '2px', scrollbarWidth: 'none' }}>
                {CATEGORIES.map(cat => {
                  const isActive = activeCategory === cat;
                  const col = cat !== 'All' ? CATEGORY_COLORS[cat] : null;
                  return (
                    <button key={cat} onClick={() => setActiveCategory(cat)} style={{
                      flexShrink: 0, padding: '0.45rem 1rem', borderRadius: '999px', border: '1px solid',
                      fontWeight: '700', fontSize: '0.78rem', cursor: 'pointer', transition: 'all 0.2s',
                      background: isActive ? (col?.bg || '#111827') : 'transparent',
                      color: isActive ? '#fff' : '#6b7280',
                      borderColor: isActive ? (col?.bg || '#111827') : '#e5e7eb',
                      whiteSpace: 'nowrap',
                    }}>
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── CONTENT ── */}
          <div style={{ background: '#f8f9fa', minHeight: '60vh', paddingBottom: '5rem' }}>
            <div className="container" style={{ paddingTop: '3rem' }}>

              {loading ? (
                <div style={{ textAlign: 'center', padding: '5rem 0', color: '#9ca3af' }}>
                  <BookOpen size={48} style={{ margin: '0 auto 1rem', opacity: 0.2 }} />
                  <p style={{ fontWeight: '600' }}>Loading articles...</p>
                </div>
              ) : filtered.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '5rem 0', background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb', color: '#9ca3af' }}>
                  <BookOpen size={48} style={{ margin: '0 auto 1rem', opacity: 0.2 }} />
                  <h3 style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: '700', color: '#374151' }}>No articles found</h3>
                  <p style={{ marginTop: '0.25rem', fontSize: '0.88rem' }}>Try a different search or category</p>
                  <button onClick={() => { setSearch(''); setActiveCategory('All'); }} style={{ marginTop: '1.25rem', padding: '0.6rem 1.5rem', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontSize: '0.85rem' }}>
                    View All Posts
                  </button>
                </div>
              ) : (
                <>
                  {/* Featured hero */}
                  {featured && !search && (
                    <div style={{ marginBottom: '2.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                        <Star size={16} style={{ color: '#f59e0b' }} />
                        <span style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#f59e0b' }}>Featured</span>
                      </div>
                      <FeaturedCard post={featured} onClick={() => handleOpenPost(featured)} />
                    </div>
                  )}

                  {/* Section label */}
                  {regularPosts.length > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                      <BookOpen size={16} style={{ color: '#dc2626' }} />
                      <span style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#374151' }}>
                        {search || activeCategory !== 'All' ? `${filtered.length} Articles Found` : 'Latest Articles'}
                      </span>
                    </div>
                  )}

                  {/* Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px,1fr))', gap: '1.5rem' }}>
                    {(search || !featured ? filtered : regularPosts).map(post => (
                      <BlogCard key={post.id} post={post} onClick={() => handleOpenPost(post)} />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="footer-inner">
          <p style={{ color: '#fff', fontWeight: '900', fontSize: '1.4rem', marginBottom: '0.5rem', fontFamily: 'Montserrat, sans-serif' }}>
            Diecast<span style={{ color: 'var(--primary)' }}>Xpress</span>
          </p>
          <p style={{ fontSize: '0.82rem', color: '#9ca3af', marginBottom: '1rem' }}>
            India's Premier Destination for Hot Wheels & Diecast Collectibles
          </p>
          <div className="footer-links">
            <a href="/">Home</a>
            <a href="/#catalog-section">Collections</a>
            <a href="/blog">Blog</a>
            <a href="#contact">Contact</a>
          </div>
          <p style={{ fontSize: '0.72rem', opacity: 0.5, marginTop: '1rem' }}>
            © {new Date().getFullYear()} DiecastXpress. All Rights Reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
