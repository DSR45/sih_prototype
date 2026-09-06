import { useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { translations } from '../data/translations'
import { Icons } from '../components/Icons'
import './DoctorLogin.css'

function DoctorLogin({ onPatientAccess, onLogin }) {
  const { language } = useLanguage()
  const t = translations[language].doctor
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [credentials, setCredentials] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const handleChange = (event) => {
    setCredentials((current) => ({ ...current, [event.target.name]: event.target.value }))
    setError('')
    setNotice('')
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!credentials.email || !credentials.password) {
      setError(t.errors.required)
      return
    }

    setError('')
    setNotice(t.signedIn)
    onLogin()
  }

  const handleForgotPassword = () => {
    setError('')
    setNotice(t.resetSent)
  }

  return (
    <main className="doctor-login-page">
      <section className="doctor-login-visual" aria-label="MediKiosk clinical workspace">
        <div className="visual-grid" />
        <div className="visual-content">
          <div className="visual-mark"><Icons.Heart /></div>
          <p className="visual-eyebrow">{t.eyebrow}</p>
          <h1>{t.visualTitle}</h1>
          <p className="visual-description">{t.visualDescription}</p>
          <div className="clinical-note">
            <div className="clinical-note-icon"><Icons.CheckCircle /></div>
            <div>
              <strong>{t.noteTitle}</strong>
              <span>{t.noteDescription}</span>
            </div>
          </div>
        </div>
        <p className="visual-footer">{t.visualFooter}</p>
      </section>

      <section className="doctor-login-panel">
        <div className="doctor-login-form-wrap">
          <div className="mobile-brand"><span className="mobile-brand-mark"><Icons.Heart /></span> MediKiosk</div>
          <div className="login-heading">
            <p className="login-kicker">{t.kicker}</p>
            <h2>{t.title}</h2>
            <p>{t.subtitle}</p>
          </div>

          <form className="doctor-login-form" onSubmit={handleSubmit} noValidate>
            <label className="field-label" htmlFor="doctor-email">{t.emailLabel}</label>
            <div className="input-wrap">
              <Icons.User />
              <input id="doctor-email" name="email" type="email" autoComplete="username" placeholder={t.emailPlaceholder} value={credentials.email} onChange={handleChange} />
            </div>

            <div className="password-label-row">
              <label className="field-label" htmlFor="doctor-password">{t.passwordLabel}</label>
              <button className="text-button" type="button" onClick={handleForgotPassword}>{t.forgotPassword}</button>
            </div>
            <div className="input-wrap">
              <Icons.Lock />
              <input id="doctor-password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder={t.passwordPlaceholder} value={credentials.password} onChange={handleChange} />
              <button className="visibility-button" type="button" aria-label={showPassword ? t.hidePassword : t.showPassword} onClick={() => setShowPassword((visible) => !visible)}>
                {showPassword ? <Icons.EyeOff /> : <Icons.Eye />}
              </button>
            </div>

            <label className="remember-row">
              <input type="checkbox" checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)} />
              <span className="custom-checkbox" aria-hidden="true"><Icons.Check /></span>
              <span>{t.rememberMe}</span>
            </label>

            {error && <p className="form-message error-message" role="alert">{error}</p>}
            {notice && <p className="form-message success-message" role="status">{notice}</p>}

            <button className="login-submit" type="submit"><span>{t.signIn}</span><Icons.ArrowRight /></button>
          </form>

          <div className="security-note"><Icons.Lock /> {t.securityNote}</div>
          <div className="login-divider"><span>{t.or}</span></div>
          <button className="patient-access-button" type="button" onClick={onPatientAccess}>{t.patientAccess}</button>
          <p className="login-help">{t.helpText} <a href="mailto:support@medikiosk.health">{t.contactSupport}</a></p>
        </div>
      </section>
    </main>
  )
}

export default DoctorLogin