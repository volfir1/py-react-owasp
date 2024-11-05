import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bug, Menu, X, LogIn } from 'lucide-react';

const Navbar = ({ project }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/users', label: 'Users' }
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-content">
          {/* Logo */}
          <Link to="/" className="navbar-brand">
            <Bug className="navbar-logo" />
            <span className="navbar-brand-text">{project}</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="navbar-menu-desktop">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${
                  location.pathname === item.path ? 'active' : ''
                }`}
              >
                {item.label}
              </Link>
            ))}

            {/* Login Link */}
            <Link to="/login" className="nav-link-login">
              <LogIn className="login-icon" />
              <span>Login</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="navbar-mobile-toggle">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="mobile-menu-button"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="navbar-menu-mobile">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`nav-link-mobile ${
                  location.pathname === item.path ? 'active' : ''
                }`}
              >
                {item.label}
              </Link>
            ))}

            {/* Mobile Login Link */}
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="nav-link-login-mobile"
            >
              <LogIn className="login-icon" />
              <span>Login</span>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;