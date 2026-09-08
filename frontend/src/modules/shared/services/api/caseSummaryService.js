import { supabase, isConfigured } from '../supabase/client'
const CATEGORIES = ['symptoms', 'history', 'lifestyle', 'risk_factors', 'red_flags']
const PRIORITIES = ['high', 'medium', 'low']
const SUMMARY_PRIORITIES = ['urgent', 'high', 'normal']

function normalizeCategory(category) {
  const value = String(category || '').toLowerCase()
  if (value.includes('risk')) return 'risk_factors'
  if (value.includes('red') || value.includes('urgent') || value.includes('serious')) return 'red_flags'
  if (value.includes('history')) return 'history'
  if (value.includes('lifestyle')) return 'lifestyle'
  return 'symptoms'
}

function validateSummary(summary) {
  if (!summary || typeof summary !== 'object') return null

  return {
    summary: typeof summary.summary === 'string' ? summary.summary : '',
    keySymptoms: Array.isArray(summary.keySymptoms) ? summary.keySymptoms : [],
    relevantHistory: Array.isArray(summary.relevantHistory) ? summary.relevantHistory : [],
    documentFindings: Array.isArray(summary.documentFindings) ? summary.documentFindings : [],
    redFlags: Array.isArray(summary.redFlags) ? summary.redFlags : [],
    missingInformation: Array.isArray(summary.missingInformation) ? summary.missingInformation : [],
    priority: SUMMARY_PRIORITIES.includes(summary.priority) ? summary.priority : 'normal',
    priorityReason: typeof summary.priorityReason === 'string' ? summary.priorityReason : ''
  }
}

export function createMockCaseSummary(patientData = {}) {
  const complaint = String(patientData.chiefComplaint || 'Unspecified health concern').trim()
  const urgent = /chest pain|difficulty breathing|shortness of breath|confusion|severe bleeding|बेहोशी|सांस लेने में कठिनाई|सीने में दर्द/i.test(complaint)

  const summary = {
    summary: `Patient reported: ${complaint}. This locally generated draft requires professional review.`,
    keySymptoms: [complaint],
    relevantHistory: [],
    documentFindings: [],
    redFlags: urgent ? [complaint] : [],
    missingInformation: ['Further clinical history and physical examination are required.'],
    priority: urgent ? 'urgent' : 'normal',
    priorityReason: urgent
      ? 'The complaint may include a warning symptom and requires prompt professional review.'
      : 'No urgent warning symptom was identified from the chief complaint alone.'
  }

  console.warn('[Case Summary] Using local fallback summary:', summary)
  return summary
}

export async function generateCaseSummaryOnce({ sessionId, patientData, onProgress }) {
  const reportProgress = (step, message) => {
    console.log(`[Case Summary] ${step}: ${message}`)
    onProgress?.(step, message)
  }

  console.group('[Case Summary] Starting case summary generation')
  reportProgress('preparing', 'Preparing case data')
  console.log('[Case Summary] Input:', {
    sessionId,
    hasPatientData: Boolean(patientData),
    chiefComplaint: patientData?.chiefComplaint || ''
  })

  if (!sessionId) {
    console.error('[Case Summary] Missing session ID')
    console.groupEnd()
    throw new Error('Session ID is required for case summary generation')
  }

  if (!isConfigured) {
    console.error('[Case Summary] Supabase is not configured; cannot invoke Edge Function')
    console.groupEnd()
    throw new Error('Supabase is not configured')
  }

  reportProgress('checking', 'Checking whether a summary already exists')
  console.log('[Case Summary] Checking for existing summary...')
  const { data: existing, error: existingError } = await supabase
    .from('ai_summaries')
    .select('*')
    .eq('session_id', sessionId)
    .maybeSingle()

  if (existingError) {
    console.error('[Case Summary] Existing-summary query failed:', existingError)
    console.groupEnd()
    throw existingError
  }
  if (existing) {
    console.log('[Case Summary] Existing summary found; invocation skipped:', existing.summary_id)
    console.groupEnd()
    return existing
  }

  reportProgress('loading', 'Loading answers and OCR text')
  console.log('[Case Summary] Loading question responses and OCR text...')
  const [responsesResult, documentsResult] = await Promise.all([
    supabase.from('question_responses').select('question, answer, question_category, created_at').eq('session_id', sessionId).order('created_at', { ascending: true }),
    supabase.from('documents').select('ocr_text').eq('session_id', sessionId)
  ])

  if (responsesResult.error) {
    console.error('[Case Summary] Question-response query failed:', responsesResult.error)
    console.groupEnd()
    throw responsesResult.error
  }
  if (documentsResult.error) {
    console.error('[Case Summary] OCR query failed:', documentsResult.error)
    console.groupEnd()
    throw documentsResult.error
  }

  const answers = (responsesResult.data || []).map(item => ({
    question: item.question || '',
    answer: item.answer || '',
    category: normalizeCategory(item.question_category),
    priority: 'medium'
  }))
  const ocrText = (documentsResult.data || []).map(document => document.ocr_text).filter(Boolean).join('\n\n')
  const body = {
    chiefComplaint: patientData?.chiefComplaint || '',
    ...(patientData?.age ? { patientAge: Number(patientData.age) } : {}),
    ...(patientData?.gender ? { patientGender: patientData.gender } : {}),
    ...(Array.isArray(patientData?.medicalHistory) && patientData.medicalHistory.length ? { medicalHistory: patientData.medicalHistory } : {}),
    answers,
    ocrText
  }

  console.log('[Case Summary] Prepared request:', {
    function: 'generate-case-summary',
    sessionId,
    answerCount: answers.length,
    ocrCharacters: ocrText.length,
    body
  })
  reportProgress('generating', 'Generating doctor-facing summary with AI')
  console.log('[Case Summary] Invoking Edge Function...')

  const { data: functionData, error: functionError } = await supabase.functions.invoke('generate-case-summary', { body })

  console.log('[Case Summary] Edge Function returned:', { data: functionData, error: functionError })
  if (functionError) {
    console.error('[Case Summary] Edge Function failed:', functionError)
    console.groupEnd()
    throw functionError
  }

  reportProgress('validating', 'Validating generated summary')
  const summary = validateSummary(functionData?.summary)
  console.log('[Case Summary] Validated summary:', summary)
  if (!summary) {
    console.error('[Case Summary] Invalid response; expected data.summary:', functionData)
    console.groupEnd()
    throw new Error('generate-case-summary returned no valid summary')
  }

  reportProgress('saving', 'Saving summary for doctor review')
  console.log('[Case Summary] Saving summary to ai_summaries...')
  const { data: saved, error: saveError } = await supabase.from('ai_summaries').insert([{
    session_id: sessionId,
      ai_summary: JSON.stringify(summary),
      doctor_edited: false,
      timeline_json: functionData.metadata || {}
  }]).select().single()

  if (saveError) {
    console.error('[Case Summary] Summary save failed:', saveError)
    console.groupEnd()
    throw saveError
  }

  console.log('[Case Summary] Summary saved successfully:', saved)
  reportProgress('complete', 'Summary generation completed')
  console.groupEnd()
  return { ...saved, summary, metadata: functionData.metadata || {} }
}

