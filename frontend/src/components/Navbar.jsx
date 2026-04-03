import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User as UserIcon, LogOut, Video } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav style={{ 
      height: '64px',
      background: 'var(--youtube-black)',
      borderBottom: '1px solid var(--border)',
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '0 1.5rem',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      {/* Brand */}
      <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', gap: '8px' }}>
        <div style={{ color: 'var(--youtube-red)' }}>
          {/* Using a standard generic icon instead of Youtube that failed export */}
          <Video size={36} fill="currentColor" strokeWidth={0} />
        </div>
        <span style={{ fontSize: '1.25rem', fontWeight: '900', color: 'white', letterSpacing: '-0.5px' }}>THUMBNAIL STUDIO</span>
      </Link>
      
      {/* Right Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {user.picture ? (
                <img src={user.picture} alt="Profile" style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid var(--border)' }} />
              ) : (
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#2A2A2A', display: 'grid', placeItems: 'center' }}>
                  <UserIcon size={16} />
                </div>
              )}
              <span style={{ fontSize: '0.875rem', fontWeight: '500', color: 'white' }}>{user.name}</span>
            </div>
            <button 
              onClick={logout}
              style={{ background: 'transparent', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <LogOut size={18} />
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link to="/login" style={{ color: 'white', textDecoration: 'none', fontWeight: '700', fontSize: '0.875rem', padding: '0.6rem 1.25rem' }}>SIGN IN</Link>
            <Link to="/register" className="btn-primary" style={{ textDecoration: 'none', borderRadius: '2px', fontSize: '0.875rem', padding: '0.6rem 1.25rem' }}>JOIN FREE</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
