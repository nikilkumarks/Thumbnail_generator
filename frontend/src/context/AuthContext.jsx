import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import PageLoader from '../components/PageLoader';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const { data } = await api.get('/auth/me');
        setUser(data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      handleAuthSuccess(data);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Login failed' };
    }
  };

  const register = async (name, email, password) => {
    try {
      const { data } = await api.post('/auth/register', { name, email, password });
      handleAuthSuccess(data);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Registration failed' };
    }
  };

  const handleGoogleSuccess = async (response) => {
    try {
      const token = response.access_token || response.credential;
      const isAccessToken = !!response.access_token;

      const { data } = await api.post('/auth/google', { token, isAccessToken });
      handleAuthSuccess(data);
      navigate('/');
    } catch (err) {
      console.error('Google OAuth failed', err);
    }
  };

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    navigate('/');
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Logout failed', err);
    } finally {
      setUser(null);
      navigate('/login');
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, handleGoogleSuccess }}>
      {loading ? <PageLoader label="Restoring your session…" /> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
