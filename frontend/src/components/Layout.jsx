import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import '../styles/navbar.css';
import '../styles/layout.css';

const Layout = (props) => {
  return (
    <div className="layout-container">
      <Navbar project={props.project} />
      <main className="layout-main">
        <div className="layout-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;