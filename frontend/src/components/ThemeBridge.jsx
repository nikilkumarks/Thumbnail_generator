import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme, PUBLIC_DARK_ROUTES } from '../context/ThemeContext';

/** Applies light theme only when logged in on studio routes; auth pages stay dark. */
const ThemeBridge = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const { pathname } = useLocation();

  useEffect(() => {
    const forceDark = !user || PUBLIC_DARK_ROUTES.includes(pathname);
    document.documentElement.setAttribute('data-theme', forceDark ? 'dark' : theme);
  }, [user, pathname, theme]);

  return null;
};

export default ThemeBridge;
