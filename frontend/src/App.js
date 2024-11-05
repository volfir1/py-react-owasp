import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TestConnection from './pages/TestConnection';
import Users from './pages/Users';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/test" element={<TestConnection />} />
        <Route path="/users" element={<Users />} />
      </Routes>
    </Router>
  );
}

export default App;