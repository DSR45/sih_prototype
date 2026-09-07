const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
}

type Intake = {
  age?: string | number
  gender?: string
  language?: string
  chiefComplaint?: string
  assessmentAnswers?: Record<string, string | string[]>
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  })

function extractJson(text: string) {
  const cleaned = text.replace(/^```json\s*|\s*```$/g, "").trim()
  return JSON.parse(cleaned)
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders })
  if (request.method !== "POST") return json({ error: "Method not allowed" }, 405)

  const apiKey = Deno.env.get("GEMINI_API_KEY")
  if (!apiKey) return json({ error: "Gemini is not configured on the server." }, 503)

  let intake: Intake
  try {
    intake = await request.json()
  } catch {
    return json({ error: "Request body must be valid JSON." }, 400)
  }

  if (!intake.chiefComplaint?.trim()) {
    return json({ error: "A chief complaint is required." }, 400)
  }

  // Only send the clinical intake required for this summary; names and phone numbers are excluded.
  const intakeForModel = {
    age: intake.age ?? "not provided",
    gender: intake.gender ?? "not provided",
    language: intake.language ?? "English",
    chiefComplaint: intake.chiefComplaint.trim().slice(0, 2000),
    assessmentAnswers: intake.assessmentAnswers ?? {},
  }

  const prompt = `You are a clinical-intake assistant for a supervised Indian health kiosk. Create a concise, plain-language intake summary for a qualified clinician. Do not diagnose, prescribe, or claim certainty. Treat this as decision support only. If chest pain, difficulty breathing, confusion, severe weakness, dark/black blood, or another immediate danger sign is present, use triage “urgent” and tell the patient to seek immediate in-person care.

Return ONLY valid JSON with this exact shape:
{
  "summary": "string, maximum 90 words",
  "triage": "routine" | "urgent",
  "redFlags": ["string"],
  "recommendedNextSteps": ["string", "string"],
  "disclaimer": "string"
}

Patient intake (do not repeat or infer identifying information):
${JSON.stringify(intakeForModel)}`

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.2, maxOutputTokens: 500, responseMimeType: "application/json" },
        }),
      },
    )

    if (!response.ok) {
      console.error("Gemini request failed", response.status, await response.text())
      return json({ error: "Unable to generate the assessment right now." }, 502)
    }

    const data = await response.json()
    const text = data.candidates?.[0]?.content?.parts?.map((part: { text?: string }) => part.text ?? "").join("")
    if (!text) return json({ error: "Gemini returned no assessment." }, 502)

    const assessment = extractJson(text)
    return json({ assessment })
  } catch (error) {
    console.error("Assessment generation error", error)
    return json({ error: "Unable to generate the assessment right now." }, 500)
  }
})
