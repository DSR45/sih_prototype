import { useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { translations } from '../data/translations'
import { Icons } from './Icons'
import './ChiefComplaint.css'

function ChiefComplaint({ patientData, onNavigate, onUpdateData }) {
  const { language } = useLanguage()
  const t = translations[language]
  const [selectedSymptoms, setSelectedSymptoms] = useState([])
  const [isListening, setIsListening] = useState(false)

  const commonSymptoms = [
    { id: 'fever', label: t.complaint.symptoms.fever, icon: Icons.Thermometer },
    { id: 'headache', label: t.complaint.symptoms.headache, icon: Icons.Headache },
    { id: 'cough', label: t.complaint.symptoms.cough, icon: Icons.Cough },
    { id: 'stomach', label: t.complaint.symptoms.stomach, icon: Icons.Stomach },
    { id: 'weakness', label: t.complaint.symptoms.weakness, icon: Icons.Warning },
    { id: 'chest', label: t.complaint.symptoms.chest, icon: Icons.Heart },
    { id: 'dizziness', label: t.complaint.symptoms.dizziness, icon: Icons.Dizziness },
  ]

  const toggleSymptom = (symptomId) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptomId) ? prev.filter((id) => id !== symptomId) : [...prev, symptomId]
    )
  }

  const handleSpeak = () => {
    setIsListening(!isListening)
    // Voice recognition implementation would go here
  }

  const handleUpdateComplaint = (value) => {
    onUpdateData({ chiefComplaint: value })
  }

  return (
    <div className="scrollable-content">
      <div className="content-wrapper">
        <div className="header-card">
          <div className="header-card-icon"><Icons.Heart /></div>
          <div className="header-card-text">
            <h3 className="header-card-title">{t.complaint.title}</h3>
            <p className="header-card-subtitle">{t.complaint.subtitle}</p>
          </div>
        </div>

        <div className="form-section">
          <div className="input-row">
            <button className={`speak-button ${isListening ? 'listening' : ''}`} onClick={handleSpeak}>
                <Icons.Mic />
              </button>
              <div className="input-group">
                <span className="input-label">{t.complaint.tapToSpeak}</span>
                <p className="input-description">{t.complaint.describeYourProblem}</p>
              </div>
          </div>

          <div className="divider-section">
            <span className="divider-text">{t.complaint.or}</span>
          </div>

          <div className="typing-section">
            <label className="typing-label">{t.complaint.preferTyping}</label>
            <textarea
              className="textarea-input"
              placeholder={t.complaint.typeYourProblem}
              value={patientData.chiefComplaint}
              onChange={(e) => handleUpdateComplaint(e.target.value)}
              rows="5"
            ></textarea>
            <p className="helper-text">{t.complaint.helperText}</p>
          </div>

          <div className="symptoms-section">
            <h4 className="symptoms-title">{t.complaint.commonSymptoms}</h4>
            <div className="symptoms-grid">
              {commonSymptoms.map((symptom) => (
                <button
                  key={symptom.id}
                  className={`symptom-button ${selectedSymptoms.includes(symptom.id) ? 'selected' : ''}`}
                  onClick={() => toggleSymptom(symptom.id)}
                >
                  {symptom.icon ? (
                    <span className="symptom-icon"><symptom.icon /></span>
                  ) : (
                    <span className="symptom-icon-placeholder" aria-hidden="true"></span>
                  )}
                  <span className="symptom-label">{symptom.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="privacy-notice">
            <span className="privacy-icon"><Icons.Lock /></span>
            <div className="privacy-text">
              <span className="privacy-label">{t.complaint.privateSecure}</span>
              <span className="privacy-description">{t.complaint.privacyDescription}</span>
            </div>
          </div>
        </div>

                <div className="action-buttons">
          <button 
            className="back-button"
            onClick={() => onNavigate(3)}
          >
            ← {t.complaint.back}
          </button>
          <div className="pagination">
            <span className="page-dot"></span>
            <span className="page-dot active"></span>
            <span className="page-dot"></span>
            <span className="page-dot"></span>
          </div>
          <button className="continue-button" onClick={() => onNavigate(5)}>{t.complaint.continue} →</button>
        </div>
      </div>
    </div>
  )
}

export default ChiefComplaint
