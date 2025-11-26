"use client";

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import type { Language } from '@/sanity/lib/types';

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
  defaultLanguage?: Language;
}

export function LanguageProvider({
  children,
  defaultLanguage = 'nb'
}: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>(defaultLanguage);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    // Optionally persist to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('mendi-language', lang);
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// Hook to get initial language from localStorage (call in useEffect)
export function getStoredLanguage(): Language {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('mendi-language');
    if (stored === 'nb' || stored === 'en') {
      return stored;
    }
  }
  return 'nb';
}
