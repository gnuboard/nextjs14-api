"use client";

import React, { useState, useEffect } from 'react';
import { Snackbar, Paper, Typography, Button, Box } from '@mui/material';

const CookieConsentBanner = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const consent = getCookie('cookieConsent');
    if (!consent) {
      setOpen(true);
    }
  }, []);

  const handleAccept = () => {
    setCookie('cookieConsent', 'accepted', 365);
    setOpen(false);
  };

  const handleReject = () => {
    setCookie('cookieConsent', 'rejected', 365);
    setOpen(false);
  };

  const setCookie = (name, value, days) => {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
  };

  const getCookie = (name) => {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  };

  return (
    <Snackbar
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      open={open}
      sx={{ maxWidth: '100%', width: '100%' }}
    >
      <Paper elevation={6} sx={{ padding: 3, backgroundColor: '#f5f5f5', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)' }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, justifyContent: 'space-between' }}>
          <Box sx={{ marginBottom: { xs: 2, sm: 0 }, marginRight: { sm: 2 } }}>
            <Typography variant="body1" sx={{ marginBottom: 0.5 }}>
              이 웹사이트는 더 나은 사용자 경험을 위해 쿠키를 사용합니다.
            </Typography>
            <Typography variant="body1">
              쿠키 사용에 동의하시겠습니까?
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}>
            <Button onClick={handleReject} color="secondary" sx={{ marginRight: 1 }}>
              거부
            </Button>
            <Button onClick={handleAccept} color="primary" variant="contained">
              동의
            </Button>
          </Box>
        </Box>
      </Paper>
    </Snackbar>
  );
};

export default CookieConsentBanner;
