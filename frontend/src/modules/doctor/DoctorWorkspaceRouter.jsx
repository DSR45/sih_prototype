import {
  DoctorLoginPage as DoctorLogin,
  DoctorDashboardPage as DoctorDashboard
} from './pages'

function DoctorWorkspaceRouter({ currentScreen, doctorLoggedIn, onLogin, onLogout, onBack, onPatientAccess }) {
  if (currentScreen === -1) {
    return <DoctorLogin onLogin={onLogin} onBack={onBack} onPatientAccess={onPatientAccess} />
  }

  if (currentScreen === -2 && doctorLoggedIn) {
    return <DoctorDashboard onLogout={onLogout} />
  }

  return null
}

export default DoctorWorkspaceRouter
