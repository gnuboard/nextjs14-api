// @/app/(authentication)/layout.js

import React from 'react';
import { Container } from '@mui/material';

export default function AuthenticationLayout({ children }) {
  return (
    <Container maxWidth="xs">
      {children}
    </Container>
  );
}