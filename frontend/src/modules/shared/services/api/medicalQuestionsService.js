import { supabaseAnonKey } from '../supabase/client'

const MEDICAL_QUESTIONS_FUNCTION_URL =
  'https://ghtpixokqjbvphlbiwsr.supabase.co/functions/v1/generate-medical-questions'

function normalizeQuestion(question, index) {
  if (typeof question === 'string') {
    return {
      id: `generated-${index}`,
      question,
      options: [],
      multi: false
    }
  }

  const text = question?.question || question?.text || question?.prompt
  if (!text) return null

  const storageQuestion = question.storageQuestion || question.englishQuestion || question.question_en || text
  const rawOptions = question.options || question.choices || []
  const rawStorageOptions = question.storageOptions || question.englishOptions || question.options_en || rawOptions
  const normalizeOptions = source => Array.isArray(source)
    ? source.map((option, optionIndex) => {
        if (Array.isArray(option)) return option
        if (typeof option === 'string') return [option, `option-${optionIndex}`]
        return [
          option.label || option.text || option.value,
          option.value || `option-${optionIndex}`
        ]
      }).filter(([label]) => label)
    : []

  const options = normalizeOptions(rawOptions)
  const storageOptions = normalizeOptions(rawStorageOptions)

  return {
    ...question,
    id: question.id || `generated-${index}`,
    question: text,
    storageQuestion,
    description: question.description || '',
    options,
    storageOptions: storageOptions.length ? storageOptions : options,
    multi: Boolean(question.multi || question.multiple)
  }
}

export async function generateMedicalQuestions({
  chiefComplaint,
  patientAge,
  patientGender,
  medicalHistory,
  language = 'en'
}) {
  if (!chiefComplaint || !chiefComplaint.trim()) {
    throw new Error('A chief complaint is required to generate questions')
  }

  const selectedLanguage = language === 'hi' ? 'hi' : 'en'
  const body = {
    chiefComplaint: chiefComplaint.trim(),
    language: selectedLanguage,
    ...(patientAge !== undefined && patientAge !== '' ? { patientAge: Number(patientAge) } : {}),
    ...(patientGender ? { patientGender } : {}),
    ...(Array.isArray(medicalHistory) && medicalHistory.length ? { medicalHistory } : {})
  }

  console.group('[Medical Questions] Edge Function request')
  console.log('[Medical Questions] URL:', MEDICAL_QUESTIONS_FUNCTION_URL)
  console.log('[Medical Questions] Request body:', body)

  let response

  try {
    response = await fetch(MEDICAL_QUESTIONS_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`
      },
      body: JSON.stringify(body)
    })

    console.log('[Medical Questions] HTTP status:', response.status)
    console.log('[Medical Questions] Response OK:', response.ok)
  } catch (requestError) {
    console.error('[Medical Questions] Network/CORS error:', requestError)
    console.groupEnd()
    throw requestError
  }

  let payload = null
  try {
    payload = await response.json()
    console.log('[Medical Questions] Raw response payload:', payload)
  } catch (parseError) {
    console.error('[Medical Questions] Invalid JSON response:', parseError)
  }

  if (!response.ok) {
    const message = payload?.error || payload?.message || `Question generation failed (${response.status})`
    console.error('[Medical Questions] Edge Function error:', message)
    console.groupEnd()
    throw new Error(message)
  }

  const questions = Array.isArray(payload?.questions)
    ? payload.questions.map(normalizeQuestion).filter(Boolean)
    : []

  console.log('[Medical Questions] Normalized questions:', questions)
  console.log('[Medical Questions] Metadata:', payload?.metadata)

  if (!questions.length) {
    console.error('[Medical Questions] No questions returned')
    console.groupEnd()
    throw new Error('Question generation returned no questions')
  }

  return {
    questions,
    metadata: payload.metadata || {
      chiefComplaint: body.chiefComplaint,
      timestamp: new Date().toISOString(),
      totalQuestions: questions.length
    }
  }
}