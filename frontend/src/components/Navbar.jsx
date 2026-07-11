import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { User as UserIcon, LogOut, Menu, X, ArrowRight, Sun, Moon, Activity } from 'lucide-react';
import BrandLogo from './BrandLogo';
import { motion, AnimatePresence } from 'framer-motion';

const STROKE = 2;

const Navbar = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };
    if (isMobileMenuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

  return (
    <nav ref={navRef} className="navbar">
      <Link
        to="/"
        onClick={(e) => {
          if (window.location.pathname === '/') {
            e.preventDefault();
            window.location.reload();
          }
        }}
        className="navbar-brand"
      >
        <div className="navbar-brand__mark">
          <BrandLogo size={22} />
        </div>
        <div>
          <div className="navbar-brand__name">PromptVision</div>
          <div className="navbar-brand__tag brand-subtext">Studio</div>
        </div>
      </Link>

      <div className="nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
        {user?.isAdmin && (
          <Link to="/admin" className="text-caption hover-red-text" style={{ color: '#aaa', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
            <Activity size={14} /> Admin
          </Link>
        )}
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <button type="button" className="btn-icon btn-icon--ghost" onClick={toggleTheme} title={isDark ? 'Light mode' : 'Dark mode'} aria-label="Toggle theme">
              {isDark ? <Sun size={18} strokeWidth={STROKE} /> : <Moon size={18} strokeWidth={STROKE} />}
            </button>
            <div className="navbar-user-pill" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {user.picture ? (
                <img src={user.picture} alt="" style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid rgba(255,0,0,0.4)' }} />
              ) : (
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#222', display: 'grid', placeItems: 'center' }}>
                  <UserIcon size={16} strokeWidth={STROKE} color="#888" />
                </div>
              )}
              <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{user.name?.split(' ')[0] || 'Creator'}</span>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
            <Link to="/login" className="text-caption hover-red-text" style={{ color: '#aaa', textDecoration: 'none' }}>Sign In</Link>
            <Link to="/register" className="btn-primary" style={{ textDecoration: 'none', fontSize: '0.8rem', padding: '0.6rem 1.25rem' }}>
              Get Started
            </Link>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="btn-icon btn-icon--ghost nav-mobile-trigger"
        style={{ width: 40, height: 40, display: 'none', placeItems: 'center', padding: 0, overflow: 'hidden', borderRadius: user && !isMobileMenuOpen ? '50%' : undefined }}
        aria-label="Menu"
      >
        {isMobileMenuOpen ? <X size={20} strokeWidth={STROKE} /> : user?.picture ? (
          <img src={user.picture} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
        ) : user ? (
          <UserIcon size={18} strokeWidth={STROKE} />
        ) : (
          <Menu size={20} strokeWidth={STROKE} />
        )}
      </button>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            className="navbar-dropdown"
          >
            {user ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                <div style={{ padding: 'var(--space-3)', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)' }}>
                  <p className="text-h4">{user.name}</p>
                  <p className="text-caption" style={{ marginTop: 4 }}>Creator</p>
                </div>
                {user.isAdmin && (
                  <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="btn-secondary" style={{ textDecoration: 'none' }}>
                    <Activity size={16} strokeWidth={STROKE} /> Admin dashboard
                  </Link>
                )}
                <button type="button" onClick={() => { toggleTheme(); setIsMobileMenuOpen(false); }} className="btn-secondary" style={{ width: '100%' }}>
                  {isDark ? <Sun size={16} strokeWidth={STROKE} /> : <Moon size={16} strokeWidth={STROKE} />}
                  {isDark ? 'Light mode' : 'Dark mode'}
                </button>
                <button type="button" onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="btn-secondary" style={{ width: '100%' }}>
                  <LogOut size={16} strokeWidth={STROKE} /> Sign Out
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="btn-secondary" style={{ textDecoration: 'none', justifyContent: 'space-between' }}>
                  Sign In <ArrowRight size={16} strokeWidth={STROKE} />
                </Link>
                <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="btn-primary" style={{ textDecoration: 'none', justifyContent: 'space-between' }}>
                  Get Started <ArrowRight size={16} strokeWidth={STROKE} />
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
