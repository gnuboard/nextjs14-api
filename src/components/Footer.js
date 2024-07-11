// src/components/Footer.js
"use client";
import React from 'react';
import { Box, Typography, Switch } from '@mui/material';
import { useTheme } from '@mui/material/styles'; // useTheme 훅을 @mui/material/styles에서 가져옴
import { useTheme as useCustomTheme } from '@/components/ThemeProvider'; // ThemeProvider에서 테마 관련 훅 import

const Footer = () => {
  const theme = useTheme(); // MUI의 useTheme 훅을 사용하여 theme 가져오기
  const { isDarkMode, toggleTheme } = useCustomTheme(); // 커스텀 ThemeProvider에서 테마 상태와 토글 함수 가져오기

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        padding: '1rem',
        textAlign: 'center',
      }}
    >
      <Typography variant="body2" sx={{ mb: 1 }}>
        회사 주소: 123 Company St, City, Country
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Typography variant="body2" sx={{ mr: 1 }}>
          Dark Mode
        </Typography>
        <Switch checked={isDarkMode} onChange={toggleTheme} />
      </Box>
    </Box>
  );
};

export default Footer;
