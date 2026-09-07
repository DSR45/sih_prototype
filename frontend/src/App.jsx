import { useEffect } from 'react'
import { LanguageProvider } from '@shared/contexts'
import { Header, ProgressBar } from '@shared/components'
import DemoLanding from '@shared/pages/DemoLanding'
import { PATIENT_FLOW } from '@shared/constants'
import { verifySetup, displaySetupStatus } from '@shared/utils/setupVerification'
import PatientFlowRouter from './modules/patient/PatientFlowRouter'
import DoctorWorkspaceRouter from './modules/doctor/DoctorWorkspaceRouter'
import { usePatientFlow } from './modules/patient/hooks/usePatientFlow'
import { useDoctorWorkspace } from './modules/doctor/hooks/useDoctorWorkspace'
import './App.css'
import './styles/compactLayout.css'

function App() {
  const {
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
  } = usePatientFlow()

  const { doctorLoggedIn, handleDoctorLogin, handleDoctorLogout } = useDoctorWorkspace()

  // Verify Supabase setup on app load
  useEffect(() => {
    async function checkSetup() {
      const status = await verifySetup()
      displaySetupStatus(status)
    }
    checkSetup()
  }, [])

  const handleDoctorFlowLogin = async (credentials) => {
    const loggedIn = await handleDoctorLogin(credentials)
    if (loggedIn !== false) {
      setCurrentScreen(-2)
      return true
    }

    return false
  }

  const handleDoctorFlowLogout = () => {
    handleDoctorLogout()
    setUserType(null)
    setCurrentScreen(PATIENT_FLOW.LANGUAGE_SELECTION)
  }

  const renderScreen = () => {
    if (currentScreen === -1 || (currentScreen === -2 && doctorLoggedIn)) {
      return (
        <DoctorWorkspaceRouter
          currentScreen={currentScreen}
          doctorLoggedIn={doctorLoggedIn}
          onLogin={handleDoctorFlowLogin}
          onLogout={handleDoctorFlowLogout}
          onBack={() => {
            setUserType(null)
            setCurrentScreen(PATIENT_FLOW.LANGUAGE_SELECTION)
          }}
          onPatientAccess={() => {
            setUserType('patient')
            setCurrentScreen(PATIENT_FLOW.LANGUAGE_SELECTION)
          }}
        />
      )
    }

    if (Object.values(PATIENT_FLOW).includes(currentScreen)) {
      return (
        <PatientFlowRouter
          currentScreen={currentScreen}
          patientData={patientData}
          workflowData={workflowData}
          onNavigate={handleNavigate}
          onUpdateData={handleUpdateData}
          onUpdateWorkflow={handleUpdateWorkflow}
          onLanguageChange={handleLanguageChange}
        />
      )
    }

    return <DemoLanding onNavigate={handleDemoChoice} />
  }

    const showHeader = currentScreen >= PATIENT_FLOW.PATIENT_INFO && currentScreen !== -1 && currentScreen !== -2
    const showProgressBar = currentScreen >= PATIENT_FLOW.PATIENT_INFO

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
