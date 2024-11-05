import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bug } from 'lucide-react';
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
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { User, Lock, Eye, EyeOff } from 'lucide-react';

// Styled components
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

const LoginPage = ({ title, project, author, version, url }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get('username');
    const password = formData.get('password');
    
    // Handle login logic here
    console.log('Login attempt:', username, password);
  };

  return (
    <>
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
            {/* Logo */}
            <Bug size={48} color="#3a86ff" />
            <LogoText variant="h1">{project || 'DSVPWA'}</LogoText>
            
            <Typography variant="h6" sx={{ mt: 2, mb: 4, color: '#4a5568', fontWeight: 500 }}>
              {title || 'Sign in to your account'}
            </Typography>

            {/* Username field */}
            <StyledTextField
              fullWidth
              id="username"
              name="username"
              label="Username"
              variant="outlined"
              margin="normal"
              required
              autoFocus
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <User size={20} color="#718096" />
                  </InputAdornment>
                ),
              }}
            />

            {/* Password field */}
            <StyledTextField
              fullWidth
              id="password"
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              margin="normal"
              required
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
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <LoginButton
              type="submit"
              fullWidth
              variant="contained"
              size="large"
            >
              Sign in
            </LoginButton>
          </Box>
        </LoginCard>
      </LoginContainer>

      <Footer>
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="body2" color="textSecondary">
              &copy; {new Date().getFullYear()} {author}
            </Typography>
            <Link
              href={url}
              underline="hover"
              variant="body2"
              color="textSecondary"
            >
              Version {version}
            </Link>
          </Box>
        </Container>
      </Footer>
    </>
  );
};

export default LoginPage;