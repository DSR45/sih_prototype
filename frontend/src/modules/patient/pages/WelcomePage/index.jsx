import { useState } from 'react'
import { useLanguage } from '@shared/contexts/LanguageContext'
import { translations } from '@shared/constants/translations'
import { Icons } from '@shared/components/Icons'
import './styles.css'

function Welcome({ onNavigate, onLanguageChange, onUpdateData, patientData }) {
  const { language } = useLanguage()
  const t = translations[language]
  const [selectedLanguage, setSelectedLanguage] = useState(language)

  

  const languages = [
    { id: 'en', label: t.language.english, flag: '🇺🇸' },
    { id: 'hi', label: t.language.hindi, flag: '🇮🇳' }
  ]

  const handleSelectLanguage = (langId) => {
    setSelectedLanguage(langId)
    const selectedLang = langId === 'en' ? 'English' : 'हिन्दी'
    onLanguageChange(langId)
    onUpdateData({ language: selectedLang })
  }

  const handleStartJourney = () => {
    onNavigate(2)
  }

  return (
    <div className="welcome-page-wrapper">
      <div className="welcome-background">
        <div className="gradient-blob blob-1"></div>
        <div className="gradient-blob blob-2"></div>
        <div className="gradient-blob blob-3"></div>
      </div>

      <div className="scrollable-content welcome-page">
        <div className="welcome-container">
          {/* Hero Section */}
          <div className="welcome-hero">
            <h1 className="welcome-title">{t.welcome.title}</h1>
            <p className="welcome-subtitle">{t.welcome.subtitle}</p>
            <p className="welcome-description">{t.welcome.description}</p>
          </div>

          

          {/* Language Selection Section */}
          <div className="welcome-language-section">
            <h3 className="language-section-title">{t.language.title}</h3>
            <p className="language-section-subtitle">{t.language.subtitle}</p>
            
            <div className="welcome-language-options">
              {languages.map((lang) => (
                <button
                  key={lang.id}
                  className={`welcome-language-card ${selectedLanguage === lang.id ? 'selected' : ''}`}
                  onClick={() => handleSelectLanguage(lang.id)}
                >
                  <span className="welcome-language-flag">{lang.flag}</span>
                  <span className="welcome-language-name">{lang.label}</span>
                  {selectedLanguage === lang.id && (
                    <span className="welcome-checkmark">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>

                    {/* CTA Section */}
          <div className="welcome-cta-section">
            <button 
              className="welcome-cta-button"
              onClick={handleStartJourney}
            >
              <span>{t.welcome.cta}</span>
              <Icons.ArrowRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Welcome
