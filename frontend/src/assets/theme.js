// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#3a86ff',
      light: '#6aa2ff',
      dark: '#2872ff',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#8338ec',
      light: '#9859ef',
      dark: '#7020d9',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f6f7ff',
      paper: '#ffffff',
    },
    error: {
      main: '#ef476f',
    },
    warning: {
      main: '#ffd60a',
    },
    success: {
      main: '#06d6a0',
    },
    info: {
      main: '#4361ee',
    },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 600,
      fontSize: '2.375rem',
    },
    h2: {
      fontWeight: 600,
      fontSize: '1.875rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.125rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.57,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#f6f7ff',
          minHeight: '100vh',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0 2px 12px 0 rgba(0,0,0,0.05)',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
        },
      },
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    'none',
    '0 2px 4px 0 rgba(0,0,0,0.05)',
    '0 4px 8px 0 rgba(0,0,0,0.05)',
    '0 8px 16px 0 rgba(0,0,0,0.05)',
    '0 12px 24px 0 rgba(0,0,0,0.05)',
    '0 16px 32px 0 rgba(0,0,0,0.05)',
    ...Array(19).fill('none'), // Fill the rest with none
  ],
});

export default theme;