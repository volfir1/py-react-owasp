import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import { ToastProvider } from './components/Snackbar'; // Adjust path as needed
import Users from './pages/Users';
import Layout from './components/Layout';
import 'ldrs/reuleaux';

// Lazy-loaded components
const Login = lazy(() => import('./pages/Login'));
const Messages = lazy(() => import('./pages/features/Messages'));

// Loading fallback component with Reuleaux loader
const LoadingFallback = () => (
  <Box 
    display="flex" 
    justifyContent="center" 
    alignItems="center" 
    minHeight="100vh"
    bgcolor="background.default"
  >
    <l-reuleaux
      size="37"
      stroke="5"
      stroke-length="0.15"
      bg-opacity="0.1"
      speed="1.2"
      color="#3a86ff"
    ></l-reuleaux>
  </Box>
);

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#3a86ff',
      light: '#6aa3ff',
      dark: '#2872ff',
    },
    secondary: {
      main: '#8338ec',
      light: '#9a5df0',
      dark: '#6c23d6',
    },
    background: {
      default: '#f6f7ff',
      paper: '#ffffff',
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", "Roboto", "Arial", sans-serif',
  },
  components: {
    MuiDataGrid: {
      styleOverrides: {
        root: {
          border: 'none',
          backgroundColor: '#ffffff',
          '& .MuiDataGrid-columnHeader': {
            backgroundColor: '#f8faff',
          },
          '& .MuiDataGrid-cell:hover': {
            color: '#3a86ff',
          },
          '& .MuiDataGrid-row:hover': {
            backgroundColor: '#f0f7ff',
          },
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        maxWidthXl: {
          maxWidth: '1400px !important',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '1rem',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
        },
      },
    },
    // Add Toast-specific style overrides
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: '1rem',
          alignItems: 'center',
        },
        filledSuccess: {
          backgroundColor: '#34d399',
        },
        filledError: {
          backgroundColor: '#ef4444',
        },
        filledWarning: {
          backgroundColor: '#f59e0b',
        },
        filledInfo: {
          backgroundColor: '#3b82f6',
        },
      },
    },
    MuiSnackbar: {
      styleOverrides: {
        root: {
          '& .MuiAlert-root': {
            minWidth: '300px',
            boxShadow: '0 8px 16px rgba(0,0,0,0.12)',
          },
        },
      },
    },
  },
});

// Simple Home component
const Home = () => (
  <div>
    <h1>Welcome to DSVPWA</h1>
    <p>This is the home page of your application.</p>
  </div>
);

function App() {
  const appInfo = {
    project: "DSVPWA",
    author: "Your Name",
    version: "1.0.0"
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToastProvider>
        <Router>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              {/* Public route for login */}
              <Route 
                path="/login" 
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <Login {...appInfo} />
                  </Suspense>
                } 
              />
      
              {/* Protected routes wrapped in Layout */}
              <Route element={<Layout {...appInfo} />}>
                <Route path="/" element={<Home />} />
                <Route path="/users" element={<Users />} />
                
                {/* Featured Routes */}
                <Route 
                  path='/messages' 
                  element={
                    <Suspense fallback={<LoadingFallback />}>
                      <Messages />
                    </Suspense>
                  } 
                />
                
                {/* Redirect unknown routes to home */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </Suspense>
        </Router>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;