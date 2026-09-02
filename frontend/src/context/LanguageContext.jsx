import React, { createContext, useContext } from 'react'

const LanguageContext = createContext()

export function LanguageProvider({ children, language, onLanguageChange }) {
  return (
    <LanguageContext.Provider value={{ language, onLanguageChange }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}

export function useTranslation() {
  const { language } = useLanguage()
  const { translations } = require('./translations')
  return translations[language] || translations.en
}
