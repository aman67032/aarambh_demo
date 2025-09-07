"use client";

import React, { createContext, useContext, ReactNode } from 'react';

interface NavigationContextType {
  navigate: (href: string) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    // Return a fallback navigation function for SSR
    return {
      navigate: (href: string) => {
        // This will only be called during SSR or when context is not available
        // In a real scenario, this would be handled by the client-side hydration
        console.warn('Navigation attempted during SSR or outside NavigationProvider');
      }
    };
  }
  return context;
};

interface NavigationProviderProps {
  children: ReactNode;
  navigate: (href: string) => void;
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({ children, navigate }) => {
  return (
    <NavigationContext.Provider value={{ navigate }}>
      {children}
    </NavigationContext.Provider>
  );
};
