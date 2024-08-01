// src/components/Header.js

"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/AuthContext';

const Header = ({ backgroundColor = 'bg-gray-800' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openDrawerSubMenu, setOpenDrawerSubMenu] = useState(false);
  const { isLogin, memberInfo, logout } = useAuth();

  const toggleSideMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logout();
    // TODO: 로그아웃 후 추가 작업 (예: 홈페이지로 리다이렉트)
  };

  const handleDrawerSubMenuToggle = () => {
    setOpenDrawerSubMenu(!openDrawerSubMenu);
  };

  const menuItems = [
    { text: 'SPA', href: '/spa' },
    { text: '게임', href: '/games/snake' },
    { text: '설문조사', href: '/poll' },
    { text: '회사소개', href: '/about' },
    { text: '제품소개', href: '/products' },
    { text: '구입하기', href: '/buy' },
    { text: 'FAQ', href: '/faq' },
    { text: '연락처', href: '/contact' },
  ];

  const productSubmenuItems = [
    { text: '제품1', href: '/products/item/1' },
    { text: '제품2', href: '/products/item/2' },
    { text: '제품3', href: '/products/item/3' },
  ];

  return (
    <header className={`${backgroundColor} w-full`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="text-white text-2xl font-bold">Logo</Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {menuItems.map((item, index) => (
                item.text === '제품소개' ? (
                  <div key={index} className="relative group">
                    <Link href={item.href} className="text-white hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium">
                      {item.text}
                    </Link>
                    <div className="absolute left-0 w-40 bg-white shadow-lg rounded-md hidden group-hover:block">
                      {productSubmenuItems.map((subItem) => (
                        <Link href={subItem.href} key={subItem.text} className="block px-4 py-2 text-gray-700 hover:bg-gray-100">{subItem.text}</Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link href={item.href} key={item.text} className="text-white hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium">
                    {item.text}
                  </Link>
                )
              ))}
              {isLogin ? (
                <button onClick={handleLogout} className="text-white hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium">
                  <svg className="h-5 w-5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-9v1" />
                  </svg> {`${memberInfo?.mb_nick || '사용자'}님`}
                </button>
              ) : (
                <Link href="/login" className="text-white hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium">
                  <svg className="h-5 w-5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M12 5l-7 7 7 7" />
                  </svg> 로그인
                </Link>
              )}
            </div>
          </div>
          <div className="flex md:hidden">
            <button onClick={toggleSideMenu} className="text-white hover:text-gray-300 focus:outline-none focus:text-gray-300">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {menuItems.map((item) => (
              item.text === '제품소개' ? (
                <div key={item.text}>
                  <button onClick={handleDrawerSubMenuToggle} className="w-full text-left text-white hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium">
                    {item.text} {openDrawerSubMenu ? (
                      <svg className="h-5 w-5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </button>
                  {openDrawerSubMenu && (
                    <div className="pl-6">
                      {productSubmenuItems.map((subItem) => (
                        <Link href={subItem.href} key={subItem.text} className="block text-white hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium" onClick={toggleSideMenu}>
                          {subItem.text}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link href={item.href} key={item.text} className="block text-white hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium" onClick={toggleSideMenu}>
                  {item.text}
                </Link>
              )
            ))}
            {!isLogin ? (
              <Link href="/login" className="block text-white hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium" onClick={toggleSideMenu}>
                로그인
              </Link>
            ) : (
              <button onClick={handleLogout} className="w-full text-left text-white hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium">
                {`${memberInfo?.mb_nick || '사용자'}님 (로그아웃)`}
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
