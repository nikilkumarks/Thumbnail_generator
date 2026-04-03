import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={{
      width: '100%',
      padding: '0.4rem 1.5rem',
      background: 'rgba(10, 10, 10, 0.95)',
      borderTop: '1px solid rgba(255, 255, 255, 0.05)',
      zIndex: 10,
      position: 'relative'
    }} className="footer-container">
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem'
      }} className="footer-content">
        {/* Copyright Section */}
        <div style={{ 
          fontSize: '0.65rem', 
          color: '#444', 
          fontWeight: '800', 
          letterSpacing: '1px' 
        }} className="copyright-text">
          &copy; 2026 PROMPTVISION STUDIOS. ALL RIGHTS RESERVED.
        </div>

        {/* Legal Horizon Links */}
        <div style={{ 
          display: 'flex', 
          gap: '1.25rem',
          alignItems: 'center'
        }} className="footer-links">
          <Link to="/privacy" style={{ fontSize: '0.65rem', color: '#666', textDecoration: 'none', fontWeight: '800', letterSpacing: '1px' }} className="footer-hover-red">PRIVACY</Link>
          <Link to="/terms" style={{ fontSize: '0.65rem', color: '#666', textDecoration: 'none', fontWeight: '800', letterSpacing: '1px' }} className="footer-hover-red">TERMS</Link>
          <Link to="/security" style={{ fontSize: '0.65rem', color: '#666', textDecoration: 'none', fontWeight: '800', letterSpacing: '1px' }} className="footer-hover-red">SECURITY</Link>
        </div>
      </div>

      <style>{`
        .footer-hover-red:hover { color: var(--youtube-red) !important; }
        
        @media (max-width: 768px) {
          .footer-container { padding: 0.8rem 1rem !important; }
          .footer-content { 
            flex-direction: column !important; 
            gap: 0.75rem !important;
            text-align: center !important;
          }
          .footer-links { 
            justify-content: center !important; 
            gap: 1.5rem !important;
            width: 100% !important;
          }
          .copyright-text { order: 2; margin-top: 0.25rem; }
          .footer-links { order: 1; }
        }

        @media (max-width: 480px) {
          .footer-links { gap: 1rem !important; }
          .copyright-text { font-size: 0.6rem !important; letter-spacing: 0.5px !important; }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
