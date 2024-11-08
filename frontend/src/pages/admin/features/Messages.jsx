import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  IconButton,
} from '@mui/material';
import {
  Code as CodeIcon,
  Storage as StorageIcon,
  Key as KeyIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useToast } from '../../../components/Snackbar'; // Adjust path as needed

const Messages = () => {
  const [message, setMessage] = useState('');
  const [results, setResults] = useState([]);
  const [activeTest, setActiveTest] = useState('sql');
  const toast = useToast();

  const testTypes = {
    xss: {
      title: 'XSS TESTING',
      icon: <CodeIcon />,
      expectedOutput: [
        {
          name: 'Basic Script',
          desc: 'Should return unescaped script',
          example: '<script>alert("XSS")</script>',
          payload: '<script>alert("XSS")</script>'
        }
      ]
    },
    sql: {
      title: 'SQL INJECTION',
      icon: <StorageIcon />,
      expectedOutput: [
        {
          name: 'Basic SELECT',
          desc: 'Should return all users',
          example: '[{"id":1,...}]',
          payload: '1 OR 1=1'
        },
        {
          name: 'Error Based',
          desc: 'Should trigger SQL error',
          example: 'error',
          payload: "' OR '1'='1"
        }
      ]
    },
    session: {
      title: 'SESSION HIJACK',
      icon: <KeyIcon />,
      expectedOutput: [
        {
          name: 'Admin Session',
          desc: 'Should set admin session',
          example: 'Cookie: SESSIONID=admin_session',
          payload: 'admin_session'
        }
      ]
    }
  };

  const handleClear = () => {
    setResults([]);
    toast.info('Test results cleared');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.warning('Please enter a test payload');
      return;
    }

    try {
      const test = testTypes[activeTest];
      const endpoint = activeTest === 'sql' ? '/sqli' : activeTest === 'xss' ? '/xss' : '/session';
      const param = activeTest === 'sql' ? 'id' : 'msg';
      
      toast.info(`Running ${activeTest.toUpperCase()} test...`, { duration: 2000 });
      
      const response = await fetch(`${endpoint}?${param}=${encodeURIComponent(message)}`);
      const responseText = await response.text();

      setResults(prev => [...prev, {
        type: activeTest,
        payload: message,
        result: responseText,
        time: new Date().toLocaleString()
      }]);

      toast.success(`${activeTest.toUpperCase()} test completed successfully`);
      setMessage('');
    } catch (error) {
      setResults(prev => [...prev, {
        type: activeTest,
        payload: message,
        result: `Error: ${error.message}`,
        time: new Date().toLocaleString(),
        isError: true
      }]);

      toast.error(`Test failed: ${error.message}`);
    }
  };

  const handleExampleClick = (payload) => {
    setMessage(payload);
    toast.info(`Test payload loaded: ${payload.slice(0, 30)}${payload.length > 30 ? '...' : ''}`, {
      duration: 2000
    });
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#F8F9FE' }}>
      {/* Top Navigation */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'white', py: 1, px: 3 }}>
        <Typography variant="h6" component="div" sx={{ color: '#4285f4' }}>
          DSVPWA Vulnerability Testing
        </Typography>
      </Box>

      {/* Main Content */}
      <Box sx={{ 
        flex: 1, 
        display: 'flex', 
        gap: 2, 
        p: 3,
        height: 'calc(100vh - 64px)',
        overflow: 'hidden'
      }}>
        {/* Left Panel - Fixed Width */}
        <Box sx={{ 
          width: 300,
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}>
          {/* Test Type Selection */}
          <Paper sx={{ p: 2 }}>
            {Object.entries(testTypes).map(([key, test]) => (
              <Button
                key={key}
                startIcon={test.icon}
                onClick={() => {
                  setActiveTest(key);
                  toast.info(`Switched to ${test.title} mode`);
                }}
                sx={{
                  justifyContent: 'flex-start',
                  width: '100%',
                  mb: 1,
                  py: 1,
                  color: activeTest === key ? 'white' : '#5f6368',
                  bgcolor: activeTest === key ? '#4285f4' : 'white',
                  '&:hover': {
                    bgcolor: activeTest === key ? '#4285f4' : '#f8f9fa'
                  }
                }}
              >
                {test.title}
              </Button>
            ))}
          </Paper>

          {/* Expected Output Examples - Now Clickable */}
          <Paper sx={{ p: 2, flex: 1, overflow: 'auto' }}>
            <Typography variant="subtitle2" gutterBottom>
              Verification Tests:
            </Typography>
            {testTypes[activeTest].expectedOutput.map((output, idx) => (
              <Box 
                key={idx} 
                sx={{ 
                  mb: 2, 
                  cursor: 'pointer',
                  '&:hover': { 
                    bgcolor: '#f8f9fa',
                    borderRadius: 1 
                  },
                  p: 1
                }}
                onClick={() => handleExampleClick(output.payload)}
              >
                <Typography variant="caption" fontWeight="bold">
                  {output.name}
                </Typography>
                <Typography variant="caption" display="block" color="text.secondary">
                  {output.desc}
                </Typography>
                <Box sx={{ 
                  mt: 1, 
                  p: 1, 
                  bgcolor: '#f8f9fa', 
                  borderRadius: 1,
                  fontFamily: 'monospace',
                  fontSize: '0.75rem'
                }}>
                  Expected: {output.example}
                </Box>
              </Box>
            ))}
          </Paper>

          {/* Input Form */}
          <Paper 
            component="form" 
            onSubmit={handleSubmit}
            sx={{ p: 2 }}
          >
            <TextField
              fullWidth
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Test vulnerabilities here..."
              size="small"
              multiline
              rows={2}
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontFamily: 'monospace',
                  fontSize: '0.875rem'
                }
              }}
            />
            <Button
              type="submit"
              fullWidth
              sx={{ 
                mt: 2,
                bgcolor: '#4285f4',
                color: 'white',
                '&:hover': { bgcolor: '#3367d6' }
              }}
            >
              TEST {activeTest.toUpperCase()}
            </Button>
          </Paper>
        </Box>

        {/* Right Panel - Results Box */}
        <Paper sx={{ 
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          {/* Results Header */}
          <Box sx={{ 
            p: 2, 
            borderBottom: 1, 
            borderColor: 'divider',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Typography variant="subtitle1">Test Results</Typography>
            <IconButton 
              onClick={handleClear}
              color="error"
              title="Clear Results"
            >
              <DeleteIcon />
            </IconButton>
          </Box>

          {/* Scrollable Results Area */}
          <Box sx={{ 
            flex: 1, 
            overflow: 'auto',
            p: 2
          }}>
            {results.map((result, idx) => (
              <Paper
                key={idx}
                sx={{ 
                  p: 2,
                  mb: 2,
                  border: 1,
                  borderColor: result.isError ? '#ffcdd2' : '#e0e0e0',
                  bgcolor: result.isError ? '#ffebee' : 'white'
                }}
              >
                <Typography variant="subtitle2" gutterBottom>
                  Test Type: {result.type.toUpperCase()}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontFamily: 'monospace',
                    mb: 1,
                    color: '#5f6368'
                  }}
                >
                  Payload: {result.payload}
                </Typography>
                <Box sx={{ 
                  p: 2,
                  bgcolor: '#f8f9fa',
                  borderRadius: 1,
                  fontFamily: 'monospace',
                  fontSize: '0.875rem',
                  overflowX: 'auto'
                }}>
                  {result.result}
                </Box>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    display: 'block',
                    mt: 1,
                    color: '#5f6368'
                  }}
                >
                  {result.time}
                </Typography>
              </Paper>
            ))}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default Messages;