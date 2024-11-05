// App.js
import React from 'react';
import Navbar from './components/navbar';
import Footer from './components/footer';

const App = () => {
  const project = "My Project";
  const navigation = [
    { label: "Home", link: "/" },
    { label: "About", link: "/about" },
    { label: "Contact", link: "/contact" },
    // Add more navigation items as needed
  ];
  const author = "Author Name";
  const version = "1.0.0";
  const url = "version";
  return (
    <div>
      <Navbar project={project} navigation={navigation} />
      {/* Rest of your app components */}
      <main role="main" className='container'>
      <h1>Welcome!</h1>
      </main>
      <Footer author={author} version={version} url={url} />
    </div>
  );
};

export default App;
