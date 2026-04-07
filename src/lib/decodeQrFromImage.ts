import jsQR from 'jsqr'
import { DecodeError } from '../types/scanner'

const MAX_DIMENSION = 2200

function getScaledSize(width: number, height: number) {
  const longestSide = Math.max(width, height)
  if (longestSide <= MAX_DIMENSION) {
    return { width, height }
  }

  const scale = MAX_DIMENSION / longestSide
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  }
}

function loadImageFromBlob(blob: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(blob)
    const image = new Image()

    image.onload = () => {
      URL.revokeObjectURL(objectUrl)
      resolve(image)
    }

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(
        new DecodeError(
          'INVALID_IMAGE',
          'This image could not be read. Please choose a valid image file.',
        ),
      )
    }

    image.src = objectUrl
  })
}

async function imageDataFromBlob(blob: Blob): Promise<ImageData> {
  if (!blob.type.startsWith('image/')) {
    throw new DecodeError(
      'INVALID_IMAGE',
      'The selected file is not an image. Please choose a valid image file.',
    )
  }

  const image = await loadImageFromBlob(blob)
  const { width, height } = getScaledSize(image.naturalWidth, image.naturalHeight)

  if (width <= 0 || height <= 0) {
    throw new DecodeError(
      'INVALID_IMAGE',
      'The selected image has invalid dimensions.',
    )
  }

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const context = canvas.getContext('2d', { willReadFrequently: true })
  if (!context) {
    throw new DecodeError(
      'DECODE_FAILED',
      'Image processing is unavailable in this browser.',
    )
  }

  context.drawImage(image, 0, 0, width, height)

  try {
    return context.getImageData(0, 0, width, height)
  } catch {
    throw new DecodeError(
      'DECODE_FAILED',
      'Unable to access pixel data from this image.',
    )
  }
}

export async function decodeQrFromImage(blob: Blob): Promise<string> {
  try {
    const imageData = await imageDataFromBlob(blob)
    const result = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: 'attemptBoth',
    })

    if (!result || !result.data) {
      throw new DecodeError('NO_QR', 'No QR code found in the selected image.')
    }

    return result.data.trim()
  } catch (error) {
    if (error instanceof DecodeError) {
      throw error
    }

    throw new DecodeError(
      'DECODE_FAILED',
      'Something went wrong while decoding the QR code.',
    )
  }
}
