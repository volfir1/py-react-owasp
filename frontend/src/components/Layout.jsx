import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import '../styles/navbar.css';
import '../styles/layout.css';
import '../styles/users.css'

const Layout = ({ project, author, version }) => {
  return (
    <div className="layout-container">
      <Navbar project={project} />
      
      <main className="layout-main">
        <div className="layout-content">
          {/* Page Header */}
          <div className="page-header">
            <div className="gradient-line"></div>
          </div>

          {/* Main Content Area */}
          <div className="content-wrapper">
            <Outlet />
          </div>

          {/* Footer */}
          <footer className="layout-footer">
            <div className="footer-content">
              <div className="footer-info">
                <span className="copyright">© {new Date().getFullYear()} {author}</span>
                <span className="version">Version {version}</span>
              </div>
              <div className="gradient-line bottom"></div>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default Layout;