import { useState, useEffect } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { translations } from '../data/translations'
import { Icons } from '../components/Icons'
import './SymptomAssessment.css'

function SymptomAssessment({ patientData, onNavigate, onUpdateData }) {
  const { language } = useLanguage()
  const t = translations[language]
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState(patientData.assessmentAnswers || {})
  const [selectedOptions, setSelectedOptions] = useState([])

  // Question configuration with conditional logic
  const getQuestions = (currentAnswers = answers) => {
    const baseQuestions = [
      {
        id: 'symptom_start',
        question: t.assessment.q1.question,
        type: 'single',
        options: [
          { value: 'today', label: t.assessment.q1.opt1 },
          { value: '1-3days', label: t.assessment.q1.opt2 },
          { value: '4-7days', label: t.assessment.q1.opt3 },
          { value: 'week+', label: t.assessment.q1.opt4 }
        ]
      },
      {
        id: 'severity',
        question: t.assessment.q2.question,
        type: 'single',
        options: [
          { value: 'mild', label: t.assessment.q2.opt1 },
          { value: 'moderate', label: t.assessment.q2.opt2 },
          { value: 'severe', label: t.assessment.q2.opt3 },
          { value: 'very-severe', label: t.assessment.q2.opt4 }
        ]
      },
      {
        id: 'progression',
        question: t.assessment.q3.question,
        type: 'single',
        options: [
          { value: 'better', label: t.assessment.q3.opt1 },
          { value: 'same', label: t.assessment.q3.opt2 },
          { value: 'worse', label: t.assessment.q3.opt3 },
          { value: 'fluctuates', label: t.assessment.q3.opt4 }
        ]
      },
      {
        id: 'symptoms',
        question: t.assessment.q4.question,
        description: t.assessment.q4.description,
        type: 'multiple',
        options: [
          { value: 'fever', label: t.assessment.q4.opt1 },
          { value: 'pain', label: t.assessment.q4.opt2 },
          { value: 'breathing', label: t.assessment.q4.opt3 },
          { value: 'dizziness', label: t.assessment.q4.opt4 },
          { value: 'nausea', label: t.assessment.q4.opt5 },
          { value: 'vomiting', label: t.assessment.q4.opt6 },
          { value: 'weakness', label: t.assessment.q4.opt7 },
          { value: 'none', label: t.assessment.q4.opt8 }
        ]
      }
    ]

    const conditionalQuestions = []

    // If breathing difficulty is selected, ask follow-up
    if (currentAnswers.symptoms?.includes('breathing')) {
      conditionalQuestions.push({
        id: 'breathing_now',
        question: t.assessment.q5.question,
        type: 'single',
        options: [
          { value: 'yes', label: t.assessment.q5.opt1 },
          { value: 'no', label: t.assessment.q5.opt2 },
          { value: 'sometimes', label: t.assessment.q5.opt3 }
        ]
      })
    }

    // If pain is selected, ask about location
    if (currentAnswers.symptoms?.includes('pain')) {
      conditionalQuestions.push({
        id: 'pain_location',
        question: t.assessment.q6.question,
        description: t.assessment.q6.description,
        type: 'multiple',
        options: [
          { value: 'head', label: t.assessment.q6.opt1 },
          { value: 'chest', label: t.assessment.q6.opt2 },
          { value: 'abdomen', label: t.assessment.q6.opt3 },
          { value: 'back', label: t.assessment.q6.opt4 },
          { value: 'limbs', label: t.assessment.q6.opt5 },
          { value: 'other', label: t.assessment.q6.opt6 }
        ]
      })
    }

    return [...baseQuestions, ...conditionalQuestions]
  }

  const allQuestions = getQuestions()
  const currentQuestion = allQuestions[currentQuestionIndex]
  const isLastQuestion = currentQuestionIndex === allQuestions.length - 1
  const isComplete = currentQuestionIndex >= allQuestions.length

  // Initialize selected options when question changes
  useEffect(() => {
    if (currentQuestion) {
      const previousAnswer = answers[currentQuestion.id]
      if (currentQuestion.type === 'multiple') {
        setSelectedOptions(previousAnswer || [])
      } else {
        setSelectedOptions(previousAnswer ? [previousAnswer] : [])
      }
    }
  }, [currentQuestionIndex, answers, language])

  const handleOptionSelect = (value) => {
    if (!currentQuestion) return

    if (currentQuestion.type === 'multiple') {
      // Handle "None of these" selection
      if (value === 'none') {
        setSelectedOptions(['none'])
      } else {
        // Remove "none" if other options are selected
        const newSelection = selectedOptions.includes(value)
          ? selectedOptions.filter(v => v !== value)
          : [...selectedOptions.filter(v => v !== 'none'), value]
        setSelectedOptions(newSelection)
      }
    } else {
      setSelectedOptions([value])
    }
  }

  const handleContinue = () => {
    if (!currentQuestion) return

    // Save answer
    const answer = currentQuestion.type === 'multiple' ? selectedOptions : selectedOptions[0]
    const newAnswers = { ...answers, [currentQuestion.id]: answer }
    if (currentQuestion.id === 'symptoms') {
      if (!selectedOptions.includes('breathing')) delete newAnswers.breathing_now
      if (!selectedOptions.includes('pain')) delete newAnswers.pain_location
    }
    setAnswers(newAnswers)

    // Move to next question or complete
    if (isLastQuestion) {
      // Save to patientData
      onUpdateData({ assessmentAnswers: newAnswers })
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    } else {
      onNavigate(4)
    }
  }

  const canContinue = selectedOptions.length > 0

  if (isComplete) {
    return (
      <div className="scrollable-content">
        <div className="content-wrapper">
          <div className="assessment-complete">
            <div className="complete-icon-wrapper">
              <Icons.CheckCircle />
            </div>
            
            <h1 className="complete-title">{t.assessment.complete.title}</h1>
            <p className="complete-text">{t.assessment.complete.text}</p>
            
            <button
              className="continue-button full-width"
              onClick={() => onNavigate(6)}
            >
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
        {/* Introduction (only show on first question) */}
        {currentQuestionIndex === 0 && (
          <div className="header-card">
            <div className="ai-badge">
              <span aria-hidden="true">✦</span>
              <span>{t.assessment.badge}</span>
            </div>
            <h3 className="header-card-title">{t.assessment.title}</h3>
            <p className="header-card-subtitle">{t.assessment.subtitle}</p>
          </div>
        )}

        {/* Question Card */}
        <div className="question-card">
          {/* Progress indicator */}
          <div className="question-progress">
            <p className="progress-text">
              {t.assessment.progress} {currentQuestionIndex + 1} {t.assessment.of} {allQuestions.length}
            </p>
          </div>

          {/* Question */}
          <h2 className="question-title">{currentQuestion.question}</h2>
          
          {currentQuestion.description && (
            <p className="question-description">{currentQuestion.description}</p>
          )}

          {/* Options */}
          <div className="options-list">
            {currentQuestion.options.map((option) => {
              const isSelected = selectedOptions.includes(option.value)
              return (
                <button
                  key={option.value}
                  onClick={() => handleOptionSelect(option.value)}
                  className={`option-button ${isSelected ? 'selected' : ''}`}
                >
                  <div className="option-radio">
                    {isSelected && <div className="option-radio-dot" />}
                  </div>
                  <span className="option-label">{option.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="action-buttons">
          <button className="back-button" onClick={handleBack}>
            ← {t.assessment.back}
          </button>
          <div className="pagination">
            {allQuestions.map((_, idx) => (
              <span
                key={idx}
                className={`page-dot ${idx < currentQuestionIndex ? 'completed' : idx === currentQuestionIndex ? 'active' : ''}`}
              />
            ))}
          </div>
          <button
            className={`continue-button ${!canContinue ? 'disabled' : ''}`}
            onClick={handleContinue}
            disabled={!canContinue}
          >
            {isLastQuestion ? t.assessment.finish : t.assessment.continue} →
          </button>
        </div>
      </div>
    </div>
  )
}

export default SymptomAssessment