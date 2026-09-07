/**
 * Client-side integration example for the generate-medical-questions Edge Function
 * 
 * This file demonstrates how to call the function from your frontend application
 */

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types
interface GenerateQuestionsRequest {
  chiefComplaint: string;
  patientAge?: number;
  patientGender?: string;
  medicalHistory?: string[];
  questionCount?: number;
}

interface GeneratedQuestion {
  question: string;
  options: string[];
  category: string;
  priority: 'high' | 'medium' | 'low';
}

interface GenerateQuestionsResponse {
  questions: GeneratedQuestion[];
  metadata: {
    chiefComplaint: string;
    timestamp: string;
    totalQuestions: number;
  };
}

/**
 * Generate medical questions based on chief complaint
 */
export async function generateMedicalQuestions(
  request: GenerateQuestionsRequest
): Promise<GenerateQuestionsResponse> {
  try {
    const { data, error } = await supabase.functions.invoke(
      'generate-medical-questions',
      {
        body: request
      }
    );

    if (error) {
      throw new Error(`Function error: ${error.message}`);
    }

    if (!data) {
      throw new Error('No data returned from function');
    }

    return data as GenerateQuestionsResponse;
  } catch (error) {
    console.error('Error generating medical questions:', error);
    throw error;
  }
}

/**
 * Example usage in a React component
 */
export async function exampleUsage() {
  try {
    // Example 1: Basic usage
    const response1 = await generateMedicalQuestions({
      chiefComplaint: 'chest pain'
    });
    console.log('Generated questions:', response1.questions);

    // Example 2: With patient details
    const response2 = await generateMedicalQuestions({
      chiefComplaint: 'severe headache',
      patientAge: 45,
      patientGender: 'female',
      medicalHistory: ['hypertension', 'diabetes'],
      questionCount: 10
    });

    // Filter high priority questions
    const highPriorityQuestions = response2.questions.filter(
      q => q.priority === 'high'
    );

    // Group by category
    const questionsByCategory = response2.questions.reduce((acc, q) => {
      if (!acc[q.category]) {
        acc[q.category] = [];
      }
      acc[q.category].push(q);
      return acc;
    }, {} as Record<string, GeneratedQuestion[]>);

    return {
      allQuestions: response2.questions,
      highPriorityQuestions,
      questionsByCategory
    };
  } catch (error) {
    console.error('Example failed:', error);
    throw error;
  }
}

/**
 * React hook for generating questions
 */
import { useState } from 'react';

export function useGenerateMedicalQuestions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<GenerateQuestionsResponse | null>(null);

  const generate = async (request: GenerateQuestionsRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await generateMedicalQuestions(request);
      setData(response);
      return response;
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { generate, loading, error, data };
}

/**
 * Example React component
 */
export function MedicalQuestionsForm() {
  const { generate, loading, error, data } = useGenerateMedicalQuestions();
  const [chiefComplaint, setChiefComplaint] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!chiefComplaint.trim()) {
      alert('Please enter a chief complaint');
      return;
    }

    try {
      await generate({ chiefComplaint });
    } catch (err) {
      console.error('Failed to generate questions:', err);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={chiefComplaint}
          onChange={(e) => setChiefComplaint(e.target.value)}
          placeholder="Enter chief complaint"
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Generating...' : 'Generate Questions'}
        </button>
      </form>

      {error && (
        <div style={{ color: 'red' }}>
          Error: {error.message}
        </div>
      )}

      {data && (
        <div>
          <h3>Generated Questions ({data.metadata.totalQuestions})</h3>
          {data.questions.map((q, index) => (
            <div key={index}>
              <h4>{q.question}</h4>
              <p><strong>Category:</strong> {q.category}</p>
              <p><strong>Priority:</strong> {q.priority}</p>
              <ul>
                {q.options.map((option, i) => (
                  <li key={i}>{option}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
