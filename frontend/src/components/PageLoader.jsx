import React from 'react';
import BrandLogo from './BrandLogo';

const PageLoader = ({ label = 'Loading studio…' }) => (
  <div className="page-loader">
    <div className="page-loader__inner">
      <div className="page-loader__mark">
        <BrandLogo size={28} />
      </div>
      <div className="page-loader__bar">
        <div className="page-loader__bar-fill" />
      </div>
      <p className="page-loader__label">{label}</p>
    </div>
  </div>
);

export default PageLoader;
