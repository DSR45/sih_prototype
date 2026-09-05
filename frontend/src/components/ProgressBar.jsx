import { useLanguage } from '../context/LanguageContext'
import { translations } from '../data/translations'
import './ProgressBar.css'

const screenConfig = {
  1: { title: 'Welcome', percentage: 0, hide: true },
  2: { title: 'Welcome', percentage: 0, hide: true }, // Old language screen - now merged with welcome
  3: { title: 'Patient Information', percentage: 25, step: 1, totalSteps: 4 },
  4: { title: 'Chief Complaint', percentage: 50, step: 2, totalSteps: 4 },
  5: { title: 'Symptom Assessment', percentage: 75, step: 3, totalSteps: 4 },
  6: { title: 'Documents', percentage: 100, step: 4, totalSteps: 4 },
  7: { title: 'Complete', hide: true },
  8: { title: 'Complete', hide: true },
  9: { title: 'Complete', hide: true },
  10: { title: 'Complete', hide: true }
}

function ProgressBar({ currentScreen }) {
  const { language } = useLanguage()
  const t = translations[language]
  const config = screenConfig[currentScreen]

  if (!config || config.hide) {
    return null // Don't show progress bar on welcome screen
  }

    const { percentage, step, totalSteps } = config
  const titles = {
    3: t.progress.patientInfo,
    4: t.progress.chiefComplaint,
    5: t.progress.symptomAssessment,
    6: t.documents?.stepTitle || 'Documents'
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
