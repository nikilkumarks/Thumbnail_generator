import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, ShieldPlus, Video } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await register(name, email, password);
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
        <h2 style={{ fontSize: '1.5rem', fontWeight: '900', marginBottom: '0.5rem', letterSpacing: '-0.5px' }}>CREATE STUDIO ACCOUNT</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.9rem' }}>Join AI Thumbnail Studio today.</p>

        {error && <div style={{ color: 'var(--youtube-red)', marginBottom: '1.5rem', backgroundColor: 'rgba(255, 0, 0, 0.1)', padding: '0.6rem', borderRadius: '4px', fontSize: '0.8rem' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem', textAlign: 'left' }}>
            <div style={{ position: 'relative' }}>
              <User size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="text" 
                className="input-field" 
                style={{ paddingLeft: '2.75rem', borderRadius: '4px', width: '100%' }} 
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

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

          <button type="submit" className="btn-primary" style={{ width: '100%', borderRadius: '4px', padding: '0.8rem' }}>CREATE ACCOUNT</button>
        </form>

        <p style={{ marginTop: '2rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--text-white)', fontWeight: '700', textDecoration: 'none' }}>LOG IN</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
