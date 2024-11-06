import React, { useState, useTransition } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Bug,
  Menu,
  X,
  LogIn,
  Home,
  User,
  Users,
  MessageCircle,
  Book,
  ArrowUpRight,
  FileOutput,
  ShieldAlert,
  FileText,
  Settings,
  Shield,
  AlertTriangle,
  ChevronDown,
  LayoutDashboard
} from 'lucide-react';
import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Container,
  Typography,
  Menu as MuiMenu,
  MenuItem,
  Divider,
} from '@mui/material';
import { styled } from '@mui/material/styles';

import Login from '../pages/Login';
// Styled components (keeping your existing styles)
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: 'white',
  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
}));

const StyledToolbar = styled(Toolbar)({
  justifyContent: 'space-between',
  padding: '0.5rem 0',
});

const NavButton = styled(Button)(({ theme, isactive }) => ({
  marginLeft: '0.5rem',
  color: isactive === 'true' ? '#3a86ff' : '#4a5568',
  '&:hover': {
    backgroundColor: 'transparent',
    color: '#3a86ff',
  },
  fontWeight: isactive === 'true' ? 600 : 500,
  textTransform: 'none',
  fontSize: '0.95rem',
}));

const DropdownButton = styled(Button)(({ theme }) => ({
  marginLeft: '0.5rem',
  color: '#4a5568',
  '&:hover': {
    backgroundColor: 'transparent',
    color: '#3a86ff',
  },
  textTransform: 'none',
  fontSize: '0.95rem',
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

const MobileNavLink = styled(Link)(({ isactive }) => ({
  textDecoration: 'none',
  color: isactive === 'true' ? '#3a86ff' : '#4a5568',
  fontWeight: isactive === 'true' ? 600 : 500,
  display: 'flex',
  alignItems: 'center',
  width: '100%',
}));

const MenuListItem = styled(MenuItem)({
  gap: '0.75rem',
  padding: '0.5rem 1rem',
  minWidth: '200px',
  '&:hover': {
    backgroundColor: '#f8faff',
    color: '#3a86ff',
  },
});

const Navbar = ({ project }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [anchorEls, setAnchorEls] = useState({
    features: null,
    tools: null,
    admin: null
  });

  const [isPending, startTransition] = useTransition();
  const handleNavigate = (to) => {
    startTransition(() => {
      setIsOpen(false);
      // Any navigation logic here
    });
  };

  const location = useLocation();

  const handleMenuOpen = (menu) => (event) => {
    setAnchorEls({ ...anchorEls, [menu]: event.currentTarget });
  };

  const handleMenuClose = (menu) => {
    setAnchorEls({ ...anchorEls, [menu]: null });
  };

  // Main navigation items
  const mainNavItems = [
    { path: '/', label: 'Home', icon: <Home size={18} /> },
    { path: '/profile', label: 'Profile', icon: <User size={18} /> },
    { path: '/users', label: 'Users', icon: <Users size={18} /> },
  ];

  // Features dropdown items
  const featureItems = [
    { path: '/messages', label: 'Messages', icon: <MessageCircle size={18} /> },
    { path: '/guestbook', label: 'Guestbook', icon: <Book size={18} /> },
  ];

  // Tools dropdown items
  const toolItems = [
    { path: '/jump', label: 'Jump', icon: <ArrowUpRight size={18} /> },
    { path: '/extract', label: 'Extract', icon: <FileOutput size={18} /> },
    { path: '/diagnostics', label: 'Diagnostics', icon: <ShieldAlert size={18} /> },
    { path: '/documents', label: 'Documents', icon: <FileText size={18} /> },
  ];

  // Admin dropdown items
  const adminItems = [
    { path: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { path: '/settings', label: 'Settings', icon: <Settings size={18} /> },
    { path: '/security', label: 'Security', icon: <Shield size={18} /> },
    { path: '/danger', label: 'Danger Zone', icon: <AlertTriangle size={18} />, danger: true },
  ];

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
              {/* Main Nav Items */}
              {mainNavItems.map((item) => (
                <NavButton
                  key={item.path}
                  component={Link}
                  to={item.path}
                  active={location.pathname === item.path ? 1 : 0}
                  startIcon={item.icon}
                >
                  {item.label}
                </NavButton>
              ))}

              {/* Features Dropdown */}
              <DropdownButton
                onClick={handleMenuOpen('features')}
                endIcon={<ChevronDown size={16} />}
              >
                Features
              </DropdownButton>
              <MuiMenu
                anchorEl={anchorEls.features}
                open={Boolean(anchorEls.features)}
                onClose={() => handleMenuClose('features')}
                PaperProps={{
                  elevation: 3,
                  sx: { mt: 1, borderRadius: '0.75rem' }
                }}
              >
                {featureItems.map((item) => (
                  <MenuListItem
                    key={item.path}
                    component={Link}
                    to={item.path}
                    onClick={() => handleMenuClose('features')}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </MenuListItem>
                ))}
              </MuiMenu>

              {/* Tools Dropdown */}
              <DropdownButton
                onClick={handleMenuOpen('tools')}
                endIcon={<ChevronDown size={16} />}
              >
                Tools
              </DropdownButton>
              <MuiMenu
                anchorEl={anchorEls.tools}
                open={Boolean(anchorEls.tools)}
                onClose={() => handleMenuClose('tools')}
                PaperProps={{
                  elevation: 3,
                  sx: { mt: 1, borderRadius: '0.75rem' }
                }}
              >
                {toolItems.map((item) => (
                  <MenuListItem
                    key={item.path}
                    component={Link}
                    to={item.path}
                    onClick={() => handleMenuClose('tools')}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </MenuListItem>
                ))}
              </MuiMenu>

              {/* Admin Dropdown */}
              <DropdownButton
                onClick={handleMenuOpen('admin')}
                endIcon={<ChevronDown size={16} />}
              >
                Admin
              </DropdownButton>
              <MuiMenu
                anchorEl={anchorEls.admin}
                open={Boolean(anchorEls.admin)}
                onClose={() => handleMenuClose('admin')}
                PaperProps={{
                  elevation: 3,
                  sx: { mt: 1, borderRadius: '0.75rem' }
                }}
              >
                {adminItems.map((item) => (
                  <MenuListItem
                    key={item.path}
                    component={Link}
                    to={item.path}
                    onClick={() => handleMenuClose('admin')}
                    sx={item.danger ? { color: 'red' } : {}}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </MenuListItem>
                ))}
              </MuiMenu>

              <LoginButton
                component={Link}
                to="/login"
                startIcon={<LogIn size={18} />}
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
          {/* Main Nav Items */}
          {mainNavItems.map((item) => (
            <MobileNavItem key={item.path} disablePadding>
              <MobileNavLink
                to={item.path}
                active={location.pathname === item.path}
                onClick={() => setIsOpen(false)}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </MobileNavLink>
            </MobileNavItem>
          ))}

          <Divider sx={{ my: 1 }} />
          
          {/* Features Section */}
          <ListItem sx={{ pl: 3, py: 1 }}>
            <Typography variant="subtitle2" color="textSecondary">Features</Typography>
          </ListItem>
          {featureItems.map((item) => (
            <MobileNavItem key={item.path} disablePadding>
              <MobileNavLink
                to={item.path}
                onClick={() => setIsOpen(false)}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </MobileNavLink>
            </MobileNavItem>
          ))}

          <Divider sx={{ my: 1 }} />
          
          {/* Tools Section */}
          <ListItem sx={{ pl: 3, py: 1 }}>
            <Typography variant="subtitle2" color="textSecondary">Tools</Typography>
          </ListItem>
          {toolItems.map((item) => (
            <MobileNavItem key={item.path} disablePadding>
              <MobileNavLink
                to={item.path}
                onClick={() => setIsOpen(false)}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </MobileNavLink>
            </MobileNavItem>
          ))}

          <Divider sx={{ my: 1 }} />
          
          {/* Admin Section */}
          <ListItem sx={{ pl: 3, py: 1 }}>
            <Typography variant="subtitle2" color="textSecondary">Admin</Typography>
          </ListItem>
          {adminItems.map((item) => (
            <MobileNavItem key={item.path} disablePadding>
              <MobileNavLink
                to={item.path}
                onClick={() => setIsOpen(false)}
                sx={item.danger ? { color: 'red' } : {}}
              >
                <ListItemIcon sx={{ minWidth: 40, color: item.danger ? 'red' : 'inherit' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </MobileNavLink>
            </MobileNavItem>
          ))}

          <Divider sx={{ my: 1 }} />

          {/* Login */}
          <MobileNavItem disablePadding>
            <MobileNavLink
              to="/login"
              onClick={() => setIsOpen(false)}
              sx={{ color: '#3a86ff' }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: '#3a86ff' }}>
                <LogIn size={20} />
              </ListItemIcon>
              <ListItemText primary="Login" />
            </MobileNavLink>
          </MobileNavItem>
        </MobileNavList>
      </Drawer>
    </>
  );
};

export default Navbar;