import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Search, Users as UsersIcon } from 'lucide-react';
import '../styles/users.css';

const Users = () => {
  const [userId, setUserId] = useState('');
  const [users, setUsers] = useState([]);
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
      setUsers([]);
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
        </div>

        <Paper elevation={0} className="search-card">
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
        </Paper>

        {error && (
          <div className="error-alert">
            {error}
          </div>
        )}

        <Paper elevation={0} className="table-card">
          <TableContainer>
            <Table className="modern-table">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Username</TableCell>
                  <TableCell>First Name</TableCell>
                  <TableCell>Last Name</TableCell>
                  <TableCell>Email</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5}>
                      <div className="loading-spinner">
                        <div className="spinner"></div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5}>
                      <div className="no-results">
                        No users found
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="id-cell">{user.id}</TableCell>
                      <TableCell className="username-cell">{user.username}</TableCell>
                      <TableCell>{user.firstname}</TableCell>
                      <TableCell>{user.lastname}</TableCell>
                      <TableCell className="email-cell">{user.email}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </div>
    </div>
  );
};

export default Users;