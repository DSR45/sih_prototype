const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export async function generateAiAssessment(patientData) {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('AI service is not configured. Add the Supabase URL and anon key to frontend/.env.local.')
  }

  const response = await fetch(`${supabaseUrl.replace(/\/$/, '')}/functions/v1/gemini-assessment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`,
    },
    body: JSON.stringify({
      age: patientData.age,
      gender: patientData.gender,
      language: patientData.language,
      chiefComplaint: patientData.chiefComplaint,
      assessmentAnswers: patientData.assessmentAnswers,
    }),
  })

  const payload = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(payload.error || 'Could not generate the AI assessment.')
  return payload.assessment
}

export async function generateFollowUpQuestions({ chiefComplaint, language }) {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('AI service is not configured. Add the Supabase URL and anon key to frontend/.env.local.')
  }

  const response = await fetch(`${supabaseUrl.replace(/\/$/, '')}/functions/v1/gemini-follow-up-questions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`,
    },
    body: JSON.stringify({ chiefComplaint, language }),
  })

  const payload = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(payload.error || 'Could not generate follow-up questions.')
  return payload.questions
}
