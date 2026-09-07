import { supabase, isConfigured } from '../supabase/client'

/**
 * Save question response
 */
export async function saveQuestionResponse(sessionId, question, answer, category) {
  if (!isConfigured) {
    console.log('📝 Mock: Saving question response:', { sessionId, question, answer })
    return {
      response_id: `${Date.now()}-mock-response`,
      session_id: sessionId,
      question,
      answer,
      question_category: category
    }
  }

  try {
    const { data, error } = await supabase
      .from('question_responses')
      .insert([{
        session_id: sessionId,
        question: question,
        answer: answer,
        question_category: category
      }])
      .select()
      .single()

    if (error) throw error

    console.log('✅ Question response saved')
    return data
  } catch (error) {
    console.error('❌ Error saving question response:', error)
    throw error
  }
}

/**
 * Save multiple question responses
 */
export async function saveQuestionResponses(sessionId, responses) {
  if (!isConfigured) {
    console.log('📝 Mock: Saving multiple responses for session:', sessionId)
    return responses.map((r, i) => ({
      response_id: `${Date.now()}-${i}`,
      session_id: sessionId,
      ...r
    }))
  }

  try {
    const inserts = responses.map(r => ({
      session_id: sessionId,
      question: r.question,
      answer: r.answer,
      question_category: r.question_category || r.category
    }))

    const { data, error } = await supabase
      .from('question_responses')
      .insert(inserts)
      .select()

    if (error) throw error

    console.log(`✅ ${data.length} question responses saved`)
    return data
  } catch (error) {
    console.error('❌ Error saving question responses:', error)
    throw error
  }
}

/**
 * Get all question responses for a session
 */
export async function getQuestionResponses(sessionId) {
  if (!isConfigured) {
    console.log('📝 Mock: Getting question responses for session:', sessionId)
    return [
      {
        response_id: '1',
        question: 'When did symptoms start?',
        answer: 'Two days ago',
        question_category: 'General'
      }
    ]
  }

  try {
    const { data, error } = await supabase
      .from('question_responses')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true })

    if (error) throw error

    console.log(`✅ Retrieved ${data.length} question responses`)
    return data || []
  } catch (error) {
    console.error('❌ Error getting question responses:', error)
    throw error
  }
}