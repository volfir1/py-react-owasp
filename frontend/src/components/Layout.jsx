// src/components/Layout.jsx
import React, { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Box, Container, useTheme, useMediaQuery, CircularProgress } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Navbar from './Navbar';

// Styled Components

// Create GlobalStyles component
export const GlobalStyles = () => {
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      :root {
        --app-height: 100%;
      }

      html, body {
        margin: 0;
        padding: 0;
        background-color: #f8faff;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        overflow-x: hidden;
        height: var(--app-height);
      }

      body {
        position: fixed;
        width: 100%;
        height: 100%;
      }

      #root {
        height: 100%;
      }

      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

      ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }

      ::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 4px;
      }

      ::-webkit-scrollbar-thumb {
        background: #3a86ff;
        border-radius: 4px;
        transition: background-color 0.2s ease;
      }

      ::-webkit-scrollbar-thumb:hover {
        background: #2872ff;
      }

      * {
        scrollbar-width: thin;
        scrollbar-color: #3a86ff #f1f1f1;
      }

      @supports (-webkit-touch-callout: none) {
        .height-100 {
          height: -webkit-fill-available;
        }
      }
    `;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  return null;
};

const LayoutRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  maxWidth: '100vw',
  backgroundColor: '#f8faff',
  overflow: 'hidden',
  position: 'relative',
}));

const MainContent = styled('main')(({ theme }) => ({
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  minHeight: `calc(100vh - ${theme.spacing(8)})`,
  width: '100%',
  overflowX: 'hidden',
  overflowY: 'auto',
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.down('sm')]: {
    minHeight: `calc(100vh - ${theme.spacing(7)})`,
    paddingBottom: theme.spacing(8),
  },
}));

const GradientBorder = styled('div')({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  height: '2px',
  background: 'linear-gradient(90deg, #3a86ff 0%, #8338ec 100%)',
  opacity: 0.7,
  zIndex: 2,
});

const ContentContainer = styled(Container)(({ theme }) => ({
  flexGrow: 1,
  width: '100%',
  maxWidth: '1920px',
  margin: '0 auto',
  padding: theme.spacing(4, 3),
  [theme.breakpoints.up('xl')]: {
    padding: theme.spacing(4, 6),
  },
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(3, 2),
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2, 1),
  },
  '& > *': {
    maxWidth: '100%',
  }
}));

const Footer = styled('footer')(({ theme }) => ({
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  borderTop: '1px solid rgba(0, 0, 0, 0.05)',
  padding: theme.spacing(2, 0),
  zIndex: theme.zIndex.appBar - 1,
  backdropFilter: 'blur(8px)',
}));

const FooterContent = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontSize: '0.875rem',
  color: '#64748b',
  position: 'relative',
  maxWidth: '1920px',
  margin: '0 auto',
  padding: '0 24px',
  [theme.breakpoints.down('sm')]: {
    padding: '0 16px',
  },
}));

const FooterGradient = styled('div')({
  position: 'absolute',
  bottom: '-9px',
  left: 0,
  right: 0,
  height: '2px',
  background: 'linear-gradient(90deg, #3a86ff 0%, #8338ec 100%)',
  opacity: 0.7,
});

const LoadingContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  backgroundColor: '#f8faff',
});

export const Layout = ({ project, author = "Your Company", version = "1.0.0" }) =>  {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useToast();

  useEffect(() => {
    const publicPaths = ['/login', '/register', '/forgot-password', '/unauthorized'];
    const isPublicPath = publicPaths.includes(location.pathname);
    
    if (!loading && !user && !isPublicPath) {
      addToast('Please login to continue', { 
        severity: 'warning',
        duration: 4000 
      });
      navigate('/login', { 
        state: { from: location.pathname },
        replace: true 
      });
    }
  }, [loading, user, navigate, location, addToast]);

  // Don't render layout for public routes
  const publicPaths = ['/login', '/register', '/forgot-password', '/unauthorized'];
  if (publicPaths.includes(location.pathname)) {
    return <Outlet />;
  }

  if (loading) {
    return (
      <LoadingContainer>
        <CircularProgress color="primary" />
      </LoadingContainer>
    );
  }

  return (
    <LayoutRoot>
      <Navbar project={project} />
      <GradientBorder />
      <MainContent>
        <ContentContainer maxWidth={false} disableGutters>
          <Box sx={{ 
            maxWidth: '100%',
            '& > *': { maxWidth: '100%' },
            position: 'relative',
            zIndex: 1
          }}>
            <Outlet />
          </Box>
        </ContentContainer>
        <Footer>
          <FooterContent>
            <span>© {new Date().getFullYear()} {author}</span>
            <span>Version {version}</span>
          </FooterContent>
          <FooterGradient />
        </Footer>
      </MainContent>
    </LayoutRoot>
  );
};

export default Layout;