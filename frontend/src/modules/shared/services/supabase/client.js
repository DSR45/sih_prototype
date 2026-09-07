import { createClient } from '@supabase/supabase-js'

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
export const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validate configuration
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase configuration missing!')
  console.error('Please create frontend/.env.local with:')
  console.error('VITE_SUPABASE_URL=your-project-url')
  console.error('VITE_SUPABASE_ANON_KEY=your-anon-key')
}

if (supabaseUrl?.includes('your-project') || supabaseAnonKey?.includes('your-anon-key')) {
  console.warn('⚠️  Supabase credentials appear to be placeholders')
  console.warn('Update frontend/.env.local with real credentials')
}

// Create Supabase client
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    })
  : null

// Export configuration status
export const isConfigured = Boolean(
  supabase &&
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('your-project') &&
  !supabaseAnonKey.includes('your-anon-key')
)

// Test connection helper
export async function testConnection() {
  if (!supabase) {
    return { success: false, error: 'Supabase client not configured' }
  }

  try {
    const { data, error } = await supabase
      .from('patients')
      .select('count')
      .limit(1)

    if (error) throw error

    console.log('✅ Supabase connection successful')
    return { success: true, data }
  } catch (error) {
    console.error('❌ Supabase connection failed:', error.message)
    return { success: false, error: error.message }
  }
}

// Log configuration status
if (isConfigured) {
  console.log('✅ Supabase configured:', supabaseUrl)
} else {
  console.warn('⚠️  Supabase not configured - using mock data')
}