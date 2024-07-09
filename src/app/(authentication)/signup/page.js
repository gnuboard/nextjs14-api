// src/app/(authentication)/signup/page.js
'use client';

import React from 'react';
import { Container, Button, Paper, Box } from '@mui/material';
import { Aggrement } from '../../../components/Signup';

export default function Contact() {
  return (
    <div>
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
          <Aggrement></Aggrement>
          <Button variant="contained" color="primary" fullWidth style={{ marginTop: 20 }}>
            회원가입
          </Button>
          <Button variant="outlined" color="primary" fullWidth style={{ marginTop: 10 }}>
            취소
          </Button>
        </Paper>
      </Box>
    </div>
  );
}
