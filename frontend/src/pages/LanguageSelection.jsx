import { useLanguage } from '../context/LanguageContext'
import { translations } from '../data/translations'
import './LanguageSelection.css'

function LanguageSelection({ patientData, onNavigate, onUpdateData, onLanguageChange }) {
  const { language } = useLanguage()
  const t = translations[language]

  const languages = [
    { id: 'en', label: t.language.english, flag: '🇺🇸' },
    { id: 'hi', label: t.language.hindi, flag: '🇮🇳' }
  ]

  const handleSelectLanguage = (langId) => {
    const selectedLang = langId === 'en' ? 'English' : 'हिन्दी'
    onLanguageChange(langId)
    onUpdateData({ language: selectedLang })
  }

  return (
    <div className="scrollable-content">
      <div className="content-wrapper">
        <div className="section-header">
          <h2 className="section-title">{t.language.title}</h2>
          <p className="section-subtitle">{t.language.subtitle}</p>
        </div>

        <div className="language-options">
          {languages.map((lang) => (
            <button
              key={lang.id}
              className={`language-card ${patientData.language === lang.label ? 'selected' : ''}`}
              onClick={() => handleSelectLanguage(lang.id)}
            >
              <span className="language-flag">{lang.flag}</span>
              <span className="language-name">{lang.label}</span>
              {patientData.language === lang.label && (
                <span className="checkmark">✓</span>
              )}
            </button>
          ))}
        </div>

        <div className="action-buttons">
          <button 
            className="back-button"
            onClick={() => onNavigate(1)}
          >
            ← {t.language.back}
          </button>
          <div className="pagination">
            <span className="page-dot"></span>
            <span className="page-dot active"></span>
            <span className="page-dot"></span>
            <span className="page-dot"></span>
          </div>
          <button 
            className="continue-button"
            onClick={() => onNavigate(3)}
          >
            {t.language.continue} →
          </button>
        </div>
      </div>
    </div>
  )
}

export default LanguageSelection
