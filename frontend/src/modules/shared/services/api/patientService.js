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