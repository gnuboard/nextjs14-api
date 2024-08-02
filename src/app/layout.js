// src/app/layout.js

import React from 'react';
import './globals.css';
import { AuthProvider } from '@/components/AuthContext';
import { ThemeProvider } from '@/components/ThemeProvider';
import FloatingChatIcon from '@/components/FloatingChatIcon';

export const metadata = {
  title: 'g6-api-연결',
};

const RootLayout = ({ children }) => {
  return (
    <html lang="ko">
      <body className="bg-gray-100 text-gray-900">
        <ThemeProvider>
          <AuthProvider>
            <div id="__next" className="min-h-screen flex flex-col">
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
