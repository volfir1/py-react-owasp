import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Users from './pages/Users';
import Layout from './components/Layout';
import LoginPage from './pages/Login';

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
    // Add more component customizations
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
  },
});

// You can create a simple Home component
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
      <Router>
        <Routes>
          {/* Public route for login */}
          <Route path="/login" element={<LoginPage {...appInfo} />} />

          {/* Protected routes wrapped in Layout */}
          <Route element={<Layout {...appInfo} />}>
            <Route path="/" element={<Home />} />
            <Route path="/users" element={<Users />} />
            {/* Add more routes here */}
            
            {/* Redirect unknown routes to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;