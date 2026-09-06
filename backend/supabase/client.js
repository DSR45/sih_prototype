import { createClient } from '@supabase/supabase-js'

const browserEnv = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env : {}
const nodeEnv = typeof process !== 'undefined' && process.env ? process.env : {}

const supabaseUrl = browserEnv.VITE_SUPABASE_URL || nodeEnv.VITE_SUPABASE_URL
const supabaseAnonKey = browserEnv.VITE_SUPABASE_ANON_KEY || nodeEnv.VITE_SUPABASE_ANON_KEY

const hasRequiredConfig = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('your-project') &&
  !supabaseAnonKey.includes('your-anon-key')
)

export const supabase = hasRequiredConfig
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    })
  : null

if (supabase) {
  globalThis.supabase = supabase
}

export const isSupabaseConfigured = hasRequiredConfig
