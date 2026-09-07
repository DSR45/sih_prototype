import { useCallback, useEffect, useState } from 'react'
import { getInitialWorkflow } from '../pages/PatientWorkflowPage'
import { PATIENT_FLOW } from '@shared/constants'
import { createDefaultPatientData, getLanguageLabel } from '../state/patientState'

const persistedState = (() => {
  try {
    return JSON.parse(localStorage.getItem('medikiosk-demo-state') || 'null')
  } catch {
    return null
  }
})()

export function usePatientFlow() {
  const [currentScreen, setCurrentScreen] = useState(() => {
    return 0
  })
  const [userType, setUserType] = useState(null)
  const [language, setLanguage] = useState(() => localStorage.getItem('medikiosk-language') || 'en')
  const [patientData, setPatientData] = useState(() => createDefaultPatientData(localStorage.getItem('medikiosk-language') || 'en'))
  const [workflowData, setWorkflowData] = useState(() => ({
    ...getInitialWorkflow(),
    ...persistedState?.workflowData
  }))

  const handleNavigate = useCallback((screenNumber) => {
    setCurrentScreen(screenNumber)
    window.scrollTo(0, 0)
  }, [])

  const handleDemoChoice = useCallback((type) => {
    setUserType(type)
    if (type === 'patient') {
      setCurrentScreen(PATIENT_FLOW.LANGUAGE_SELECTION)
    } else if (type === 'doctor') {
      setCurrentScreen(-1)
    }
  }, [])

  const handleLanguageChange = useCallback((newLanguage) => {
    setLanguage(newLanguage)
    localStorage.setItem('medikiosk-language', newLanguage)
    const langName = getLanguageLabel(newLanguage)
    setPatientData(prev => ({
      ...prev,
      language: langName
    }))
  }, [])

  const handleUpdateData = useCallback((updates) => {
    setPatientData(prev => ({
      ...prev,
      ...updates
    }))
  }, [])

    const handleUpdateWorkflow = useCallback((updates) => {
    setWorkflowData(prev => ({
      ...prev,
      ...updates
    }))
  }, [])

  const handleResetSession = useCallback(() => {
    // Clear only session-specific data, keep patient identity
    setPatientData(prev => ({
      ...prev,
      sessionId: undefined,
      chiefComplaint: '',
      complaintCategory: '',
      complaintTags: [],
      assessmentAnswers: {}
    }))
    setWorkflowData(getInitialWorkflow())
    console.log('✅ Session data reset')
  }, [])

  useEffect(() => {
    localStorage.setItem('medikiosk-demo-state', JSON.stringify({
      currentScreen,
      userType,
      patientData,
      workflowData
    }))
  }, [currentScreen, userType, patientData, workflowData])

  return {
    currentScreen,
    setCurrentScreen,
    userType,
    language,
    patientData,
    workflowData,
    handleNavigate,
    handleDemoChoice,
    handleLanguageChange,
    handleUpdateData,
    handleUpdateWorkflow,
    handleResetSession,
    setUserType
  }
}
