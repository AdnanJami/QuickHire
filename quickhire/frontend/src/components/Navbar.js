import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      background: scrolled ? 'rgba(255,255,255,0.97)' : 'white',
      boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.08)' : '0 1px 0 #F3F4F6',
      backdropFilter: scrolled ? 'blur(10px)' : 'none',
      transition: 'all 0.3s ease',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72 }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, #2B4EFF, #6B8AFF)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ color: 'white', fontFamily: 'Syne', fontWeight: 800, fontSize: 16 }}>Q</span>
            </div>
            <span style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 20, color: '#1A1A2E' }}>
              Quick<span style={{ color: '#2B4EFF' }}>Hire</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }} className="desktop-nav">
            <Link
              to="/"
              style={{
                fontWeight: 500,
                fontSize: 15,
                color: location.pathname === '/' ? '#2B4EFF' : '#374151',
                transition: 'color 0.2s',
              }}
            >
              Find Jobs
            </Link>
            <Link
              to="/jobs"
              style={{
                fontWeight: 500,
                fontSize: 15,
                color: location.pathname === '/jobs' ? '#2B4EFF' : '#374151',
                transition: 'color 0.2s',
              }}
            >
              Browse Companies
            </Link>
          </div>

          {/* Auth Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }} className="desktop-nav">
            <Link to="/admin">
              <button style={{
                background: 'transparent',
                border: '1.5px solid #E5E7EB',
                borderRadius: 8,
                padding: '9px 20px',
                fontSize: 14,
                fontWeight: 600,
                color: '#374151',
                cursor: 'pointer',
                fontFamily: 'DM Sans',
                transition: 'all 0.2s',
              }}>
                Admin
              </button>
            </Link>
            <Link to="/jobs">
              <button className="btn-primary" style={{ padding: '9px 20px', fontSize: 14 }}>
                Find Jobs
              </button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'none' }}
            className="mobile-menu-btn"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div style={{
          background: 'white',
          borderTop: '1px solid #F3F4F6',
          padding: 20,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}>
          <Link to="/" onClick={() => setMobileOpen(false)} style={{ fontWeight: 500, color: '#374151' }}>Find Jobs</Link>
          <Link to="/jobs" onClick={() => setMobileOpen(false)} style={{ fontWeight: 500, color: '#374151' }}>Browse All Jobs</Link>
          <Link to="/admin" onClick={() => setMobileOpen(false)} style={{ fontWeight: 500, color: '#374151' }}>Admin Panel</Link>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
