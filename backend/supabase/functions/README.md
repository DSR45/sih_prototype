# Gemini assessment function

`gemini-assessment` keeps `GEMINI_API_KEY` on the server and returns a clinician-facing intake summary. The request excludes the patient name and phone number.

1. Create a Gemini API key in Google AI Studio.
2. Run `supabase login` and `supabase link --project-ref <project-ref>`.
3. Save the secret: `supabase secrets set GEMINI_API_KEY=<your-key>`.
4. Deploy both functions: `supabase functions deploy gemini-assessment --no-verify-jwt` and `supabase functions deploy gemini-follow-up-questions --no-verify-jwt`.
5. Copy `frontend/.env.example` to `frontend/.env.local`, then set the public Supabase URL and anon key.
6. From `frontend`, run `npm run dev`.

`gemini-follow-up-questions` creates 3–6 symptom questions from the chief complaint; if it is unavailable, the frontend uses its existing fixed questionnaire. `--no-verify-jwt` supports the current unauthenticated kiosk flow. Before a public launch, add authentication and rate limiting, then enable JWT verification. The output is decision support only; it is not a diagnosis or prescription.
