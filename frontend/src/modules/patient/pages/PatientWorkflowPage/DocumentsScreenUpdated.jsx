import { useRef, useState } from 'react'
import { Icons } from '@shared/components/Icons'
import { uploadDocument, deleteDocument } from '@shared/services/api/documentService'

export function DocumentsScreen({ patientData, workflowData, updateWorkflow, onNavigate, t }) {
  const inputRef = useRef(null)
  const [documents, setDocuments] = useState(() => 
    (workflowData.documents || []).filter(document => document && document.name)
  )
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')

  const addFiles = async (fileList) => {
    const files = [...fileList].filter(file => /^(application\/pdf|image\/(jpeg|png))$/.test(file.type))
    if (!files.length) return
    
    if (!patientData.sessionId) {
      console.error('❌ No session ID available')
      setError('Session not found. Please restart.')
      return
    }
    
    setUploading(true)
    setProgress(15)
    setError('')
    
    try {
      const uploadedDocs = []
      
      for (const file of files) {
        const documentType = file.type === 'application/pdf' ? 'Prescription' : 'Lab Report'
        const doc = await uploadDocument(patientData.sessionId, file, documentType)
        uploadedDocs.push({
          document_id: doc.document_id,
          id: doc.document_id,
          name: file.name,
          type: file.type,
          size: file.size,
          file_url: doc.file_url
        })
        setProgress(prev => Math.min(prev + (80 / files.length), 100))
      }
      
      setDocuments(current => [...current, ...uploadedDocs])
      setProgress(100)
      console.log('✅ Documents uploaded:', uploadedDocs.length)
    } catch (err) {
      console.error('❌ Error uploading documents:', err)
      setError('Failed to upload documents. Please try again.')
      setProgress(0)
    } finally {
      setTimeout(() => setUploading(false), 500)
    }
  }

  const handleRemoveDocument = async (doc) => {
    try {
      if (doc.document_id && doc.file_url) {
        await deleteDocument(doc.document_id, doc.file_url)
      }
      setDocuments(current => current.filter(item => item.id !== doc.id))
      console.log('✅ Document deleted')
    } catch (err) {
      console.error('❌ Error deleting document:', err)
      setError('Failed to delete document.')
    }
  }

  const continueToSummary = () => {
    updateWorkflow({ documents })
    onNavigate(7)
  }

  return (
    <>
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
          disabled={uploading}
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

      {error && (
        <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#fee', border: '1px solid #fcc', borderRadius: '8px', color: '#c00' }}>
          {error}
        </div>
      )}

      <div className="document-list">
        {documents.length ? (
          documents.map(document => (
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
                onClick={() => handleRemoveDocument(document)}
              >
                {t.documents.remove}
              </button>
            </div>
          ))
        ) : (
          <div className="empty-documents">
            <span><Icons.File /></span>
            <div>
              <strong>{t.documents.noDocuments}</strong>
              <p>{t.documents.noDocumentsText}</p>
            </div>
          </div>
        )}
      </div>

      <div className="workflow-actions">
        <button className="workflow-button workflow-button-ghost" onClick={() => onNavigate(5)}>
          ← {t.documents.back}
        </button>
        <div>
          <button className="workflow-button workflow-button-outline" onClick={() => {
            updateWorkflow({ documents: [] })
            onNavigate(7)
          }}>
            {t.documents.skip}
          </button>
          <button className="workflow-button workflow-button-primary" onClick={continueToSummary}>
            {t.documents.continue} <span>→</span>
          </button>
        </div>
      </div>
    </>
  )
}
