import { useCallback, useEffect, useRef, useState } from 'react'
import './App.css'
import { ImagePreview } from './components/ImagePreview'
import { InputPanel } from './components/InputPanel'
import { ResultPanel } from './components/ResultPanel'
import { useClipboardImage } from './hooks/useClipboardImage'
import { decodeQrFromImage } from './lib/decodeQrFromImage'
import { getHttpUrl } from './lib/isHttpUrl'
import { DecodeError } from './types/scanner'
import type { DecodeErrorCode, ScanSource } from './types/scanner'

const DECODE_ERROR_MESSAGES: Record<DecodeErrorCode, string> = {
  NO_QR: 'No QR code was found in this image. Try a clearer image or a different crop.',
  INVALID_IMAGE: 'This image could not be read. Please select a valid image file.',
  DECODE_FAILED:
    'The image was loaded, but decoding failed. Please try another image.',
}

function getFriendlyDecodeMessage(error: DecodeError) {
  return DECODE_ERROR_MESSAGES[error.code] ?? error.message
}

function App() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [decodedText, setDecodedText] = useState('')
  const [openUrl, setOpenUrl] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [scanSource, setScanSource] = useState<ScanSource | null>(null)
  const [attemptCount, setAttemptCount] = useState(0)

  const scanRequestIdRef = useRef(0)

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  const handleScan = useCallback(async (blob: Blob, source: ScanSource) => {
    const requestId = ++scanRequestIdRef.current
    const nextPreviewUrl = URL.createObjectURL(blob)

    setScanSource(source)
    setAttemptCount((count) => count + 1)
    setIsScanning(true)
    setErrorMessage(null)
    setDecodedText('')
    setOpenUrl(null)
    setPreviewUrl(nextPreviewUrl)

    try {
      const qrText = await decodeQrFromImage(blob)

      if (requestId !== scanRequestIdRef.current) {
        return
      }

      setDecodedText(qrText)
      setOpenUrl(getHttpUrl(qrText))
      setErrorMessage(null)
    } catch (error) {
      if (requestId !== scanRequestIdRef.current) {
        return
      }

      if (error instanceof DecodeError) {
        setErrorMessage(getFriendlyDecodeMessage(error))
      } else {
        setErrorMessage('Unexpected error while scanning. Please try again.')
      }
    } finally {
      if (requestId === scanRequestIdRef.current) {
        setIsScanning(false)
      }
    }
  }, [])

  const handleSelectFile = useCallback(
    (file: File) => {
      void handleScan(file, 'upload')
    },
    [handleScan],
  )

  const handleClipboardImage = useCallback(
    (blob: Blob) => {
      void handleScan(blob, 'clipboard')
    },
    [handleScan],
  )

  const handleClipboardNonImage = useCallback((message: string) => {
    scanRequestIdRef.current += 1
    setScanSource('clipboard')
    setAttemptCount((count) => count + 1)
    setIsScanning(false)
    setErrorMessage(message)
    setDecodedText('')
    setOpenUrl(null)
    setPreviewUrl((currentUrl) => {
      if (currentUrl) {
        URL.revokeObjectURL(currentUrl)
      }
      return null
    })
  }, [])

  useClipboardImage({
    enabled: true,
    onImage: handleClipboardImage,
    onNonImagePaste: handleClipboardNonImage,
  })

  const handleOpenUrl = useCallback(() => {
    if (!openUrl) {
      return
    }
    window.open(openUrl, '_blank', 'noopener,noreferrer')
  }, [openUrl])

  const handleClear = useCallback(() => {
    scanRequestIdRef.current += 1
    setPreviewUrl((currentUrl) => {
      if (currentUrl) {
        URL.revokeObjectURL(currentUrl)
      }
      return null
    })
    setDecodedText('')
    setOpenUrl(null)
    setErrorMessage(null)
    setIsScanning(false)
    setScanSource(null)
    setAttemptCount(0)
  }, [])

  return (
    <main className="page">
      <div className="ambient ambient-left" aria-hidden="true" />
      <div className="ambient ambient-right" aria-hidden="true" />

      <div className="app-shell">
        <header className="app-header">
          <p className="eyebrow">In-browser decoder</p>
          <h1>QR Code Scanner</h1>
          <p>
            Upload an image or paste one from clipboard to decode QR content in
            your browser.
          </p>
        </header>

        <div className="layout-grid">
          <div className="stack">
            <InputPanel isScanning={isScanning} onSelectFile={handleSelectFile} />
            <ImagePreview
              imageUrl={previewUrl}
              source={scanSource}
              isScanning={isScanning}
            />
          </div>

          <ResultPanel
            decodedText={decodedText}
            openUrl={openUrl}
            errorMessage={errorMessage}
            isScanning={isScanning}
            attemptCount={attemptCount}
            onOpenUrl={handleOpenUrl}
            onClear={handleClear}
          />
        </div>
      </div>
    </main>
  )
}

export default App
