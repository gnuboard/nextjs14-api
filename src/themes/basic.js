// @/themes/basic.js

import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    background: {
      default: '#ffffff',
      paper: '#f0f0f0',
    },
    text: {
      primary: '#000000',
      secondary: '#555555',
    },
    link: {
      main: '#1976d2', // Custom link color for light mode
    },
  },
  typography: {
    h4: {
      fontSize: '2rem',
      fontWeight: 600,
      color: '#1976d2',
    },
    body1: {
      fontSize: '1rem',
      color: '#000000',
    },
  },
  components: {
    MuiLink: {
      styleOverrides: {
        root: {
          color: '#1976d2',
          textDecoration: 'none',
          '&:hover': {
            color: '#155a99',
          },
        },
      },
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    background: {
      default: '#121212',
      paper: '#424242',
    },
    text: {
      primary: '#ffffff',
      secondary: '#aaaaaa',
    },
    link: {
      main: '#bb86fc', // Custom link color for dark mode
    },
  },
  typography: {
    h4: {
      fontSize: '2rem',
      fontWeight: 600,
      color: '#90caf9',
    },
    body1: {
      fontSize: '1rem',
      color: '#ffffff',
    },
  },
  components: {
    MuiLink: {
      styleOverrides: {
        root: {
          color: '#bb86fc',
          textDecoration: 'none',
          '&:hover': {
            color: '#ff79c6',
          },
        },
      },
    },
  },
});
