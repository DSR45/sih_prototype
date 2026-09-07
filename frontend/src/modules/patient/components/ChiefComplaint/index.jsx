import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '@shared/contexts/LanguageContext'
import { translations } from '@shared/constants/translations'
import { Icons } from '@shared/components/Icons'
import ScreenShell from '@shared/components/Layout/ScreenShell'
import StepNavigation from '@shared/components/Navigation/StepNavigation'
import { PATIENT_FLOW } from '@shared/constants'
import { supabasePatientAdapter } from '@shared/services/supabaseAdapter'
import { updateChiefComplaint } from '@shared/services/api/sessionService'
import { saveQuestionResponse } from '@shared/services/api/questionService'
import './styles.css'

function ChiefComplaint({ patientData, onNavigate, onUpdateData }) {
  const { language } = useLanguage()
  const t = translations[language]
  const [selectedSymptoms, setSelectedSymptoms] = useState(patientData.complaintTags || [])
  const [isListening, setIsListening] = useState(false)
  const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const [voiceSupported, setVoiceSupported] = useState(false)
    const recognitionRef = useRef(null)
    const voiceTextRef = useRef('')

    useEffect(() => {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (!SpeechRecognition) return

      const recognition = new SpeechRecognition()
      recognition.continuous = true
            recognition.interimResults = true
            recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN'

            recognition.onstart = () => {
              setIsListening(true)
              setError('')
            }

            recognition.onresult = (event) => {
              let finalTranscript = ''
              let interimTranscript = ''

              for (let index = event.resultIndex; index < event.results.length; index += 1) {
                const text = event.results[index][0].transcript
                if (event.results[index].isFinal) {
                  finalTranscript += text
                } else {
                  interimTranscript += text
                }
              }

              const baseText = voiceTextRef.current.trim()
              const committedText = `${baseText}${baseText && finalTranscript.trim() ? ' ' : ''}${finalTranscript.trim()}`.trim()

              if (finalTranscript.trim()) {
                voiceTextRef.current = committedText
              }

              const visibleText = `${committedText}${committedText && interimTranscript.trim() ? ' ' : ''}${interimTranscript.trim()}`.trim()
              onUpdateData({ chiefComplaint: visibleText })
            }

            recognition.onend = () => {
              setIsListening(false)
              voiceTextRef.current = patientData.chiefComplaint || voiceTextRef.current
            }
      recognition.onerror = (event) => {
        setIsListening(false)
        setError(event.error === 'not-allowed'
          ? 'Please allow microphone access.'
          : 'Voice input failed. Please try again.')
      }

      recognitionRef.current = recognition
      setVoiceSupported(true)

      return () => {
        recognition.abort()
        recognitionRef.current = null
      }
    }, [language, onUpdateData])

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
    const nextSelected = selectedSymptoms.includes(symptomId)
      ? selectedSymptoms.filter((id) => id !== symptomId)
      : [...selectedSymptoms, symptomId]

    setSelectedSymptoms(nextSelected)
    onUpdateData({ complaintTags: nextSelected })
  }

    const handleSpeak = () => {
    if (!voiceSupported || !recognitionRef.current) {
      setError('Voice input is not supported in this browser.')
      return
    }

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
      return
    }

    voiceTextRef.current = patientData.chiefComplaint || ''
    setError('')
        try {
      recognitionRef.current.lang = language === 'hi' ? 'hi-IN' : 'en-IN'
      recognitionRef.current.start()
      setIsListening(true)
    } catch (recognitionError) {
      console.error('Unable to start voice recognition:', recognitionError)
      setIsListening(false)
      setError('Please try the microphone again.')
    }
  }

  const handleUpdateComplaint = (value) => {
    voiceTextRef.current = value
    onUpdateData({ chiefComplaint: value })
  }

  const handleContinue = async () => {
    // Validate chief complaint
    if (!patientData.chiefComplaint || patientData.chiefComplaint.trim() === '') {
      setError(t.complaint.errors?.complaintRequired || 'Please describe your problem')
      return
    }

    setSaving(true)
    setError('')

    try {
      // Determine complaint category based on selected symptoms or complaint text
      let category = 'General'
      const complaint = patientData.chiefComplaint.toLowerCase()
      
      if (selectedSymptoms.includes('fever') || complaint.includes('fever')) {
        category = 'Fever'
      } else if (selectedSymptoms.includes('headache') || complaint.includes('headache')) {
        category = 'Headache'
      } else if (selectedSymptoms.includes('cough') || complaint.includes('cough')) {
        category = 'Cough'
      } else if (selectedSymptoms.includes('stomach') || complaint.includes('stomach') || complaint.includes('abdominal')) {
        category = 'Abdominal Pain'
      } else if (selectedSymptoms.includes('weakness')) {
        category = 'General Weakness'
      }

            // Create the visit session only after Continue is clicked.
      const session = await supabasePatientAdapter.createSession({
        patient_id: patientData.patientId,
        department: 'General Medicine',
        language_used: patientData.language || 'English',
        chief_complaint: patientData.chiefComplaint.trim(),
        complaint_category: category,
        consent_given: true,
        status: 'in_progress'
      })

      const sessionId = session?.session_id || session?.id
      if (!sessionId) {
        throw new Error('Session was created without a session ID')
      }

      await updateChiefComplaint(sessionId, patientData.chiefComplaint.trim(), category)

      if (selectedSymptoms.length > 0) {
        await saveQuestionResponse(
          sessionId,
          'Selected symptoms',
          selectedSymptoms.join(', '),
          'Chief Complaint'
        )
      }

      onUpdateData({ sessionId })
      console.log('✅ Session and chief complaint saved to backend')

      // Update local state
      onUpdateData({ 
        chiefComplaint: patientData.chiefComplaint,
        complaintCategory: category,
        complaintTags: selectedSymptoms 
      })

      // Navigate to next screen
      onNavigate(PATIENT_FLOW.SYMPTOM_ASSESSMENT)
    } catch (err) {
      console.error('❌ Error saving chief complaint:', err)
      setError('Failed to save. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <ScreenShell>
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

          {error && (
            <div className="error-message" style={{ marginTop: '10px', padding: '4px 0', color: '#c00', fontSize: '12px', lineHeight: '1.4' }}>
                          {error}
                        </div>
          )}
        </div>

      <StepNavigation
        onBack={() => onNavigate(PATIENT_FLOW.PATIENT_INFO)}
        onContinue={handleContinue}
        backLabel={t.complaint.back}
        continueLabel={saving ? 'Saving...' : t.complaint.continue}
        currentStep={1}
        totalSteps={4}
        disabled={saving}
      />
    </ScreenShell>
  )
}

export default ChiefComplaint
