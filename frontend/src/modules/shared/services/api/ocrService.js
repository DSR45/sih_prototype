import { createWorker } from 'tesseract.js'

/**
 * Extract text from an image in the browser using Tesseract.js.
 * PDFs are intentionally not processed here because client-side PDF rendering
 * requires an additional PDF renderer; they can still be uploaded normally.
 */
export async function extractTextFromImage(file, onProgress) {
  if (!file || !file.type.startsWith('image/')) {
    throw new Error('OCR supports image files only')
  }

  console.group(`[OCR] Starting extraction: ${file.name}`)
  console.log('[OCR] File details:', {
    name: file.name,
    type: file.type,
    sizeBytes: file.size
  })

  const worker = await createWorker('eng', 1, {
    logger: message => {
      const progress = typeof message.progress === 'number'
        ? Math.round(message.progress * 100)
        : null

      console.log('[OCR] Tesseract:', {
        status: message.status,
        progress: progress === null ? undefined : `${progress}%`
      })

      if (progress !== null && onProgress) onProgress(progress)
    }
  })

  try {
    console.log('[OCR] Tesseract worker initialized')
    const result = await worker.recognize(file)
    const text = result.data.text?.trim() || ''
    const confidence = result.data.confidence ?? 0

    console.log('[OCR] Extraction completed:', {
      characters: text.length,
      confidence,
      preview: text.slice(0, 300)
    })
    console.log('[OCR] Full extracted text:', text)
    console.groupEnd()

    return { text, confidence }
  } catch (error) {
    console.error('[OCR] Extraction failed:', error)
    console.groupEnd()
    throw error
  } finally {
    await worker.terminate()
    console.log('[OCR] Tesseract worker terminated')
  }
}
