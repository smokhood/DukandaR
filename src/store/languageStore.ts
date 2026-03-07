/**
 * Language Store - Global language preference management
 * Uses Zustand with AsyncStorage persistence
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import i18n from '../i18n';

export type Language = 'en' | 'ur';

interface LanguageState {
  language: Language;
  isRTL: boolean;
}

interface LanguageActions {
  setLanguage: (language: Language) => Promise<void>;
  toggleLanguage: () => Promise<void>;
}

type LanguageStore = LanguageState & LanguageActions;

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set, get) => ({
      // Initial state
      language: 'ur',
      isRTL: true,

      // Actions
      setLanguage: async (language: Language) => {
        try {
          console.log('[Language Store] Changing language to:', language);
          console.log('[Language Store] i18n.language before:', i18n.language);
          await i18n.changeLanguage(language);
          console.log('[Language Store] i18n.language after:', i18n.language);
          set({
            language,
            isRTL: language === 'ur',
          });
          console.log('[Language Store] Store updated successfully to:', language);
        } catch (error) {
          console.error('[Language Store] Failed to change language:', error);
        }
      },

      toggleLanguage: async () => {
        const currentLang = get().language;
        const newLang: Language = currentLang === 'en' ? 'ur' : 'en';
        console.log('[Language] Toggling from', currentLang, 'to', newLang);
        await get().setLanguage(newLang);
      },
    }),
    {
      name: 'dukandar-language-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Sync i18n when hydrating from storage
      onRehydrateStorage: () => {
        return (state, error) => {
          if (error) {
            console.error('Failed to rehydrate language store:', error);
          } else if (state) {
            // Sync i18n with stored language
            i18n.changeLanguage(state.language).catch((err) => {
              console.error('Failed to sync i18n with stored language:', err);
            });
          }
        };
      },
    }
  )
);
