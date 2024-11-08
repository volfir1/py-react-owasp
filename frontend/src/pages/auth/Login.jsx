// src/pages/auth/Login.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bug, User, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext'; // Fixed import
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Link,
  InputAdornment,
  IconButton,
  Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Navbar from '../../components/Navbar';

// Styled components maintained from original
const LoginContainer = styled(Container)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  background: 'linear-gradient(135deg, #f6f7ff 0%, #f0f2ff 100%)',
}));

const LoginCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: '1rem',
  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
  width: '100%',
  maxWidth: '400px',
}));

const LogoText = styled(Typography)(({ theme }) => ({
  fontSize: '1.5rem',
  fontWeight: 600,
  background: 'linear-gradient(120deg, #3a86ff, #8338ec)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  marginTop: theme.spacing(2),
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '0.75rem',
    backgroundColor: '#f8faff',
    '&:hover fieldset': {
      borderColor: '#3a86ff',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#3a86ff',
    },
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#3a86ff',
  },
}));

const LoginButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
  background: 'linear-gradient(135deg, #3a86ff, #3a86ff)',
  color: 'white',
  padding: '0.75rem',
  borderRadius: '0.75rem',
  textTransform: 'none',
  fontSize: '1rem',
  fontWeight: 500,
  '&:hover': {
    background: 'linear-gradient(135deg, #2872ff, #2872ff)',
  },
}));

const Footer = styled(Box)(({ theme }) => ({
  position: 'fixed',
  bottom: 0,
  width: '100%',
  padding: theme.spacing(2),
  backgroundColor: 'white',
  borderTop: '1px solid #f0f2f5',
}));

const LoginPage = ({ title = "Sign in", project = "DSVPWA", author, version, url }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { addToast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockTimer, setBlockTimer] = useState(0);

  // Get the intended destination from location state
  const from = location.state?.from || '/';

  useEffect(() => {
    if (loginAttempts >= 5) {
      setIsBlocked(true);
      setBlockTimer(30);
      
      const timer = setInterval(() => {
        setBlockTimer((prev) => {
          if (prev <= 1) {
            setIsBlocked(false);
            setLoginAttempts(0);
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [loginAttempts]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isBlocked) {
      addToast(`Too many attempts. Please wait ${blockTimer} seconds.`, {
        severity: 'error',
        duration: 4000
      });
      return;
    }

    setError('');
    setLoading(true);

    const formData = new FormData(e.target);
    const username = formData.get('username');
    const password = formData.get('password');

    // Basic validation
    if (!username || !password) {
      setError('Please enter both username and password');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json', // Explicitly request JSON response
        },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });

      // Check content type of response
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned non-JSON response. Please try again later.');
      }

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error('JSON parsing error:', jsonError);
        throw new Error('Invalid response from server. Please try again later.');
      }

      if (response.ok && data.status === 'success') {
        // Update auth context
        await login(data.user);
        
        // Show success message
        addToast('Login successful', {
          severity: 'success',
          duration: 3000
        });
        
        // Navigate based on role or return to intended destination
        const defaultPath = data.user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard';
        const redirectPath = from === '/' ? defaultPath : from;
        navigate(redirectPath, { replace: true });
      } else {
        setLoginAttempts(prev => prev + 1);
        const errorMessage = data.message || 'Invalid username or password';
        setError(errorMessage);
        addToast(errorMessage, {
          severity: 'error',
          duration: 4000
        });
      }
    } catch (err) {
      console.error('Login error:', err);
      let errorMessage;
      
      if (err.name === 'TypeError' && err.message.includes('Failed to fetch')) {
        errorMessage = 'Unable to connect to the server. Please check your internet connection.';
      } else if (err.message.includes('Server returned non-JSON')) {
        errorMessage = 'Server error. Please try again later or contact support if the problem persists.';
      } else {
        errorMessage = 'An unexpected error occurred. Please try again.';
      }
      
      setError(errorMessage);
      addToast(errorMessage, {
        severity: 'error',
        duration: 4000
      });
      setLoginAttempts(prev => prev + 1);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
    <Navbar/>
    <LoginContainer>
      <LoginCard>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* Logo & Title */}
          <Bug size={48} color="#3a86ff" />
          <LogoText variant="h1">{project}</LogoText>
          
          <Typography variant="h6" sx={{ mt: 2, mb: 4, color: '#4a5568', fontWeight: 500 }}>
            {title}
          </Typography>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 2, width: '100%', borderRadius: '0.75rem' }}>
              {error}
            </Alert>
          )}

          {/* Login Form */}
          <StyledTextField
            fullWidth
            id="username"
            name="username"
            label="Username"
            variant="outlined"
            margin="normal"
            required
            autoComplete="username"
            autoFocus
            disabled={loading || isBlocked}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <User size={20} color="#718096" />
                </InputAdornment>
              ),
            }}
          />

          <StyledTextField
            fullWidth
            id="password"
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            variant="outlined"
            margin="normal"
            required
            autoComplete="current-password"
            disabled={loading || isBlocked}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock size={20} color="#718096" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    sx={{ color: '#718096' }}
                    disabled={loading || isBlocked}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* Login Button */}
          <LoginButton
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading || isBlocked}
          >
            {isBlocked 
              ? `Wait ${blockTimer}s` 
              : loading 
                ? 'Signing in...' 
                : 'Sign in'
            }
          </LoginButton>
        </Box>
      </LoginCard>

      {/* Footer */}
      <Footer>
        <Container maxWidth="lg">
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <Typography variant="body2" color="textSecondary">
              &copy; {new Date().getFullYear()} {author}
            </Typography>
            <Link
              href={url}
              underline="hover"
              variant="body2"
              color="textSecondary"
              target="_blank"
              rel="noopener"
            >
              Version {version}
            </Link>
          </Box>
        </Container>
      </Footer>
    </LoginContainer>
    </>
  );
};

export default LoginPage;