import { supabase, isConfigured } from '../supabase/client'

const BUCKET_NAME = 'medical-documents'

/**
 * Upload document to Supabase Storage
 */
export async function uploadDocument(sessionId, file, documentType) {
  if (!isConfigured) {
    console.log('📝 Mock: Uploading document:', file.name)
    return {
      document_id: `${Date.now()}-mock-doc`,
      session_id: sessionId,
      document_type: documentType,
      file_url: `mock://documents/${file.name}`,
      uploaded_at: new Date().toISOString()
    }
  }

  try {
    // Generate unique file path
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    const filePath = `${sessionId}/${fileName}`

    // Upload to storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) throw uploadError

    // Get public URL (or signed URL for private buckets)
    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath)

    // Save document record to database
    const { data: docData, error: docError } = await supabase
      .from('documents')
      .insert([{
        session_id: sessionId,
        document_type: documentType,
        file_url: filePath, // Store path, not full URL
        uploaded_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (docError) throw docError

    console.log('✅ Document uploaded:', fileName)
    return {
      ...docData,
      publicUrl // Include URL for immediate display
    }
  } catch (error) {
    console.error('❌ Error uploading document:', error)
    throw error
  }
}

/**
 * Get signed URL for private document
 */
export async function getDocumentUrl(filePath, expiresIn = 3600) {
  if (!isConfigured) {
    console.log('📝 Mock: Getting document URL:', filePath)
    return `mock://documents/${filePath}`
  }

  try {
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(filePath, expiresIn)

    if (error) throw error

    return data.signedUrl
  } catch (error) {
    console.error('❌ Error getting document URL:', error)
    throw error
  }
}

/**
 * Get all documents for a session
 */
export async function getSessionDocuments(sessionId) {
  if (!isConfigured) {
    console.log('📝 Mock: Getting documents for session:', sessionId)
    return [
      {
        document_id: '1',
        document_type: 'Prescription',
        file_url: 'mock://documents/prescription.pdf',
        uploaded_at: new Date().toISOString()
      }
    ]
  }

  try {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('session_id', sessionId)
      .order('uploaded_at', { ascending: false })

    if (error) throw error

    // Get signed URLs for each document
    const documentsWithUrls = await Promise.all(
      (data || []).map(async (doc) => {
        try {
          const signedUrl = await getDocumentUrl(doc.file_url)
          return { ...doc, signedUrl }
        } catch (err) {
          console.warn('Could not get signed URL for', doc.document_id)
          return doc
        }
      })
    )

    console.log(`✅ Retrieved ${documentsWithUrls.length} documents`)
    return documentsWithUrls
  } catch (error) {
    console.error('❌ Error getting documents:', error)
    throw error
  }
}

/**
 * Update document with OCR results
 */
export async function updateDocumentOCR(documentId, ocrText, extractedInfo, confidence) {
  if (!isConfigured) {
    console.log('📝 Mock: Updating OCR for document:', documentId)
    return { document_id: documentId, ocr_text: ocrText }
  }

  try {
    const { data, error } = await supabase
      .from('documents')
      .update({
        ocr_text: ocrText,
        extracted_info: extractedInfo,
        ocr_confidence: confidence
      })
      .eq('document_id', documentId)
      .select()
      .single()

    if (error) throw error

    console.log('✅ Document OCR updated')
    return data
  } catch (error) {
    console.error('❌ Error updating document OCR:', error)
    throw error
  }
}

/**
 * Delete document
 */
export async function deleteDocument(documentId, filePath) {
  if (!isConfigured) {
    console.log('📝 Mock: Deleting document:', documentId)
    return { success: true }
  }

  try {
    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath])

    if (storageError) throw storageError

    // Delete from database
    const { error: dbError } = await supabase
      .from('documents')
      .delete()
      .eq('document_id', documentId)

    if (dbError) throw dbError

    console.log('✅ Document deleted')
    return { success: true }
  } catch (error) {
    console.error('❌ Error deleting document:', error)
    throw error
  }
}