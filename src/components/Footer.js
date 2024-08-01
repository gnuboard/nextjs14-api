// src/components/Footer.js
"use client";
import React from 'react';
import { useTheme as useCustomTheme } from '@/components/ThemeProvider'; // ThemeProvider에서 테마 관련 훅 import

const Footer = () => {
  const { isDarkMode, toggleTheme } = useCustomTheme(); // 커스텀 ThemeProvider에서 테마 상태와 토글 함수 가져오기

  return (
    <footer className={`bg-${isDarkMode ? 'gray-900' : 'white'} text-${isDarkMode ? 'white' : 'gray-900'} p-4 text-center`}>
      <div className="mb-4">
        회사 주소: 123 Company St, City, Country
      </div>
      <div className="flex justify-center items-center">
        <span className="mr-2">Dark Mode</span>
        <label className="switch">
          <input type="checkbox" checked={isDarkMode} onChange={toggleTheme} />
          <span className="slider round"></span>
        </label>
      </div>
    </footer>
  );
};

export default Footer;
