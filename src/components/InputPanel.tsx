import type { ChangeEvent } from 'react'

interface InputPanelProps {
  isScanning: boolean
  onSelectFile: (file: File) => void
}

export function InputPanel({ isScanning, onSelectFile }: InputPanelProps) {
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (!selectedFile) {
      return
    }

    onSelectFile(selectedFile)
    event.target.value = ''
  }

  return (
    <section className="panel" aria-label="Image input methods">
      <div className="panel-header">
        <h2>Choose an image</h2>
        <p>Upload a file or paste an image from your clipboard.</p>
      </div>

      <label className="upload-zone" htmlFor="qr-image-input">
        <span className="upload-title">Upload image</span>
        <span className="upload-subtitle">PNG, JPG, WEBP, GIF, BMP</span>
        <input
          id="qr-image-input"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isScanning}
        />
      </label>

      <div className="paste-hint" role="note">
        <strong>Paste from clipboard</strong>
        <p>Copy an image, then press Cmd+V or Ctrl+V anywhere on this page.</p>
      </div>
    </section>
  )
}
