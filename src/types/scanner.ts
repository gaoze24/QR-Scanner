export type ScanSource = 'upload' | 'clipboard'

export type DecodeErrorCode = 'NO_QR' | 'INVALID_IMAGE' | 'DECODE_FAILED'

export class DecodeError extends Error {
  code: DecodeErrorCode

  constructor(code: DecodeErrorCode, message: string) {
    super(message)
    this.name = 'DecodeError'
    this.code = code
  }
}
