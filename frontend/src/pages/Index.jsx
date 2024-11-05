import React from 'react';
import { Link } from 'react-router-dom';

const Layout = ({ 
  children, 
  title = "Default Title", 
  project = "DSVPWA", 
  author = "Author Name",
  version = "1.0.0",
  url = "#",
  navigation = [] // Array of navigation items
}) => {
  return (
    <>
      <head>
        <meta charSet="utf-8" />
        <title>{title} | {project}</title>
      </head>
      <body>
        <nav className="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
          <div className="container">
            <Link className="navbar-brand" to="/">
              <i className="fas fa-bug"></i>
              {project}
            </Link>
            <div className="collapse navbar-collapse" id="navbar">
              <ul className="navbar-nav mr-auto">
                {navigation.map((item, index) => (
                  <li key={index} className="nav-item">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </nav>

        <main role="main" className="container">
          <h1>Welcome!</h1>
          {children} {/* This replaces {content} */}
        </main>

        <footer className="footer">
          <div className="container">
            <p className="float-left text-left copyright">
              <small>&copy; {new Date().getFullYear()} {author}</small>
            </p>
            <p className="float-right text-right version">
              <small>
                <a href={url}>{version}</a>
              </small>
            </p>
          </div>
        </footer>
      </body>
    </>
  );
};

export default Layout;