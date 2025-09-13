import { useLanguage } from '@/contexts/LanguageContext';
import { translations, type TranslationKey } from '@/lib/translations';

export function useTranslations() {
  const { language, getLocalizedText } = useLanguage();

  const t = (key: TranslationKey): string => {
    const translation = translations[key];
    if (!translation) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }
    
    return translation[language] || translation.uz; // Fallback to Uzbek
  };

  // Helper for API response texts (nameUz, nameUzC, nameRu)
  const getApiText = (item: { nameUz?: string; nameUzC?: string; nameRu?: string }) => {
    return getLocalizedText(item.nameUz || '', item.nameRu || '', item.nameUzC || '');
  };

  // Helper for answer options (textUz, textUzC, textRu)
  const getAnswerText = (option: { textUz?: string; textUzC?: string; textRu?: string }) => {
    return getLocalizedText(option.textUz || '', option.textRu || '', option.textUzC || '');
  };

  return {
    t,
    getApiText,
    getAnswerText,
    language
  };
}