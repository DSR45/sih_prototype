import { supabase } from './client.js'

if (supabase) {
  globalThis.supabase = supabase
}

export async function createPatientRecord(patient) {
  if (!globalThis.supabase) {
    return { data: null, error: new Error('Supabase client is not initialized.') }
  }

  const { data, error } = await globalThis.supabase
    .from('patients')
    .insert([
      {
        patient_id: patient.patient_id || null,
        full_name: patient.full_name,
        age: patient.age,
        gender: patient.gender,
        phone: patient.phone,
        preferred_language: patient.preferred_language || 'English'
      }
    ])
    .select()
    .single()

  return { data, error }
}

export async function createSessionRecord(session) {
  if (!globalThis.supabase) {
    return { data: null, error: new Error('Supabase client is not initialized.') }
  }

  const { data, error } = await globalThis.supabase
    .from('sessions')
    .insert([
      {
        patient_id: session.patient_id,
        department: session.department,
        language_used: session.language_used,
        chief_complaint: session.chief_complaint,
        complaint_category: session.complaint_category,
        consent_given: Boolean(session.consent_given),
        status: session.status || 'in_progress'
      }
    ])
    .select()
    .single()

  return { data, error }
}

export async function createQuestionResponse(sessionId, question, answer, category) {
  if (!globalThis.supabase) {
    return { data: null, error: new Error('Supabase client is not initialized.') }
  }

  const { data, error } = await globalThis.supabase
    .from('question_responses')
    .insert([
      {
        session_id: sessionId,
        question,
        answer,
        question_category: category
      }
    ])
    .select()
    .single()

  return { data, error }
}

export async function createMedicalHistory(sessionId, payload) {
  if (!globalThis.supabase) {
    return { data: null, error: new Error('Supabase client is not initialized.') }
  }

  const { data, error } = await globalThis.supabase
    .from('medical_history')
    .upsert({
      session_id: sessionId,
      history_present_illness: payload.history_present_illness,
      past_medical_history: payload.past_medical_history,
      current_medications: payload.current_medications,
      past_surgical_history: payload.past_surgical_history,
      allergies: payload.allergies,
      family_history: payload.family_history,
      personal_history: payload.personal_history,
      review_of_systems: payload.review_of_systems,
      voice_transcript: payload.voice_transcript
    })
    .select()
    .single()

  return { data, error }
}

export async function fetchSubmittedSessions() {
  if (!globalThis.supabase) {
    return { data: [], error: new Error('Supabase client is not initialized.') }
  }

  const { data, error } = await globalThis.supabase
    .from('sessions')
    .select('*')
    .in('status', ['submitted', 'reviewed'])
    .order('created_at', { ascending: false })

  return { data, error }
}
