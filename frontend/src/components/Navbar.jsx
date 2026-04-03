import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User as UserIcon, LogOut, Sparkles, Layout, Menu, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  // Disable body scroll when mobile menu is active
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  return (
    <nav style={{ 
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
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px',
            padding: '6px 14px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '24px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
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
            <div style={{ width: '1px', height: '16px', background: 'rgba(255, 255, 255, 0.1)' }}></div>
            <button onClick={logout} style={{ background: 'transparent', color: '#888', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }} className="logout-btn">
              <LogOut size={16} />
            </button>
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
          background: 'rgba(255, 255, 255, 0.05)', 
          border: '1px solid rgba(255, 255, 255, 0.1)', 
          color: 'white', 
          width: '44px', 
          height: '44px', 
          borderRadius: '12px', 
          display: 'none', 
          placeItems: 'center',
          cursor: 'pointer',
          zIndex: 3600
        }}
        className="nav-mobile-trigger"
      >
        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile Slide Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              width: '100%',
              maxWidth: '320px',
              height: '100dvh',
              background: '#0A0A0A',
              borderLeft: '1px solid #1A1A1A',
              zIndex: 3550,
              display: 'flex',
              flexDirection: 'column',
              padding: '6rem 1.5rem 2rem',
              boxShadow: '-20px 0 60px rgba(0,0,0,0.8)'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {user ? (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', background: '#0F0F0F', borderRadius: '20px', border: '1px solid #1A1A1A' }}>
                    {user.picture ? (
                      <img src={user.picture} alt="Avatar" style={{ width: '44px', height: '44px', borderRadius: '50%', border: '2px solid var(--youtube-red)' }} />
                    ) : (
                      <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#212121', display: 'grid', placeItems: 'center' }}><UserIcon size={24} /></div>
                    )}
                    <div>
                      <h3 style={{ fontSize: '1rem', fontWeight: '900' }}>{user.name}</h3>
                      <p style={{ fontSize: '0.65rem', color: '#888', fontWeight: '700' }}>CREATOR ACTIVE</p>
                    </div>
                  </div>
                  <button onClick={() => { logout(); toggleMobileMenu(); }} style={{ padding: '1.25rem', borderRadius: '16px', background: '#111', border: '1px solid #222', color: 'white', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}>
                    <LogOut size={20} /> SIGN OUT
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={toggleMobileMenu} style={{ padding: '1.25rem', borderRadius: '16px', background: '#111', border: '1px solid #222', color: 'white', textDecoration: 'none', fontWeight: '800', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    SIGN IN <ArrowRight size={20} />
                  </Link>
                  <Link to="/register" onClick={toggleMobileMenu} style={{ padding: '1.25rem', borderRadius: '16px', background: 'var(--youtube-red)', border: 'none', color: 'white', textDecoration: 'none', fontWeight: '900', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    GET STARTED <Sparkles size={20} fill="currentColor" />
                  </Link>
                </>
              )}
            </div>

            <div style={{ marginTop: 'auto', textAlign: 'center', opacity: 0.15 }}>
              <p style={{ fontSize: '0.6rem', fontWeight: '800', color: 'white', letterSpacing: '2px' }}>PROMPTVISION STUDIOS v2.4</p>
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
