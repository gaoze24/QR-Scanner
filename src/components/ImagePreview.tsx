import type { ScanSource } from '../types/scanner'

interface ImagePreviewProps {
  imageUrl: string | null
  source: ScanSource | null
  isScanning: boolean
}

export function ImagePreview({ imageUrl, source, isScanning }: ImagePreviewProps) {
  return (
    <section className="panel" aria-label="Image preview">
      <div className="panel-header">
        <h2>Preview</h2>
        <p>
          {source
            ? `Current source: ${source === 'upload' ? 'file upload' : 'clipboard paste'}`
            : 'No image selected yet.'}
        </p>
      </div>

      <div className="preview-frame">
        {imageUrl ? (
          <img src={imageUrl} alt="Uploaded or pasted content" />
        ) : (
          <div className="preview-placeholder">Your selected image will appear here.</div>
        )}
        {isScanning && <div className="preview-overlay">Scanning image...</div>}
      </div>
    </section>
  )
}
