import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { Mail, Lock, Sparkles, ArrowRight, Video, Zap, Cpu, Palette, Info } from 'lucide-react';
import Navbar from '../components/Navbar';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, handleGoogleSuccess } = useAuth();
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
      
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2.5rem' }}>
        
        {/* Unified Discovery Card - Expanded Width */}
        <div style={{ 
          width: '100%', 
          maxWidth: '1160px', 
          display: 'flex', 
          background: '#0F0F0F', 
          border: '1px solid #222', 
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 30px 60px rgba(0,0,0,0.5)'
        }} className="fade-in main-auth-card">
          
          {/* Left Pane: The Intelligence Briefing with Background Visual */}
          <div style={{ 
            flex: 1.1, 
            padding: '4rem', 
            background: 'linear-gradient(rgba(10, 10, 10, 0.9), rgba(10, 10, 10, 0.9)), url("https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRight: '1px solid #222',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }} className="hide-on-mobile">
            <div style={{ color: 'var(--youtube-red)', marginBottom: '1.5rem' }}>
               <Video size={48} fill="currentColor" strokeWidth={0} />
            </div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '1.5rem', letterSpacing: '-1.5px', lineHeight: '1.1' }}>
              PROMPT <br/>
              <span style={{ color: 'var(--youtube-red)' }}>VISION.</span>
            </h1>
            <p style={{ color: '#888', fontSize: '1rem', lineHeight: '1.6', marginBottom: '3.5rem', fontWeight: '500' }}>
              PromptVision generates optimized, high-CTR thumbnails engineered for viral growth and channel authority.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {[
                { title: 'Describe Vision', desc: 'Define your video concept in plain English.', icon: <Zap size={18} /> },
                { title: 'AI Refinement', desc: 'Cohere AI expansion into technical prompt mastery.', icon: <Cpu size={18} /> },
                { title: 'Flux Studio Rendering', desc: 'FLUX.1-schnell 1280x720 photorealistic high-res generation.', icon: <Palette size={18} /> }
              ].map((step, i) => (
                <div key={i} style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                  <div style={{ color: 'var(--youtube-red)', marginTop: '2px' }}>{step.icon}</div>
                  <div>
                    <h4 style={{ fontWeight: '800', fontSize: '0.9rem', color: 'white', marginBottom: '2px' }}>{step.title}</h4>
                    <p style={{ color: '#444', fontSize: '0.8125rem', fontWeight: '500' }}>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Pane: Simple Studio Access */}
          <div style={{ flex: 1, padding: '4rem', backgroundColor: '#0F0F0F', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ marginBottom: '2.5rem' }}>
               <h2 style={{ fontSize: '1.75rem', fontWeight: '900', marginBottom: '0.5rem', letterSpacing: '-0.5px' }}>PromptVision Access</h2>
               <p style={{ color: '#444', fontSize: '0.85rem', fontWeight: '600', letterSpacing: '0.5px' }}>Sign in to start creating.</p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                 <label style={{ fontSize: '0.75rem', fontWeight: '800', color: '#444', letterSpacing: '1px' }}>EMAIL</label>
                 <div style={{ position: 'relative' }}>
                    <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#444' }} />
                    <input 
                      type="email" 
                      name="email"
                      placeholder="name@email.com"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      style={{ 
                        width: '100%', 
                        background: '#0a0a0a', 
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

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                 <label style={{ fontSize: '0.75rem', fontWeight: '800', color: '#444', letterSpacing: '1px' }}>PASSWORD</label>
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
                        background: '#0a0a0a', 
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

              {error && <div style={{ color: '#FF4C4C', fontSize: '0.8rem', background: 'rgba(255,0,0,0.05)', padding: '0.75rem', borderRadius: '4px', border: '1px solid rgba(255,0,0,0.1)' }}>{error}</div>}

              <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', borderRadius: '8px', padding: '1rem', marginTop: '0.5rem' }}>
                {loading ? 'WAITING...' : 'ENTER STUDIO'} <ArrowRight size={16} />
              </button>
            </form>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '2rem 0' }}>
              <div style={{ flex: 1, height: '1px', background: '#222' }}></div>
              <span style={{ fontSize: '0.75rem', color: '#333', fontWeight: '800' }}>OR</span>
              <div style={{ flex: 1, height: '1px', background: '#222' }}></div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => setError('Google Sign-In failed')} theme="filled_black" shape="pill" width={320} />
            </div>

            <p style={{ textAlign: 'center', marginTop: '2.5rem', color: '#444', fontSize: '0.875rem', fontWeight: '500' }}>
              Don't have an account? <Link to="/register" style={{ color: 'white', textDecoration: 'none', fontWeight: '700' }}>CREATE ONE</Link>
            </p>
          </div>

        </div>
      </div>

      <style>{`
        .auth-input:focus { border-color: var(--youtube-red) !important; background: #121212 !important; }
        @media (max-width: 992px) {
          .hide-on-mobile { display: none !important; }
          .main-auth-card { flex-direction: column !important; }
        }
      `}</style>
    </div>
  );
};

export default Login;
