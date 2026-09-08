import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '@shared/contexts/LanguageContext'
import { translations } from '@shared/constants/translations'
import { Icons } from '@shared/components/Icons'
import {
  uploadDocument,
  deleteDocument,
  updateDocumentOCR
} from '@shared/services/api/documentService'
import { extractTextFromImage } from '@shared/services/api/ocrService'
import { extractTextFromPdf } from '@shared/services/api/pdfOcrService'
import { generateCaseSummaryOnce, createMockCaseSummary } from '@shared/services/api/caseSummaryService'
import { supabase } from '@shared/services/supabase/client'
import './styles.css'

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

function DocumentsScreen({ patientData, workflowData, updateWorkflow, onNavigate }) {
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
  const [extractingText, setExtractingText] = useState(false)
  const [ocrProgress, setOcrProgress] = useState(0)
  const [progress, setProgress] = useState(0)

  const addFiles = async (fileList) => {
      const files = [...fileList].filter(file => /^(application\/pdf|image\/(jpeg|png))$/.test(file.type))
      if (!files.length) return

      if (!patientData?.sessionId) {
        console.error('No session ID available for document upload')
        return
      }

      setUploading(true)
      setProgress(10)

      try {
        const uploadedDocuments = []

        for (let index = 0; index < files.length; index += 1) {
          const file = files[index]
          const documentType = file.type === 'application/pdf' ? 'Prescription' : 'Lab Report'
                    console.log('[Documents] Uploading file:', {
            name: file.name,
            type: file.type,
            sizeBytes: file.size
          })

          const uploaded = await uploadDocument(patientData.sessionId, file, documentType)
          console.log('[Documents] Upload completed:', {
            name: file.name,
            documentId: uploaded.document_id
          })

                    if (file.type.startsWith('image/') || file.type === 'application/pdf') {
            console.group(`[Documents/OCR] Processing ${file.name}`)
            console.log('[Documents/OCR] File type:', file.type)
            setExtractingText(true)
            setOcrProgress(0)

            try {
              const progressHandler = value => {
                setOcrProgress(value)
                console.log(`[Documents/OCR] Progress for ${file.name}: ${value}%`)
              }

              const ocrResult = file.type === 'application/pdf'
                ? await extractTextFromPdf(file, progressHandler)
                : await extractTextFromImage(file, progressHandler)

              console.log('[Documents/OCR] Extracted data:', {
                fileName: file.name,
                fileType: file.type,
                pages: ocrResult.pages || 1,
                text: ocrResult.text,
                characterCount: ocrResult.text.length,
                confidence: ocrResult.confidence
              })

              await updateDocumentOCR(
                uploaded.document_id,
                ocrResult.text,
                {
                  source: file.type === 'application/pdf' ? 'pdfjs+tesseract.js' : 'tesseract.js',
                  fileName: file.name,
                  pages: ocrResult.pages || 1
                },
                ocrResult.confidence
              )

              console.log('[Documents/OCR] Saved OCR data to backend:', uploaded.document_id)
            } catch (ocrError) {
              console.error('[Documents/OCR] Extraction failed:', {
                fileName: file.name,
                fileType: file.type,
                error: ocrError
              })
            } finally {
              setExtractingText(false)
              setOcrProgress(100)
              console.log('[Documents/OCR] Finished:', file.name)
              console.groupEnd()
            }
          } else {
            console.log('[Documents/OCR] Skipped unsupported file:', {
              name: file.name,
              type: file.type
            })
          }

          uploadedDocuments.push({
            ...uploaded,
            id: uploaded.document_id,
            name: file.name,
            type: file.type,
            size: file.size
          })

          setProgress(Math.round(((index + 1) / files.length) * 100))
        }

        setDocuments(current => [...current, ...uploadedDocuments])
      } catch (error) {
        console.error('Document upload failed:', error)
      } finally {
        setUploading(false)
      }
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

        {extractingText && (
          <div className="ocr-loading-overlay" role="status" aria-live="polite">
            <div className="ocr-loading-card">
              <div className="ocr-spinner" aria-hidden="true" />
              <h3>Extracting document text</h3>
              <p>Please wait while Tesseract reads the uploaded image.</p>
              <strong>{ocrProgress}%</strong>
              <div className="ocr-progress-track">
                <i style={{ width: `${ocrProgress}%` }} />
              </div>
            </div>
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
                onPrimary={() => onNavigate(10)}
        primaryLabel="Finish and prepare case"
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
  const [summaryError, setSummaryError] = useState('')
  const [summaryStage, setSummaryStage] = useState('preparing')

  const summarySteps = [
    ['preparing', 'Prepare case data'],
    ['checking', 'Check existing summary'],
    ['loading', 'Load answers and OCR text'],
    ['generating', 'Generate doctor summary'],
    ['validating', 'Validate summary response'],
    ['saving', 'Save summary for doctor review'],
    ['submitting', 'Submit completed case'],
    ['complete', 'Complete case']
  ]

  useEffect(() => {
    let cancelled = false
    const sessionId = patientData.sessionId || workflowData.sessionId

    async function completeCase() {
      try {
        if (sessionId) {
                    console.log('[Case Summary] Starting completion flow:', { sessionId })
          await generateCaseSummaryOnce({
            sessionId,
            patientData,
            onProgress: step => setSummaryStage(step)
          })

          console.log('[Case Summary] Summary complete; submitting session:', sessionId)
          setSummaryStage('submitting')
          await import('@shared/services/supabaseAdapter').then(({ supabasePatientAdapter }) =>
            supabasePatientAdapter.submitSession(sessionId)
          )
          console.log('[Case Summary] Session submitted successfully:', sessionId)
          setSummaryStage('complete')
        }
            } catch (error) {
        console.error('[Case Summary] AI generation failed; creating fallback summary:', error)
        try {
          const fallbackSummary = createMockCaseSummary(patientData)
          if (sessionId) {
            setSummaryStage('saving')
            const { data: fallbackSaved, error: fallbackSaveError } = await supabase
              .from('ai_summaries')
              .insert([{
                session_id: sessionId,
                ai_summary: JSON.stringify(fallbackSummary),
                doctor_edited: false,
                timeline_json: { source: 'local-fallback', generatedAt: new Date().toISOString() }
              }])
              .select()
              .single()

            if (fallbackSaveError) throw fallbackSaveError
            console.warn('[Case Summary] Fallback summary saved:', fallbackSaved?.summary_id)
            setSummaryStage('submitting')
            await import('@shared/services/supabaseAdapter').then(({ supabasePatientAdapter }) =>
              supabasePatientAdapter.submitSession(sessionId)
            )
            console.warn('[Case Summary] Session submitted with fallback summary:', sessionId)
            setSummaryStage('complete')
          }
        } catch (fallbackError) {
          console.error('[Case Summary] Fallback summary failed:', fallbackError)
          if (!cancelled) setSummaryError('The summary could not be generated, but your original answers and documents are preserved.')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
          updateWorkflow({ completedAt: new Date().toISOString(), sessionId })
        }
      }
    }

    completeCase()
    return () => { cancelled = true }
  }, [patientData, patientData.sessionId, updateWorkflow, workflowData.sessionId])

  return (
    <Layout screen={10} title={t.completion.stepTitle}>
            {loading ? (
                <div className="loading-state case-summary-loading">
          <span className="workflow-eyebrow">{t.completion.loadingEyebrow}</span>
          <h1>Preparing your case summary</h1>
          <p>{t.completion.loadingText}</p>
          <div className="summary-progress-timeline" role="status" aria-live="polite">
            {summarySteps.map(([step, label], index) => {
              const currentIndex = summarySteps.findIndex(([name]) => name === summaryStage)
              const isComplete = index < currentIndex || summaryStage === 'complete'
              const isActive = step === summaryStage

              return (
                <div className="summary-progress-step" key={step}>
                  <div className={`summary-progress-marker ${isComplete ? 'complete' : ''} ${isActive ? 'active' : ''}`}>
                    {isComplete ? '✓' : isActive ? <span className="summary-progress-spinner" /> : index + 1}
                  </div>
                  <div className={`summary-progress-label ${isActive ? 'active' : ''}`}>
                    <strong>{label}</strong>
                    {isActive && <small>In progress…</small>}
                  </div>
                  {index < summarySteps.length - 1 && <div className={`summary-progress-arrow ${isComplete ? 'complete' : ''}`}>↓</div>}
                </div>
              )
            })}
          </div>
        </div>
            ) : (
        <>
          {summaryError && (
            <div className="assessment-banner urgent" role="alert">
              <strong>Summary unavailable</strong>
              <span>{summaryError}</span>
            </div>
          )}
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