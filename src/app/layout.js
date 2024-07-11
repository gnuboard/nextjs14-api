// src/app/layout.js

import React from 'react';
import './globals.css';
import { AuthProvider } from '@/components/AuthContext';
import { ThemeProvider } from '@/components/ThemeProvider';
import GlobalStyle from '@/components/GlobalStyle';
import FloatingChatIcon from '@/components/FloatingChatIcon';

export const metadata = {
  title: 'g6-api-연결',
};

const RootLayout = ({ children }) => {
  return (
    <html lang="ko">
      <body>
        <ThemeProvider>
          <AuthProvider>
            <GlobalStyle />
            <div id="__next">
              {children}
            </div>
            <FloatingChatIcon />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;