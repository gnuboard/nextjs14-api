"use client";
import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Read dark mode state from local storage on page load
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('isDarkMode');
      return savedMode ? JSON.parse(savedMode) : false;
    }
    return false;
  });

  const [themes, setThemes] = useState({ lightTheme: null, darkTheme: null });

  const loadTheme = async () => {
    let themeName = process.env.NEXT_PUBLIC_THEME || 'basic';
    try {
      const importedThemes = await import(`@/themes/${themeName}`);
      setThemes(importedThemes);
    } catch (error) {
      console.error(`Failed to load theme '${themeName}', falling back to 'basic' theme. Error:`, error);
      themeName = 'basic';
      const importedThemes = await import(`@/themes/${themeName}`);
      setThemes(importedThemes);
    }
  };

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode;
      if (typeof window !== 'undefined') {
        localStorage.setItem('isDarkMode', JSON.stringify(newMode));
      }
      return newMode;
    });
  };

  useEffect(() => {
    loadTheme();
  }, []);

  useEffect(() => {
    // Read dark mode state from local storage on page load
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('isDarkMode');
      if (savedMode !== null) {
        setIsDarkMode(JSON.parse(savedMode));
      }
    }
  }, []);

  const theme = useMemo(() => {
    return isDarkMode ? themes.darkTheme : themes.lightTheme;
  }, [isDarkMode, themes]);

  if (!themes.lightTheme || !themes.darkTheme) {
    return <div>Loading...</div>;
  }

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
