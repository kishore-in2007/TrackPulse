'use client';

import React from 'react';
import { LanguageProvider } from '@/lib/context/LanguageContext';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      {children}
    </LanguageProvider>
  );
}
