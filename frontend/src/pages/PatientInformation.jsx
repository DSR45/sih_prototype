import React, { useState } from 'react'
import { genderOptions } from '../data/mockData'
import { useLanguage } from '../context/LanguageContext'
import { translations } from '../data/translations'
import { Icons } from '../components/Icons'
import './PatientInformation.css'

function PatientInformation({ patientData, onNavigate, onUpdateData }) {
  const { language } = useLanguage()
  const t = translations[language]
  const [errors, setErrors] = useState({})
  const localizedGenderLabels = {
    male: t.patient.male,
    female: t.patient.female,
    other: t.patient.other
  }
  const genderIcons = {
    male: Icons.Male,
    female: Icons.Female,
    other: Icons.User
  }

  const handleChange = (field, value) => {
    onUpdateData({ [field]: value })
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!patientData.fullName.trim()) {
      newErrors.fullName = t.patient.errors.nameRequired
    }

    if (!patientData.age) {
      newErrors.age = t.patient.errors.ageRequired
    } else if (isNaN(patientData.age) || patientData.age < 1 || patientData.age > 120) {
      newErrors.age = t.patient.errors.ageInvalid
    }

    if (!patientData.gender) {
      newErrors.gender = t.patient.errors.genderRequired
    }

    if (!patientData.mobile.trim()) {
      newErrors.mobile = t.patient.errors.mobileRequired
    } else if (!/^\d{10}$/.test(patientData.mobile.replace(/\D/g, ''))) {
      newErrors.mobile = t.patient.errors.mobileInvalid
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleContinue = () => {
    if (validateForm()) {
      onNavigate(4)
    }
  }

  return (
    <div className="scrollable-content">
      <div className="content-wrapper">
        <div className="section-header">
          <h2 className="section-title">{t.patient.title}</h2>
          <p className="section-subtitle">{t.patient.subtitle}</p>
        </div>

        <div className="form-section">
          {/* Full Name */}
          <div className="form-group">
            <label className="form-label">{t.patient.fullName} *</label>
            <input
              type="text"
              className={`form-input ${errors.fullName ? 'error' : ''}`}
              placeholder={t.patient.placeholders.fullName}
              value={patientData.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
            />
            {errors.fullName && (
              <span className="error-message">{errors.fullName}</span>
            )}
          </div>

          {/* Age */}
          <div className="form-group">
            <label className="form-label">{t.patient.age} *</label>
            <input
              type="number"
              className={`form-input ${errors.age ? 'error' : ''}`}
              placeholder={t.patient.placeholders.age}
              value={patientData.age}
              onChange={(e) => handleChange('age', e.target.value)}
              min="1"
              max="120"
            />
            {errors.age && (
              <span className="error-message">{errors.age}</span>
            )}
          </div>

          {/* Gender */}
          <div className="form-group">
            <label className="form-label">{t.patient.gender} *</label>
            <div className={`gender-options ${errors.gender ? 'error-border' : ''}`}>
              {genderOptions.map((option) => (
                <button
                  key={option.id}
                  className={`gender-button ${patientData.gender === option.id ? 'selected' : ''}`}
                  onClick={() => handleChange('gender', option.id)}
                >
                  <span className="gender-icon" aria-hidden="true">
                    {(() => {
                      const GenderIcon = genderIcons[option.id]
                      return <GenderIcon />
                    })()}
                  </span>
                  <span className="gender-label">{localizedGenderLabels[option.id] || option.label}</span>
                </button>
              ))}
            </div>
            {errors.gender && (
              <span className="error-message">{errors.gender}</span>
            )}
          </div>

          {/* Mobile Number */}
          <div className="form-group">
            <label className="form-label">{t.patient.mobile} *</label>
            <input
              type="tel"
              className={`form-input ${errors.mobile ? 'error' : ''}`}
              placeholder={t.patient.placeholders.mobile}
              value={patientData.mobile}
              onChange={(e) => handleChange('mobile', e.target.value.replace(/\D/g, '').slice(0, 10))}
              maxLength="10"
            />
            {errors.mobile && (
              <span className="error-message">{errors.mobile}</span>
            )}
          </div>
        </div>

        <div className="action-buttons">
          <button 
            className="back-button"
            onClick={() => onNavigate(2)}
          >
            ← {t.patient.back}
          </button>
          <div className="pagination">
            <span className="page-dot"></span>
            <span className="page-dot"></span>
            <span className="page-dot active"></span>
            <span className="page-dot"></span>
          </div>
          <button 
            className="continue-button"
            onClick={handleContinue}
          >
            {t.patient.continue} →
          </button>
        </div>
      </div>
    </div>
  )
}

export default PatientInformation

