// src/pages/NotFound.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Container,
  Paper 
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  Home,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Styled Components
const StyledContainer = styled(Container)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  background: 'linear-gradient(135deg, #f6f7ff 0%, #f0f2ff 100%)',
}));

const ContentCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: '1rem',
  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
  width: '100%',
  maxWidth: '480px',
  textAlign: 'center',
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
}));

const ErrorCode = styled(Typography)(({ theme }) => ({
  fontSize: '6rem',
  fontWeight: 700,
  background: 'linear-gradient(120deg, #3a86ff, #8338ec)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  marginBottom: theme.spacing(2),
  lineHeight: 1,
}));

const HomeButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
  background: 'linear-gradient(135deg, #3a86ff, #3a86ff)',
  color: 'white',
  padding: '0.75rem 2rem',
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
  left: 0,
  right: 0,
  padding: theme.spacing(2),
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  borderTop: '1px solid rgba(0, 0, 0, 0.05)',
  backdropFilter: 'blur(8px)',
}));

const FooterContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  maxWidth: '1920px',
  margin: '0 auto',
  padding: '0 24px',
  [theme.breakpoints.down('sm')]: {
    padding: '0 16px',
  },
}));

const NotFound = ({ author = "Your Company", version = "1.0.0" }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleHomeClick = () => {
    if (user) {
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <StyledContainer>
      <ContentCard elevation={0}>
        <AlertTriangle 
          size={64} 
          color="#3a86ff" 
          style={{ marginBottom: '1rem' }}
        />
        <ErrorCode variant="h1">404</ErrorCode>
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: 600, 
            color: '#2d3748',
            mb: 2 
          }}
        >
          Page Not Found
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            color: '#4a5568',
            mb: 3 
          }}
        >
          The page you're looking for doesn't exist or has been moved.
        </Typography>
        <HomeButton
          startIcon={<Home size={20} />}
          onClick={handleHomeClick}
        >
          Back to {user ? 'Dashboard' : 'Login'}
        </HomeButton>
      </ContentCard>

      <Footer>
        <FooterContent>
          <Typography variant="body2" color="textSecondary">
            © {new Date().getFullYear()} {author}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Version {version}
          </Typography>
        </FooterContent>
        <Box
          sx={{
            position: 'absolute',
            bottom: -1,
            left: 0,
            right: 0,
            height: '2px',
            background: 'linear-gradient(90deg, #3a86ff 0%, #8338ec 100%)',
            opacity: 0.7,
          }}
        />
      </Footer>
    </StyledContainer>
  );
};

export default NotFound;