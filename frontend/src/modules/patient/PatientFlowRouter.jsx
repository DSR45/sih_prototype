import Welcome from '../../pages/Welcome'
import PatientLogin from '../../pages/PatientLogin'
import PatientInformation from '../../pages/PatientInformation'
import ChiefComplaint from '../../components/ChiefComplaint'
import SymptomAssessment from '../../pages/SymptomAssessment'
import PatientWorkflow from '../../pages/PatientWorkflow'
import { PATIENT_FLOW } from '../../constants/patientFlow'

function PatientFlowRouter({
  currentScreen,
  patientData,
  workflowData,
  onNavigate,
  onUpdateData,
  onUpdateWorkflow,
  onLanguageChange
}) {
  switch (currentScreen) {
    case PATIENT_FLOW.WELCOME:
      return (
        <Welcome
          onNavigate={onNavigate}
          onLanguageChange={onLanguageChange}
          onUpdateData={onUpdateData}
          patientData={patientData}
        />
      )
    case PATIENT_FLOW.PATIENT_LOGIN:
      return (
        <PatientLogin
          patientData={patientData}
          onNavigate={onNavigate}
          onUpdateData={onUpdateData}
          onDoctorLogin={() => onNavigate(-1)}
        />
      )
    case PATIENT_FLOW.PATIENT_INFO:
      return (
        <PatientInformation
          patientData={patientData}
          onNavigate={onNavigate}
          onUpdateData={onUpdateData}
        />
      )
    case PATIENT_FLOW.CHIEF_COMPLAINT:
      return (
        <ChiefComplaint
          patientData={patientData}
          onNavigate={onNavigate}
          onUpdateData={onUpdateData}
        />
      )
    case PATIENT_FLOW.SYMPTOM_ASSESSMENT:
      return (
        <SymptomAssessment
          patientData={patientData}
          onNavigate={onNavigate}
          onUpdateData={onUpdateData}
        />
      )
    case PATIENT_FLOW.DOCUMENTS:
    case PATIENT_FLOW.SUMMARY:
    case PATIENT_FLOW.COMPLETION:
      return (
        <PatientWorkflow
          screen={currentScreen}
          patientData={patientData}
          workflowData={workflowData}
          updateWorkflow={onUpdateWorkflow}
          onNavigate={onNavigate}
        />
      )
    default:
      return null
  }
}

export default PatientFlowRouter
