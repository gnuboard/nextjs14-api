// @/components/FloatingChatIcon.js

"use client";

import React from 'react';
import Link from 'next/link';

const FloatingChatIcon = () => {
  return (
    <>
      <Link href="/chat">
        <div className="floatingChatIcon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </div>
      </Link>
      <style jsx>{`
        .floatingChatIcon {
          position: fixed;
          bottom: 20px;
          right: 20px;
          padding: 12px;
          background-color: #3b82f6;
          color: white;
          border-radius: 50%;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          cursor: pointer;
          transition: background-color 0.3s;
          z-index: 50;
        }

        .floatingChatIcon:hover {
          background-color: #2563eb;
        }

        .floatingChatIcon svg {
          width: 24px;
          height: 24px;
          fill: none;
          stroke: currentColor;
          stroke-width: 2;
          stroke-linecap: round;
          stroke-linejoin: round;
        }
      `}</style>
    </>
  );
};

export default FloatingChatIcon;
