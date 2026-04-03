import React from 'react';

const Footer = () => {
  return (
    <footer style={{ 
      padding: '0.4rem 0', 
      display: 'flex', 
      alignItems: 'center',
      justifyContent: 'center',
      gap: '2rem',
      opacity: 0.6,
      transition: 'all 0.3s ease',
      zIndex: 20,
      userSelect: 'none',
      borderTop: '1px solid #111'
    }} 
    onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
    onMouseLeave={(e) => e.currentTarget.style.opacity = 0.6}>
      
      {/* 🏢 Trademarks */}
      <p style={{ fontSize: '0.625rem', fontWeight: '900', letterSpacing: '2px', color: '#333', whiteSpace: 'nowrap' }}>
        © 2026 PROMPTVISION
      </p>

      {/* 📜 Compact Horizon Links */}
      <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.625rem', fontWeight: '800', letterSpacing: '1px' }}>
        {[
          { label: 'PRIVACY' },
          { label: 'TERMS' },
          { label: 'SECURITY' }
        ].map((link, i) => (
          <a 
            key={i}
            href="#" 
            onClick={(e) => e.preventDefault()}
            style={{ color: '#555', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={(e) => e.target.style.color = 'white'}
            onMouseLeave={(e) => e.target.style.color = '#555'}
          >
            {link.label}
          </a>
        ))}
      </div>

      <style>{`
        footer a { border-bottom: 2px solid transparent; }
        footer a:hover { border-bottom-color: var(--youtube-red); }
      `}</style>
    </footer>
  );
};

export default Footer;
