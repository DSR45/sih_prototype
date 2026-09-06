import { useCallback, useEffect, useState } from 'react'
import { getInitialWorkflow } from '../../../pages/PatientWorkflow'
import { PATIENT_FLOW } from '../../../constants/patientFlow'
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
    const savedScreen = persistedState?.currentScreen
    return savedScreen === 0 ? PATIENT_FLOW.WELCOME : savedScreen ?? PATIENT_FLOW.WELCOME
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
      setCurrentScreen(PATIENT_FLOW.WELCOME)
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
    setUserType
  }
}
