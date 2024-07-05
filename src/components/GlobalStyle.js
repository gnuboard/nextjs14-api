// src/components/GlobalStyle.js
"use client";
import React from 'react';
import { GlobalStyles } from '@mui/system';
import { useTheme } from '@mui/material/styles';

const GlobalStyle = () => {
  const theme = useTheme();

  return (
    <GlobalStyles
      styles={{
        body: {
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
          minHeight: '100vh',
          margin: 0,
          padding: 0,
          fontFamily: theme.typography.fontFamily,
        },
        '#__next': {
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        },
        footer: {
          backgroundColor: theme.palette.mode === 'light' ? '#f0f0f0' : '#424242',
          color: theme.palette.mode === 'light' ? '#000000' : '#ffffff',
          padding: '1rem',
          textAlign: 'center',
        },
      }}
    />
  );
};

export default GlobalStyle;
