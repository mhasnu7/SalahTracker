import React, { createContext, useState, useMemo } from 'react';
import { lightColors, darkColors } from './colors';

export const ThemeContext = createContext({
  isDark: true,
  colors: darkColors,
  toggleTheme: () => {},
  setIsDark: (dark: boolean) => {}, // Add setIsDark to the context
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDark, setIsDark] = useState(true);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const theme = useMemo(() => ({
    isDark,
    colors: isDark ? darkColors : lightColors,
    toggleTheme,
    setIsDark, // Expose setIsDark
  }), [isDark]);

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};