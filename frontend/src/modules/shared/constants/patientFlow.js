export const PATIENT_FLOW = {
  LANGUAGE_SELECTION: 1,
  WELCOME: 1,
  PATIENT_LOGIN: 2,
  PATIENT_DETAILS: 2.5,
  PATIENT_INFO: 3,
  CHIEF_COMPLAINT: 4,
  SYMPTOM_ASSESSMENT: 5,
  DOCUMENTS: 6,
  SUMMARY: 7,
  COMPLETION: 8
}

export const PATIENT_PROGRESS_STEPS = [
  { key: 'PATIENT_INFO', screen: PATIENT_FLOW.PATIENT_INFO, titleKey: 'patientInfo' },
  { key: 'CHIEF_COMPLAINT', screen: PATIENT_FLOW.CHIEF_COMPLAINT, titleKey: 'chiefComplaint' },
  { key: 'SYMPTOM_ASSESSMENT', screen: PATIENT_FLOW.SYMPTOM_ASSESSMENT, titleKey: 'symptomAssessment' },
  { key: 'DOCUMENTS', screen: PATIENT_FLOW.DOCUMENTS, titleKey: 'documents' }
]
