import { useLanguage } from '../context/LanguageContext'
import { translations } from '../data/translations'
import { Icons } from '../components/Icons'
import './Welcome.css'

function Welcome({ onNavigate }) {
  const { language } = useLanguage()
  const t = translations[language]

  const features = [
    {
      icon: Icons.Clock,
      title: t.welcome.feature1,
      desc: t.welcome.feature1Description
    },
    {
      icon: Icons.Lock,
      title: t.welcome.feature2,
      desc: t.welcome.feature2Description
    },
    {
      icon: Icons.Heart,
      title: t.welcome.feature3,
      desc: t.welcome.feature3Description
    }
  ]

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

          {/* Features Grid */}
          <div className="features-grid">
            {features.map((feature, idx) => (
              <div key={idx} className="feature-card">
                <div className="feature-icon-wrapper">
                  <feature.icon />
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-desc">{feature.desc}</p>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="welcome-cta-section">
            <button 
              className="welcome-cta-button"
              onClick={() => onNavigate(2)}
            >
              <span>{t.welcome.cta}</span>
              <Icons.ArrowRight />
            </button>
            <p className="welcome-cta-subtext">{t.welcome.ctaSubtext}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Welcome
