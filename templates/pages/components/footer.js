// Footer.js
import React from 'react';

const Footer = ({ author, version, url }) => (
  <footer className="footer">
    <div className="container">
      <p className="float-left text-left copyright">
        <small>&copy; 2021 {author}</small>
      </p>
      <p className="float-right text-right version">
        <small><a href={url}>{version}</a></small>
      </p>
    </div>
  </footer>
);

export default Footer;
