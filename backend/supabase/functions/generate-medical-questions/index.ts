import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenerativeAI } from "npm:@google/generative-ai@0.21.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RequestBody {
  chiefComplaint: string;
  patientAge?: number;
  patientGender?: string;
  medicalHistory?: string[];
  questionCount?: number;
  language?: 'en' | 'hi';
}

interface GeneratedQuestion {
  question: string;
  options: string[];
  storageQuestion: string;
  storageOptions: string[];
  category: string;
  priority: 'high' | 'medium' | 'low';
}

interface ResponseData {
  questions: GeneratedQuestion[];
  metadata: {
    chiefComplaint: string;
    timestamp: string;
    totalQuestions: number;
    language: 'en' | 'hi';
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Validate API key
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    // Parse request body
    const requestBody: RequestBody = await req.json();
    const { 
      chiefComplaint, 
      patientAge, 
      patientGender, 
      medicalHistory = [],
      questionCount = 10,
      language = 'en'
    } = requestBody;
    const selectedLanguage = language === 'hi' ? 'hi' : 'en';

    // Validate chief complaint
    if (!chiefComplaint || chiefComplaint.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'Chief complaint is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Construct the prompt
    const prompt = buildPrompt({
      chiefComplaint,
      patientAge,
      patientGender,
      medicalHistory,
      questionCount,
      language: selectedLanguage
    });

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the JSON response from Gemini
    const parsedQuestions = parseGeminiResponse(text, selectedLanguage);

    // Construct response
    const responseData: ResponseData = {
      questions: parsedQuestions,
      metadata: {
        chiefComplaint,
        language: selectedLanguage,
        timestamp: new Date().toISOString(),
        totalQuestions: parsedQuestions.length
      }
    };

    return new Response(
      JSON.stringify(responseData),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error generating questions:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An error occurred while generating questions',
        details: error.toString()
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

function buildPrompt(params: RequestBody): string {
  const {
    chiefComplaint,
    patientAge,
    patientGender,
    medicalHistory = [],
    questionCount,
    language = 'en'
  } = params;
  const languageInstruction = language === 'hi'
    ? 'Write every question, option, and description in clear, simple, patient-friendly Hindi. Keep commonly understood medical terms such as fever, diabetes, blood pressure, and oxygen in English when that improves clarity, optionally explaining them in Hindi. Do not mix languages unnecessarily.'
    : 'Write every question, option, and description in clear, patient-friendly English.';
  
  let prompt = `You are a medical AI assistant helping doctors gather relevant patient information. Based on the following chief complaint, generate ${questionCount} targeted medical questions with multiple-choice options.

**Required output language:** ${language === 'hi' ? 'Hindi (हिन्दी)' : 'English'}
**Language instruction:** ${languageInstruction}

**Chief Complaint:** ${chiefComplaint}
`;

  if (patientAge) {
    prompt += `**Patient Age:** ${patientAge} years\n`;
  }

  if (patientGender) {
    prompt += `**Patient Gender:** ${patientGender}\n`;
  }

  if (medicalHistory.length > 0) {
    prompt += `**Medical History:** ${medicalHistory.join(', ')}\n`;
  }

  prompt += `
**Instructions:**
1. Generate questions that help assess:
   - Symptom severity and duration
   - Associated symptoms
   - Risk factors
   - Previous treatments or interventions
   - Lifestyle factors
   - Red flag symptoms

2. Each question should have 4-6 relevant multiple-choice options
3. Categorize each question as: "symptoms", "history", "lifestyle", "risk_factors", or "red_flags"
4. Assign priority level: "high" (critical/urgent), "medium" (important), or "low" (supplementary)
5. Make options clinically relevant and mutually exclusive when possible
6. Include time-based options where appropriate (e.g., "Less than 24 hours", "1-3 days", etc.)

**Output Format (strict JSON only):**
\`\`\`json
{
  "questions": [
    {
      "question": "Question text in the requested display language?",
      "options": ["Options in the requested display language"],
      "storageQuestion": "The same question in clear English for storage",
      "storageOptions": ["The same options in English, in the exact same order"],
      "category": "symptoms|history|lifestyle|risk_factors|red_flags",
      "priority": "high|medium|low"
    }
  ]
}
\`\`\`

Generate the questions now:`;

  return prompt;
}

function parseGeminiResponse(text: string, language: 'en' | 'hi' = 'en'): GeneratedQuestion[] {
  try {
    // Remove markdown code blocks if present
    let cleanedText = text.trim();
    
    // Remove ```json and ``` markers
    cleanedText = cleanedText.replace(/```json\s*/g, '');
    cleanedText = cleanedText.replace(/```\s*/g, '');
    cleanedText = cleanedText.trim();

    // Parse JSON
    const parsed = JSON.parse(cleanedText);
    
    // Validate structure
    if (!parsed.questions || !Array.isArray(parsed.questions)) {
      throw new Error('Invalid response structure: missing questions array');
    }

    // Validate each question
    return parsed.questions.map((q: any, index: number) => {
      if (!q.question || !Array.isArray(q.options)) {
        throw new Error(`Invalid question structure at index ${index}`);
      }

      const hasEnglishStorageQuestion = typeof q.storageQuestion === 'string' && q.storageQuestion.trim().length > 0
      const hasEnglishStorageOptions = Array.isArray(q.storageOptions) && q.storageOptions.length === q.options.length && q.storageOptions.every((option: unknown) => typeof option === 'string' && option.trim().length > 0)

      if (language === 'hi' && (!hasEnglishStorageQuestion || !hasEnglishStorageOptions)) {
        throw new Error(`Hindi question at index ${index} is missing English storage fields`)
      }

      const storageOptions = hasEnglishStorageOptions ? q.storageOptions : q.options;

      return {
        question: q.question,
        options: q.options,
        storageQuestion: hasEnglishStorageQuestion ? q.storageQuestion : q.question,
        storageOptions,
        category: q.category || 'symptoms',
        priority: q.priority || 'medium'
      };
    });

  } catch (error) {
    console.error('Error parsing Gemini response:', error);
    console.error('Raw response:', text);
    throw new Error(`Failed to parse AI response: ${error.message}`);
  }
}