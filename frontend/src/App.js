// src/App.js
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ErrorBoundary from './pages/utils/ErrorBoundary';
import AppRoutes from './AppRoutes';
import { GlobalStyles } from './components/Layout';  // Import from named exports
import theme from './assets/theme';

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ThemeProvider theme={theme}>
          <ToastProvider>
            <AuthProvider>
              <CssBaseline />
              <GlobalStyles />
              <AppRoutes />
            </AuthProvider>
          </ToastProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;