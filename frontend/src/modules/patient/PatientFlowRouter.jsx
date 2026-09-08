import {
  WelcomePage,
  LanguageSelectionPage as LanguageSelection,
  PatientLoginPage as PatientLogin,
  PatientInformationPage as PatientInformation,
  PatientDetailsPage as PatientDetails,
  PatientWorkflowPage as PatientWorkflow,
  SymptomAssessmentPage as SymptomAssessment
} from './pages'
import { ChiefComplaint } from './components'
import { PATIENT_FLOW } from '@shared/constants'

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
    case PATIENT_FLOW.LANGUAGE_SELECTION:
      return (
        <LanguageSelection
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
    case PATIENT_FLOW.PATIENT_DETAILS:
      return (
        <PatientDetails
                  patientData={patientData}
                  onNavigate={onNavigate}
                  onUpdateData={onUpdateData}
                  onUpdateWorkflow={onUpdateWorkflow}
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
    case PATIENT_FLOW.ASSESSMENT_RESULT:
    case PATIENT_FLOW.NEXT_STEP:
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
