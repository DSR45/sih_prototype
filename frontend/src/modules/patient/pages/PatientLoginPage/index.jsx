import { useState } from 'react'
import { useLanguage } from '@shared/contexts/LanguageContext'
import { translations } from '@shared/constants/translations'
import { Icons } from '@shared/components/Icons'
import { PATIENT_FLOW } from '@shared/constants'
import { supabasePatientAdapter } from '@shared/services/supabaseAdapter'
import './styles.css'

function PatientLogin({ patientData, onNavigate, onUpdateData }) {
  const { language } = useLanguage()
  const t = translations[language]
  const [phone, setPhone] = useState(patientData.mobile || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleCheckPhone = async () => {
    const sanitized = phone.replace(/\D/g, '')

    if (sanitized.length !== 10) {
      setError('Please enter a valid 10-digit mobile number.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const patient = await supabasePatientAdapter.getPatientByPhone(sanitized)

      if (patient) {
        onUpdateData({
          patientId: patient.patient_id,
          fullName: patient.full_name,
          age: patient.age,
          gender: patient.gender,
          mobile: patient.phone,
          language: patient.preferred_language || patientData.language || 'English'
        })
        onNavigate(PATIENT_FLOW.PATIENT_DETAILS)
      } else {
        setError(t.login?.notFound || 'No record found for this number.')
      }
    } catch (lookupError) {
      console.error('Patient lookup failed:', lookupError)
      setError('Unable to check patient record. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleRegisterNewPatient = () => {
    const sanitized = phone.replace(/\D/g, '').slice(0, 10)

    if (sanitized) {
      onUpdateData({ mobile: sanitized })
    }

    onNavigate(PATIENT_FLOW.PATIENT_INFO)
  }

  return (
    <div className="patient-login-page">
      <div className="patient-login-shell">
        <div className="patient-login-card">
          <div className="patient-login-top">
            <div className="patient-login-brand">
              <span className="patient-login-brand-icon"><Icons.Heart /></span>
              <span className="patient-login-brand-text">MediKiosk</span>
            </div>
            <h1 className="patient-login-title">{t.login?.title || 'Patient access'}</h1>
            <p className="patient-login-subtitle">
              {t.login?.subtitle || 'Enter your mobile number to continue. New patients can register below.'}
            </p>
          </div>

          <div className="patient-login-body">
            <label className="phone-input-label">{t.login?.mobileLabel || 'Mobile Number'}</label>
            <div className="phone-input-wrapper">
              <div className="phone-input-icon">
                <Icons.Phone />
              </div>
              <input
                type="tel"
                className={`phone-input ${error ? 'error' : ''}`}
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))
                  setError('')
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && phone.length === 10) {
                    handleCheckPhone()
                  }
                }}
                placeholder="9876543210"
                maxLength="10"
                inputMode="numeric"
                autoComplete="tel"
              />
            </div>
            <div className="phone-input-hint">
              {t.login?.mobileHint || 'Use the 10-digit number linked to your record.'}
            </div>

            {error && (
              <div className="status-banner status-banner-error">
                <Icons.AlertCircle />
                <span>{error}</span>
              </div>
            )}

            <button
              type="button"
              className="primary-login-button"
              onClick={handleCheckPhone}
              disabled={loading || phone.length !== 10}
            >
              {loading ? (
                <>
                  <Icons.Loader className="animate-spin" />
                  {t.login?.checking || 'Checking...'}
                </>
              ) : (
                t.login?.continueButton || 'Continue'
              )}
            </button>

            <button type="button" className="register-link-button" onClick={handleRegisterNewPatient}>
              {t.login?.registerText || 'Register'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PatientLogin
