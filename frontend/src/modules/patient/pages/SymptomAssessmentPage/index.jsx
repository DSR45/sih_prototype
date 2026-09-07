import { useState } from 'react'
import { useLanguage } from '@shared/contexts/LanguageContext'
import { translations } from '@shared/constants/translations'
import { Icons } from '@shared/components/Icons'
import { isPilesComplaint } from '../PatientWorkflowPage'
import { saveQuestionResponse } from '@shared/services/api/questionService'
import './styles.css'

function SymptomAssessment({ patientData, onNavigate, onUpdateData }) {
  const { language } = useLanguage()
  const t = translations[language] || translations.en
  
  if (!t || !t.assessment) {
    console.error('Translations not loaded properly for language:', language)
    return null
  }
  
  const pilesCase = isPilesComplaint(patientData.chiefComplaint)
  
  const feverQuestions = [
    { 
      id: 'duration', 
      question: t.assessment.fever.q1.question, 
      options: [
        [t.assessment.fever.q1.opt1, '1-day'], 
        [t.assessment.fever.q1.opt2, '2-3-days'], 
        [t.assessment.fever.q1.opt3, 'more-than-3-days']
      ] 
    },
    { 
      id: 'temperature', 
      question: t.assessment.fever.q2.question, 
      options: [
        [t.assessment.fever.q2.opt1, 'below-100'], 
        [t.assessment.fever.q2.opt2, 'around-101'], 
        [t.assessment.fever.q2.opt3, '102-or-higher']
      ] 
    },
    { 
      id: 'symptoms', 
      question: t.assessment.fever.q3.question, 
      description: t.assessment.fever.q3.description, 
      multi: true, 
      options: [
        [t.assessment.fever.q3.opt1, 'headache'], 
        [t.assessment.fever.q3.opt2, 'body-ache'], 
        [t.assessment.fever.q3.opt3, 'cough'], 
        [t.assessment.fever.q3.opt4, 'sore-throat'], 
        [t.assessment.fever.q3.opt5, 'vomiting'], 
        [t.assessment.fever.q3.opt6, 'none']
      ] 
    },
    { 
      id: 'seriousSymptoms', 
      question: t.assessment.fever.q4.question, 
      description: t.assessment.fever.q4.description, 
      multi: true, 
      options: [
        [t.assessment.fever.q4.opt1, 'breathing'], 
        [t.assessment.fever.q4.opt2, 'chest-pain'], 
        [t.assessment.fever.q4.opt3, 'confusion'], 
        [t.assessment.fever.q4.opt4, 'severe-weakness'], 
        [t.assessment.fever.q4.opt5, 'none']
      ] 
    }
  ]

  const pilesQuestions = [
    { 
      id: 'duration', 
      question: t.assessment.piles.q1.question, 
      options: [
        [t.assessment.piles.q1.opt1, 'less-than-week'], 
        [t.assessment.piles.q1.opt2, '1-4-weeks'], 
        [t.assessment.piles.q1.opt3, 'more-than-month']
      ] 
    },
    { 
      id: 'bloodColour', 
      question: t.assessment.piles.q2.question, 
      options: [
        [t.assessment.piles.q2.opt1, 'bright-red'], 
        [t.assessment.piles.q2.opt2, 'dark'], 
        [t.assessment.piles.q2.opt3, 'not-sure']
      ] 
    },
    { 
      id: 'pain', 
      question: t.assessment.piles.q3.question, 
      options: [
        [t.assessment.piles.q3.opt1, 'yes'], 
        [t.assessment.piles.q3.opt2, 'no'], 
        [t.assessment.piles.q3.opt3, 'sometimes']
      ] 
    },
    { 
      id: 'lump', 
      question: t.assessment.piles.q4.question, 
      options: [
        [t.assessment.piles.q4.opt1, 'yes'], 
        [t.assessment.piles.q4.opt2, 'no'], 
        [t.assessment.piles.q4.opt3, 'not-sure']
      ] 
    },
    { 
      id: 'constipation', 
      question: t.assessment.piles.q5.question, 
      options: [
        [t.assessment.piles.q5.opt1, 'often'], 
        [t.assessment.piles.q5.opt2, 'sometimes'], 
        [t.assessment.piles.q5.opt3, 'no']
      ] 
    },
    { 
      id: 'frequency', 
      question: t.assessment.piles.q6.question, 
      options: [
        [t.assessment.piles.q6.opt1, 'once'], 
        [t.assessment.piles.q6.opt2, 'few-times'], 
        [t.assessment.piles.q6.opt3, 'frequently']
      ] 
    }
  ]

    const questions = pilesCase ? pilesQuestions : feverQuestions
  const [questionIndex, setQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState(patientData.assessmentAnswers || {})
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const currentQuestion = questions[questionIndex]
  const selected = currentQuestion?.multi ? (answers[currentQuestion.id] || []) : (answers[currentQuestion?.id] ? [answers[currentQuestion.id]] : [])
  const complete = questionIndex >= questions.length

  const selectOption = (value) => { 
    if (currentQuestion.multi) 
      setAnswers(previous => ({ 
        ...previous, 
        [currentQuestion.id]: value === 'none' ? ['none'] : selected.includes(value) ? selected.filter(item => item !== value) : [...selected.filter(item => item !== 'none'), value] 
      }))
    else 
      setAnswers(previous => ({ ...previous, [currentQuestion.id]: value })) 
  }

    const continueQuestion = async () => { 
      if (!selected.length) return
    
      setSaving(true)
      setError('')

      try {
        // Save current answer to backend
        if (patientData.sessionId) {
          const answerValue = currentQuestion.multi 
            ? selected.join(', ') 
            : selected[0]

          await saveQuestionResponse(
            patientData.sessionId,
            currentQuestion.question,
            answerValue,
            'Symptom Assessment'
          )

          console.log(`✅ Saved answer for question: ${currentQuestion.id}`)
        }

        // Save answers to local state
        const updatedAnswers = { ...answers }
        onUpdateData({ assessmentAnswers: updatedAnswers })
      
        // Move to next question or mark complete
        setQuestionIndex(index => index + 1)
      } catch (err) {
        console.error('❌ Error saving answer:', err)
        setError('Failed to save answer. Please try again.')
      } finally {
        setSaving(false)
      }
    }

  if (complete) {
      console.log('SymptomAssessment complete. Saved answers:', answers)
      console.log('Navigating to screen 6 (Documents)')
    
      return (
        <div className="scrollable-content">
          <div className="content-wrapper">
            <div className="assessment-complete">
              <div className="complete-icon-wrapper">
                <Icons.CheckCircle />
              </div>
              <h1 className="complete-title">{t.assessment.complete.title}</h1>
              <p className="complete-text">{t.assessment.complete.text}</p>
              <button className="continue-button full-width" onClick={() => {
                console.log('Continue button clicked, navigating to screen 6')
                onNavigate(6)
              }}>
                {t.assessment.complete.button} →
              </button>
            </div>
          </div>
        </div>
      )
    }

  return (
    <div className="scrollable-content">
      <div className="content-wrapper">
        <div className="header-card">
          <div className="ai-badge">
            <span aria-hidden="true">✦</span>
            <span>{t.assessment.badge}</span>
          </div>
          <h3 className="header-card-title">
            {t.assessment.title} {pilesCase ? t.assessment.titlePiles : t.assessment.titleFever}
          </h3>
          <p className="header-card-subtitle">{t.assessment.subtitle}</p>
        </div>
        
        <div className="question-card">
          <div className="question-progress">
            <p className="progress-text">
              {t.assessment.progress} {questionIndex + 1} {t.assessment.of} {questions.length}
            </p>
            <div className="question-progress-track">
              <span style={{ width: `${((questionIndex + 1) / questions.length) * 100}%` }} />
            </div>
          </div>
          
          <h2 className="question-title">{currentQuestion.question}</h2>
          {currentQuestion.description && (
            <p className="question-description">{currentQuestion.description}</p>
          )}
          
                    <div className="options-list">
            {currentQuestion.options.map(([label, value]) => (
              <button 
                key={value} 
                className={`option-button ${selected.includes(value) ? 'selected' : ''}`} 
                onClick={() => selectOption(value)}
                disabled={saving}
              >
                <span className="option-radio">
                  {selected.includes(value) && <span className="option-radio-dot" />}
                </span>
                <span className="option-label">{label}</span>
              </button>
            ))}
          </div>

          {error && (
            <div className="error-message" style={{ marginTop: '16px', padding: '12px', backgroundColor: '#fee', border: '1px solid #fcc', borderRadius: '8px', color: '#c00' }}>
              <Icons.AlertCircle /> {error}
            </div>
          )}
        </div>
        
        <div className="action-buttons">
          <button 
            className="back-button" 
            onClick={() => questionIndex ? setQuestionIndex(index => index - 1) : onNavigate(4)}
          >
            ← {t.assessment.back}
          </button>
          <div className="pagination">
            {questions.map((_, index) => (
              <span 
                key={index} 
                className={`page-dot ${index < questionIndex ? 'completed' : index === questionIndex ? 'active' : ''}`} 
              />
            ))}
          </div>
                    <button 
            className={`continue-button ${!selected.length || saving ? 'disabled' : ''}`} 
            disabled={!selected.length || saving} 
            onClick={continueQuestion}
          >
            {saving ? (
              <>
                <Icons.Loader className="animate-spin" />
                Saving...
              </>
            ) : (
              <>{questionIndex === questions.length - 1 ? t.assessment.finish : t.assessment.continue} →</>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default SymptomAssessment