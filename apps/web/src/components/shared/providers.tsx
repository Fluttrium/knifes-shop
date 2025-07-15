'use client';

import React from 'react';
import { Toaster } from 'react-hot-toast';
import NextTopLoader from 'nextjs-toploader';

export const Providers: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <>
      {children}
      <Toaster />
      <NextTopLoader />
    </>
  );
};
// SessionProvider внутри себя будет хранить контекст, который мы уже будем прокидыать в то место куда нам нужно