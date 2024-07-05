// src/components/AuthContext.js
"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    // 페이지 로드 시 로컬 스토리지에서 로그인 상태를 복원
    const savedAccessToken = localStorage.getItem('accessToken');
    const savedUsername = localStorage.getItem('username');
    if (savedAccessToken && savedUsername) {
      setAccessToken(savedAccessToken);
      setUsername(savedUsername);
    }
  }, []);

  const login = (token, user) => {
    setAccessToken(token);
    setUsername(user);
    localStorage.setItem('accessToken', token);
    localStorage.setItem('username', user);
  };

  const logout = () => {
    setAccessToken(null);
    setUsername(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('username');
  };

  const isMember = !!accessToken && !!username;

  return (
    <AuthContext.Provider value={{ accessToken, username, isMember, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
