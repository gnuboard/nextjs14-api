// app/(board)/layout.js

import React from 'react';
import RootLayout from '@/app/(home)/layout';

const BoardLayout = ({ children }) => {
  return <RootLayout>{children}</RootLayout>;
};

export default BoardLayout;
