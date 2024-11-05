import React, { useState, useEffect } from 'react';

const TestConnection = () => {
  const [status, setStatus] = useState('Testing...');

  useEffect(() => {
    const testConnection = async () => {
      try {
        const response = await fetch('/api/test');
        const data = await response.json();
        setStatus(data.message);
      } catch (error) {
        setStatus('Connection failed: ' + error.message);
      }
    };

    testConnection();
  }, []);

  return (
    <div>
      <h2>Connection Test</h2>
      <p>Status: {status}</p>
    </div>
  );
};

export default TestConnection;