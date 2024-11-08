import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Box, 
  Typography, 
  Button, 
  Paper
} from '@mui/material';
import { Shield, ArrowLeft, Home } from 'lucide-react';
import { styled } from '@mui/material/styles';

// Styled components to match your theme
const UnauthorizedContainer = styled(Container)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  background: 'linear-gradient(135deg, #f6f7ff 0%, #f0f2ff 100%)',
}));

const ContentCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(6),
  borderRadius: '1rem',
  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
  width: '100%',
  maxWidth: '500px',
  textAlign: 'center',
}));

const GradientText = styled(Typography)(({ theme }) => ({
  fontSize: '1.5rem',
  fontWeight: 600,
  background: 'linear-gradient(120deg, #3a86ff, #8338ec)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(3),
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: '0.75rem',
  padding: '0.75rem 1.5rem',
  fontSize: '1rem',
  fontWeight: 500,
  textTransform: 'none',
  '&.MuiButton-contained': {
    background: 'linear-gradient(135deg, #3a86ff, #3a86ff)',
    color: 'white',
    '&:hover': {
      background: 'linear-gradient(135deg, #2872ff, #2872ff)',
    },
  },
  '&.MuiButton-outlined': {
    borderColor: '#3a86ff',
    color: '#3a86ff',
    '&:hover': {
      borderColor: '#2872ff',
      backgroundColor: 'rgba(58,134,255,0.04)',
    },
  },
}));

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <UnauthorizedContainer>
      <ContentCard>
        <Shield size={64} color="#3a86ff" />
        
        <GradientText variant="h1">
          Access Denied
        </GradientText>
        
        <Typography variant="h6" sx={{ mb: 3, color: '#4a5568' }}>
          You don't have permission to access this page
        </Typography>
        
        <Typography variant="body1" sx={{ mb: 4, color: '#718096' }}>
          Please check your credentials or contact your administrator for access.
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <ActionButton
            variant="outlined"
            startIcon={<ArrowLeft size={20} />}
            onClick={() => navigate(-1)}
          >
            Go Back
          </ActionButton>
          
          <ActionButton
            variant="contained"
            startIcon={<Home size={20} />}
            onClick={() => navigate('/')}
          >
            Home
          </ActionButton>
        </Box>
      </ContentCard>

      {/* Optional footer text */}
      <Typography 
        variant="body2" 
        sx={{ 
          mt: 4, 
          color: '#718096',
          textAlign: 'center'
        }}
      >
        If you believe this is a mistake, please contact support
      </Typography>
    </UnauthorizedContainer>
  );
};

export default UnauthorizedPage;