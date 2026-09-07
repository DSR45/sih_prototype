import { useLanguage } from '@shared/contexts/LanguageContext'
import { translations } from '@shared/constants/translations'
import { Icons } from '@shared/components/Icons'
import './styles.css'

function DemoLanding({ onNavigate }) {
  const { language } = useLanguage()
  const t = translations[language]

  return (
    <div className="demo-landing-wrapper">
      <div className="demo-background">
        <div className="gradient-blob blob-1"></div>
        <div className="gradient-blob blob-2"></div>
        <div className="gradient-blob blob-3"></div>
      </div>

      <div className="demo-landing-content">
        <div className="demo-container">
          {/* Logo/Brand Section */}
          <div className="demo-hero">
            <div className="demo-logo">
              <Icons.Heart />
            </div>
            <h1 className="demo-title">CaseConnect</h1>
            <p className="demo-subtitle">Intelligent Healthcare Pre-Consultation System</p>
            <p className="demo-description">Choose your access type to continue</p>
          </div>

          {/* Access Type Cards */}
          <div className="demo-cards-grid">
            {/* Patient Card */}
            <button 
              className="demo-access-card patient-card"
              onClick={() => onNavigate('patient')}
            >
              <div className="demo-card-icon patient-icon">
                <Icons.User />
              </div>
              <h2 className="demo-card-title">Patient Access</h2>
              <p className="demo-card-description">
                Start your pre-consultation journey
              </p>
              <div className="demo-card-features">
                <div className="demo-feature-item">
                  <span className="feature-check">✓</span>
                  <span>Quick Registration</span>
                </div>
                <div className="demo-feature-item">
                  <span className="feature-check">✓</span>
                  <span>AI Guided Questions</span>
                </div>
                <div className="demo-feature-item">
                  <span className="feature-check">✓</span>
                  <span>Document Upload</span>
                </div>
              </div>
              <div className="demo-card-action">
                <span>Continue as Patient</span>
                <Icons.ArrowRight />
              </div>
            </button>

            {/* Doctor Card */}
            <button 
              className="demo-access-card doctor-card"
              onClick={() => onNavigate('doctor')}
            >
              <div className="demo-card-icon doctor-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                  <path d="M12 14v7M9 18h6"></path>
                </svg>
              </div>
              <h2 className="demo-card-title">Doctor Access</h2>
              <p className="demo-card-description">
                Review patient cases and assessments
              </p>
              <div className="demo-card-features">
                <div className="demo-feature-item">
                  <span className="feature-check">✓</span>
                  <span>Patient Dashboard</span>
                </div>
                <div className="demo-feature-item">
                  <span className="feature-check">✓</span>
                  <span>AI Summaries</span>
                </div>
                <div className="demo-feature-item">
                  <span className="feature-check">✓</span>
                  <span>Review & Approve</span>
                </div>
              </div>
              <div className="demo-card-action">
                <span>Doctor Login</span>
                <Icons.ArrowRight />
              </div>
            </button>
          </div>

          {/* Footer Info */}
          <div className="demo-footer">
            <div className="demo-badge">
              <Icons.Lock />
              <span>Secure & Confidential</span>
            </div>
            <p className="demo-footer-text">
              Demo Version • SIH 2026 Internal Hackathon
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DemoLanding
