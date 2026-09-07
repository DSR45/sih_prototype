export function createDefaultPatientData(language = 'en') {
  return {
    language: language === 'en' ? 'English' : 'हिन्दी',
    fullName: '',
    age: '',
    gender: '',
    mobile: '',
    chiefComplaint: '',
    complaintTags: [],
    assessmentAnswers: null
  }
}

export function mergePatientData(prevState = {}, updates = {}) {
  return {
    ...prevState,
    ...updates
  }
}

export function getLanguageLabel(language = 'en') {
  return language === 'en' ? 'English' : 'हिन्दी'
}
