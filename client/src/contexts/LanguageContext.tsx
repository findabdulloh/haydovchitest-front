import { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'uz' | 'uzc' | 'ru';

export interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  getLocalizedText: (textUz: string, textRu: string, textUzC: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'uz';
  });

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  const getLocalizedText = (textUz: string, textRu: string, textUzC: string) => {
    switch (language) {
      case 'uz':
        return textUz;
      case 'ru':
        return textRu;
      case 'uzc':
        return textUzC;
      default:
        return textUz;
    }
  };

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, getLocalizedText }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export const languageNames = {
  uz: 'O\'zbekcha',
  uzc: 'Ўзбекча',
  ru: 'Русский'
} as const;