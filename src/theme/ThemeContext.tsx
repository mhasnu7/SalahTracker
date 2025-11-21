import React, { createContext, useState, useMemo } from 'react';
import { lightColors, darkColors } from './colors';

// Define context shape based on line 4-9 of old file, ensuring all parts are defined
interface ThemeContextType {
  isDark: boolean;
  colors: typeof darkColors | typeof lightColors;
  toggleTheme: () => void;
  setIsDark: (dark: boolean) => void;
}

// Extend the ColorScheme interface to include the new properties
declare module './colors' {
  export interface ColorScheme {
    buttonBackground: string;
    buttonText: string;
    shadow: string;
    primary: string;
    textSecondary: string;
  }
}

export const ThemeContext = createContext<ThemeContextType>({
  isDark: true,
  colors: darkColors,
  toggleTheme: () => {},
  setIsDark: () => {},
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
    setIsDark,
  }), [isDark]);

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => React.useContext(ThemeContext);