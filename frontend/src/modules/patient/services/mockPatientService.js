import { supabasePatientAdapter } from '../../shared/services/supabaseAdapter'

const mockPatient = {
  language: 'English',
  fullName: 'Rahul Sharma',
  age: '32',
  gender: 'Male',
  mobile: '9876543210',
  chiefComplaint: 'Fever and headache since yesterday',
  complaintTags: ['fever', 'headache'],
  assessmentAnswers: {
    duration: '1-day',
    temperature: 'around-101',
    symptoms: ['headache'],
    seriousSymptoms: ['none']
  }
}

export function getInitialPatientData(language = 'en') {
  return {
    language: language === 'en' ? 'English' : 'हिन्दी',
    fullName: '',
    age: '',
    gender: '',
    mobile: '',
    chiefComplaint: '',
    complaintTags: [],
    assessmentAnswers: null,
    ...mockPatient,
    language: language === 'en' ? 'English' : 'हिन्दी'
  }
}

export async function createPatientSessionDraft(patientData = {}) {
  const payload = {
    patient_id: patientData.patientId || 'MK-10001',
    chief_complaint: patientData.chiefComplaint || mockPatient.chiefComplaint,
    complaint_category: patientData.complaintCategory || 'General',
    department: patientData.department || 'General Medicine',
    language_used: patientData.language || 'English',
    consent_given: Boolean(patientData.consentGiven),
    status: 'in_progress'
  }

  try {
    const session = await supabasePatientAdapter.createSession(payload)
    return {
      id: session?.session_id || session?.id || `session_${Date.now()}`,
      status: session?.status || 'draft',
      createdAt: session?.created_at || new Date().toISOString(),
      updatedAt: session?.created_at || new Date().toISOString(),
      patient: {
        fullName: patientData.fullName || mockPatient.fullName,
        age: patientData.age || mockPatient.age,
        gender: patientData.gender || mockPatient.gender,
        mobile: patientData.mobile || mockPatient.mobile,
        language: patientData.language || 'English'
      },
      chiefComplaint: payload.chief_complaint,
      complaintTags: patientData.complaintTags || [],
      assessmentAnswers: patientData.assessmentAnswers || {},
      medicalHistory: {
        allergies: '',
        medications: '',
        surgeries: '',
        familyHistory: ''
      },
      documents: [],
      aiDraftSummary: null
    }
  } catch (error) {
    console.warn('Supabase patient session creation failed; using local fallback.', error)
    return {
      id: `session_${Date.now()}`,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      patient: {
        fullName: patientData.fullName || mockPatient.fullName,
        age: patientData.age || mockPatient.age,
        gender: patientData.gender || mockPatient.gender,
        mobile: patientData.mobile || mockPatient.mobile,
        language: patientData.language || 'English'
      },
      chiefComplaint: patientData.chiefComplaint || mockPatient.chiefComplaint,
      complaintTags: patientData.complaintTags || [],
      assessmentAnswers: patientData.assessmentAnswers || {},
      medicalHistory: {
        allergies: '',
        medications: '',
        surgeries: '',
        familyHistory: ''
      },
      documents: [],
      aiDraftSummary: null
    }
  }
}
