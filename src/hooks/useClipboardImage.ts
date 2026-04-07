import { useEffect } from 'react'

interface UseClipboardImageOptions {
  enabled?: boolean
  onImage: (blob: Blob) => void
  onNonImagePaste: (message: string) => void
}

export function useClipboardImage({
  enabled = true,
  onImage,
  onNonImagePaste,
}: UseClipboardImageOptions) {
  useEffect(() => {
    if (!enabled) {
      return
    }

    const handlePaste = (event: ClipboardEvent) => {
      const items = event.clipboardData?.items
      if (!items || items.length === 0) {
        onNonImagePaste('Clipboard is empty. Copy an image and try again.')
        return
      }

      for (const item of Array.from(items)) {
        if (!item.type.startsWith('image/')) {
          continue
        }

        const file = item.getAsFile()
        if (file) {
          event.preventDefault()
          onImage(file)
          return
        }
      }

      onNonImagePaste(
        'Clipboard content is not an image. Copy an image and press Cmd+V or Ctrl+V.',
      )
    }

    window.addEventListener('paste', handlePaste)
    return () => {
      window.removeEventListener('paste', handlePaste)
    }
  }, [enabled, onImage, onNonImagePaste])
}
