// src/components/AuthContext.js
"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

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

  const fetchMemberInfo = async (token) => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/members/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // console.log('Member info:', response.data);
      setMemberInfo(response.data);
      setIsLogin(true);
    } catch (error) {
      console.error('Error fetching member info:', error);
      logout();
    }
  };

  const login = async (username, password) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/token`,
        {
          username, 
          password
        },
        {
          headers: { 
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      // console.log('Login response:', response.data);
  
      const { access_token } = response.data;
      setAccessToken(access_token);
      localStorage.setItem('accessToken', access_token);
      await fetchMemberInfo(access_token);
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