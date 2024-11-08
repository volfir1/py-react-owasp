import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Bug,
  Menu,
  X,
  LogIn,
  LogOut,
  User,
  Users,
  MessageCircle,
  Settings,
  LayoutDashboard,
  ChevronDown,
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
  Avatar,
} from '@mui/material';
import { styled } from '@mui/material/styles';

// Styled Components
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: 'white',
  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
}));

const StyledToolbar = styled(Toolbar)({
  justifyContent: 'space-between',
  padding: '0.5rem 0',
});

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

const UserButton = styled(Button)(({ theme }) => ({
  marginLeft: '0.5rem',
  color: '#4a5568',
  textTransform: 'none',
  fontSize: '0.95rem',
  '&:hover': {
    backgroundColor: 'transparent',
    color: '#3a86ff',
  },
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
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [anchorEls, setAnchorEls] = useState({
    features: null,
    admin: null,
    profile: null,
  });
  const location = useLocation();

  const handleMenuOpen = (menu) => (event) => {
    setAnchorEls({ ...anchorEls, [menu]: event.currentTarget });
  };

  const handleMenuClose = (menu) => {
    setAnchorEls({ ...anchorEls, [menu]: null });
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
  
      const data = await response.json();
  
      if (response.ok && data.status === 'success') {
        await logout();
        navigate('/login');
      } else {
        console.error('Logout failed:', data.message);
      }
    } catch (error) {
      console.error('Logout error:', error);
      await logout();
      navigate('/login');
    }
  };

  // Updated navigation items based on role and routes structure
  const getNavItems = () => {
    // Shared items (available to both admin and student when logged in)
    const sharedItems = [
      { path: '/messages', label: 'Messages', icon: <MessageCircle size={18} /> },
    ];

    // Admin-specific items
    const adminItems = [
      { path: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
      { path: '/admin/users', label: 'Users', icon: <Users size={18} /> },
    ];

    // Student-specific items
    const studentItems = [
      { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    ];

    if (!user) return [];

    if (user.role === 'admin') {
      return [...adminItems, ...sharedItems];
    }
    
    if (user.role === 'student') {
      return [...studentItems, ...sharedItems];
    }

    return sharedItems;
  };

  // Profile menu items with correct paths
  const profileItems = [
    { 
      label: 'Dashboard', 
      icon: <LayoutDashboard size={18} />, 
      onClick: () => navigate(user?.role === 'admin' ? '/admin' : '/dashboard')
    },
    { 
      label: 'Profile', 
      icon: <User size={18} />, 
      onClick: () => navigate(user?.role === 'admin' ? '/admin/profile' : '/profile')
    },
    { 
      label: 'Settings', 
      icon: <Settings size={18} />, 
      onClick: () => navigate(user?.role === 'admin' ? '/admin/settings' : '/settings')
    },
    { 
      label: 'Logout', 
      icon: <LogOut size={18} />, 
      onClick: handleLogout,
      danger: true 
    },
  ];

  // Get navigation items based on user role
  const navItems = getNavItems();

  // Check if current path is active
  const isActivePath = (path) => {
    if (path === '/admin' || path === '/dashboard') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <StyledAppBar position="sticky">
        <Container maxWidth="xl">
          <StyledToolbar>
            <LogoLink to={user ? (user.role === 'admin' ? '/admin' : '/dashboard') : '/'}>
              <Bug size={28} color="#3a86ff" />
              <BrandText variant="h6">{project}</BrandText>
            </LogoLink>

            {/* Desktop Navigation */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
              {user ? (
                <>
                  {navItems.map((item) => (
                    <NavButton
                      key={item.path}
                      component={Link}
                      to={item.path}
                      isactive={isActivePath(item.path) ? 'true' : 'false'}
                      startIcon={item.icon}
                    >
                      {item.label}
                    </NavButton>
                  ))}

                  {/* User Profile Menu */}
                  <UserButton
                    onClick={handleMenuOpen('profile')}
                    startIcon={
                      <Avatar 
                        sx={{ 
                          width: 28, 
                          height: 28,
                          bgcolor: '#3a86ff',
                          fontSize: '0.875rem'
                        }}
                      >
                        {user.firstname?.[0] || user.username?.[0]}
                      </Avatar>
                    }
                    endIcon={<ChevronDown size={16} />}
                  >
                    {user.firstname || user.username}
                  </UserButton>
                  
                  <MuiMenu
                    anchorEl={anchorEls.profile}
                    open={Boolean(anchorEls.profile)}
                    onClose={() => handleMenuClose('profile')}
                    PaperProps={{
                      elevation: 3,
                      sx: { mt: 1, borderRadius: '0.75rem' }
                    }}
                  >
                    <Box sx={{ px: 2, py: 1 }}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Signed in as
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {user.email}
                      </Typography>
                    </Box>
                    <Divider sx={{ my: 1 }} />
                    {profileItems.map((item) => (
                      <MenuListItem
                        key={item.label}
                        onClick={() => {
                          handleMenuClose('profile');
                          item.onClick();
                        }}
                        sx={item.danger ? { color: 'red' } : {}}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </MenuListItem>
                    ))}
                  </MuiMenu>
                </>
              ) : (
                <LoginButton
                  component={Link}
                  to="/login"
                  startIcon={<LogIn size={18} />}
                >
                  Login
                </LoginButton>
              )}
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
          {user ? (
            <>
              {/* User Profile Section */}
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Avatar 
                  sx={{ 
                    width: 64, 
                    height: 64, 
                    bgcolor: '#3a86ff',
                    fontSize: '1.5rem',
                    margin: '0 auto'
                  }}
                >
                  {user.firstname?.[0] || user.username?.[0]}
                </Avatar>
                <Typography variant="subtitle1" sx={{ mt: 1, fontWeight: 500 }}>
                  {user.firstname || user.username}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {user.email}
                </Typography>
              </Box>

              <Divider sx={{ my: 1 }} />

              {/* Navigation Items */}
              {navItems.map((item) => (
                <MobileNavItem key={item.path} disablePadding>
                  <MobileNavLink
                    to={item.path}
                    isactive={isActivePath(item.path) ? 'true' : 'false'}
                    onClick={() => setIsOpen(false)}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.label} />
                  </MobileNavLink>
                </MobileNavItem>
              ))}

              <Divider sx={{ my: 1 }} />

              {/* Logout */}
              <MobileNavItem disablePadding>
                <MobileNavLink
                  to="#"
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  sx={{ color: 'red' }}
                >
                  <ListItemIcon sx={{ minWidth: 40, color: 'red' }}>
                    <LogOut size={20} />
                  </ListItemIcon>
                  <ListItemText primary="Logout" />
                </MobileNavLink>
              </MobileNavItem>
            </>
          ) : (
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
          )}
        </MobileNavList>
      </Drawer>
    </>
  );
};

export default Navbar;