import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import { Mail, Lock, ShieldCheck, Video, Play } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, handleGoogleSuccess } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    if (!result.success) {
      setError(result.message);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', padding: '1rem', backgroundColor: 'var(--youtube-black)' }}>
      <div className="premium-card fade-in" style={{ padding: '2.5rem', width: '100%', maxWidth: '420px', textAlign: 'center', borderRadius: '12px' }}>
        <div style={{ color: 'var(--youtube-red)', marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
          <Video size={48} fill="currentColor" strokeWidth={0} />
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '900', marginBottom: '0.5rem', letterSpacing: '-0.5px' }}>LOGIN TO STUDIO</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.9rem' }}>Use your AI Thumbnail account.</p>

        {error && <div style={{ color: 'var(--youtube-red)', marginBottom: '1.5rem', backgroundColor: 'rgba(255, 0, 0, 0.1)', padding: '0.6rem', borderRadius: '4px', fontSize: '0.8rem' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem', textAlign: 'left' }}>
            <div style={{ position: 'relative' }}>
              <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="email" 
                className="input-field" 
                style={{ paddingLeft: '2.75rem', borderRadius: '4px', width: '100%' }} 
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
                style={{ paddingLeft: '2.75rem', borderRadius: '4px', width: '100%' }} 
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', borderRadius: '4px', padding: '0.8rem' }}>SIGN IN</button>
        </form>

        <div style={{ margin: '1.5rem 0', position: 'relative', height: '1px', background: 'var(--border)' }}>
          <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'var(--bg-card)', padding: '0 0.75rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>OR</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError('Google login failed')}
            theme="filled_black"
            shape="square"
            width="360"
          />
        </div>

        <p style={{ marginTop: '2rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          First time? <Link to="/register" style={{ color: 'var(--text-white)', fontWeight: '700', textDecoration: 'none' }}>CREATE ACCOUNT</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
