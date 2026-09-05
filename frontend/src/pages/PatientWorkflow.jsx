import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { translations } from '../data/translations'
import { Icons } from '../components/Icons'
import './PatientWorkflow.css'

export function getInitialWorkflow() {
  return { documents: [], assessmentComplete: false, carePath: '', completedAt: '' }
}

export function isPilesComplaint(complaint = '') {
  return /bleed|blood|stool|piles|hemorrhoid|खून|मल|बवासीर/i.test(complaint)
}

function Layout({ screen, title, children }) {
  const { language } = useLanguage()
  const t = translations[language] || translations.en
  
  if (!t || !t.documents) {
    console.error('Translations not loaded properly for language:', language)
    return null
  }
  
  return (
    <main className="workflow-scroll">
      <div className="workflow-container">
        <div className="workflow-step">
          <span>{t.documents.step} {screen - 5} {t.assessment.of} 5</span>
          <strong>{title}</strong>
          <small>{t.assessment.badge}</small>
        </div>
        {children}
      </div>
    </main>
  )
}

function HeaderBlock({ eyebrow, title, description, children }) {
  return (
    <div className="workflow-intro">
      <div>
        {eyebrow && <span className="workflow-eyebrow">{eyebrow}</span>}
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {children}
    </div>
  )
}

function Card({ title, action, children }) {
  return (
    <section className="workflow-card">
      <div className="workflow-card-heading">
        <h2>{title}</h2>
        {action}
      </div>
      {children}
    </section>
  )
}

function ActionBar({ onBack, onPrimary, primaryLabel, secondaryLabel, onSecondary, backLabel }) {
  const { language } = useLanguage()
  const t = translations[language] || translations.en
  
  if (!t || !t.documents) {
    return (
      <div className="workflow-actions">
        <button className="workflow-button workflow-button-ghost" onClick={onBack}>← Back</button>
        <button className="workflow-button workflow-button-primary" onClick={onPrimary}>{primaryLabel} <span>→</span></button>
      </div>
    )
  }
  
  return (
    <div className="workflow-actions">
      <button className="workflow-button workflow-button-ghost" onClick={onBack}>
        ← {backLabel || t.documents.back}
      </button>
      <div>
        {secondaryLabel && (
          <button className="workflow-button workflow-button-outline" onClick={onSecondary}>
            {secondaryLabel}
          </button>
        )}
        <button className="workflow-button workflow-button-primary" onClick={onPrimary}>
          {primaryLabel} <span>→</span>
        </button>
      </div>
    </div>
  )
}

function DocumentsScreen({ workflowData, updateWorkflow, onNavigate }) {
  console.log('DocumentsScreen rendering')
  const { language } = useLanguage()
  console.log('DocumentsScreen language:', language)
  const t = translations[language] || translations.en
  console.log('DocumentsScreen translations loaded:', !!t, 'has documents key:', !!(t && t.documents))
  
  if (!t || !t.documents) {
    console.error('DocumentsScreen: Translations not loaded for language:', language)
    return (
      <div style={{ padding: '40px', textAlign: 'center', fontSize: '18px', background: '#fff', minHeight: '400px' }}>
        <h2>Loading translations...</h2>
        <p>Language: {language}</p>
        <p>Translations object exists: {t ? 'Yes' : 'No'}</p>
        <p>Documents key exists: {(t && t.documents) ? 'Yes' : 'No'}</p>
      </div>
    )
  }
  
  console.log('DocumentsScreen: About to render main content')
  const inputRef = useRef(null)
  const [documents, setDocuments] = useState(() => 
    (workflowData.documents || []).filter(document => document && document.name)
  )
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  const addFiles = (fileList) => {
    const files = [...fileList].filter(file => /^(application\/pdf|image\/(jpeg|png))$/.test(file.type))
    if (!files.length) return
    
    setUploading(true)
    setProgress(15)
    const timer = setInterval(() => setProgress(value => Math.min(value + 25, 100)), 120)
    
    setTimeout(() => {
      clearInterval(timer)
      setDocuments(current => [
        ...current,
        ...files.map(file => ({
          id: `${file.name}-${file.lastModified}-${Math.random()}`,
          name: file.name,
          type: file.type,
          size: file.size
        }))
      ])
      setUploading(false)
      setProgress(100)
    }, 520)
  }

  const continueToSummary = () => {
    updateWorkflow({ documents })
    onNavigate(7)
  }

  return (
    <Layout screen={6} title={t.documents.stepTitle}>
      <HeaderBlock
        eyebrow={t.documents.eyebrow}
        title={t.documents.title}
        description={t.documents.subtitle}
      >
        <span className="soft-badge">{t.documents.optional}</span>
      </HeaderBlock>

      <Card title={t.documents.cardTitle}>
        <div
          className="drop-zone"
          onDragOver={event => event.preventDefault()}
          onDrop={event => {
            event.preventDefault()
            addFiles(event.dataTransfer.files)
          }}
        >
          <div className="upload-icon"><Icons.File /></div>
          <strong>{t.documents.dropZoneTitle}</strong>
          <span>{t.documents.dropZoneSubtitle}</span>
          <button
            className="workflow-button workflow-button-outline"
            onClick={() => inputRef.current?.click()}
          >
            {t.documents.chooseFiles}
          </button>
          <input
            ref={inputRef}
            type="file"
            hidden
            multiple
            accept="application/pdf,image/jpeg,image/png"
            onChange={event => addFiles(event.target.files)}
          />
        </div>

        {uploading && (
          <div className="upload-progress">
            <span>{t.documents.uploadProgress}</span>
            <strong>{progress}%</strong>
            <div><i style={{ width: `${progress}%` }} /></div>
          </div>
        )}
      </Card>

      <Card title={`${t.documents.attachedTitle} (${documents.length})`}>
        {documents.length ? (
          <div className="document-list">
            {documents.map(document => (
              <div className="document-row" key={document.id}>
                <span className="file-icon">
                  {document.type === 'application/pdf' ? 'PDF' : 'IMG'}
                </span>
                <div>
                  <strong>{document.name}</strong>
                  <small>
                    {document.type === 'application/pdf' ? 'PDF document' : 'Image report'} · {(document.size / 1024).toFixed(0)} KB
                  </small>
                </div>
                <button
                  className="remove-button"
                  onClick={() => setDocuments(current => current.filter(item => item.id !== document.id))}
                >
                  {t.documents.remove}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-documents">
            <span><Icons.File /></span>
            <div>
              <strong>{t.documents.noDocuments}</strong>
              <p>{t.documents.noDocumentsText}</p>
            </div>
          </div>
        )}
      </Card>

      <ActionBar
        onBack={() => onNavigate(5)}
        onPrimary={continueToSummary}
        primaryLabel={t.documents.continue}
        backLabel={t.documents.back}
        secondaryLabel={t.documents.skip}
        onSecondary={() => {
          updateWorkflow({ documents: [] })
          onNavigate(7)
        }}
      />
    </Layout>
  )
}

function SummaryScreen({ patientData, workflowData, onNavigate }) {
  const { language } = useLanguage()
  const t = translations[language] || translations.en
  
  if (!t || !t.summary) {
    console.error('SummaryScreen: Translations not loaded for language:', language)
    return <div>Loading translations...</div>
  }
  const answers = patientData.assessmentAnswers || {}
  const complaintType = isPilesComplaint(patientData.chiefComplaint) ? t.summary.piles : t.summary.fever

  const formatSymptoms = (symptomsArray) => {
    if (!Array.isArray(symptomsArray)) return 'None reported'
    const filtered = symptomsArray.filter(value => value !== 'none')
    return filtered.length ? filtered.join(', ') : 'None reported'
  }

  const values = isPilesComplaint(patientData.chiefComplaint) ? [
    [t.summary.answerLabels.duration, answers.duration || 'Not provided'],
    [t.summary.answerLabels.bloodColour, answers.bloodColour || 'Not provided'],
    [t.summary.answerLabels.pain, answers.pain || 'Not provided'],
    [t.summary.answerLabels.lump, answers.lump || 'Not provided'],
    [t.summary.answerLabels.constipation, answers.constipation || 'Not provided'],
    [t.summary.answerLabels.frequency, answers.frequency || 'Not provided']
  ] : [
    [t.summary.answerLabels.duration, answers.duration || '2-3 days'],
    [t.summary.answerLabels.temperature, answers.temperature || 'Around 101°F'],
    [t.summary.answerLabels.symptoms, formatSymptoms(answers.symptoms)],
    [t.summary.answerLabels.seriousSymptoms, formatSymptoms(answers.seriousSymptoms)]
  ]

  const docCount = (workflowData.documents || []).length
  const docText = docCount 
    ? `${docCount} ${docCount > 1 ? t.summary.documentsCountPlural : t.summary.documentsCount} ${t.summary.documentsAttached}`
    : t.summary.noDocuments

  return (
    <Layout screen={7} title={t.summary.stepTitle}>
      <HeaderBlock
        eyebrow={t.summary.eyebrow}
        title={t.summary.title}
        description={t.summary.subtitle}
      >
        <span className="soft-badge">{t.summary.badge}</span>
      </HeaderBlock>

      <div className="summary-grid">
        <Card
          title={t.summary.complaintTitle}
          action={<button className="text-link" onClick={() => onNavigate(4)}>{t.summary.edit}</button>}
        >
          <p className="complaint-quote">{patientData.chiefComplaint || complaintType}</p>
          <span className="demo-note">{t.summary.demoCase} {complaintType}</span>
        </Card>

        <Card
          title={t.summary.answersTitle}
          action={<button className="text-link" onClick={() => onNavigate(5)}>{t.summary.edit}</button>}
        >
          <div className="answer-grid">
            {values.map(([label, value]) => (
              <div key={label}>
                <span>{label}</span>
                <strong>{String(value).replaceAll('-', ' ')}</strong>
              </div>
            ))}
          </div>
        </Card>

        <Card title={t.summary.documentsTitle}>
          <div className="summary-documents">
            <Icons.File />
            <strong>{docText}</strong>
            <button className="text-link" onClick={() => onNavigate(6)}>{t.summary.edit}</button>
          </div>
        </Card>
      </div>

      <div className="privacy-note">
        <Icons.Lock /> {t.summary.privacyNote}
      </div>

      <ActionBar
        onBack={() => onNavigate(6)}
        onPrimary={() => onNavigate(8)}
        primaryLabel={t.summary.continue}
        backLabel={t.summary.back}
      />
    </Layout>
  )
}

function AssessmentScreen({ patientData, updateWorkflow, onNavigate }) {
  const { language } = useLanguage()
  const t = translations[language] || translations.en
  
  if (!t || !t.assessmentResult) {
    console.error('AssessmentScreen: Translations not loaded for language:', language)
    return <div>Loading translations...</div>
  }
  const answer = patientData.assessmentAnswers || {}
  const urgent = (answer.seriousSymptoms || []).some(value => value !== 'none') || answer.bloodColour === 'dark'

  useEffect(() => {
    updateWorkflow({ carePath: urgent ? 'urgent' : 'routine', assessmentComplete: true })
  }, [urgent, updateWorkflow])

  const complaintType = isPilesComplaint(patientData.chiefComplaint) ? t.summary.piles : t.summary.fever

  return (
    <Layout screen={8} title={t.assessmentResult.stepTitle}>
      <div className="result-state">
        <div className={`result-mark ${urgent ? 'warning' : ''}`}>
          {urgent ? '!' : <Icons.CheckCircle />}
        </div>
        <span className="workflow-eyebrow">{t.assessmentResult.eyebrow}</span>
        <h1>{t.assessmentResult.title}</h1>
        <p>{t.assessmentResult.subtitle}</p>
      </div>

      <div className={`assessment-banner ${urgent ? 'urgent' : ''}`}>
        <strong>{urgent ? t.assessmentResult.bannerUrgent : t.assessmentResult.bannerRoutine}</strong>
        <span>{t.assessmentResult.disclaimer}</span>
      </div>

      <div className="assessment-columns">
        <Card title={t.assessmentResult.symptomsTitle}>
          <ul className="check-list">
            <li>{t.assessmentResult.symptom1} {complaintType}</li>
            <li>{t.assessmentResult.symptom2}</li>
            <li>
              {(() => {
                const symptoms = patientData.assessmentAnswers?.symptoms
                if (!Array.isArray(symptoms)) return 'No additional symptoms selected'
                const filtered = symptoms.filter(item => item !== 'none')
                return filtered.length ? filtered.join(', ') : 'No additional symptoms selected'
              })()}
            </li>
          </ul>
        </Card>

        <Card title={t.assessmentResult.observationTitle}>
          <p className="observation-text">
            {urgent ? t.assessmentResult.observationUrgent : t.assessmentResult.observationRoutine}
          </p>
        </Card>
      </div>

      <ActionBar
        onBack={() => onNavigate(7)}
        onPrimary={() => onNavigate(9)}
        primaryLabel={t.assessmentResult.continue}
        backLabel={t.assessmentResult.back}
      />
    </Layout>
  )
}

function NextStepScreen({ workflowData, onNavigate }) {
  const { language } = useLanguage()
  const t = translations[language] || translations.en
  
  if (!t || !t.nextStep) {
    console.error('NextStepScreen: Translations not loaded for language:', language)
    return <div>Loading translations...</div>
  }
  const urgent = workflowData.carePath === 'urgent'

  return (
    <Layout screen={9} title={t.nextStep.stepTitle}>
      <HeaderBlock
        eyebrow={t.nextStep.eyebrow}
        title={t.nextStep.title}
        description={t.nextStep.subtitle}
      >
        <span className={`path-badge ${urgent ? 'urgent' : ''}`}>
          {urgent ? t.nextStep.pathUrgent : t.nextStep.pathRoutine}
        </span>
      </HeaderBlock>

      <section className={`next-step-card ${urgent ? 'urgent' : ''}`}>
        <div className="next-step-icon">
          {urgent ? '!' : <Icons.Heart />}
        </div>
        <div>
          <span className="workflow-eyebrow">{t.nextStep.actionEyebrow}</span>
          <h2>{urgent ? t.nextStep.actionUrgentTitle : t.nextStep.actionRoutineTitle}</h2>
          <p>{urgent ? t.nextStep.actionUrgentText : t.nextStep.actionRoutineText}</p>
        </div>
      </section>

      <Card title={t.nextStep.whatNextTitle}>
        <div className="care-steps">
          <div>
            <b>1</b>
            <span>
              <strong>{t.nextStep.step1Title}</strong>
              <small>{t.nextStep.step1Text}</small>
            </span>
          </div>
          <div>
            <b>2</b>
            <span>
              <strong>{urgent ? t.nextStep.step2UrgentTitle : t.nextStep.step2RoutineTitle}</strong>
              <small>{urgent ? t.nextStep.step2UrgentText : t.nextStep.step2RoutineText}</small>
            </span>
          </div>
        </div>
      </Card>

      <div className="disclaimer">
        {t.nextStep.disclaimer}
      </div>

      <ActionBar
        onBack={() => onNavigate(8)}
        onPrimary={() => onNavigate(10)}
        primaryLabel={urgent ? t.nextStep.continueUrgent : t.nextStep.continueRoutine}
        backLabel={t.nextStep.back}
      />
    </Layout>
  )
}

function CompletionScreen({ patientData, workflowData, updateWorkflow, onNavigate }) {
  const { language } = useLanguage()
  const t = translations[language] || translations.en
  
  if (!t || !t.completion) {
    console.error('CompletionScreen: Translations not loaded for language:', language)
    return <div>Loading translations...</div>
  }
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
      updateWorkflow({ completedAt: new Date().toISOString() })
    }, 650)
    return () => clearTimeout(timer)
  }, [updateWorkflow])

  return (
    <Layout screen={10} title={t.completion.stepTitle}>
      {loading ? (
        <div className="loading-state">
          <div className="spinner" />
          <span className="workflow-eyebrow">{t.completion.loadingEyebrow}</span>
          <h1>{t.completion.loadingTitle}</h1>
          <p>{t.completion.loadingText}</p>
        </div>
      ) : (
        <>
          <div className="result-state completion">
            <div className="result-mark">
              <Icons.CheckCircle />
            </div>
            <span className="workflow-eyebrow">{t.completion.eyebrow}</span>
            <h1>{t.completion.title}</h1>
            <p>{patientData.fullName || t.completion.patient} {t.completion.subtitle}</p>
          </div>

          <Card title={t.completion.overviewTitle}>
            <div className="answer-grid">
              <div>
                <span>{t.completion.patient}</span>
                <strong>{patientData.fullName || t.completion.patient}</strong>
              </div>
              <div>
                <span>{t.completion.documents}</span>
                <strong>{(workflowData.documents || []).length} {t.completion.documentsAttached}</strong>
              </div>
              <div>
                <span>{t.completion.pathway}</span>
                <strong>
                  {workflowData.carePath === 'urgent' ? t.completion.pathwayUrgent : t.completion.pathwayRoutine}
                </strong>
              </div>
            </div>
          </Card>

          <div className="success-note">
            <Icons.CheckCircle /> {t.completion.successNote}
          </div>

          <ActionBar
            onBack={() => onNavigate(9)}
            onPrimary={() => {
              localStorage.removeItem('medikiosk-demo-state')
              window.location.reload()
            }}
            primaryLabel={t.completion.restart}
            backLabel={t.completion.back}
          />
        </>
      )}
    </Layout>
  )
}

export default function PatientWorkflow({ screen, patientData, workflowData, updateWorkflow, onNavigate }) {
  console.log('PatientWorkflow rendering screen:', screen)
  console.log('Patient data:', patientData)
  console.log('Workflow data:', workflowData)
  
  const props = { patientData, workflowData, updateWorkflow, onNavigate }
  
  const screens = {
    6: <DocumentsScreen {...props} />,
    7: <SummaryScreen {...props} />,
    8: <AssessmentScreen {...props} />,
    9: <NextStepScreen {...props} />,
    10: <CompletionScreen {...props} />
  }
  
  const screenToRender = screens[screen] || <DocumentsScreen {...props} />
  console.log('Rendering screen component for screen:', screen)
  
  return screenToRender
}