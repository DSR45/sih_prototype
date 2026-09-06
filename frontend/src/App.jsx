import { useCallback, useEffect, useState } from 'react'
import { LanguageProvider } from './context/LanguageContext'
import Header from './components/Header'
import ProgressBar from './components/ProgressBar'
import DemoLanding from './pages/DemoLanding'
import Welcome from './pages/Welcome'
import PatientInformation from './pages/PatientInformation'
import ChiefComplaint from './components/ChiefComplaint'
import SymptomAssessment from './pages/SymptomAssessment'
import PatientWorkflow, { getInitialWorkflow } from './pages/PatientWorkflow'
import DoctorLogin from './pages/DoctorLogin'
import DoctorDashboard from './pages/DoctorDashboard'
import './App.css'

const persistedState = (() => {
  try {
    return JSON.parse(localStorage.getItem('medikiosk-demo-state') || 'null')
  } catch {
    return null
  }
})()

function App() {
  const [currentScreen, setCurrentScreen] = useState(0) // Always start at Demo Landing
  const [userType, setUserType] = useState(null) // Always start fresh // 'patient' or 'doctor'
  const [language, setLanguage] = useState(() => localStorage.getItem('medikiosk-language') || 'en')
  const [patientData, setPatientData] = useState({
    language: (localStorage.getItem('medikiosk-language') || 'en') === 'en' ? 'English' : 'हिन्दी',
    fullName: '',
    age: '',
    gender: '',
    mobile: '',
    chiefComplaint: '',
    assessmentAnswers: null,
    // Start fresh - no persisted data
  })
  const [workflowData, setWorkflowData] = useState(() => ({
    ...getInitialWorkflow(),
    ...persistedState?.workflowData
  }))
  const [doctorLoggedIn, setDoctorLoggedIn] = useState(false)

  const handleNavigate = useCallback((screenNumber) => {
    console.log('App.jsx: Navigating from screen', currentScreen, 'to screen', screenNumber)
    setCurrentScreen(screenNumber)
    window.scrollTo(0, 0)
  }, [currentScreen])

  const handleDemoChoice = (type) => {
    setUserType(type)
    if (type === 'patient') {
      setCurrentScreen(1) // Go to patient welcome screen
    } else if (type === 'doctor') {
      setCurrentScreen(-1) // Go to doctor login screen
    }
  }

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage)
    localStorage.setItem('medikiosk-language', newLanguage)
    const langName = newLanguage === 'en' ? 'English' : 'हिन्दी'
    setPatientData(prev => ({
      ...prev,
      language: langName
    }))
  }

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

  const handleDoctorLogin = () => {
    setDoctorLoggedIn(true)
    setCurrentScreen(-2) // Go to doctor dashboard
  }

  const handleDoctorLogout = () => {
    setDoctorLoggedIn(false)
    setUserType(null)
    setCurrentScreen(0) // Back to demo landing
  }

  useEffect(() => {
    localStorage.setItem('medikiosk-demo-state', JSON.stringify({ 
      currentScreen, 
      userType,
      patientData, 
      workflowData 
    }))
  }, [currentScreen, userType, patientData, workflowData])

  const renderScreen = () => {
    // Demo Landing Screen
    if (currentScreen === 0) {
      return <DemoLanding onNavigate={handleDemoChoice} />
    }

    // Doctor Login Screen
    if (currentScreen === -1) {
      return (
        <DoctorLogin 
          onLogin={handleDoctorLogin}
          onBack={() => {
            setUserType(null)
            setCurrentScreen(0)
          }}
        />
      )
    }

    // Doctor Dashboard
    if (currentScreen === -2 && doctorLoggedIn) {
      return (
        <DoctorDashboard
          onLogout={handleDoctorLogout}
        />
      )
    }

    // Patient Workflow
    switch (currentScreen) {
      case 1:
        return (
          <Welcome 
            onNavigate={handleNavigate}
            onLanguageChange={handleLanguageChange}
            onUpdateData={handleUpdateData}
            patientData={patientData}
          />
        )
      case 2:
        // Old language selection screen - redirect to welcome
        handleNavigate(1)
        return null
      case 3:
        return (
          <PatientInformation
            patientData={patientData}
            onNavigate={handleNavigate}
            onUpdateData={handleUpdateData}
          />
        )
      case 4:
        return (
          <ChiefComplaint
            patientData={patientData}
            onNavigate={handleNavigate}
            onUpdateData={handleUpdateData}
          />
        )
      case 5:
        return (
          <SymptomAssessment
            patientData={patientData}
            onNavigate={handleNavigate}
            onUpdateData={handleUpdateData}
          />
        )
      case 6:
      case 7:
      case 8:
      case 9:
      case 10:
      case 11:
      case 12:
      case 13:
      case 14:
      case 15:
      case 16:
        return (
          <PatientWorkflow
            screen={currentScreen}
            patientData={patientData}
            workflowData={workflowData}
            updateWorkflow={handleUpdateWorkflow}
            onNavigate={handleNavigate}
          />
        )
      default:
        return <DemoLanding onNavigate={handleDemoChoice} />
    }
  }

  const showHeader = currentScreen > 0 && currentScreen !== -1 && currentScreen !== -2
  const showProgressBar = currentScreen > 0

  return (
    <LanguageProvider language={language} onLanguageChange={handleLanguageChange}>
      <div className="app-container">
        {showHeader && <Header />}
        {showProgressBar && <ProgressBar currentScreen={currentScreen} />}
        {renderScreen()}
      </div>
    </LanguageProvider>
  )
}

export default App
