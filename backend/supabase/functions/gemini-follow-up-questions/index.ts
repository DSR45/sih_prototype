const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
}

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { ...corsHeaders, "Content-Type": "application/json" },
})

function parseQuestions(text: string) {
  const payload = JSON.parse(text.replace(/^```json\s*|\s*```$/g, "").trim())
  if (!Array.isArray(payload.questions) || payload.questions.length < 3) throw new Error("Invalid question payload")

  const questions = payload.questions.slice(0, 6).map((item: Record<string, unknown>, index: number) => {
    const options = Array.isArray(item.options) ? item.options.slice(0, 4) : []
    if (typeof item.question !== "string" || options.length < 2) throw new Error("Invalid question")
    return {
      id: `ai-question-${index + 1}`,
      question: item.question.slice(0, 240),
      description: typeof item.description === "string" ? item.description.slice(0, 280) : "",
      multi: item.multi === true,
      options: options.map((option: Record<string, unknown>, optionIndex: number) => ({
        label: String(option.label ?? "Option").slice(0, 100),
        value: `option-${optionIndex + 1}`,
      })),
    }
  })
  return { questions }
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders })
  if (request.method !== "POST") return json({ error: "Method not allowed" }, 405)

  const apiKey = Deno.env.get("GEMINI_API_KEY")
  if (!apiKey) return json({ error: "Gemini is not configured on the server." }, 503)

  let body: { chiefComplaint?: string; language?: string }
  try {
    body = await request.json()
  } catch {
    return json({ error: "Request body must be valid JSON." }, 400)
  }

  const chiefComplaint = body.chiefComplaint?.trim()
  if (!chiefComplaint) return json({ error: "A chief complaint is required." }, 400)

  const prompt = `You create short, non-diagnostic symptom follow-up questions for a supervised health kiosk. Based only on the patient's chief complaint, ask 3 to 6 relevant questions that help a clinician understand symptoms and identify possible red flags. Do not diagnose, prescribe treatment, mention a disease as certain, or ask for name, phone number, address, religion, caste, or other identifying information. Keep wording simple and use the patient's language where possible.

Return ONLY valid JSON with this exact shape:
{
  "questions": [
    {
      "question": "string",
      "description": "optional short string",
      "multi": false,
      "options": [{ "label": "string" }, { "label": "string" }]
    }
  ]
}

Rules: each question needs 2 to 4 selectable options. Include a question about concerning symptoms when medically relevant. Chief complaint: ${chiefComplaint.slice(0, 2000)}. Preferred language: ${(body.language || "English").slice(0, 30)}.`

  try {
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.2, maxOutputTokens: 900, responseMimeType: "application/json" },
      }),
    })
    if (!response.ok) {
      console.error("Gemini question request failed", response.status, await response.text())
      return json({ error: "Unable to generate follow-up questions right now." }, 502)
    }

    const data = await response.json()
    const text = data.candidates?.[0]?.content?.parts?.map((part: { text?: string }) => part.text ?? "").join("")
    if (!text) return json({ error: "Gemini returned no questions." }, 502)
    return json(parseQuestions(text))
  } catch (error) {
    console.error("Follow-up question generation error", error)
    return json({ error: "Unable to generate follow-up questions right now." }, 500)
  }
})
