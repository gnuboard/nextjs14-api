// src/app/layout.js
import React from 'react';
import './globals.css';
import { AuthProvider } from '@/components/AuthContext';
import { ThemeProvider } from '@/components/ThemeContext';
import GlobalStyle from '@/components/GlobalStyle';

export const metadata = {
  title: 'Opus',
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
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
