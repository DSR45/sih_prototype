import { supabase, isConfigured } from '../supabase/client'

// Mock data for development without Supabase
const MOCK_PATIENT = {
  patient_id: 'MK-10001',
  full_name: 'Demo Patient',
  age: 25,
  gender: 'Male',
  phone: '9999999999',
  preferred_language: 'English'
}

/**
 * Search for existing patient by phone number
 */
export async function searchPatientByPhone(phone) {
  if (!isConfigured) {
    console.log('📝 Mock: Searching patient by phone:', phone)
    return phone ? MOCK_PATIENT : null
  }

  try {
    const cleanPhone = phone.replace(/\D/g, '')
    
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('phone', cleanPhone)
      .maybeSingle()

    if (error && error.code !== 'PGRST116') throw error

    console.log('✅ Patient search:', data ? 'found' : 'not found')
    return data
  } catch (error) {
    console.error('❌ Error searching patient:', error)
    throw error
  }
}

/**
 * Register a new patient
 */
export async function registerPatient(patientData) {
  if (!isConfigured) {
    console.log('📝 Mock: Registering patient:', patientData)
    return {
      ...MOCK_PATIENT,
      ...patientData,
      patient_id: `MK-${Math.floor(10000 + Math.random() * 90000)}`
    }
  }

  try {
    const { data, error } = await supabase
      .from('patients')
      .insert([{
        full_name: patientData.full_name,
        age: Number(patientData.age),
        gender: patientData.gender,
        phone: patientData.phone.replace(/\D/g, ''),
        preferred_language: patientData.preferred_language || 'English'
      }])
      .select()
      .single()

    if (error) throw error

    console.log('✅ Patient registered:', data.patient_id)
    return data
  } catch (error) {
    console.error('❌ Error registering patient:', error)
    throw error
  }
}

/**
 * Get patient by ID
 */
export async function getPatientById(patientId) {
  if (!isConfigured) {
    console.log('📝 Mock: Getting patient:', patientId)
    return MOCK_PATIENT
  }

  try {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('patient_id', patientId)
      .single()

    if (error) throw error

    console.log('✅ Patient retrieved:', data.patient_id)
    return data
  } catch (error) {
    console.error('❌ Error getting patient:', error)
    throw error
  }
}
/**
 * Get complete patient details for a doctor using session ID
 */
export async function getPatientDetails(sessionId) {
  if (!isConfigured) {
    return {
      patient: MOCK_PATIENT,
      session: {
        session_id: sessionId,
        chief_complaint: "Demo complaint",
        department: "General Medicine",
        language_used: "English"
      },
      medical_history: null,
      question_responses: []
    };
  }

  try {
    // Get session + patient
    const { data: session, error: sessionError } = await supabase
      .from("sessions")
      .select(`
        *,
        patients (
          patient_id,
          full_name,
          age,
          gender,
          phone,
          preferred_language
        )
      `)
      .eq("session_id", sessionId)
      .single();

    if (sessionError) throw sessionError;

    // Get medical history
    const { data: medicalHistory } = await supabase
      .from("medical_history")
      .select("*")
      .eq("session_id", sessionId)
      .maybeSingle();

    // Get question responses
    const { data: questionResponses } = await supabase
      .from("question_responses")
      .select("*")
      .eq("session_id", sessionId);

    const { data: aiSummary } = await supabase
      .from("ai_summaries")
      .select("*")
      .eq("session_id", sessionId)
      .maybeSingle();

    return {
      patient: session.patients,
      session,
      medical_history: medicalHistory,
      question_responses: questionResponses || [],
      ai_summary: aiSummary
    };
  } catch (error) {
    console.error("❌ Error getting patient details:", error);
    throw error;
  }
}
/**
 * Get all question responses for a session
 */
export async function getQuestionResponses(sessionId) {
  if (!isConfigured) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from("question_responses")
      .select("*")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: true });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error("❌ Error getting question responses:", error);
    throw error;
  }
}
/**
 * Get medicines extracted from a document
 */
export async function getMedicines(documentId) {
  if (!isConfigured) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from("medicines")
      .select("*")
      .eq("document_id", documentId);

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error("❌ Error getting medicines:", error);
    throw error;
  }
}