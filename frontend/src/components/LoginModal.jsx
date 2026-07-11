import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useGoogleLogin } from '@react-oauth/google';
import { Mail, Lock, X } from 'lucide-react';
import BrandLogo from './BrandLogo';
import { motion } from 'framer-motion';

const STROKE = 2;

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

const LoginModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, handleGoogleSuccess } = useAuth();

  const googleLogin = useGoogleLogin({
    onSuccess: (res) => { handleGoogleSuccess(res); onClose(); },
    onError: () => setError('Google login failed'),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    if (result.success) onClose();
    else setError(result.message);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" onClick={onClose} className="modal-close" aria-label="Close">
          <X size={18} strokeWidth={STROKE} />
        </button>

        <div style={{ textAlign: 'center' }}>
          <div className="navbar-brand__mark" style={{ margin: '0 auto var(--space-6)' }}>
            <BrandLogo size={22} />
          </div>
          <h2 className="text-h2" style={{ marginBottom: 'var(--space-2)' }}>Welcome back</h2>
          <p className="text-body-sm" style={{ marginBottom: 'var(--space-8)' }}>Sign in to create viral thumbnails</p>

          {error && <div className="alert-error" style={{ marginBottom: 'var(--space-4)', justifyContent: 'center' }}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 'var(--space-4)', textAlign: 'left' }}>
              <label className="text-label" style={{ display: 'block', marginBottom: 'var(--space-2)' }}>Email</label>
              <div className="input-with-icon">
                <Mail size={16} strokeWidth={STROKE} className="input-icon" />
                <input type="email" className="input-field" placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            </div>
            <div style={{ marginBottom: 'var(--space-6)', textAlign: 'left' }}>
              <label className="text-label" style={{ display: 'block', marginBottom: 'var(--space-2)' }}>Password</label>
              <div className="input-with-icon">
                <Lock size={16} strokeWidth={STROKE} className="input-icon" />
                <input type="password" className="input-field" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%' }}>Sign In</button>
          </form>

          <div className="divider-or">
            <div className="divider-or__line" /><span className="divider-or__text">OR</span><div className="divider-or__line" />
          </div>

          <button type="button" onClick={() => googleLogin()} className="btn-secondary" style={{ width: '100%' }}>
            <GoogleIcon /> Continue with Google
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginModal;
