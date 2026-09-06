import { useEffect, useState,useState } from 'react'
import { LanguageProvider } from './context/LanguageContext'
import Header from './components/Header'
import ProgressBar from './components/ProgressBar'
import Welcome from './pages/Welcome'
import LanguageSelection from './pages/LanguageSelection'
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
  const [currentScreen, setCurrentScreen] = useState(0)
  const [doctorView, setDoctorView] = useState(false)
  const [patientData, setPatientData] = useState(() => {
    const savedData = localStorage.getItem('medikiosk-patient-data')
    return savedData ? JSON.parse(savedData) : {
      language: (localStorage.getItem('medikiosk-language') || 'en') === 'en' ? 'English' : 'हिन्दी',
      fullName: '',
      age: '',
      gender: '',
      mobile: '',
      chiefComplaint: ''
    }
  })
  const [workflowData, setWorkflowData] = useState(() => ({
    ...getInitialWorkflow(),
    ...persistedState?.workflowData
  }))

  const handleNavigate = useCallback((screenNumber) => {
      console.log('App.jsx: Navigating from screen', currentScreen, 'to screen', screenNumber)
      setCurrentScreen(screenNumber)
      window.scrollTo(0, 0)
    }, [currentScreen])
  useEffect(() => {
    localStorage.setItem('medikiosk-patient-data', JSON.stringify(patientData))
  }, [patientData])

  const handleNavigate = (screenNumber) => {
    setCurrentScreen(screenNumber)
    window.scrollTo(0, 0)
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

  useEffect(() => {
    localStorage.setItem('medikiosk-demo-state', JSON.stringify({ currentScreen, patientData, workflowData }))
  }, [currentScreen, patientData, workflowData])

    const renderScreen = () => {
  const renderScreen = () => {
    if (doctorView) {
      return (
        <DoctorDashboard
          onLogout={() => setDoctorView(false)}
          onPatientAccess={() => {
            setDoctorView(false)
            handleNavigate(1)
          }}
        />
      )
    }

    switch (currentScreen) {
      case 0:
        return <DoctorLogin onLogin={() => setDoctorView(true)} onPatientAccess={() => handleNavigate(1)} />
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
        // Old language selection screen - redirect to welcome if accessed directly
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
        return (
          <Welcome 
            onNavigate={handleNavigate}
            onLanguageChange={handleLanguageChange}
            onUpdateData={handleUpdateData}
            patientData={patientData}
          />
        )
    }
  }

  return (
    <LanguageProvider language={language} onLanguageChange={handleLanguageChange}>
      <div className="app-container">
        {currentScreen > 0 && <Header />}
        {currentScreen > 0 && <ProgressBar currentScreen={currentScreen} />}
        {renderScreen()}
      </div>
    </LanguageProvider>
  )
}
}
export default App
