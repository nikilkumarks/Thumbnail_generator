import React, { useState, useEffect } from 'react';
import { X, Cookie } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ConsentBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      // Small delay to let the app load first before showing the banner
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleConsent = (status) => {
    if (status === 'accepted' || status === 'rejected') {
      localStorage.setItem('cookieConsent', status);
    }
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 9999,
            width: '100%',
            backgroundColor: 'rgba(10, 10, 10, 0.98)',
            backdropFilter: 'blur(20px)',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '0.85rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            color: 'white',
            boxSizing: 'border-box'
          }}
          className="consent-banner"
        >
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flex: 1 }}>
            <div style={{ 
              width: '32px', 
              height: '32px', 
              borderRadius: '8px', 
              background: 'rgba(255, 0, 0, 0.1)', 
              color: 'var(--youtube-red)', 
              display: 'grid', 
              placeItems: 'center',
              flexShrink: 0
            }}>
              <Cookie size={16} />
            </div>
            <div>
              <p style={{ color: '#DDD', fontSize: '0.8rem', lineHeight: '1.4', fontWeight: '500', margin: 0 }}>
                <strong style={{ color: 'white', marginRight: '6px' }}>Privacy & Cookies:</strong>
                We use cookies to enhance your experience and secure authentication. Allow cookies?
              </p>
            </div>
          </div>

          <div className="consent-buttons" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexShrink: 0, paddingRight: '2rem' }}>
            <button 
              className="reject-btn"
              onClick={() => handleConsent('rejected')}
              style={{
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              Reject All
            </button>
            <button 
              className="accept-btn btn-primary"
              onClick={() => handleConsent('accepted')}
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontWeight: '800',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              Accept All
            </button>
          </div>

          <button 
            className="dismiss-btn"
            onClick={() => handleConsent('ignored')}
            style={{
              position: 'absolute',
              right: '1.5rem',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'transparent',
              border: 'none',
              color: '#888',
              cursor: 'pointer',
              padding: '6px',
              display: 'grid',
              placeItems: 'center',
              borderRadius: '50%',
              transition: 'background 0.2s, color 0.2s',
              zIndex: 10
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#888'; e.currentTarget.style.background = 'transparent'; }}
          >
            <X size={18} />
          </button>

          <style>{`
            @media (max-width: 768px) {
              .consent-banner {
                flex-direction: column !important;
                align-items: stretch !important;
                padding: 1.25rem 1.25rem 1rem 1.25rem !important;
                gap: 1rem !important;
              }
              .consent-buttons {
                width: 100% !important;
                padding-right: 0 !important;
                justify-content: space-between !important;
              }
              .consent-buttons button {
                flex: 1 !important;
                text-align: center !important;
              }
              .dismiss-btn {
                top: 12px !important;
                right: 12px !important;
                transform: none !important;
              }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConsentBanner;
