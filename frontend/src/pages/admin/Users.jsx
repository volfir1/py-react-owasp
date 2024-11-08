import React, { useState, useEffect, useRef } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { Search, Users as UsersIcon, Plus } from 'lucide-react';
import '../../styles/users.css'

const Users = () => {
  const [userId, setUserId] = useState('');
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    role: ''
  });
  const initialLoadDone = useRef(false);

  const fetchUsers = async (id = '') => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (id || initialLoadDone.current) {
        // Your toast logic here if you want to keep it
      }

      const url = id ? `/api/users?id=${id}` : '/api/users';
      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.status === 'error') throw new Error(data.message);
      
      setUsers(data.data);
      setError(null);
      initialLoadDone.current = true;
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create user');
      }

      if (data.status === 'error') {
        throw new Error(data.message);
      }

      // Refresh user list and close dialog
      await fetchUsers();
      setShowCreateDialog(false);
      setNewUser({
        username: '',
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        role: ''
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setUserId(value);
    
    if (value === '') {
      fetchUsers();
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
          <div className="d-flex align-items-center justify-content-between gap-2 mb-4">
            <h1 className="heading-text">
              <UsersIcon size={28} className="text-primary" /> User Management
            </h1>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Plus size={20} />}
              onClick={() => setShowCreateDialog(true)}
            >
              Add User
            </Button>
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
                  <TableCell>Role</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <div className="loading-spinner">
                        <div className="spinner"></div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6}>
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
                      <TableCell>{user.role}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        <Dialog 
          open={showCreateDialog} 
          onClose={() => setShowCreateDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Create New User</DialogTitle>
          <form onSubmit={handleCreateUser}>
            <DialogContent>
              <div className="dialog-form-content">
                <TextField
                  fullWidth
                  label="Username"
                  value={newUser.username}
                  onChange={e => setNewUser({...newUser, username: e.target.value})}
                  margin="normal"
                  required
                />
                <TextField
                  fullWidth
                  label="First Name"
                  value={newUser.firstname}
                  onChange={e => setNewUser({...newUser, firstname: e.target.value})}
                  margin="normal"
                  required
                />
                <TextField
                  fullWidth
                  label="Last Name"
                  value={newUser.lastname}
                  onChange={e => setNewUser({...newUser, lastname: e.target.value})}
                  margin="normal"
                  required
                />
                <TextField
                  fullWidth
                  type="email"
                  label="Email"
                  value={newUser.email}
                  onChange={e => setNewUser({...newUser, email: e.target.value})}
                  margin="normal"
                  required
                />
                <TextField
                  fullWidth
                  type="password"
                  label="Password"
                  value={newUser.password}
                  onChange={e => setNewUser({...newUser, password: e.target.value})}
                  margin="normal"
                  required
                />
                <FormControl fullWidth margin="normal" required>
                  <InputLabel>Role</InputLabel>
                  <Select
                    value={newUser.role}
                    onChange={e => setNewUser({...newUser, role: e.target.value})}
                    label="Role"
                  >
                    <MenuItem value="admin">Admin</MenuItem>
                    <MenuItem value="user">User</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowCreateDialog(false)}>Cancel</Button>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary"
                disabled={isLoading}
              >
                {isLoading ? 'Creating...' : 'Create User'}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </div>
    </div>
  );
};

export default Users;