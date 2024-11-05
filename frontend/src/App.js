import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Users from './pages/Users';
import Navbar from './components/Navbar';

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
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="app">
          <Navbar project="DSVPWA" />
          <Routes>
            <Route path="/" element={<div>Home Page</div>} />
            <Route path="/users" element={<Users />} />
            <Route path="/login" element={<div>Login Page</div>} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;