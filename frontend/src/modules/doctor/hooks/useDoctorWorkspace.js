import { useCallback, useState } from 'react'
import { supabaseDoctorAdapter } from '@shared/services/supabaseAdapter'

export function useDoctorWorkspace() {
  const [doctorLoggedIn, setDoctorLoggedIn] = useState(false)

  const handleDoctorLogin = useCallback(async (credentials = { email: 'doctor@medikiosk.local', password: 'demo123' }) => {
    const email = credentials?.email || 'doctor@medikiosk.local'
    const password = credentials?.password || 'demo123'

    try {
      const result = await supabaseDoctorAdapter.signInDoctor(email, password)
      if (result?.demo || result?.user) {
        setDoctorLoggedIn(true)
        return true
      }
    } catch (error) {
      console.warn('Doctor auth failed.', error)
    }

    setDoctorLoggedIn(false)
    return false
  }, [])

  const handleDoctorLogout = useCallback(() => {
    setDoctorLoggedIn(false)
  }, [])

  return {
    doctorLoggedIn,
    handleDoctorLogin,
    handleDoctorLogout
  }
}
