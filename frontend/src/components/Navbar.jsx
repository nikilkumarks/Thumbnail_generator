import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User as UserIcon, LogOut, Sparkles, Layout, Menu, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navRef = useRef(null);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  return (
    <nav ref={navRef} style={{ 
      height: '72px',
      background: 'rgba(10, 10, 10, 0.95)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '0 2rem',
      position: 'fixed', // Changed from sticky for absolute persistence
      top: 0,
      left: 0,
      right: 0,
      width: '100%',
      zIndex: 3500, // Elevated for total authority
      transition: 'all 0.3s ease'
    }} className="navbar-container">
      {/* Brand - Studio Logo */}
      <Link 
        to="/" 
        onClick={(e) => {
           if (window.location.pathname === '/') {
             e.preventDefault();
             window.location.reload();
           }
        }}
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          textDecoration: 'none', 
          gap: '10px',
          zIndex: 3600
        }}
      >
        <div style={{ color: 'var(--youtube-red)', position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Layout size={32} strokeWidth={2.5} className="logo-icon" />
          <Sparkles size={14} fill="currentColor" style={{ position: 'absolute', top: '-4px', right: '-6px' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span className="brand-text" style={{ fontSize: '0.9rem', fontWeight: '900', color: 'white', letterSpacing: '1px', lineHeight: '1' }}>PROMPT</span>
          <span className="brand-subtext" style={{ fontSize: '0.65rem', fontWeight: '700', color: 'var(--youtube-red)', letterSpacing: '2px', lineHeight: '1.2' }}>VISION PRO</span>
        </div>
      </Link>
      
      {/* Desktop Actions */}
      <div className="nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        {user ? (
          <div 
            onClick={toggleMobileMenu}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px',
              padding: '6px 14px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '24px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {user.picture ? (
                <img src={user.picture} alt="Profile" style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid var(--youtube-red)' }} />
              ) : (
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#212121', display: 'grid', placeItems: 'center' }}>
                  <UserIcon size={14} color="#888" />
                </div>
              )}
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'white' }}>{user.name?.split(' ')[0] || 'Creator'}</span>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <Link to="/login" style={{ color: 'white', textDecoration: 'none', fontWeight: '800', fontSize: '0.75rem', letterSpacing: '1px' }} className="hover-red-text">SIGN IN</Link>
            <Link to="/register" className="btn-primary" style={{ textDecoration: 'none', borderRadius: '24px', fontSize: '0.75rem', padding: '0.65rem 1.25rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={14} fill="currentColor" /> GET STARTED
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Trigger */}
      <button 
        onClick={toggleMobileMenu}
        style={{ 
          background: (user && !isMobileMenuOpen) ? 'transparent' : 'rgba(255, 255, 255, 0.05)', 
          border: (user && !isMobileMenuOpen) ? 'none' : '1px solid rgba(255, 255, 255, 0.1)', 
          color: 'white', 
          width: '40px', 
          height: '40px', 
          borderRadius: (user && !isMobileMenuOpen) ? '50%' : '12px', 
          display: 'none', 
          placeItems: 'center',
          cursor: 'pointer',
          zIndex: 3600,
          padding: 0,
          overflow: 'hidden'
        }}
        className="nav-mobile-trigger"
      >
        {isMobileMenuOpen ? (
          <X size={20} />
        ) : user ? (
          user.picture ? (
            <img src={user.picture} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover', border: '1px solid var(--youtube-red)', borderRadius: '50%' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', background: '#212121', display: 'grid', placeItems: 'center', border: '1px solid var(--youtube-red)', borderRadius: '50%' }}>
              <UserIcon size={18} color="#888" />
            </div>
          )
        ) : (
          <Menu size={20} />
        )}
      </button>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'absolute',
              top: '80px',
              right: '1.25rem',
              width: 'max-content',
              minWidth: '220px',
              background: '#111',
              border: '1px solid #222',
              borderRadius: '16px',
              zIndex: 3550,
              display: 'flex',
              flexDirection: 'column',
              padding: '1rem',
              boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
              transformOrigin: 'top right'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {user ? (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: '#0a0a0a', borderRadius: '12px', border: '1px solid #1A1A1A' }}>
                    {user.picture ? (
                      <img src={user.picture} alt="Avatar" style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid var(--youtube-red)' }} />
                    ) : (
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#212121', display: 'grid', placeItems: 'center' }}><UserIcon size={18} /></div>
                    )}
                    <div>
                      <h3 style={{ fontSize: '0.85rem', fontWeight: '800' }}>{user.name}</h3>
                      <p style={{ fontSize: '0.6rem', color: '#888', fontWeight: '700' }}>CREATOR</p>
                    </div>
                  </div>
                  <button onClick={() => { logout(); toggleMobileMenu(); }} style={{ padding: '0.75rem', borderRadius: '12px', background: '#1a1a1a', border: '1px solid #333', color: 'white', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.8rem', justifyContent: 'center' }}>
                    <LogOut size={16} /> SIGN OUT
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={toggleMobileMenu} style={{ padding: '0.75rem', borderRadius: '12px', background: '#1a1a1a', border: '1px solid #333', color: 'white', textDecoration: 'none', fontWeight: '800', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
                    SIGN IN <ArrowRight size={16} />
                  </Link>
                  <Link to="/register" onClick={toggleMobileMenu} style={{ padding: '0.75rem', borderRadius: '12px', background: 'var(--youtube-red)', border: 'none', color: 'white', textDecoration: 'none', fontWeight: '900', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
                    GET STARTED <Sparkles size={16} fill="currentColor" />
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 992px) {
          .nav-desktop { display: none !important; }
          .nav-mobile-trigger { display: grid !important; }
          .navbar-container { padding: 0 1.25rem !important; }
        }
        @media (max-width: 480px) {
          .brand-subtext { display: none; }
          .logo-icon { width: 28px !important; }
          .brand-text { font-size: 0.8rem !important; }
        }
        .logout-btn:hover { color: var(--youtube-red) !important; }
        .hover-red-text:hover { color: var(--youtube-red) !important; }
        .btn-primary:active { transform: scale(0.98); }
        .nav-mobile-trigger:active { transform: scale(0.9); }
      `}</style>
    </nav>
  );
};

export default Navbar;
