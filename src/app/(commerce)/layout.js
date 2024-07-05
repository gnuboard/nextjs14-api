// import React from 'react';
// import './globals.css';
// import BodyLayout from './BodyLayout';

// const RootLayout = ({ children }) => {
//   return (
//     <html lang="ko">
//       <BodyLayout>
//         {children}
//       </BodyLayout>
//     </html>
//   );
// };

// export default RootLayout;


import React from 'react';
import '../globals.css';
import { Container, Box } from '@mui/material';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: '커머스',
};

const RootLayout = ({ children }) => {
  return (
    <>
      <Header backgroundColor="#ff4081" />
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