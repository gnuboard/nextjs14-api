// Code: src/app/(home)/layout.js

import React from 'react';
import '../globals.css';
import { Container, Box } from '@mui/material';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Snake',
};

const RootLayout = ({ children }) => {
  return (
    <>
      <Header />
      <Container maxWidth="lg">
        <Box my={4}>
          <main>{children}</main>
        </Box>
      </Container>
      <Footer />
    </>
  );
};

export default RootLayout;