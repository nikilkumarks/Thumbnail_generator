import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Sparkles, ArrowRight, Video, Zap, Cpu, Palette, Info } from 'lucide-react';
import Navbar from '../components/Navbar';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, handleGoogleSuccess } = useAuth();
  const navigate = useNavigate();

  const googleLogin = useGoogleLogin({
    onSuccess: (res) => handleGoogleSuccess(res),
    onError: () => setError('Google Sign-In failed')
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await register(formData.name, formData.email, formData.password);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.4 }}
      style={{ minHeight: '100vh', backgroundColor: 'var(--youtube-black)', color: 'white', display: 'flex', flexDirection: 'column' }}
    >
      <Navbar />
      
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="auth-wrapper">
        
        {/* Unified Studio Card - Register */}
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
          
          {/* Left Pane: The Creative Briefing */}
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

          {/* Right Pane: Simple Studio Onboarding */}
          <div style={{ flex: 1, backgroundColor: '#0F0F0F', display: 'flex', flexDirection: 'column', justifyContent: 'center' }} className="auth-form-container">
            <div style={{ marginBottom: '2.5rem' }}>
               <h2 style={{ fontSize: '1.75rem', fontWeight: '900', marginBottom: '0.5rem', letterSpacing: '-0.5px' }}>PromptVision Join</h2>
               <p style={{ color: '#444', fontSize: '0.85rem', fontWeight: '600', letterSpacing: '0.5px' }}>Create your pro creator account.</p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                 <label style={{ fontSize: '0.75rem', fontWeight: '800', color: '#444', letterSpacing: '1px' }}>FULL NAME</label>
                 <div style={{ position: 'relative' }}>
                    <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#444' }} />
                    <input 
                      type="text" 
                      name="name"
                      placeholder="Enter name..."
                      required
                      value={formData.name}
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
                {loading ? 'INITIALIZING...' : 'START CREATING'} <Sparkles size={16} />
              </button>
            </form>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '2rem 0' }}>
              <div style={{ flex: 1, height: '1px', background: '#222' }}></div>
              <span style={{ fontSize: '0.75rem', color: '#333', fontWeight: '800' }}>OR</span>
              <div style={{ flex: 1, height: '1px', background: '#222' }}></div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
              <button 
                type="button" 
                onClick={() => googleLogin()}
                className="btn-secondary" 
                style={{ width: '100%', margin: '0 auto', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', padding: '0.875rem', borderRadius: '8px', border: '1px solid #333', background: '#111', color: 'white', fontWeight: '800', fontSize: '0.85rem' }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                   <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                   <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                   <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                   <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                CONTINUE WITH GOOGLE
              </button>
            </div>

            <p style={{ textAlign: 'center', marginTop: '2.5rem', color: '#444', fontSize: '0.875rem', fontWeight: '500' }}>
              Already have an account? <Link to="/login" style={{ color: 'white', textDecoration: 'none', fontWeight: '700' }}>SIGN IN</Link>
            </p>
          </div>

        </div>
      </div>

      <style>{`
        .auth-wrapper { padding: 2.5rem; }
        .auth-form-container { padding: 4rem; }
        .auth-input:focus { border-color: var(--youtube-red) !important; background: #121212 !important; }
        
        @media (max-width: 992px) {
          .hide-on-mobile { display: none !important; }
          .main-auth-card { 
            flex-direction: column !important; 
            border-radius: 16px !important;
          }
        }
        
        @media (max-width: 640px) {
          .auth-wrapper { padding: 1rem !important; margin-top: 1rem !important; }
          .auth-form-container { padding: 2rem 1.5rem !important; }
        }
      `}</style>
    </motion.div>
  );
};

export default Register;
