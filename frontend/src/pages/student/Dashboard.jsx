// src/pages/student/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Avatar, 
  CircularProgress,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Button
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  User,
  Mail,
  BookOpen,
  Calendar,
  Bell,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

// Styled Components
const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  borderRadius: '1rem',
  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
}));

const WelcomeCard = styled(StyledCard)(({ theme }) => ({
  background: 'linear-gradient(135deg, #3a86ff 0%, #8338ec 100%)',
  color: 'white',
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 80,
  height: 80,
  backgroundColor: 'white',
  color: '#3a86ff',
  fontSize: '2rem',
  fontWeight: 600,
  border: '4px solid rgba(255, 255, 255, 0.2)',
}));

const StatCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: '1rem',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  background: 'white',
  height: '100%',
}));

const NotificationsList = styled(List)(({ theme }) => ({
  maxHeight: 300,
  overflow: 'auto',
  '& .MuiListItem-root': {
    borderRadius: '0.5rem',
    marginBottom: theme.spacing(1),
    '&:hover': {
      backgroundColor: '#f8faff',
    },
  },
}));

const StudentDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { addToast } = useToast();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/dashboard', {
          credentials: 'include'
        });
        const result = await response.json();

        if (response.ok && result.status === 'success') {
          setData(result.data);
        } else {
          throw new Error(result.message || 'Failed to fetch dashboard data');
        }
      } catch (error) {
        console.error('Dashboard error:', error);
        addToast(error.message, { severity: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [addToast]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  // Sample data - replace with actual data from your API
  const stats = {
    coursesInProgress: 3,
    completedCourses: 5,
    upcomingDeadlines: 2,
    averageScore: 85
  };

  const notifications = [
    {
      id: 1,
      type: 'deadline',
      message: 'Assignment submission due in 2 days',
      course: 'Mathematics',
      time: '2 hours ago'
    },
    {
      id: 2,
      type: 'grade',
      message: 'New grade posted for your recent quiz',
      course: 'Physics',
      time: '1 day ago'
    },
    {
      id: 3,
      type: 'announcement',
      message: 'New study material available',
      course: 'Chemistry',
      time: '2 days ago'
    },
  ];

  const upcomingAssignments = [
    {
      id: 1,
      title: 'Math Assignment 3',
      dueDate: '2024-11-10',
      status: 'pending'
    },
    {
      id: 2,
      title: 'Physics Lab Report',
      dueDate: '2024-11-12',
      status: 'in_progress'
    },
    {
      id: 3,
      title: 'Chemistry Quiz',
      dueDate: '2024-11-15',
      status: 'pending'
    },
  ];

  return (
    <Box p={3}>
      <Grid container spacing={3}>
        {/* Welcome Card */}
        <Grid item xs={12} md={4}>
          <WelcomeCard>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <StyledAvatar>
                {data?.user_info?.name?.[0] || user?.firstname?.[0]}
              </StyledAvatar>
              <Typography variant="h5" sx={{ mt: 2, fontWeight: 600 }}>
                Welcome back, {data?.user_info?.name || user?.firstname}!
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
                Student ID: {user?.id}
              </Typography>
            </CardContent>
          </WelcomeCard>
        </Grid>

        {/* Quick Stats */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={2} height="100%">
            <Grid item xs={6} sm={3}>
              <StatCard elevation={0}>
                <BookOpen size={24} color="#3a86ff" />
                <Box>
                  <Typography variant="h4" fontWeight={600}>
                    {stats.coursesInProgress}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Active Courses
                  </Typography>
                </Box>
              </StatCard>
            </Grid>
            <Grid item xs={6} sm={3}>
              <StatCard elevation={0}>
                <CheckCircle size={24} color="#06d6a0" />
                <Box>
                  <Typography variant="h4" fontWeight={600}>
                    {stats.completedCourses}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Completed
                  </Typography>
                </Box>
              </StatCard>
            </Grid>
            <Grid item xs={6} sm={3}>
              <StatCard elevation={0}>
                <Calendar size={24} color="#ffd60a" />
                <Box>
                  <Typography variant="h4" fontWeight={600}>
                    {stats.upcomingDeadlines}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Deadlines
                  </Typography>
                </Box>
              </StatCard>
            </Grid>
            <Grid item xs={6} sm={3}>
              <StatCard elevation={0}>
                <AlertCircle size={24} color="#ef476f" />
                <Box>
                  <Typography variant="h4" fontWeight={600}>
                    {stats.averageScore}%
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Avg. Score
                  </Typography>
                </Box>
              </StatCard>
            </Grid>
          </Grid>
        </Grid>

        {/* Upcoming Assignments */}
        <Grid item xs={12} md={8}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Upcoming Assignments
              </Typography>
              <List>
                {upcomingAssignments.map((assignment) => (
                  <ListItem
                    key={assignment.id}
                    secondaryAction={
                      <IconButton edge="end">
                        <ChevronRight size={20} />
                      </IconButton>
                    }
                    sx={{ 
                      bgcolor: 'background.paper',
                      mb: 1,
                      borderRadius: '0.5rem'
                    }}
                  >
                    <ListItemIcon>
                      <Clock size={20} color={assignment.status === 'in_progress' ? '#ffd60a' : '#3a86ff'} />
                    </ListItemIcon>
                    <ListItemText
                      primary={assignment.title}
                      secondary={`Due: ${new Date(assignment.dueDate).toLocaleDateString()}`}
                    />
                  </ListItem>
                ))}
              </List>
              <Button 
                fullWidth 
                sx={{ 
                  mt: 2,
                  borderRadius: '0.75rem',
                  textTransform: 'none',
                  fontWeight: 500
                }}
              >
                View All Assignments
              </Button>
            </CardContent>
          </StyledCard>
        </Grid>

        {/* Notifications */}
        <Grid item xs={12} md={4}>
          <StyledCard>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" fontWeight={600}>
                  Recent Notifications
                </Typography>
                <Bell size={20} color="#3a86ff" />
              </Box>
              <NotificationsList>
                {notifications.map((notification) => (
                  <ListItem
                    key={notification.id}
                    sx={{ bgcolor: 'background.paper' }}
                  >
                    <ListItemText
                      primary={notification.message}
                      secondary={
                        <React.Fragment>
                          <Typography component="span" variant="body2" color="textSecondary">
                            {notification.course} • {notification.time}
                          </Typography>
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                ))}
              </NotificationsList>
              <Button 
                fullWidth 
                sx={{ 
                  mt: 2,
                  borderRadius: '0.75rem',
                  textTransform: 'none',
                  fontWeight: 500
                }}
              >
                View All Notifications
              </Button>
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StudentDashboard;