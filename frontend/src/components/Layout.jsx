import React from 'react';
import { Outlet } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Box, Container, useTheme, useMediaQuery } from '@mui/material';
import Navbar from './Navbar';

// Styled components with improved overflow handling
const LayoutRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  maxWidth: '100vw',
  backgroundColor: '#f8faff',
  overflow: 'hidden', // Prevent horizontal scroll
  position: 'relative',
}));

const MainContent = styled('main')(({ theme }) => ({
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  minHeight: `calc(100vh - ${theme.spacing(8)})`, // 64px navbar
  width: '100%',
  overflowX: 'hidden',
  overflowY: 'auto',
  paddingBottom: theme.spacing(10), // Space for footer
  [theme.breakpoints.down('sm')]: {
    minHeight: `calc(100vh - ${theme.spacing(7)})`, // 56px navbar on mobile
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
  maxWidth: '1920px', // Maximum width for ultra-wide screens
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
  '& > *': { // Ensure all direct children don't overflow
    maxWidth: '100%',
  }
}));

const Footer = styled('footer')(({ theme }) => ({
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: '#fff',
  borderTop: '1px solid rgba(0, 0, 0, 0.05)',
  padding: theme.spacing(2, 0),
  zIndex: theme.zIndex.appBar - 1,
  backdropFilter: 'blur(8px)',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
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

const Layout = ({ project, author, version }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <LayoutRoot>
      <Navbar project={project} />
      
      <GradientBorder />
      
      <MainContent>
        <ContentContainer 
          maxWidth={false} // Let the styled component handle max-width
          disableGutters // We're handling padding in styled component
        >
          <Box 
            sx={{ 
              maxWidth: '100%',
              '& > *': { maxWidth: '100%' } // Ensure all nested components respect container width
            }}
          >
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

// Global styles
const globalStyles = `
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

  /* Improved scrollbar styling */
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

  /* Firefox scrollbar */
  * {
    scrollbar-width: thin;
    scrollbar-color: #3a86ff #f1f1f1;
  }

  /* Mobile height fix */
  @supports (-webkit-touch-callout: none) {
    .height-100 {
      height: -webkit-fill-available;
    }
  }
`;

// Add this to your index.js or App.js to handle mobile viewport height
const setAppHeight = () => {
  const doc = document.documentElement;
  doc.style.setProperty('--app-height', `${window.innerHeight}px`);
};

// Add these event listeners in your app initialization
window.addEventListener('resize', setAppHeight);
window.addEventListener('orientationchange', setAppHeight);
setAppHeight();

export default Layout;