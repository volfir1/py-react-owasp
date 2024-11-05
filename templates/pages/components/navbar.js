// Navbar.js
import React from 'react';

const Navbar = ({ project, navigation }) => (
  <nav className="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
    <div className="container">
      <a className="navbar-brand" href="/">
        <i className="fas fa-bug"></i> {project}
      </a>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbar"
        aria-controls="navbar"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbar">
        <ul className="navbar-nav mr-auto">
          {navigation.map((item, index) => (
            <li key={index} className="nav-item">
              <a className="nav-link" href={item.link}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </nav>
);

export default Navbar;
