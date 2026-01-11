/**
 * Internationalization Store
 * Manages language selection and translations
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { translations, type Language, type Translations } from '@/i18n/translations'

// Re-export types for external use
export type { Language, Translations }

const STORAGE_KEY = 'app_language'

export const useI18nStore = defineStore('i18n', () => {
  // Load saved language or default to English
  const savedLang = localStorage.getItem(STORAGE_KEY) as Language | null
  const currentLanguage = ref<Language>(savedLang || 'en')
  
  // Get current translations
  const t = computed<Translations>(() => translations[currentLanguage.value])
  
  // Available languages
  const languages = [
    { code: 'en' as Language, name: 'English', flag: '🇬🇧' },
    { code: 'de' as Language, name: 'Deutsch', flag: '🇩🇪' },
    { code: 'tr' as Language, name: 'Türkçe', flag: '🇹🇷' }
  ]
  
  // Set language
  function setLanguage(lang: Language) {
    currentLanguage.value = lang
    localStorage.setItem(STORAGE_KEY, lang)
    // Update HTML lang attribute
    document.documentElement.lang = lang
    console.log(`🌐 Language changed to: ${lang}`)
  }
  
  // Get a specific translation by key path (e.g., 'common.loading')
  function translate(keyPath: string): string {
    const keys = keyPath.split('.')
    let result: any = t.value
    
    for (const key of keys) {
      if (result && typeof result === 'object' && key in result) {
        result = result[key]
      } else {
        console.warn(`Translation missing: ${keyPath}`)
        return keyPath
      }
    }
    
    return typeof result === 'string' ? result : keyPath
  }
  
  // Initialize HTML lang attribute
  document.documentElement.lang = currentLanguage.value
  
  return {
    currentLanguage,
    t,
    languages,
    setLanguage,
    translate
  }
})
