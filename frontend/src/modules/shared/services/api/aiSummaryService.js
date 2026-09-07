import { supabase, isConfigured } from '../supabase/client'

/**
 * Generate AI summary for a session
 * This would typically call an Edge Function or AI service
 */
export async function generateAISummary(sessionId) {
  if (!isConfigured) {
    console.log('📝 Mock: Generating AI summary for session:', sessionId)
    return {
      summary_id: `${Date.now()}-mock-summary`,
      session_id: sessionId,
      ai_summary: 'Mock AI-generated clinical summary.\n\nPatient reported symptoms...\n\nRecommendations: Doctor review required.',
      doctor_edited: false,
      created_at: new Date().toISOString()
    }
  }

  try {
    // First, check if summary already exists
    const { data: existing } = await supabase
      .from('ai_summaries')
      .select('*')
      .eq('session_id', sessionId)
      .maybeSingle()

    if (existing) {
      console.log('✅ AI summary already exists')
      return existing
    }

    // TODO: Call Edge Function or AI service to generate summary
    // For now, create a basic summary
    const fallbackSummary = `AI Draft Clinical Summary\n\nSession ID: ${sessionId}\n\nThis is an AI-generated draft summary.\nDoctor verification required.\n\nNote: Real AI integration pending.`

    const { data, error } = await supabase
      .from('ai_summaries')
      .insert([{
        session_id: sessionId,
        ai_summary: fallbackSummary,
        doctor_edited: false,
        timeline_json: {}
      }])
      .select()
      .single()

    if (error) throw error

    console.log('✅ AI summary created')
    return data
  } catch (error) {
    console.error('❌ Error generating AI summary:', error)
    throw error
  }
}

/**
 * Get AI summary for a session
 */
export async function getAISummary(sessionId) {
  if (!isConfigured) {
    console.log('📝 Mock: Getting AI summary for session:', sessionId)
    return {
      session_id: sessionId,
      ai_summary: 'Mock AI summary',
      doctor_summary: null,
      doctor_edited: false
    }
  }

  try {
    const { data, error } = await supabase
      .from('ai_summaries')
      .select('*')
      .eq('session_id', sessionId)
      .maybeSingle()

    if (error && error.code !== 'PGRST116') throw error

    console.log('✅ AI summary retrieved')
    return data
  } catch (error) {
    console.error('❌ Error getting AI summary:', error)
    throw error
  }
}

/**
 * Update doctor's edited summary
 */
export async function updateDoctorSummary(sessionId, doctorSummary) {
  if (!isConfigured) {
    console.log('📝 Mock: Updating doctor summary for session:', sessionId)
    return {
      session_id: sessionId,
      doctor_summary: doctorSummary,
      doctor_edited: true
    }
  }

  try {
    const { data, error } = await supabase
      .from('ai_summaries')
      .update({
        doctor_summary: doctorSummary,
        doctor_edited: true
      })
      .eq('session_id', sessionId)
      .select()
      .single()

    if (error) throw error

    console.log('✅ Doctor summary updated')
    return data
  } catch (error) {
    console.error('❌ Error updating doctor summary:', error)
    throw error
  }
}

/**
 * Approve summary (doctor approval)
 */
export async function approveSummary(sessionId, doctorId) {
  if (!isConfigured) {
    console.log('📝 Mock: Approving summary for session:', sessionId)
    return {
      session_id: sessionId,
      approved_by: doctorId,
      approved_at: new Date().toISOString()
    }
  }

  try {
    // Update AI summary with approval
    const { data: summaryData, error: summaryError } = await supabase
      .from('ai_summaries')
      .update({
        approved_by: doctorId,
        approved_at: new Date().toISOString()
      })
      .eq('session_id', sessionId)
      .select()
      .single()

    if (summaryError) throw summaryError

    // Update session status to reviewed
    const { error: sessionError } = await supabase
      .from('sessions')
      .update({ status: 'reviewed' })
      .eq('session_id', sessionId)

    if (sessionError) throw sessionError

    console.log('✅ Summary approved, session marked as reviewed')
    return summaryData
  } catch (error) {
    console.error('❌ Error approving summary:', error)
    throw error
  }
}