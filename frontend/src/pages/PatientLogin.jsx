import { useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { translations } from '../data/translations'
import { Icons } from '../components/Icons'
import { supabasePatientAdapter } from '../modules/shared/services/supabaseAdapter'

function PatientLogin({ patientData, onNavigate, onUpdateData, onDoctorLogin }) {
  const { language } = useLanguage()
  const t = translations[language]
  const [phone, setPhone] = useState(patientData.mobile || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleContinueExisting = async () => {
    const sanitized = phone.replace(/\D/g, '')

    if (sanitized.length !== 10) {
      setError('Please enter a valid 10-digit mobile number.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const patient = await supabasePatientAdapter.getPatientByPhone(sanitized)

      if (!patient) {
        setError('No patient record found. Please register a new patient first.')
        setLoading(false)
        return
      }

      onUpdateData({
        patientId: patient.patient_id,
        fullName: patient.full_name,
        age: patient.age,
        gender: patient.gender,
        mobile: patient.phone,
        language: patient.preferred_language || patientData.language || 'English'
      })

      setLoading(false)
      onNavigate(3)
    } catch (lookupError) {
      console.error('Patient lookup failed:', lookupError)
      setError('Unable to look up patient right now. Please register again or try later.')
      setLoading(false)
    }
  }

  const handleRegister = () => {
    onUpdateData({ mobile: phone.replace(/\D/g, '').slice(0, 10) })
    onNavigate(3)
  }

  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 20px', background: '#f4f7fb' }}>
      <section style={{ width: '100%', maxWidth: '980px', background: '#fff', borderRadius: '28px', boxShadow: '0 20px 60px rgba(15, 23, 42, 0.12)', overflow: 'hidden', display: 'grid', gridTemplateColumns: '1.1fr 0.9fr' }}>
        <div style={{ background: 'linear-gradient(135deg, #0b5ad3 0%, #1491ff 100%)', padding: '48px 40px', color: '#fff', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px', fontWeight: 700 }}>
            <span style={{ width: '42px', height: '42px', borderRadius: '12px', display: 'grid', placeItems: 'center', background: 'rgba(255,255,255,0.14)' }}><Icons.Heart /></span>
            MediKiosk
          </div>

          <p style={{ textTransform: 'uppercase', letterSpacing: '0.12em', opacity: 0.8, fontSize: '12px', marginBottom: '18px' }}>Patient intake</p>
          <h1 style={{ fontSize: '2.5rem', lineHeight: 1.1, margin: '0 0 18px' }}>Your care journey starts here.</h1>
          <p style={{ fontSize: '1.04rem', opacity: 0.9, maxWidth: '420px', lineHeight: 1.7 }}>
            Sign in with your registered mobile number to continue your visit, or register a new patient profile for a fresh consultation.
          </p>

          <div style={{ marginTop: '28px', display: 'grid', gap: '14px' }}>
            <div style={{ background: 'rgba(255,255,255,0.12)', padding: '14px 16px', borderRadius: '14px' }}>
              <strong>Fast onboarding</strong>
              <div style={{ marginTop: '6px', fontSize: '0.92rem', opacity: 0.88 }}>Secure patient intake, guided questions, and document upload.</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.12)', padding: '14px 16px', borderRadius: '14px' }}>
              <strong>Doctor-ready summary</strong>
              <div style={{ marginTop: '6px', fontSize: '0.92rem', opacity: 0.88 }}>Your case is prepared for quick clinician review and approval.</div>
            </div>
          </div>
        </div>

        <div style={{ padding: '42px 36px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ marginBottom: '22px' }}>
            <p style={{ margin: 0, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.12em', fontSize: '12px', fontWeight: 700 }}>Patient portal</p>
            <h2 style={{ margin: '10px 0 8px', fontSize: '2rem', color: '#0f172a' }}>Continue your visit</h2>
            <p style={{ margin: 0, color: '#475569', lineHeight: 1.6 }}>Enter your mobile number to find your patient record.</p>
          </div>

          <label style={{ display: 'block', marginBottom: '10px', fontWeight: 600, color: '#0f172a' }}>Mobile number</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid #dbeafe', borderRadius: '14px', padding: '0 14px', background: '#f8fbff', marginBottom: '14px' }}>
            <Icons.Phone />
            <input
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value.replace(/\D/g, '').slice(0, 10))}
              placeholder="9876543210"
              style={{ border: 'none', background: 'transparent', width: '100%', padding: '16px 0', fontSize: '1rem', outline: 'none' }}
            />
          </div>

          {error && (
            <div style={{ marginBottom: '16px', padding: '10px 12px', borderRadius: '10px', background: '#fee2e2', color: '#991b1b', fontSize: '0.95rem' }}>
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={handleContinueExisting}
            disabled={loading}
            style={{ width: '100%', border: 'none', borderRadius: '14px', padding: '16px 20px', background: '#0b5ad3', color: '#fff', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', marginBottom: '12px' }}
          >
            {loading ? 'Checking patient record...' : 'Continue as existing patient'}
          </button>

          <button
            type="button"
            onClick={handleRegister}
            style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '14px', padding: '16px 20px', background: '#fff', color: '#0f172a', fontWeight: 600, fontSize: '1rem', cursor: 'pointer', marginBottom: '22px' }}
          >
            Register a new patient
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
            <span style={{ color: '#64748b', fontSize: '0.84rem' }}>or</span>
            <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
          </div>

          <button
            type="button"
            onClick={onDoctorLogin}
            style={{ width: '100%', border: 'none', borderRadius: '14px', padding: '16px 20px', background: '#e0f2fe', color: '#075985', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}
          >
            Login as doctor
          </button>
        </div>
      </section>
    </main>
  )
}

export default PatientLogin
