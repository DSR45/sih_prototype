# Generate Medical Questions - Supabase Edge Function

This Edge Function integrates with Google's Gemini AI to generate contextual medical questions and multiple-choice options based on a patient's chief complaint.

## Features

- Generates targeted medical questions based on chief complaint
- Provides multiple-choice options for each question
- Categorizes questions (symptoms, history, lifestyle, risk_factors, red_flags)
- Assigns priority levels (high, medium, low)
- Considers patient demographics and medical history

## Setup

### 1. Get Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the API key

### 2. Configure Environment Variable

Set the `GEMINI_API_KEY` secret in your Supabase project:

```bash
# For local developmentsupabase secrets set 
# Gemini AI API Key
# Get your API key from: https://aistudio.google.com/app/apikey
GEMINI_API_KEY=your_gemini_api_key_here


# For production (via Supabase Dashboard)
# Go to: Project Settings > Edge Functions > Secrets
# Add: GEMINI_API_KEY = your_api_key_here
```

### 3. Deploy the Function

```bash
# Deploy to Supabase
supabase functions deploy generate-medical-questions

# Or deploy all functions
supabase functions deploy
```

## API Usage

### Endpoint

```
POST https://<project-ref>.supabase.co/functions/v1/generate-medical-questions
```

### Headers

```
Authorization: Bearer <anon-key-or-service-role-key>
Content-Type: application/json
```

### Request Body

```json
{
  "chiefComplaint": "severe headache",
  "patientAge": 45,
  "patientGender": "female",
  "medicalHistory": ["hypertension", "diabetes"],
  "questionCount": 10
}
```

#### Parameters

- `chiefComplaint` (required, string): The patient's main complaint
- `patientAge` (optional, number): Patient's age in years
- `patientGender` (optional, string): Patient's gender
- `medicalHistory` (optional, array): List of existing medical conditions
- `questionCount` (optional, number): Number of questions to generate (default: 10)

### Response

```json
{
  "questions": [
    {
      "question": "How long have you been experiencing this headache?",
      "options": [
        "Less than 24 hours",
        "1-3 days",
        "4-7 days",
        "More than a week"
      ],
      "category": "symptoms",
      "priority": "high"
    },
    {
      "question": "What is the intensity of the headache?",
      "options": [
        "Mild (1-3/10)",
        "Moderate (4-6/10)",
        "Severe (7-9/10)",
        "Worst headache of my life (10/10)"
      ],
      "category": "symptoms",
      "priority": "high"
    }
  ],
  "metadata": {
    "chiefComplaint": "severe headache",
    "timestamp": "2026-09-07T11:20:40.782Z",
    "totalQuestions": 10
  }
}
```

### Error Response

```json
{
  "error": "Error message",
  "details": "Detailed error information"
}
```

## Testing Locally

1. Start Supabase local development:
```bash
supabase start
```

2. Serve the function locally:
```bash
supabase functions serve generate-medical-questions --env-file ./supabase/.env.local
```

3. Test with curl:
```bash
curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/generate-medical-questions' \
  --header 'Authorization: Bearer YOUR_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{
    "chiefComplaint": "chest pain",
    "patientAge": 55,
    "patientGender": "male",
    "questionCount": 5
  }'
```

## Integration Example (Frontend)

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'YOUR_SUPABASE_URL',
  'YOUR_SUPABASE_ANON_KEY'
);

async function generateQuestions(chiefComplaint: string) {
  try {
    const { data, error } = await supabase.functions.invoke(
      'generate-medical-questions',
      {
        body: {
          chiefComplaint: chiefComplaint,
          patientAge: 45,
          patientGender: 'female',
          medicalHistory: ['hypertension'],
          questionCount: 10
        }
      }
    );

    if (error) throw error;
    
    console.log('Generated questions:', data.questions);
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}
```

## Question Categories

- **symptoms**: Questions about current symptoms and their characteristics
- **history**: Past medical history and previous treatments
- **lifestyle**: Diet, exercise, habits, occupational factors
- **risk_factors**: Family history, exposure, genetic factors
- **red_flags**: Warning signs requiring immediate attention

## Priority Levels

- **high**: Critical questions that could indicate serious conditions
- **medium**: Important diagnostic questions
- **low**: Supplementary information for complete assessment

## Rate Limiting

Gemini AI has usage limits based on your API tier. Monitor your usage at [Google AI Studio](https://aistudio.google.com/).

## Security Notes

- Never expose your GEMINI_API_KEY in client-side code
- Use Supabase RLS policies to restrict access to this function
- Consider implementing rate limiting on the client side
- Validate and sanitize all user inputs

## Troubleshooting

### "GEMINI_API_KEY is not configured"
- Ensure you've set the secret: `supabase secrets set GEMINI_API_KEY=your_key`
- Restart the function after setting secrets

### "Failed to parse AI response"
- The AI response format might have changed
- Check the function logs: `supabase functions logs generate-medical-questions`

### CORS errors
- Ensure you're including the Authorization header
- Check that your frontend URL is allowed in CORS settings

## License

This function is part of the SIH prototype project.
"