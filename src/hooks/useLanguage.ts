/**
 * useLanguage Hook - Combines language store with i18next translation
 * Provides easy access to translation function and language toggle
 */
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguageStore } from '../store/languageStore';

export function useLanguage() {
  const { t, i18n } = useTranslation();
  const { language, isRTL, setLanguage, toggleLanguage } = useLanguageStore();

  // Sync i18n language with store language
  useEffect(() => {
    if (i18n.language !== language) {
      console.log('[useLanguage] Syncing i18n from', i18n.language, 'to', language);
      i18n.changeLanguage(language);
    }
  }, [language, i18n]);

  return {
    t, // Translation function
    language, // Current language ('en' | 'ur')
    isRTL, // Is right-to-left language
    currentLanguage: i18n.language, // i18next current language
    setLanguage, // Set specific language
    toggleLanguage, // Toggle between en/ur
  };
}
