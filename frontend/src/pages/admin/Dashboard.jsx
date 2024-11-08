// src/pages/Dashboard/AdminDashboard.jsx
import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Paper,
  Divider,
  Avatar,
  LinearProgress
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const StatCard = ({ title, value, icon, progress }) => (
  <Card sx={{ height: '100%', transform: 'translateZ(0)', '&:hover': { transform: 'scale(1.02)' }, transition: 'transform 0.2s' }}>
    <CardContent>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography color="textSecondary" variant="h6">
            {title}
          </Typography>
          <Typography variant="h4" sx={{ color: '#4F46E5', fontWeight: 'bold' }}>
            {value}
          </Typography>
        </Box>
        <Avatar sx={{ bgcolor: 'rgba(79, 70, 229, 0.1)', color: '#4F46E5' }}>
          {icon}
        </Avatar>
      </Box>
      <Box mt={2}>
        <LinearProgress 
          variant="determinate" 
          value={progress} 
          sx={{
            height: 6,
            borderRadius: 3,
            bgcolor: 'rgba(79, 70, 229, 0.1)',
            '& .MuiLinearProgress-bar': {
              borderRadius: 3,
              bgcolor: '#4F46E5'
            }
          }}
        />
      </Box>
    </CardContent>
  </Card>
);

const AdminDashboard = () => {
  const { user } = useAuth();
  
  // Static data based on your XML structure
  const dashboardData = {
    statistics: {
      total_users: 6, // Total count from your XML
      total_students: 4, // Count of users with student role
      total_admins: 2, // Count of users with admin role
      active_sessions: 24
    }
  };

  const stats = [
    {
      title: 'Total Users',
      value: dashboardData.statistics.total_users,
      icon: <PersonIcon />,
      progress: 70
    },
    {
      title: 'Total Students',
      value: dashboardData.statistics.total_students,
      icon: <SchoolIcon />,
      progress: 85
    },
    {
      title: 'Total Admins',
      value: dashboardData.statistics.total_admins,
      icon: <AdminPanelSettingsIcon />,
      progress: 45
    },
    {
      title: 'Active Sessions',
      value: dashboardData.statistics.active_sessions,
      icon: <TrendingUpIcon />,
      progress: 60
    }
  ];

  return (
    <Box sx={{ p: 3, bgcolor: '#F8FAFF', minHeight: '100vh' }}>
      {/* Welcome Section */}
      <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)', color: 'white' }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
            Welcome back, {user?.firstname || 'Administrator'}
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            Here's what's happening in your admin dashboard today
          </Typography>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {stats.map((stat) => (
          <Grid item xs={12} sm={6} md={3} key={stat.title}>
            <StatCard {...stat} />
          </Grid>
        ))}
      </Grid>

      {/* Quick Actions & System Info */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Quick Actions
              </Typography>
              <Grid container spacing={2}>
                {['Add User', 'View Reports', 'System Settings', 'Message Users'].map((action) => (
                  <Grid item xs={6} key={action}>
                    <Paper 
                      sx={{ 
                        p: 2, 
                        textAlign: 'center', 
                        cursor: 'pointer',
                        '&:hover': {
                          bgcolor: 'rgba(79, 70, 229, 0.1)'
                        }
                      }}
                      elevation={0}
                    >
                      <Typography color="textSecondary">{action}</Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                System Information
              </Typography>
              <Box sx={{ '& > *': { my: 1.5 } }}>
                <Box display="flex" justifyContent="space-between">
                  <Typography color="textSecondary">System Status</Typography>
                  <Typography color="success.main" fontWeight={500}>Online</Typography>
                </Box>
                <Divider />
                <Box display="flex" justifyContent="space-between">
                  <Typography color="textSecondary">Last Updated</Typography>
                  <Typography>{new Date().toLocaleTimeString()}</Typography>
                </Box>
                <Divider />
                <Box display="flex" justifyContent="space-between">
                  <Typography color="textSecondary">Server Load</Typography>
                  <Typography color="primary" fontWeight={500}>42%</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;