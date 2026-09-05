import { createContext, useContext } from 'react'

const LanguageContext = createContext({ language: 'en', onLanguageChange: () => {} })

export function LanguageProvider({ children, language, onLanguageChange }) {
  return (
    <LanguageContext.Provider value={{ language: language || 'en', onLanguageChange }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    console.warn('useLanguage must be used within LanguageProvider')
    return { language: 'en', onLanguageChange: () => {} }
  }
  return context
}

export function useTranslation() {
  const { language } = useLanguage()
  const { translations } = require('../data/translations')
  return translations[language] || translations.en
}
