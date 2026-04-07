# QR Code Scanner

A modern single-page web app that decodes QR codes from images entirely in the browser.

## What it does

- Decodes QR codes from an uploaded image file.
- Decodes QR codes from an image pasted from the clipboard with Cmd+V or Ctrl+V.
- Shows a preview of the current image.
- Displays decoded text in a readable, copy-friendly result box.
- Shows an Open URL button only when decoded content is a valid http or https URL.
- Handles common failures with friendly messages:
  - no QR code found
  - invalid or unreadable image
  - clipboard content is not an image

## Tech stack

- React
- TypeScript
- Vite
- jsQR for client-side QR decoding

## Install dependencies

```bash
npm install
```

## Run locally

```bash
npm run dev
```

Open the local URL shown in the terminal.

## Build for production

```bash
npm run build
```

## Preview production build

```bash
npm run preview
```

## How to use

1. Upload method:
1. Click Upload image and pick a local image containing a QR code.
2. Wait for scanning to finish, then read the decoded result.

2. Clipboard method:
1. Copy an image containing a QR code.
2. Press Cmd+V or Ctrl+V on the page.
3. The app scans the pasted image and shows the result.

3. URL behavior:
1. If the decoded text is a valid http or https URL, Open URL appears.
2. Click Open URL to open the link in a new tab.
3. The app never redirects automatically.

4. Clear state:
1. Click Clear to reset preview, result, and messages.
2. Scan another image.

## Notes

- The app is fully client-side and does not require any backend.
- QR decoding runs in the browser using canvas pixel data.
