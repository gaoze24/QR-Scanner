import { useEffect, useState } from 'react'

interface ResultPanelProps {
  decodedText: string
  openUrl: string | null
  errorMessage: string | null
  isScanning: boolean
  attemptCount: number
  onOpenUrl: () => void
  onClear: () => void
}

export function ResultPanel({
  decodedText,
  openUrl,
  errorMessage,
  isScanning,
  attemptCount,
  onOpenUrl,
  onClear,
}: ResultPanelProps) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) {
      return
    }

    const timer = window.setTimeout(() => {
      setCopied(false)
    }, 1400)

    return () => {
      window.clearTimeout(timer)
    }
  }, [copied])

  const canCopy = decodedText.length > 0
  const hasState = decodedText.length > 0 || errorMessage !== null || attemptCount > 0

  const handleCopy = async () => {
    if (!canCopy) {
      return
    }

    try {
      await navigator.clipboard.writeText(decodedText)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  return (
    <section className="panel panel-result" aria-label="Decoded QR result">
      <div className="panel-header">
        <h2>Decoded result</h2>
        <p>
          {attemptCount > 0 ? `Scans completed: ${attemptCount}` : 'Scan an image to view its QR content.'}
        </p>
      </div>

      {isScanning && <div className="notice notice-info">Scanning in progress...</div>}
      {!isScanning && errorMessage && <div className="notice notice-error">{errorMessage}</div>}
      {!isScanning && !errorMessage && decodedText && (
        <div className="notice notice-success">QR code detected successfully.</div>
      )}

      <textarea
        className="result-box"
        value={decodedText}
        readOnly
        placeholder="Decoded content will appear here"
      />

      <div className="action-row">
        <button type="button" className="btn btn-copy" onClick={handleCopy} disabled={!canCopy}>
          {copied ? 'Copied' : 'Copy result'}
        </button>

        {openUrl && (
          <button type="button" className="btn btn-primary" onClick={onOpenUrl}>
            Open URL
          </button>
        )}

        <button type="button" className="btn btn-clear" onClick={onClear} disabled={!hasState}>
          Clear
        </button>
      </div>
    </section>
  )
}
