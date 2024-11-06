import React, { useState, useEffect, useRef } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Search, Users as UsersIcon } from 'lucide-react';
import { useToast } from '../components/Snackbar';
import '../styles/users.css';

const Users = () => {
  const [userId, setUserId] = useState('');
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const initialLoadDone = useRef(false);

  const fetchUsers = async (id = '') => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Only show loading toast for manual searches, not initial load
      if (id || initialLoadDone.current) {
        toast.info(
          id 
            ? `Searching for user with ID: ${id}...`
            : 'Loading all users...',
          { duration: 2000 }
        );
      }

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

      // Only show success toast if it's not the initial load
      // or if it's a specific search
      if (id || initialLoadDone.current) {
        const resultCount = data.data.length;
        if (id) {
          toast.success(
            resultCount === 0 
              ? `No users found with ID: ${id}`
              : `Found ${resultCount} user${resultCount > 1 ? 's' : ''} matching ID: ${id}`
          );
        } else {
          toast.success(`Successfully loaded ${resultCount} users`);
        }
      }

      // Mark initial load as complete after first successful load
      initialLoadDone.current = true;
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
      setUsers([]);
      toast.error(`Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userId.trim()) {
      toast.warning('Please enter a user ID to search');
      return;
    }
    fetchUsers(userId);
  };

  useEffect(() => {
    // Initial load
    fetchUsers();
    // No cleanup needed since we're using the ref to track initial load
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setUserId(value);
    
    // Clear search when input is emptied
    if (value === '') {
      fetchUsers();
      // Only show toast if it's not the initial state
      if (initialLoadDone.current) {
        toast.info('Showing all users');
      }
    }
  };

  // Rest of the component remains the same...
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
                  onChange={handleInputChange}
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