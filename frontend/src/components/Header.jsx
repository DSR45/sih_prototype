import { useLanguage } from '../context/LanguageContext'
import { translations } from '../data/translations'
import { Icons } from './Icons'
import './Header.css'

function Header() {
  const { language, onLanguageChange } = useLanguage()
  const t = translations[language]

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo-section">
          <div className="logo">
            <span className="logo-icon">⊕</span>
          </div>
          <div className="logo-text">
            <h1 className="logo-title">MediKiosk</h1>
            <p className="logo-subtitle">{t.header.appTagline}</p>
          </div>
        </div>
        <div className="header-controls">
          <div className="language-selector">
            <button 
              className={`lang-option ${language === 'en' ? 'active' : ''}`}
              onClick={() => onLanguageChange('en')}
            >
              <span className="lang-icon"><Icons.Globe /></span>
              English
            </button>
            <div className="lang-divider"></div>
            <button 
              className={`lang-option ${language === 'hi' ? 'active' : ''}`}
              onClick={() => onLanguageChange('hi')}
            >
              <span className="lang-icon">हि</span>
              हिन्दी
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header

