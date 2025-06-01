import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'ja';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    'questionSet.title': 'Select Question Set',
    'questionSet.description': 'Enter a question set ID',
    'questionSet.placeholder': 'Question set ID (e.g. default)',
    'questionSet.start': 'Start',
    'questionSet.error': 'Failed to load question set',
    'language.en': 'English',
    'language.ja': '日本語'
  },
  ja: {
    'questionSet.title': '問題セットを選択',
    'questionSet.description': '問題セットIDを入力してください',
    'questionSet.placeholder': '問題セットID (例: default)',
    'questionSet.start': '開始',
    'questionSet.error': '問題セットの読み込みに失敗しました',
    'language.en': 'English',
    'language.ja': '日本語'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};