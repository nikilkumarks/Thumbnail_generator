import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User as UserIcon, LogOut, Video, Sparkles, ChevronDown, Layout } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav style={{ 
      height: '72px',
      background: 'rgba(15, 15, 15, 0.85)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '0 2rem',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
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
          gap: '12px',
          padding: '0.4rem 0'
        }}
      >
        <div style={{ 
          color: 'var(--youtube-red)',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {/* Main Logo Icon: A Play Button frame with Sparks (Flat) */}
          <Layout size={38} strokeWidth={2.5} />
          <Sparkles 
            size={18} 
            fill="currentColor" 
            style={{ 
              position: 'absolute', 
              top: '-4px', 
              right: '-6px'
            }} 
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ 
            fontSize: '1rem', 
            fontWeight: '900', 
            color: 'white', 
            letterSpacing: '1px',
            lineHeight: '1'
          }}>PROMPT</span>
          <span style={{ 
            fontSize: '0.75rem', 
            fontWeight: '600', 
            color: 'var(--youtube-red)', 
            letterSpacing: '3px',
            lineHeight: '1.2'
          }}>VISION PRO</span>
        </div>
      </Link>
      
      {/* Right Actions - Account & Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
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
                <img 
                  src={user.picture} 
                  alt="Profile" 
                  style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid var(--youtube-red)' }} 
                />
              ) : (
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#212121', display: 'grid', placeItems: 'center' }}>
                  <UserIcon size={16} color="#888" />
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.8125rem', fontWeight: '700', color: 'white' }}>{user.name || 'Creator'}</span>
                <span style={{ fontSize: '0.625rem', color: '#888', fontWeight: '500' }}>Active</span>
              </div>
            </div>
            
            <div style={{ width: '1px', height: '20px', background: 'rgba(255, 255, 255, 0.1)', marginLeft: '4px' }}></div>
            
            <button 
              onClick={logout}
              style={{ 
                background: 'transparent', 
                color: '#888', 
                border: 'none',
                display: 'flex', 
                alignItems: 'center',
                cursor: 'pointer'
              }}
              className="logout-btn"
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
            <Link to="/login" style={{ 
              color: 'white', 
              textDecoration: 'none', 
              fontWeight: '700', 
              fontSize: '0.8125rem' 
            }} className="hover:text-red transition">SIGN IN</Link>
            
            <Link to="/register" className="btn-primary" style={{ 
              textDecoration: 'none', 
              borderRadius: '24px', 
              fontSize: '0.8125rem',
              padding: '0.75rem 1.5rem',
              fontWeight: '800',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Sparkles size={14} fill="currentColor" /> GET STARTED
            </Link>
          </div>
        )}
      </div>

      <style>{`
        .logout-btn:hover { color: var(--youtube-red) !important; }
        .hover:text-red:hover { color: var(--youtube-red) !important; }
        .btn-primary:hover { opacity: 0.9; }
        .transition { transition: all 0.2s ease-in-out; }
      `}</style>
    </nav>
  );
};

export default Navbar;
