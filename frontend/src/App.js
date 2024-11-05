import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TestConnection from './pages/TestConnection';
import Users from './pages/Users';
import Login from './pages/Login';
import Home from './pages/Index';
import Navbar from './components/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
function App() {
  return (
    <Router>
      <div className="app">
        <Navbar project="DSVPWA" />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/users" element={<Users />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;