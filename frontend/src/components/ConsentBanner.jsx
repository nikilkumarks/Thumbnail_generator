import React, { useState, useEffect } from 'react';
import { X, Cookie } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const STROKE = 2;

const ConsentBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('cookieConsent')) {
      const t = setTimeout(() => setIsVisible(true), 1200);
      return () => clearTimeout(t);
    }
  }, []);

  const handleConsent = (status) => {
    if (status === 'accepted' || status === 'rejected') localStorage.setItem('cookieConsent', status);
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          className="consent-banner"
          style={{
            position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 9999,
            padding: 'var(--space-5) var(--space-6)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-4)', flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center', flex: 1, minWidth: 200 }}>
            <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: 'var(--red-soft)', display: 'grid', placeItems: 'center', color: 'var(--youtube-red)' }}>
              <Cookie size={18} strokeWidth={STROKE} />
            </div>
            <p className="text-body-sm" style={{ color: '#ccc', margin: 0 }}>
              We use cookies for authentication and a better experience.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            <button type="button" className="btn-secondary" onClick={() => handleConsent('rejected')} style={{ fontSize: '0.8rem' }}>Reject</button>
            <button type="button" className="btn-primary" onClick={() => handleConsent('accepted')} style={{ fontSize: '0.8rem' }}>Accept</button>
          </div>
          <button type="button" className="btn-icon" onClick={() => handleConsent('ignored')} style={{ position: 'absolute', top: 'var(--space-3)', right: 'var(--space-3)' }} aria-label="Dismiss">
            <X size={16} strokeWidth={STROKE} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConsentBanner;
