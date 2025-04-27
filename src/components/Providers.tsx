'use client';

import { SessionProvider } from 'next-auth/react';
import { LanguageProvider } from '@/context/LanguageContext'; // Assuming this uses context
import { AuthModalProvider } from '@/context/AuthModalContext'; // Assuming this uses context
import { ReactNode } from 'react';

interface ProvidersProps {
  children: ReactNode;
}

const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <SessionProvider>
      <AuthModalProvider>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </AuthModalProvider>
    </SessionProvider>
  );
};

export default Providers;
