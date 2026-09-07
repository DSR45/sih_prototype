import { testConnection, isConfigured } from '@shared/services/supabase/client'

/**
 * Verify Supabase setup and configuration
 */
export async function verifySetup() {
  console.log('\n🔍 MediKiosk Setup Verification\n')
  console.log('================================')

  // Check 1: Environment variables
  console.log('\n1️⃣ Checking environment variables...')
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Environment variables missing!')
    console.log('\n📝 Action required:')
    console.log('Create frontend/.env.local with:')
    console.log('VITE_SUPABASE_URL=your-project-url')
    console.log('VITE_SUPABASE_ANON_KEY=your-anon-key\n')
    return { configured: false, connected: false }
  }

  if (supabaseUrl.includes('your-project') || supabaseKey.includes('your-anon-key')) {
    console.warn('⚠️  Environment variables appear to be placeholders')
    console.log('\n📝 Action required:')
    console.log('Update frontend/.env.local with real Supabase credentials\n')
    return { configured: false, connected: false }
  }

  console.log('✅ Environment variables configured')
  console.log('   URL:', supabaseUrl)
  console.log('   Key:', supabaseKey.substring(0, 20) + '...')

  // Check 2: Supabase client
  console.log('\n2️⃣ Checking Supabase client...')
  if (!isConfigured) {
    console.error('❌ Supabase client not initialized')
    return { configured: false, connected: false }
  }
  console.log('✅ Supabase client initialized')

  // Check 3: Database connection
  console.log('\n3️⃣ Testing database connection...')
  const connectionResult = await testConnection()

  if (!connectionResult.success) {
    console.error('❌ Database connection failed')
    console.error('   Error:', connectionResult.error)
    console.log('\n📝 Possible issues:')
    console.log('- Database schema not applied')
    console.log('- RLS policies blocking access')
    console.log('- Invalid credentials')
    console.log('- Network issues\n')
    return { configured: true, connected: false, error: connectionResult.error }
  }

  console.log('✅ Database connection successful')

  // Summary
  console.log('\n================================')
  console.log('✅ Setup verification complete!')
  console.log('================================\n')

  return { configured: true, connected: true }
}

/**
 * Display setup status banner
 */
export function displaySetupStatus(status) {
  if (status.configured && status.connected) {
    console.log(
      '%c✅ MediKiosk Ready',
      'background: #10b981; color: white; padding: 8px 16px; border-radius: 4px; font-weight: bold;'
    )
    console.log('Database: Connected')
    console.log('Status: Production mode\n')
  } else if (status.configured && !status.connected) {
    console.log(
      '%c⚠️  MediKiosk Configured (Connection Issue)',
      'background: #f59e0b; color: white; padding: 8px 16px; border-radius: 4px; font-weight: bold;'
    )
    console.log('Database: Connection failed')
    console.log('Status: Check database setup\n')
  } else {
    console.log(
      '%c📝 MediKiosk Development Mode',
      'background: #6366f1; color: white; padding: 8px 16px; border-radius: 4px; font-weight: bold;'
    )
    console.log('Database: Using mock data')
    console.log('Status: Configure .env.local for production\n')
  }
}