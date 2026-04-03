import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { Mail, Lock, User, Sparkles, ArrowRight, Video } from 'lucide-react';
import Navbar from '../components/Navbar';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, googleLoginSuccess } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await login(formData.email, formData.password);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--youtube-black)', color: 'white', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ 
          width: '100%', 
          maxWidth: '420px', 
          background: '#0F0F0F', 
          border: '1px solid #222', 
          borderRadius: '16px',
          padding: '2.5rem'
        }} className="fade-in">
          
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
             <div style={{ color: 'var(--youtube-red)', display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                <Video size={48} fill="currentColor" strokeWidth={0} />
             </div>
             <h1 style={{ fontSize: '1.75rem', fontWeight: '900', marginBottom: '0.5rem', letterSpacing: '-0.5px' }}>ACCESS STUDIO</h1>
             <p style={{ color: '#555', fontSize: '0.875rem', fontWeight: '600', letterSpacing: '0.5px' }}>SIGN IN TO YOUR CREATIVE ACCOUNT</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: '800', color: '#888', letterSpacing: '0.5px' }}>EMAIL ADDRESS</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#444' }} />
                <input 
                  type="email" 
                  name="email"
                  placeholder="name@company.com"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  style={{ 
                    width: '100%', 
                    background: '#1A1A1A', 
                    border: '1px solid #333', 
                    borderRadius: '8px', 
                    padding: '12px 12px 12px 40px',
                    color: 'white',
                    outline: 'none',
                    fontSize: '0.9rem'
                  }}
                  className="auth-input"
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: '800', color: '#888', letterSpacing: '0.5px' }}>PASSWORD</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#444' }} />
                <input 
                  type="password" 
                  name="password"
                  placeholder="••••••••"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  style={{ 
                    width: '100%', 
                    background: '#1A1A1A', 
                    border: '1px solid #333', 
                    borderRadius: '8px', 
                    padding: '12px 12px 12px 40px',
                    color: 'white',
                    outline: 'none',
                    fontSize: '0.9rem'
                  }}
                  className="auth-input"
                />
              </div>
            </div>

            {error && (
              <div style={{ color: '#FF4C4C', fontSize: '0.8rem', background: 'rgba(255,0,0,0.05)', padding: '0.75rem', borderRadius: '4px', border: '1px solid rgba(255,0,0,0.1)' }}>
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary"
              style={{ width: '100%', borderRadius: '8px', padding: '1rem', marginTop: '0.5rem' }}
            >
              {loading ? 'AUTHENTICATING...' : 'SIGN IN TO STUDIO'} <ArrowRight size={16} />
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '2rem 0' }}>
            <div style={{ flex: 1, height: '1px', background: '#222' }}></div>
            <span style={{ fontSize: '0.7rem', color: '#444', fontWeight: '800' }}>OR CONTINUE WITH</span>
            <div style={{ flex: 1, height: '1px', background: '#222' }}></div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <GoogleLogin 
               onSuccess={googleLoginSuccess} 
               onError={() => setError('Google Sign-In failed')} 
               theme="filled_black"
               shape="pill"
               width={340}
            />
          </div>

          <p style={{ textAlign: 'center', marginTop: '2.5rem', color: '#555', fontSize: '0.875rem', fontWeight: '500' }}>
            Dont have an account? <Link to="/register" style={{ color: 'white', textDecoration: 'none', fontWeight: '700' }}>GET STARTED</Link>
          </p>

        </div>
      </div>

      <style>{`
        .auth-input:focus { border-color: var(--youtube-red) !important; background: #222 !important; }
      `}</style>
    </div>
  );
};

export default Login;
