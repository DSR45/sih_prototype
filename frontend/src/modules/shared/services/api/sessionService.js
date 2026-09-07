import { supabase, isConfigured } from '../supabase/client'

// Mock session for development
const MOCK_SESSION = {
  session_id: 'aaaaaaaa-1111-1111-1111-111111111111',
  patient_id: 'MK-10001',
  visit_date: new Date().toISOString(),
  department: 'General Medicine',
  language_used: 'English',
  chief_complaint: 'Demo complaint',
  complaint_category: 'General',
  consent_given: true,
  red_flag: false,
  status: 'in_progress'
}

/**
 * Create a new session for a patient visit
 */
export async function createSession(sessionData) {
  if (!isConfigured) {
    console.log('📝 Mock: Creating session:', sessionData)
    return {
      ...MOCK_SESSION,
      ...sessionData,
      session_id: `${Date.now()}-mock-session`
    }
  }

  try {
    const { data, error } = await supabase
      .from('sessions')
      .insert([{
        patient_id: sessionData.patient_id,
        department: sessionData.department || 'General Medicine',
        language_used: sessionData.language_used || 'English',
        chief_complaint: sessionData.chief_complaint || 'Initial consultation',
        complaint_category: sessionData.complaint_category || 'General',
        consent_given: sessionData.consent_given !== false,
        consent_timestamp: sessionData.consent_given ? new Date().toISOString() : null,
        status: sessionData.status || 'in_progress'
      }])
      .select()
      .single()

    if (error) throw error

    console.log('✅ Session created:', data.session_id)
    return data
  } catch (error) {
    console.error('❌ Error creating session:', error)
    throw error
  }
}

/**
 * Get session by ID
 */
export async function getSessionById(sessionId) {
  if (!isConfigured) {
    console.log('📝 Mock: Getting session:', sessionId)
    return MOCK_SESSION
  }

  try {
    const { data, error } = await supabase
      .from('sessions')
      .select('*, patients(*)')
      .eq('session_id', sessionId)
      .single()

    if (error) throw error

    console.log('✅ Session retrieved:', data.session_id)
    return data
  } catch (error) {
    console.error('❌ Error getting session:', error)
    throw error
  }
}

/**
 * Update session (e.g., chief complaint, status)
 */
export async function updateSession(sessionId, updates) {
  if (!isConfigured) {
    console.log('📝 Mock: Updating session:', sessionId, updates)
    return { ...MOCK_SESSION, ...updates }
  }

  try {
    const { data, error } = await supabase
      .from('sessions')
      .update(updates)
      .eq('session_id', sessionId)
      .select()
      .single()

    if (error) throw error

    console.log('✅ Session updated:', data.session_id)
    return data
  } catch (error) {
    console.error('❌ Error updating session:', error)
    throw error
  }
}

/**
 * Update chief complaint
 */
export async function updateChiefComplaint(sessionId, complaint, category) {
  return updateSession(sessionId, {
    chief_complaint: complaint,
    complaint_category: category
  })
}

/**
 * Submit session for doctor review
 */
export async function submitSession(sessionId) {
  return updateSession(sessionId, {
    status: 'submitted'
  })
}

/**
 * Get all sessions for a patient
 */
export async function getPatientSessions(patientId) {
  if (!isConfigured) {
    console.log('📝 Mock: Getting patient sessions:', patientId)
    return [MOCK_SESSION]
  }

  try {
    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false })

    if (error) throw error

    console.log(`✅ Retrieved ${data.length} sessions for patient`)
    return data
  } catch (error) {
    console.error('❌ Error getting patient sessions:', error)
    throw error
  }
}