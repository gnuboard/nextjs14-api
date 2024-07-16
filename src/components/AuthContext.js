// src/components/AuthContext.js
"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchMemberRequest, loginRequest } from '@/app/axios/server_api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [username, setUsername] = useState(null);
  const [memberInfo, setMemberInfo] = useState(null);
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem('accessToken');
    if (savedToken) {
      setAccessToken(savedToken);
      fetchMemberInfo(savedToken);
    }
  }, []);

  const fetchMemberInfo = async () => {
    try {
      const response = await fetchMemberRequest();
      setMemberInfo(response.data);
      setIsLogin(true);
    } catch (error) {
      console.error('Error fetching member info:', error);
      logout();
    }
  };

  const login = async (username, password) => {
    try {
      const response = await loginRequest(username, password);
      const { access_token } = response.data;
      setAccessToken(access_token);
      localStorage.setItem('accessToken', access_token);
      await fetchMemberInfo();
      setIsLogin(true);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    setAccessToken(null);
    setUsername(null);
    setMemberInfo(null);
    setIsLogin(false);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('username');
  };

  return (
    <AuthContext.Provider value={{ accessToken, username, memberInfo, isLogin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);