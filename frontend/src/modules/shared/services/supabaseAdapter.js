// Adapter using centralized services
import * as patientService from './api/patientService'
import * as sessionService from './api/sessionService'
import * as doctorService from './api/doctorService'
import * as aiSummaryService from './api/aiSummaryService'
import { supabase, isConfigured } from './supabase/client'

// Supabase client now imported from centralized service

const mockPatientSession = {
  id: 'session_mock_001',
  status: 'draft',
  patient_id: 'MK-10001',
  chief_complaint: 'Fever and headache',
  created_at: new Date().toISOString()
}

const mockDoctorProfile = {
  name: 'Dr. Ananya Mehta',
  specialty: 'General Medicine',
  email: 'doctor@medikiosk.local'
}

async function fallbackToMock(operation, fallbackValue) {
  if (operation) {
    try {
      return await operation()
    } catch (error) {
      console.warn('[supabaseAdapter] Falling back to mock data:', error)
    }
  }

  return fallbackValue
}

export const supabasePatientAdapter = {
  async getPatientByPhone(phone) {
    return patientService.searchPatientByPhone(phone)
  },

  async registerPatient(payload) {
    return patientService.registerPatient(payload)
  },

  async getSessionById(id) {
    return sessionService.getSessionById(id)
  },

  async createSession(payload) {
    return sessionService.createSession(payload)
  },

  async updateSession(id, updates) {
    return sessionService.updateSession(id, updates)
  },

  async submitSession(id) {
    return sessionService.submitSession(id)
  }
}

export const supabaseDoctorAdapter = {
  async signInDoctor(email, password) {
    return doctorService.loginDoctor(email, password)
  },

  async getDoctorProfile() {
    const currentDoctor = await doctorService.getCurrentDoctor()
    return currentDoctor?.doctor || mockDoctorProfile
  },

  async getQueue() {
    const sessions = await doctorService.getSubmittedSessions()
    return sessions.map(item => ({
      id: item.patient_id,
      name: item.patients?.full_name || 'Patient',
      concern: item.chief_complaint || 'General review',
      status: item.status === 'reviewed' ? 'Completed' : 'Ready',
      sessionId: item.session_id
    }))
  },

  async reviewSummary(sessionId, summary) {
    const data = await aiSummaryService.updateDoctorSummary(sessionId, summary)
    return { ...data, sessionId, status: 'reviewed' }
  },

  async approveSummary(sessionId) {
    const currentDoctor = await doctorService.getCurrentDoctor()
    const doctorId = currentDoctor?.doctor?.doctor_id || null
    const data = await aiSummaryService.approveSummary(sessionId, doctorId)
    return { ...data, sessionId, status: 'approved' }
  }
}

export const backendCapabilities = {
  patient: isConfigured ? 'supabase' : 'mock-ready',
  doctor: isConfigured ? 'supabase' : 'mock-ready',
  storage: isConfigured ? 'supabase-storage-ready' : 'mock-ready',
  aiSummary: isConfigured ? 'supabase-ready' : 'mock-ready',
  supabaseReady: isConfigured
}

export const supabaseClient = supabase

export async function ensureSupabaseConnectivity() {
  if (!supabase) {
    return { ok: false, reason: 'VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are not configured.' }
  }

  const { error } = await supabase.from('patients').select('patient_id').limit(1)

  if (error) {
    return { ok: false, reason: error.message }
  }

  return { ok: true }
}
