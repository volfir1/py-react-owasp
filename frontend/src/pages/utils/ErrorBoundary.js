// src/pages/utils/ErrorBoundary.js
import React from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import { AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: '1rem',
  textAlign: 'center',
  maxWidth: 500,
  margin: '0 auto',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
}));

const ErrorFallbackUI = ({ error, resetErrorBoundary }) => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
        background: 'linear-gradient(135deg, #f6f7ff 0%, #f0f2ff 100%)',
      }}
    >
      <StyledPaper elevation={0}>
        <AlertTriangle 
          size={64} 
          color="#ef476f" 
          style={{ marginBottom: '1rem' }} 
        />
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
          Something went wrong
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          {error.message}
        </Typography>
        <Button
          variant="contained"
          onClick={resetErrorBoundary}
          sx={{
            borderRadius: '0.75rem',
            textTransform: 'none',
            fontWeight: 500,
            background: 'linear-gradient(135deg, #3a86ff 0%, #3a86ff 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #2872ff 0%, #2872ff 100%)',
            },
          }}
        >
          Try again
        </Button>
      </StyledPaper>
    </Box>
  );
};

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  resetErrorBoundary = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallbackUI 
          error={this.state.error}
          resetErrorBoundary={this.resetErrorBoundary}
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;