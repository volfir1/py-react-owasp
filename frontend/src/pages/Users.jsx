import React, { useState, useEffect } from 'react';
import '../styles/users.css';
const Users = () => {
  const [userId, setUserId] = useState('');
  const [users, setUsers] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchUsers = async (id = '') => {
    setIsLoading(true);
    setError(null);
    
    try {
      const url = id 
        ? `/api/users?id=${id}`
        : '/api/users';
        
      console.log('Fetching:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.status === 'error') {
        throw new Error(data.message);
      }
      
      setUsers(data.data);
      setError(null);
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
      setUsers(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchUsers(userId);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="main-container">
      <div className="container py-4">
        <div className="content-card glass-effect p-4">
          <h1 className="brand-text mb-4">User Management</h1>
          
          <div className="card mb-4">
            <div className="card-body">
              <form onSubmit={handleSubmit} className="row g-3 align-items-center">
                <div className="col-sm-11">
                  <input
                    type="text"
                    className="form-control"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder="Enter user ID (optional)"
                  />
                </div>
                <div className="col-sm-1">
                  <button 
                    type="submit" 
                    className="btn btn-primary w-100"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="spinner-border spinner-border-sm" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    ) : (
                      'Search'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          
          {isLoading && (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}
          
          {users && !isLoading && (
            <div className="table-responsive">
              {users.length > 0 ? (
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th scope="col">ID</th>
                      <th scope="col">Username</th>
                      <th scope="col">First Name</th>
                      <th scope="col">Last Name</th>
                      <th scope="col">Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.username}</td>
                        <td>{user.firstname}</td>
                        <td>{user.lastname}</td>
                        <td>{user.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="alert alert-info text-center">
                  No users found
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Users;