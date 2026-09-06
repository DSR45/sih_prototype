import { createClient } from '@supabase/supabase-js'

const browserEnv = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env : {}
const nodeEnv = typeof process !== 'undefined' && process.env ? process.env : {}

const supabaseUrl = browserEnv.VITE_SUPABASE_URL || nodeEnv.VITE_SUPABASE_URL
const supabaseAnonKey = browserEnv.VITE_SUPABASE_ANON_KEY || nodeEnv.VITE_SUPABASE_ANON_KEY

const isConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('your-project') &&
  !supabaseAnonKey.includes('your-anon-key')
)

const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    })
  : null

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
    if (!supabase) {
      const normalized = (phone || '').replace(/\D/g, '')
      return normalized ? { patient_id: 'MK-10001', full_name: 'Rahul Sharma', phone: normalized, preferred_language: 'English' } : null
    }

    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .ilike('phone', `%${String(phone || '').replace(/\D/g, '')}%`)
      .limit(1)
      .maybeSingle()

    if (error) {
      throw error
    }

    return data
  },

  async registerPatient(payload) {
    if (!supabase) {
      return {
        patient_id: 'MK-10001',
        full_name: payload.full_name,
        age: payload.age,
        gender: payload.gender,
        phone: payload.phone,
        preferred_language: payload.preferred_language || 'English'
      }
    }

    const { data, error } = await supabase
      .from('patients')
      .insert([
        {
          full_name: payload.full_name,
          age: Number(payload.age),
          gender: payload.gender,
          phone: payload.phone,
          preferred_language: payload.preferred_language || 'English'
        }
      ])
      .select()
      .single()

    if (error) {
      throw error
    }

    return data
  },

  async getSessionById(id) {
    if (!supabase) {
      return mockPatientSession
    }

    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('session_id', id)
      .maybeSingle()

    if (error) {
      throw error
    }

    return data || mockPatientSession
  },

  async createSession(payload) {
    if (!supabase) {
      return { ...mockPatientSession, ...payload, id: payload.id || mockPatientSession.id }
    }

    const { data, error } = await supabase
      .from('sessions')
      .insert([
        {
          patient_id: payload.patient_id,
          chief_complaint: payload.chief_complaint,
          complaint_category: payload.complaint_category || 'General',
          department: payload.department || 'General Medicine',
          language_used: payload.language_used || 'English',
          consent_given: Boolean(payload.consent_given),
          status: payload.status || 'in_progress'
        }
      ])
      .select()
      .single()

    if (error) {
      throw error
    }

    return data
  },

  async updateSession(id, updates) {
    if (!supabase) {
      return { id, ...updates }
    }

    const { data, error } = await supabase
      .from('sessions')
      .update(updates)
      .eq('session_id', id)
      .select()
      .single()

    if (error) {
      throw error
    }

    return data
  },

  async submitSession(id) {
    return this.updateSession(id, { status: 'submitted' })
  }
}

export const supabaseDoctorAdapter = {
  async signInDoctor(email, password) {
    if (!supabase) {
      return { user: { email }, session: { access_token: 'demo-doctor-token' }, demo: true }
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      throw error
    }

    return data
  },

  async getDoctorProfile() {
    if (!supabase) {
      return mockDoctorProfile
    }

    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .limit(1)
      .maybeSingle()

    if (error) {
      throw error
    }

    return data || mockDoctorProfile
  },

  async getQueue() {
    if (!supabase) {
      return [
        { id: 'MK-1048', name: 'Rahul Sharma', concern: 'Fever and headache', status: 'Ready' },
        { id: 'MK-1047', name: 'Priya Nair', concern: 'Persistent cough', status: 'Waiting' }
      ]
    }

    const { data, error } = await supabase
      .from('sessions')
      .select('*, patients(full_name, patient_id)')
      .in('status', ['submitted', 'reviewed'])
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return (data || []).map((item) => ({
      id: item.patient_id,
      name: item.patients?.full_name || 'Patient',
      concern: item.chief_complaint || 'General review',
      status: item.status === 'reviewed' ? 'Completed' : 'Ready'
    }))
  },

  async reviewSummary(sessionId, summary) {
    if (!supabase) {
      return { sessionId, summary, status: 'reviewed' }
    }

    const { data, error } = await supabase
      .from('ai_summaries')
      .update({ doctor_summary: summary, doctor_edited: true })
      .eq('session_id', sessionId)
      .select()
      .single()

    if (error) {
      throw error
    }

    return { ...data, sessionId, status: 'reviewed' }
  },

  async approveSummary(sessionId) {
    if (!supabase) {
      return { sessionId, status: 'approved' }
    }

    const { data, error } = await supabase
      .from('sessions')
      .update({ status: 'reviewed' })
      .eq('session_id', sessionId)
      .select()
      .single()

    if (error) {
      throw error
    }

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
