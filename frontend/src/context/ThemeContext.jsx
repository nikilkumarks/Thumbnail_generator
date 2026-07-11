import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext(null);

export const PUBLIC_DARK_ROUTES = ['/login', '/register', '/privacy', '/terms', '/security'];

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => localStorage.getItem('pv-theme') || 'dark');

  const toggleTheme = () => {
    setTheme((t) => {
      const next = t === 'dark' ? 'light' : 'dark';
      localStorage.setItem('pv-theme', next);
      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark: theme === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
