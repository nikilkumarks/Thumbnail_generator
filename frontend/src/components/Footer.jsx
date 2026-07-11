import React from 'react';
import { Link } from 'react-router-dom';

const Footer = ({ compact = false }) => (
  <footer className={`footer-minimal ${compact ? 'footer-minimal--compact' : ''}`}>
    <div className="footer-links">
      <Link to="/privacy">Privacy</Link>
      <Link to="/terms">Terms</Link>
      <Link to="/security">Security</Link>
    </div>
    {!compact && (
      <p className="text-caption footer-copy">© 2026 PromptVision Studio</p>
    )}
  </footer>
);

export default Footer;
