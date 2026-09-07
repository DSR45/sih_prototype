import { createContext, useContext, useEffect } from 'react'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { translations } from '../../constants/translations'

const resources = Object.fromEntries(
  Object.entries(translations).map(([language, value]) => [
    language,
    { translation: value }
  ])
)

if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: localStorage.getItem('medikiosk-language') || 'en',
      fallbackLng: 'en',
      interpolation: { escapeValue: false },
      react: { useSuspense: false }
    })
}

const LanguageContext = createContext({
  language: 'en',
  onLanguageChange: () => {}
})

export function LanguageProvider({ children, language, onLanguageChange }) {
  const activeLanguage = language === 'hi' ? 'hi' : 'en'

  useEffect(() => {
    if (i18n.language !== activeLanguage) {
      i18n.changeLanguage(activeLanguage)
    }
  }, [activeLanguage])

  return (
    <LanguageContext.Provider
      value={{ language: activeLanguage, onLanguageChange, i18n }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
export function useTranslation() {
  return {
    t: i18n.t.bind(i18n),
    i18n
  }
}

export { i18n }

