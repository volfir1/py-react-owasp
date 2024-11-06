import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { Alert, Snackbar, Stack } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';

const ToastContext = createContext(null);

// Action types
const ADD_TOAST = 'ADD_TOAST';
const REMOVE_TOAST = 'REMOVE_TOAST';

const toastReducer = (state, action) => {
  switch (action.type) {
    case ADD_TOAST:
      return [...state, action.toast];
    case REMOVE_TOAST:
      return state.filter(toast => toast.id !== action.id);
    default:
      return state;
  }
};

export const ToastProvider = ({ children }) => {
  const [toasts, dispatch] = useReducer(toastReducer, []);

  const addToast = useCallback((message, options = {}) => {
    const id = uuidv4();
    const toast = {
      id,
      message,
      severity: options.severity || 'info',
      duration: options.duration || 5000,
      position: options.position || {
        vertical: 'bottom',
        horizontal: 'right'
      }
    };
    
    dispatch({ type: ADD_TOAST, toast });
    
    // Automatically remove toast after duration
    setTimeout(() => {
      dispatch({ type: REMOVE_TOAST, id });
    }, toast.duration);
  }, []);

  const removeToast = useCallback((id) => {
    dispatch({ type: REMOVE_TOAST, id });
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <Stack 
        spacing={1} 
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 2000
        }}
      >
        {toasts.map((toast) => (
          <Snackbar
            key={toast.id}
            open={true}
            anchorOrigin={toast.position}
            sx={{ position: 'relative', bottom: 'auto', right: 'auto' }}
          >
            <Alert
              elevation={6}
              variant="filled"
              onClose={() => removeToast(toast.id)}
              severity={toast.severity}
              sx={{ 
                width: '100%',
                minWidth: '300px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
              }}
            >
              {toast.message}
            </Alert>
          </Snackbar>
        ))}
      </Stack>
    </ToastContext.Provider>
  );
};

// Custom hook for using toast that includes helper functions
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  
  const { addToast } = context;

  // Define helper functions within the hook
  const success = useCallback((message, options = {}) => {
    addToast(message, { ...options, severity: 'success' });
  }, [addToast]);

  const error = useCallback((message, options = {}) => {
    addToast(message, { ...options, severity: 'error' });
  }, [addToast]);

  const warning = useCallback((message, options = {}) => {
    addToast(message, { ...options, severity: 'warning' });
  }, [addToast]);

  const info = useCallback((message, options = {}) => {
    addToast(message, { ...options, severity: 'info' });
  }, [addToast]);

  // Return both the original context and helper functions
  return {
    ...context,
    success,
    error,
    warning,
    info
  };
};

export { ToastContext };