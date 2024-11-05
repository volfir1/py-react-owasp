import React from 'react';
import { Outlet } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Box, Container } from '@mui/material';
import Navbar from './Navbar';

// Styled components
const LayoutRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  backgroundColor: '#f8faff',
}));

const MainContent = styled('main')(({ theme }) => ({
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  minHeight: 'calc(100vh - 64px)', // Subtracting navbar height
}));

const GradientBorder = styled('div')({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  height: '2px',
  background: 'linear-gradient(90deg, #3a86ff 0%, #8338ec 100%)',
  opacity: 0.7,
});

const ContentContainer = styled(Container)(({ theme }) => ({
  flexGrow: 1,
  width: '100%',
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(10), // Space for footer
  [theme.breakpoints.down('sm')]: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(8),
  },
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
}));

const FooterContent = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontSize: '0.875rem',
  color: '#64748b',
  position: 'relative',
});

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
  return (
    <LayoutRoot>
      {/* Navbar */}
      <Navbar project={project} />

      {/* Top Gradient Border */}
      <GradientBorder />

      {/* Main Content */}
      <MainContent>
        <ContentContainer maxWidth="xl">
          <Outlet />
        </ContentContainer>

        {/* Footer */}
        <Footer>
          <Container maxWidth="xl">
            <FooterContent>
              <span>© {new Date().getFullYear()} {author}</span>
              <span>Version {version}</span>
            </FooterContent>
            <FooterGradient />
          </Container>
        </Footer>
      </MainContent>
    </LayoutRoot>
  );
};

// Add this to your global CSS or create a new styles/global.css file
const globalStyles = `
  body {
    margin: 0;
    padding: 0;
    background-color: #f8faff;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  * {
    box-sizing: border-box;
  }

  /* Custom scrollbar styling */
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
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #2872ff;
  }

  /* For Firefox */
  * {
    scrollbar-width: thin;
    scrollbar-color: #3a86ff #f1f1f1;
  }
`;

export default Layout;