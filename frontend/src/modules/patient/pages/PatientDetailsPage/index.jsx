import { useLanguage } from '@shared/contexts/LanguageContext'
import { translations } from '@shared/constants/translations'
import { Icons } from '@shared/components/Icons'
import { PATIENT_FLOW } from '@shared/constants'
import { supabasePatientAdapter } from '@shared/services/supabaseAdapter'
import './styles.css'

function PatientDetails({ patientData, onNavigate, onUpdateData, onUpdateWorkflow }) {
  const { language } = useLanguage()
  const t = translations[language]

    const handleStartNewCase = async () => {
    try {
      const preferredLanguage = patientData.language || 'English'
      const session = await supabasePatientAdapter.createSession({
        patient_id: patientData.patientId,
        department: 'General Medicine',
        language_used: preferredLanguage,
        chief_complaint: 'Initial consultation',
        complaint_category: 'General',
        consent_given: true,
        status: 'in_progress'
      })

      const sessionId = session?.session_id || session?.id
      if (!sessionId) throw new Error('Session was created without a session ID')

            onUpdateData({
        sessionId,
        chiefComplaint: '',
        complaintCategory: '',
        complaintTags: [],
        assessmentAnswers: {}
      })
      onUpdateWorkflow?.({
        documents: [],
        assessmentComplete: false,
        carePath: '',
        completedAt: '',
        sessionId
      })
      onNavigate(PATIENT_FLOW.CHIEF_COMPLAINT)
    } catch (error) {
      console.error('Failed to create new patient session:', error)
    }
  }

  const handleLogout = () => {
    // Clear patient data and go back to login
    onUpdateData({
      patientId: '',
      fullName: '',
      age: '',
      gender: '',
      mobile: '',
      sessionId: ''
    })
    onNavigate(PATIENT_FLOW.PATIENT_LOGIN)
  }

  const getGenderIcon = (gender) => {
    const genderLower = gender?.toLowerCase()
    if (genderLower === 'male') return <Icons.Male />
    if (genderLower === 'female') return <Icons.Female />
    return <Icons.User />
  }

  const formatGender = (gender) => {
    if (!gender) return 'Not specified'
    const genderLower = gender.toLowerCase()
    if (genderLower === 'male') return t.patient?.male || 'Male'
    if (genderLower === 'female') return t.patient?.female || 'Female'
    if (genderLower === 'other') return t.patient?.other || 'Other'
    return gender
  }

  return (
    <div className="patient-details-container">
      <div className="patient-details-card">
        {/* Header */}
        <div className="details-header">
          <div className="details-header-content">
            <div className="details-header-icon">
              <Icons.User />
            </div>
            <div>
              <h1 className="details-title">
                {t.patientDetails?.title || 'Patient Dashboard'}
              </h1>
              <p className="details-subtitle">
                {t.patientDetails?.subtitle || 'View your information and start a new consultation'}
              </p>
            </div>
          </div>
          <button
            type="button"
            className="btn-logout"
            onClick={handleLogout}
            title="Logout"
          >
            <Icons.LogOut />
          </button>
        </div>

        {/* Patient Info Card */}
        <div className="patient-info-section">
          <div className="section-header-small">
            <h2 className="section-title-small">
              {t.patientDetails?.infoTitle || 'Your Information'}
            </h2>
          </div>

          <div className="patient-info-card">
            {/* Patient ID Badge */}
            <div className="patient-id-badge">
              <span className="patient-id-label">
                {t.patientDetails?.patientId || 'Patient ID'}
              </span>
              <span className="patient-id-value">{patientData.patientId}</span>
            </div>

            {/* Info Grid */}
            <div className="info-grid">
              <div className="info-item">
                <div className="info-icon">
                  <Icons.User />
                </div>
                <div className="info-content">
                  <div className="info-label">
                    {t.patient?.fullName || 'Full Name'}
                  </div>
                  <div className="info-value">{patientData.fullName}</div>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">
                  <Icons.Calendar />
                </div>
                <div className="info-content">
                  <div className="info-label">{t.patient?.age || 'Age'}</div>
                  <div className="info-value">{patientData.age} years</div>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon gender-icon">
                  {getGenderIcon(patientData.gender)}
                </div>
                <div className="info-content">
                  <div className="info-label">{t.patient?.gender || 'Gender'}</div>
                  <div className="info-value">{formatGender(patientData.gender)}</div>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">
                  <Icons.Phone />
                </div>
                <div className="info-content">
                  <div className="info-label">{t.patient?.mobile || 'Mobile'}</div>
                  <div className="info-value">+91 {patientData.mobile}</div>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">
                  <Icons.Globe />
                </div>
                <div className="info-content">
                  <div className="info-label">
                    {t.patientDetails?.language || 'Language'}
                  </div>
                  <div className="info-value">{patientData.language || 'English'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Section */}
        <div className="action-section">
          <div className="action-card">
            <div className="action-icon">
              <Icons.FileText />
            </div>
            <div className="action-content">
              <h3 className="action-title">
                {t.patientDetails?.newCaseTitle || 'Start New Consultation'}
              </h3>
              <p className="action-description">
                {t.patientDetails?.newCaseDescription ||
                  'Begin a new visit by providing your chief complaint and medical history'}
              </p>
            </div>
            <button
              type="button"
              className="btn-start-case"
              onClick={handleStartNewCase}
            >
              <span>{t.patientDetails?.startButton || 'Start New Case'}</span>
              <Icons.ArrowRight />
            </button>
          </div>
        </div>

        {/* Info Banner */}
        <div className="info-banner">
          <div className="info-banner-icon">
            <Icons.Info />
          </div>
          <div className="info-banner-text">
            {t.patientDetails?.infoBanner ||
              'Your information is secure and will only be shared with your healthcare provider.'}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PatientDetails