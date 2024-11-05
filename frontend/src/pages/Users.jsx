import React, { useState, useEffect } from 'react';
import { Search, Users as UsersIcon } from 'lucide-react';
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
      const url = id ? `/api/users?id=${id}` : '/api/users';
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      if (data.status === 'error') throw new Error(data.message);
      
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
    <div className="page-container">
      <div className="content-wrapper">
        <div className="header-section">
          <div className="d-flex align-items-center gap-2 mb-4">
            <UsersIcon size={28} className="text-primary" />
            <h1 className="heading-text">User Management</h1>
          </div>
          
          <div className="search-card">
            <form onSubmit={handleSubmit} className="search-form">
              <div className="input-wrapper">
                <div className="search-input-group">
                  <Search size={20} className="search-icon" />
                  <input
                    type="text"
                    className="modern-input"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder="Search by User ID"
                  />
                </div>
                <button 
                  type="submit" 
                  className="search-button"
                  disabled={isLoading}
                >
                  {isLoading ? 'Searching...' : 'Search'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {error && (
          <div className="error-alert">
            <p>{error}</p>
          </div>
        )}
        
        {isLoading && (
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        )}
        
        {users && !isLoading && (
          <div className="table-card">
            {users.length > 0 ? (
              <div className="table-responsive">
                <table className="modern-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Username</th>
                      <th>First Name</th>
                      <th>Last Name</th>
                      <th>Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td className="id-cell">{user.id}</td>
                        <td className="username-cell">{user.username}</td>
                        <td>{user.firstname}</td>
                        <td>{user.lastname}</td>
                        <td className="email-cell">{user.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="no-results">
                <p>No users found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;