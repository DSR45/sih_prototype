import { useLanguage } from '@shared/contexts/LanguageContext'
import { translations } from '@shared/constants/translations'
import './styles.css'

import { PATIENT_FLOW, PATIENT_PROGRESS_STEPS } from '@shared/constants'

const screenConfig = {
  [PATIENT_FLOW.LANGUAGE_SELECTION]: { title: 'Language Selection', percentage: 0, hide: true },
  [PATIENT_FLOW.PATIENT_LOGIN]: { title: 'Patient Login', percentage: 0, hide: true },
  [PATIENT_FLOW.PATIENT_DETAILS]: { title: 'Patient Details', percentage: 0, hide: true },
  [PATIENT_FLOW.PATIENT_INFO]: { title: 'Patient Information', percentage: 25, step: 1, totalSteps: 4 },
  [PATIENT_FLOW.CHIEF_COMPLAINT]: { title: 'Chief Complaint', percentage: 50, step: 2, totalSteps: 4 },
  [PATIENT_FLOW.SYMPTOM_ASSESSMENT]: { title: 'Symptom Assessment', percentage: 75, step: 3, totalSteps: 4 },
  [PATIENT_FLOW.DOCUMENTS]: { title: 'Documents', percentage: 100, step: 4, totalSteps: 4 },
  [PATIENT_FLOW.SUMMARY]: { title: 'Complete', hide: true },
  [PATIENT_FLOW.COMPLETION]: { title: 'Complete', hide: true }
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
    [PATIENT_FLOW.PATIENT_INFO]: t.progress.patientInfo,
    [PATIENT_FLOW.CHIEF_COMPLAINT]: t.progress.chiefComplaint,
    [PATIENT_FLOW.SYMPTOM_ASSESSMENT]: t.progress.symptomAssessment,
    [PATIENT_FLOW.DOCUMENTS]: t.documents?.stepTitle || 'Documents'
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
          {PATIENT_PROGRESS_STEPS.map(({ screen }, index) => (
            <div
              key={screen}
              className={`step-dot ${screen < currentScreen ? 'completed' : screen === currentScreen ? 'current' : 'pending'}`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProgressBar
