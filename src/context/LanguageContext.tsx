"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'fa';
type Direction = 'ltr' | 'rtl';

type LanguageContextType = {
  language: Language;
  direction: Direction;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

const defaultLanguage: Language = 'en';

// Create the context with a default value
const LanguageContext = createContext<LanguageContextType>({
  language: defaultLanguage,
  direction: 'ltr',
  setLanguage: () => { },
  t: (key: string) => key,
});

// Translations
import en from './locales/en';
import fa from './locales/fa';

const translations = {
  en,
  fa,
};

type LanguageProviderProps = {
  children: ReactNode;
};

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguageState] = useState<Language>(defaultLanguage);
  const [direction, setDirection] = useState<Direction>('ltr');

  // Load language preference from localStorage on component mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'fa')) {
      setLanguageState(savedLanguage);
    }
  }, []);

  // Update direction when language changes
  useEffect(() => {
    setDirection(language === 'fa' ? 'rtl' : 'ltr');
    document.documentElement.dir = language === 'fa' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    localStorage.setItem('language', language);
  }, [language]);

  // Translation function
  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, direction, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = () => useContext(LanguageContext);
