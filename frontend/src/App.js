import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import LoginPage from './pages/Login.jsx';
import Users from './pages/Users';

// Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';

// You can add some custom CSS if needed
const customStyles = `
  .navbar {
    box-shadow: 0 2px 4px rgba(0,0,0,.08);
  }
  
  .nav-link.active {
    color: #0d6efd !important;
    font-weight: 500;
  }
  
  .navbar-brand {
    font-size: 1.25rem;
  }
  
  .btn-primary {
    padding: 0.5rem 1rem;
  }
`;

const Home = () => (
  <div className="card">
    <div className="card-body">
      <h1 className="card-title">Welcome to DSVPWA</h1>
      <p className="card-text text-muted">
        This is the home page of your application.
      </p>
    </div>
  </div>
);

function App() {
  const appConfig = {
    project: "DSVPWA",
    author: "Your Name",
    version: "1.0.0",
    url: "https://github.com/yourusername/dsvpwa",
    title: "Login"
  };

  return (
    <>
      <style>{customStyles}</style>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage {...appConfig} />} />
          <Route path="/" element={<Layout {...appConfig} />}>
            <Route index element={<Home />} />
            <Route path="users" element={<Users />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;