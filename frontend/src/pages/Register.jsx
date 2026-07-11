import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Zap, Cpu, Palette } from 'lucide-react';
import Navbar from '../components/Navbar';
import PageLoader from '../components/PageLoader';

const STROKE = 2;
const FEATURES = [
  { title: 'Describe your idea', desc: 'Type what you want in plain English.', icon: Zap },
  { title: 'AI refines it', desc: 'Cohere expands it into a pro prompt.', icon: Cpu },
  { title: 'Thumbnail generated', desc: 'FLUX renders a 1280×720 image.', icon: Palette },
];

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, handleGoogleSuccess } = useAuth();
  const navigate = useNavigate();

  const googleLogin = useGoogleLogin({
    onSuccess: (res) => handleGoogleSuccess(res),
    onError: () => setError('Google Sign-In failed'),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await register(formData.name, formData.email, formData.password);
    if (result.success) navigate('/');
    else setError(result.message);
    setLoading(false);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="page-bg page-scroll auth-page auth-locked-dark">
      {loading && <div className="auth-submit-loader"><PageLoader label="Creating your studio…" /></div>}
      <Navbar />
      <div className="auth-wrapper">
        <div className="auth-card fade-in">
          <div className="auth-card__hero hide-on-mobile">
            <span className="badge" style={{ marginBottom: 'var(--space-6)', width: 'fit-content' }}>Free to start</span>
            <h1 className="text-h1" style={{ marginBottom: 'var(--space-4)' }}>
              Join thousands of <span className="text-accent">creators</span>
            </h1>
            <p className="text-body" style={{ marginBottom: 'var(--space-10)', maxWidth: 400 }}>
              Create your account and start generating thumbnails today.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {FEATURES.map(({ title, desc, icon: Icon }) => (
                <div key={title} className="auth-feature">
                  <div className="auth-feature__icon"><Icon size={18} strokeWidth={STROKE} /></div>
                  <div>
                    <p className="text-h4" style={{ color: 'white' }}>{title}</p>
                    <p className="text-body-sm" style={{ color: '#666', fontSize: '0.8rem' }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="auth-card__form">
            <h2 className="text-h2" style={{ marginBottom: 'var(--space-2)' }}>Create account</h2>
            <p className="text-body-sm" style={{ marginBottom: 'var(--space-8)' }}>Set up your studio in seconds</p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
              <div>
                <label className="text-label" style={{ display: 'block', marginBottom: 'var(--space-2)' }}>Name</label>
                <div className="input-with-icon">
                  <User size={16} strokeWidth={STROKE} className="input-icon" />
                  <input type="text" name="name" className="auth-input" placeholder="Your name" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="text-label" style={{ display: 'block', marginBottom: 'var(--space-2)' }}>Email</label>
                <div className="input-with-icon">
                  <Mail size={16} strokeWidth={STROKE} className="input-icon" />
                  <input type="email" name="email" className="auth-input" placeholder="you@email.com" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="text-label" style={{ display: 'block', marginBottom: 'var(--space-2)' }}>Password</label>
                <div className="input-with-icon">
                  <Lock size={16} strokeWidth={STROKE} className="input-icon" />
                  <input type="password" name="password" className="auth-input" placeholder="••••••••" required value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                </div>
              </div>
              {error && <div className="alert-error">{error}</div>}
              <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', marginTop: 'var(--space-2)' }}>
                {loading ? 'Creating...' : 'Create Studio'} <ArrowRight size={16} strokeWidth={STROKE} />
              </button>
            </form>

            <div className="divider-or">
              <div className="divider-or__line" /><span className="divider-or__text">OR</span><div className="divider-or__line" />
            </div>

            <button type="button" onClick={() => googleLogin()} className="btn-secondary" style={{ width: '100%' }}>
              <GoogleIcon /> Continue with Google
            </button>

            <p className="text-body-sm" style={{ textAlign: 'center', marginTop: 'var(--space-8)' }}>
              Have an account? <Link to="/login" style={{ color: 'white', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Register;
