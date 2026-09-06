import { LanguageProvider } from './context/LanguageContext'
import Header from './components/Header'
import ProgressBar from './components/ProgressBar'
import DemoLanding from './pages/DemoLanding'
import { PATIENT_FLOW } from './constants/patientFlow'
import PatientFlowRouter from './modules/patient/PatientFlowRouter'
import DoctorWorkspaceRouter from './modules/doctor/DoctorWorkspaceRouter'
import { usePatientFlow } from './modules/patient/hooks/usePatientFlow'
import { useDoctorWorkspace } from './modules/doctor/hooks/useDoctorWorkspace'
import './App.css'

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
    setCurrentScreen(PATIENT_FLOW.WELCOME)
  }

  const renderScreen = () => {
    if (currentScreen === 0) {
      return (
        <Welcome
          onNavigate={handleNavigate}
          onLanguageChange={handleLanguageChange}
          onUpdateData={handleUpdateData}
          patientData={patientData}
        />
      )
    }

    if (currentScreen === -1 || (currentScreen === -2 && doctorLoggedIn)) {
      return (
        <DoctorWorkspaceRouter
          currentScreen={currentScreen}
          doctorLoggedIn={doctorLoggedIn}
          onLogin={handleDoctorFlowLogin}
          onLogout={handleDoctorFlowLogout}
          onBack={() => {
            setUserType(null)
            setCurrentScreen(PATIENT_FLOW.WELCOME)
          }}
          onPatientAccess={() => {
            setUserType('patient')
            setCurrentScreen(PATIENT_FLOW.WELCOME)
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
