import * as pdfjsLib from 'pdfjs-dist/build/pdf.mjs'
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.mjs?url'
import { createWorker } from 'tesseract.js'

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl

export async function extractTextFromPdf(file, onProgress) {
  if (!file || file.type !== 'application/pdf') {
    throw new Error('PDF OCR requires a PDF file')
  }

  console.group(`[PDF OCR] Starting extraction: ${file.name}`)

  const pdf = await pdfjsLib.getDocument({
    data: await file.arrayBuffer()
  }).promise

  console.log('[PDF OCR] PDF loaded:', {
    name: file.name,
    pages: pdf.numPages,
    sizeBytes: file.size
  })

  const worker = await createWorker('eng', 1, {
    logger: message => {
      if (message.status) {
        console.log('[PDF OCR] Tesseract:', message.status, message.progress)
      }
    }
  })

  const pageTexts = []
  let confidenceTotal = 0

  try {
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      console.log(`[PDF OCR] Rendering page ${pageNumber}/${pdf.numPages}`)

      const page = await pdf.getPage(pageNumber)
      const viewport = page.getViewport({ scale: 2 })
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')

      canvas.width = viewport.width
      canvas.height = viewport.height

      await page.render({
        canvasContext: context,
        viewport
      }).promise

      console.log(`[PDF OCR] Running Tesseract on page ${pageNumber}`)

      const result = await worker.recognize(canvas)
      const text = result.data.text?.trim() || ''
      const confidence = result.data.confidence || 0

      pageTexts.push(`--- Page ${pageNumber} ---\n${text}`)
      confidenceTotal += confidence

      const progress = Math.round((pageNumber / pdf.numPages) * 100)
      onProgress?.(progress)

      console.log('[PDF OCR] Page complete:', {
        page: pageNumber,
        characters: text.length,
        confidence,
        progress,
        extractedText: text
      })
    }
  } finally {
    await worker.terminate()
    console.log('[PDF OCR] Tesseract worker terminated')
  }

  const text = pageTexts.join('\n\n')
  const confidence = pdf.numPages ? confidenceTotal / pdf.numPages : 0

  console.log('[PDF OCR] Extraction completed:', {
    pages: pdf.numPages,
    characters: text.length,
    confidence,
    extractedText: text
  })
  console.groupEnd()

  return {
    text,
    confidence,
    pages: pdf.numPages
  }
}