import React, { useState } from 'react'
import { LanguageProvider } from './context/LanguageContext'
import Header from './components/Header'
import ProgressBar from './components/ProgressBar'
import Welcome from './pages/Welcome'
import LanguageSelection from './pages/LanguageSelection'
import PatientInformation from './pages/PatientInformation'
import ChiefComplaint from './components/ChiefComplaint'
import './App.css'

function App() {
  const [currentScreen, setCurrentScreen] = useState(1)
  const [language, setLanguage] = useState(() => localStorage.getItem('medikiosk-language') || 'en')
  const [patientData, setPatientData] = useState({
    language: (localStorage.getItem('medikiosk-language') || 'en') === 'en' ? 'English' : 'हिन्दी',
    fullName: '',
    age: '',
    gender: '',
    mobile: '',
    chiefComplaint: ''
  })

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

  const handleUpdateData = (updates) => {
    setPatientData(prev => ({
      ...prev,
      ...updates
    }))
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 1:
        return <Welcome onNavigate={handleNavigate} />
      case 2:
        return (
          <LanguageSelection
            patientData={patientData}
            onNavigate={handleNavigate}
            onUpdateData={handleUpdateData}
            onLanguageChange={handleLanguageChange}
          />
        )
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
      default:
        return <Welcome onNavigate={handleNavigate} />
    }
  }

  return (
    <LanguageProvider language={language} onLanguageChange={handleLanguageChange}>
      <div className="app-container">
        <Header />
        <ProgressBar currentScreen={currentScreen} />
        {renderScreen()}
      </div>
    </LanguageProvider>
  )
}

export default App
