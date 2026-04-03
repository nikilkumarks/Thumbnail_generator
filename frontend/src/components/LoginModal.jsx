import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import { Mail, Lock, X, Play, Video } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LoginModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, handleGoogleSuccess } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    if (result.success) {
      onClose();
    } else {
      setError(result.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
           onClick={onClose}
           style={{ position: 'absolute', right: '1.25rem', top: '1.25rem', color: 'var(--text-muted)', background: 'transparent' }}
        >
          <X size={20} />
        </button>

        <div style={{ textAlign: 'center' }}>
          <div style={{ color: 'var(--youtube-red)', marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
            <Video size={48} fill="currentColor" strokeWidth={0} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '900', marginBottom: '0.5rem', letterSpacing: '-0.5px' }}>ACCESS STUDIO</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.9rem' }}>Sign in to start creatingthumbnails.</p>

          {error && <div style={{ color: 'var(--youtube-red)', marginBottom: '1rem', background: 'rgba(255,0,0,0.1)', padding: '0.5rem', borderRadius: '4px', fontSize: '0.8rem' }}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem', textAlign: 'left' }}>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  type="email" 
                  className="input-field" 
                  style={{ paddingLeft: '2.75rem', width: '100%' }} 
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  type="password" 
                  className="input-field" 
                  style={{ paddingLeft: '2.75rem', width: '100%' }} 
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', borderRadius: '4px', marginBottom: '1.5rem' }}>SIGN IN</button>
          </form>

          <div style={{ margin: '1.5rem 0', position: 'relative', height: '1px', background: 'var(--border)' }}>
            <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'var(--bg-card)', padding: '0 0.75rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>OR</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <GoogleLogin
               onSuccess={(res) => {
                 handleGoogleSuccess(res);
                 onClose();
               }}
               onError={() => setError('Google login failed')}
               theme="filled_black"
               shape="square"
               width="340"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginModal;
