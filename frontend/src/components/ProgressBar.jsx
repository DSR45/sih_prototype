import { useLanguage } from '../context/LanguageContext'
import { translations } from '../data/translations'
import './ProgressBar.css'

const screenConfig = {
  1: { title: 'Welcome', percentage: 0, hide: true },
  2: { title: 'Language Selection', percentage: 25, step: 1, totalSteps: 4 },
  3: { title: 'Patient Information', percentage: 50, step: 2, totalSteps: 4 },
  4: { title: 'Chief Complaint', percentage: 75, step: 3, totalSteps: 4 }
}

function ProgressBar({ currentScreen }) {
  const { language } = useLanguage()
  const t = translations[language]
  const config = screenConfig[currentScreen]

  if (config?.hide) {
    return null // Don't show progress bar on welcome screen
  }

  const { percentage, step, totalSteps } = config
  const titles = {
    2: t.progress.languageSelection,
    3: t.progress.patientInfo,
    4: t.progress.chiefComplaint
  }

  return (
    <div className="progress-section">
      <div className="progress-container">
        <div className="progress-header">
          <div className="step-info">
            <span className="step-badge">{t.progress.step} {step}/{totalSteps}</span>
            <h2 className="step-title">{titles[currentScreen]}</h2>
          </div>
          <div className="percentage">{percentage}{t.progress.complete}</div>
        </div>

        <div className="progress-bar-wrapper">
          <div className="progress-bar-background">
            <div className="progress-bar-fill" style={{ width: `${percentage}%` }}></div>
          </div>
        </div>

        <div className="step-indicators">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div
              key={index}
              className={`step-dot ${index < step ? 'completed' : index === step - 1 ? 'current' : 'pending'}`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProgressBar
