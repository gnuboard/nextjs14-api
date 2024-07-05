// src/app/(authentication)/login/page.js
"use client";

import React, { useState } from 'react';
import { 
  Container, 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Paper,
  Snackbar,
  Alert
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { login } = useAuth();  // useAuth hook 사용

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!username || !password) {
      setError('사용자 이름과 비밀번호를 모두 입력해주세요.');
      return;
    }

    try {
      // Replace with actual login logic
      // Mocking login success with a token
      const token = 'mock-token';
      login(token, username);
      console.log('로그인 성공');
      router.push('/');
    } catch (error) {
      console.error('로그인 에러:', error);
      setError(error.message);
    }
  };

  const handleCloseError = () => {
    setError('');
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
          <Typography component="h1" variant="h5">
            로그인
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="사용자 이름"
              name="username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="비밀번호"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              로그인
            </Button>
          </Box>
        </Paper>
      </Box>
      <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseError}>
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
}
