import { supabase, isConfigured } from '../supabase/client'

/**
 * Save or update medical history for a session
 */
export async function saveMedicalHistory(sessionId, historyData) {
  if (!isConfigured) {
    console.log('📝 Mock: Saving medical history for session:', sessionId)
    return {
      history_id: `${Date.now()}-mock-history`,
      session_id: sessionId,
      ...historyData
    }
  }

  try {
    // Check if history already exists
    const { data: existing } = await supabase
      .from('medical_history')
      .select('history_id')
      .eq('session_id', sessionId)
      .maybeSingle()

    if (existing) {
      // Update existing
      const { data, error } = await supabase
        .from('medical_history')
        .update({
          history_present_illness: historyData.history_present_illness,
          past_medical_history: historyData.past_medical_history,
          current_medications: historyData.current_medications,
          past_surgical_history: historyData.past_surgical_history,
          allergies: historyData.allergies,
          family_history: historyData.family_history,
          personal_history: historyData.personal_history,
          review_of_systems: historyData.review_of_systems,
          voice_transcript: historyData.voice_transcript
        })
        .eq('session_id', sessionId)
        .select()
        .single()

      if (error) throw error

      console.log('✅ Medical history updated')
      return data
    } else {
      // Insert new
      const { data, error } = await supabase
        .from('medical_history')
        .insert([{
          session_id: sessionId,
          history_present_illness: historyData.history_present_illness,
          past_medical_history: historyData.past_medical_history,
          current_medications: historyData.current_medications,
          past_surgical_history: historyData.past_surgical_history,
          allergies: historyData.allergies,
          family_history: historyData.family_history,
          personal_history: historyData.personal_history,
          review_of_systems: historyData.review_of_systems,
          voice_transcript: historyData.voice_transcript
        }])
        .select()
        .single()

      if (error) throw error

      console.log('✅ Medical history created')
      return data
    }
  } catch (error) {
    console.error('❌ Error saving medical history:', error)
    throw error
  }
}

/**
 * Get medical history for a session
 */
export async function getMedicalHistory(sessionId) {
  if (!isConfigured) {
    console.log('📝 Mock: Getting medical history for session:', sessionId)
    return {
      session_id: sessionId,
      past_medical_history: 'No known conditions',
      current_medications: 'None',
      allergies: 'No known allergies'
    }
  }

  try {
    const { data, error } = await supabase
      .from('medical_history')
      .select('*')
      .eq('session_id', sessionId)
      .maybeSingle()

    if (error && error.code !== 'PGRST116') throw error

    console.log('✅ Medical history retrieved')
    return data
  } catch (error) {
    console.error('❌ Error getting medical history:', error)
    throw error
  }
}