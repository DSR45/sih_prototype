import { supabase, isConfigured } from '../supabase/client'

/**
 * Doctor login with Supabase Auth
 */
export async function loginDoctor(email, password) {
  if (!isConfigured) {
    console.log('📝 Mock: Doctor login:', email)
    return {
      user: {
        id: 'mock-doctor-id',
        email: email
      },
      session: {
        access_token: 'mock-token'
      },
      doctor: {
        doctor_id: 'mock-doctor-id',
        full_name: 'Dr. Demo',
        email: email,
        specialization: 'General Medicine'
      }
    }
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) throw error

    // Get doctor profile
    const { data: doctorData, error: doctorError } = await supabase
      .from('doctors')
      .select('*')
      .eq('auth_user_id', data.user.id)
      .single()

    if (doctorError) {
      console.warn('Doctor profile not found, using auth data only')
    }

    console.log('✅ Doctor logged in:', data.user.email)
    return {
      ...data,
      doctor: doctorData
    }
  } catch (error) {
    console.error('❌ Doctor login failed:', error)
    throw error
  }
}

/**
 * Logout doctor
 */
export async function logoutDoctor() {
  if (!isConfigured) {
    console.log('📝 Mock: Doctor logout')
    return { success: true }
  }

  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error

    console.log('✅ Doctor logged out')
    return { success: true }
  } catch (error) {
    console.error('❌ Doctor logout failed:', error)
    throw error
  }
}

/**
 * Get current doctor session
 */
export async function getCurrentDoctor() {
  if (!isConfigured) {
    console.log('📝 Mock: Getting current doctor')
    return null
  }

  try {
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) return null

    // Get doctor profile
    const { data: doctorData } = await supabase
      .from('doctors')
      .select('*')
      .eq('auth_user_id', user.id)
      .single()

    return {
      user,
      doctor: doctorData
    }
  } catch (error) {
    console.error('❌ Error getting current doctor:', error)
    return null
  }
}

/**
 * Get doctor profile by ID
 */
export async function getDoctorProfile(doctorId) {
  if (!isConfigured) {
    console.log('📝 Mock: Getting doctor profile:', doctorId)
    return {
      doctor_id: doctorId,
      full_name: 'Dr. Demo',
      specialization: 'General Medicine'
    }
  }

  try {
    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .eq('doctor_id', doctorId)
      .single()

    if (error) throw error

    console.log('✅ Doctor profile retrieved')
    return data
  } catch (error) {
    console.error('❌ Error getting doctor profile:', error)
    throw error
  }
}

/**
 * Get submitted sessions (doctor dashboard)
 */
export async function getSubmittedSessions() {
  if (!isConfigured) {
    console.log('📝 Mock: Getting submitted sessions')
    return [
      {
        session_id: '1',
        patient_id: 'MK-10001',
        chief_complaint: 'Headache for 3 days',
        status: 'submitted',
        visit_date: new Date().toISOString(),
        patients: {
          full_name: 'Demo Patient',
          age: 30,
          gender: 'Male'
        }
      }
    ]
  }

  try {
    const { data, error } = await supabase
      .from('sessions')
      .select(`
        *,
        patients (
          patient_id,
          full_name,
          age,
          gender,
          phone
        )
      `)
      .eq('status', 'submitted')
      .in('status', ['in_progress', 'submitted'])
      .order('created_at', { ascending: false })

    if (error) throw error

    console.log(`✅ Retrieved ${data.length} submitted sessions`)
    return data
  } catch (error) {
    console.error('❌ Error getting submitted sessions:', error)
    throw error
  }
}

/**
 * Get reviewed sessions
 */
export async function getReviewedSessions() {
  if (!isConfigured) {
    console.log('📝 Mock: Getting reviewed sessions')
    return []
  }

  try {
    const { data, error } = await supabase
      .from('sessions')
      .select(`
        *,
        patients (
          patient_id,
          full_name,
          age,
          gender
        )
      `)
      .eq('status', 'reviewed')
      .order('created_at', { ascending: false })

    if (error) throw error

    console.log(`✅ Retrieved ${data.length} reviewed sessions`)
    return data
  } catch (error) {
    console.error('❌ Error getting reviewed sessions:', error)
    throw error
  }
}

/**
 * Get complete session data for doctor review
 */
export async function getSessionForReview(sessionId) {
  if (!isConfigured) {
    console.log('📝 Mock: Getting session for review:', sessionId)
    return {
      session: { session_id: sessionId, chief_complaint: 'Mock complaint' },
      patient: { full_name: 'Mock Patient' },
      medical_history: {},
      question_responses: [],
      documents: [],
      ai_summary: { ai_summary: 'Mock summary' }
    }
  }

  try {
    // Get session with patient info
    const { data: sessionData, error: sessionError } = await supabase
      .from('sessions')
      .select(`
        *,
        patients (*)
      `)
      .eq('session_id', sessionId)
      .single()

    if (sessionError) throw sessionError

    // Get medical history
    const { data: historyData } = await supabase
      .from('medical_history')
      .select('*')
      .eq('session_id', sessionId)
      .maybeSingle()

    // Get question responses
    const { data: questionsData } = await supabase
      .from('question_responses')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true })

    // Get documents
    const { data: documentsData } = await supabase
      .from('documents')
      .select('*')
      .eq('session_id', sessionId)

    // Get AI summary
    const { data: summaryData } = await supabase
      .from('ai_summaries')
      .select('*')
      .eq('session_id', sessionId)
      .maybeSingle()

    console.log('✅ Complete session data retrieved for review')
    return {
      session: sessionData,
      patient: sessionData.patients,
      medical_history: historyData,
      question_responses: questionsData || [],
      documents: documentsData || [],
      ai_summary: summaryData
    }
  } catch (error) {
    console.error('❌ Error getting session for review:', error)
    throw error
  }
}
export async function getSessionDocuments(sessionId) {
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("session_id", sessionId)

  if (error) throw error
  return data || []
}