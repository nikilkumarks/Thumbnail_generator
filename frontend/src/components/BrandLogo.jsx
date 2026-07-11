import React from 'react';

/** Minimal 16:9 frame + play mark — thumbnail studio mark (not generic AI sparkle). */
const BrandLogo = ({ size = 24, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <rect x="3" y="8" width="26" height="16" rx="3" stroke="white" strokeWidth="2" fill="none" />
    <path d="M14 12.5v7l6-3.5-6-3.5z" fill="white" />
    <rect x="22" y="6" width="6" height="6" rx="1.5" fill="#FF0000" />
  </svg>
);

export default BrandLogo;
