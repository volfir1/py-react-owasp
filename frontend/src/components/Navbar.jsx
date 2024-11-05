import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bug, Menu, X, LogIn } from 'lucide-react';
import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  Container,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';

// Styled components
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: 'white',
  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
}));

const StyledToolbar = styled(Toolbar)({
  justifyContent: 'space-between',
  padding: '0.5rem 0',
});

const NavButton = styled(Button)(({ theme, active }) => ({
  marginLeft: '1rem',
  color: active ? '#3a86ff' : '#4a5568',
  '&:hover': {
    backgroundColor: 'transparent',
    color: '#3a86ff',
  },
  fontWeight: active ? 600 : 500,
  textTransform: 'none',
  fontSize: '1rem',
}));

const LoginButton = styled(Button)(({ theme }) => ({
  marginLeft: '1rem',
  backgroundColor: '#3a86ff',
  color: 'white',
  '&:hover': {
    backgroundColor: '#2872ff',
  },
  textTransform: 'none',
  borderRadius: '0.75rem',
  padding: '0.5rem 1.25rem',
  fontWeight: 500,
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
}));

const LogoLink = styled(Link)({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
  color: '#2d3748',
  gap: '0.5rem',
});

const BrandText = styled(Typography)({
  fontSize: '1.25rem',
  fontWeight: 600,
  background: 'linear-gradient(120deg, #3a86ff, #8338ec)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
});

const MobileNavList = styled(List)({
  paddingTop: '1rem',
});

const MobileNavItem = styled(ListItem)({
  padding: '0.75rem 1.5rem',
});

const MobileNavLink = styled(Link)(({ active }) => ({
  textDecoration: 'none',
  color: active ? '#3a86ff' : '#4a5568',
  fontWeight: active ? 600 : 500,
  display: 'flex',
  alignItems: 'center',
  width: '100%',
}));

const Navbar = ({ project }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/users', label: 'Users' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <StyledAppBar position="sticky">
        <Container maxWidth="xl">
          <StyledToolbar>
            <LogoLink to="/">
              <Bug size={28} color="#3a86ff" />
              <BrandText variant="h6">{project}</BrandText>
            </LogoLink>

            {/* Desktop Navigation */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
              {navItems.map((item) => (
                <NavButton
                  key={item.path}
                  component={Link}
                  to={item.path}
                  active={isActive(item.path)}
                >
                  {item.label}
                </NavButton>
              ))}
              <LoginButton
                component={Link}
                to="/login"
                startIcon={<LogIn size={20} />}
              >
                Login
              </LoginButton>
            </Box>

            {/* Mobile menu button */}
            <IconButton
              sx={{ display: { xs: 'flex', md: 'none' }, color: '#4a5568' }}
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </IconButton>
          </StyledToolbar>
        </Container>
      </StyledAppBar>

      {/* Mobile Navigation Drawer */}
      <Drawer
        anchor="right"
        open={isOpen}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: {
            width: '240px',
            backgroundImage: 'linear-gradient(135deg, #f6f7ff 0%, #f0f2ff 100%)',
          }
        }}
      >
        <MobileNavList>
          {navItems.map((item) => (
            <MobileNavItem key={item.path} disablePadding>
              <MobileNavLink
                to={item.path}
                active={isActive(item.path)}
                onClick={() => setIsOpen(false)}
              >
                <ListItemText primary={item.label} />
              </MobileNavLink>
            </MobileNavItem>
          ))}
          <MobileNavItem disablePadding>
            <MobileNavLink
              to="/login"
              onClick={() => setIsOpen(false)}
              sx={{
                color: '#3a86ff',
                gap: '0.5rem',
              }}
            >
              <LogIn size={20} />
              <ListItemText primary="Login" />
            </MobileNavLink>
          </MobileNavItem>
        </MobileNavList>
      </Drawer>
    </>
  );
};

export default Navbar;