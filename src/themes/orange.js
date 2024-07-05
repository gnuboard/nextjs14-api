import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#ff5722',
    },
    background: {
      default: '#fafafa',
      paper: '#e0e0e0',
    },
    text: {
      primary: '#212121',
      secondary: '#757575',
    },
  },
  typography: {
    h4: {
      fontSize: '2rem',
      fontWeight: 600,
      color: '#ff5722',
    },
    body1: {
      fontSize: '1rem',
      color: '#212121',
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ffab91',
    },
    background: {
      default: '#303030',
      paper: '#616161',
    },
    text: {
      primary: '#ffffff',
      secondary: '#bdbdbd',
    },
  },
  typography: {
    h4: {
      fontSize: '2rem',
      fontWeight: 600,
      color: '#ffab91',
    },
    body1: {
      fontSize: '1rem',
      color: '#ffffff',
    },
  },
});
