import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

/**
 * exportPDF — Production-ready PDF export
 * Works on mobile (Android + iOS) and desktop
 * No window.print(), no new tabs
 */
export async function exportPDF(filename = 'my-cv') {
  const element = document.getElementById('cv-preview')

  if (!element) {
    console.error('[exportPDF] #cv-preview not found in DOM')
    alert('Could not find CV preview. Please try again.')
    return
  }

  // ── 1. Save ALL styles we'll temporarily change ──
  const saved = {
    transform:       element.style.transform,
    width:           element.style.width,
    minWidth:        element.style.minWidth,
    maxWidth:        element.style.maxWidth,
    position:        element.style.position,
    left:            element.style.left,
    top:             element.style.top,
    zIndex:          element.style.zIndex,
    marginBottom:    element.style.marginBottom,
    transformOrigin: element.style.transformOrigin,
  }

  // ── 2. Also fix any parent wrappers that have transform/scale ──
  const parentSaved = []
  let node = element.parentElement
  while (node && node !== document.body) {
    parentSaved.push({
      el:        node,
      transform: node.style.transform,
      overflow:  node.style.overflow,
    })
    node.style.transform = 'none'
    node.style.overflow  = 'visible'
    node = node.parentElement
  }

  // ── 3. Clone element into a fixed off-screen container ──
  // This avoids ANY layout interference from the page
  const container = document.createElement('div')
  container.style.cssText = `
    position: fixed;
    top: 0;
    left: -9999px;
    width: 794px;
    min-width: 794px;
    background: #ffffff;
    z-index: -1;
    pointer-events: none;
  `

  // Deep clone the element
  const clone = element.cloneNode(true)
  clone.style.transform       = 'none'
  clone.style.width           = '794px'
  clone.style.minWidth        = '794px'
  clone.style.maxWidth        = '794px'
  clone.style.position        = 'relative'
  clone.style.left            = '0'
  clone.style.top             = '0'
  clone.style.marginBottom    = '0'
  clone.style.transformOrigin = 'top left'
  clone.id = 'cv-preview-export-clone'

  container.appendChild(clone)
  document.body.appendChild(container)

  // ── 4. Wait for fonts + images to load ──
  await waitForAssets(container)

  let pdf = null

  try {
    // ── 5. Capture with html2canvas ──
    const canvas = await html2canvas(clone, {
      scale:           3,          // High DPI — crisp on retina screens
      useCORS:         true,
      allowTaint:      false,
      logging:         false,
      backgroundColor: '#ffffff',
      width:           794,
      windowWidth:     794,
      imageTimeout:    15000,
      removeContainer: true,
      onclone: (clonedDoc) => {
        // Fix fonts in cloned document
        const style = clonedDoc.createElement('style')
        style.textContent = `
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif !important;
          }
          h1, h2, h3, h4 {
            font-family: Georgia, "Times New Roman", serif !important;
          }
        `
        clonedDoc.head.appendChild(style)
      },
    })

    // ── 6. Build PDF ──
    const pageW = 210   // A4 mm
    const pageH = 297   // A4 mm

    // Calculate image height in mm
    const imgHeightMM = (canvas.height / canvas.width) * pageW

    pdf = new jsPDF({
      orientation: 'portrait',
      unit:        'mm',
      format:      'a4',
      compress:    true,
    })

    // Set PDF metadata
    pdf.setProperties({
      title:    filename,
      subject:  'Curriculum Vitae',
      author:   filename,
      creator:  'CVcraft',
      keywords: 'CV, Resume',
    })

    if (imgHeightMM <= pageH) {
      // ── Single page ──
      pdf.addImage(
        canvas.toDataURL('image/jpeg', 0.95),
        'JPEG',
        0, 0,
        pageW, imgHeightMM,
        undefined,
        'FAST'
      )
    } else {
      // ── Multi-page: slice canvas ──
      const pxPerMM    = canvas.width / pageW
      const pageHpx    = Math.floor(pageH * pxPerMM)
      let   remaining  = canvas.height
      let   offsetPx   = 0

      while (remaining > 0) {
        const sliceH = Math.min(pageHpx, remaining)

        // Create slice canvas
        const slice    = document.createElement('canvas')
        slice.width    = canvas.width
        slice.height   = sliceH
        const ctx      = slice.getContext('2d')
        ctx.fillStyle  = '#ffffff'
        ctx.fillRect(0, 0, slice.width, slice.height)
        ctx.drawImage(canvas, 0, offsetPx, canvas.width, sliceH, 0, 0, canvas.width, sliceH)

        const sliceHmm = (sliceH / canvas.width) * pageW

        pdf.addImage(
          slice.toDataURL('image/jpeg', 0.95),
          'JPEG',
          0, 0,
          pageW, sliceHmm,
          undefined,
          'FAST'
        )

        remaining -= sliceH
        offsetPx  += sliceH
        if (remaining > 0) pdf.addPage()
      }
    }

  } finally {
    // ── 7. Always restore DOM — even if error ──
    document.body.removeChild(container)

    // Restore parent wrappers
    parentSaved.forEach(({ el, transform, overflow }) => {
      el.style.transform = transform
      el.style.overflow  = overflow
    })
  }

  if (!pdf) {
    alert('PDF generation failed. Please try again.')
    return
  }

  // ── 8. Download — mobile-safe ──
  await downloadPDF(pdf, `${filename}.pdf`)
}

// ─────────────────────────────────────────────────────────────────
// Download PDF — works on mobile Chrome + Safari + desktop
// ─────────────────────────────────────────────────────────────────
async function downloadPDF(pdf, filename) {
  const ua         = navigator.userAgent.toLowerCase()
  const isIOS      = /iphone|ipad|ipod/.test(ua)
  const isSafari   = /safari/.test(ua) && !/chrome/.test(ua)
  const isMobile   = /android|iphone|ipad|ipod|mobile/.test(ua)

  try {
    if (isIOS || isSafari) {
      // iOS / Safari: open blob URL in same tab (only reliable method)
      const blob = pdf.output('blob')
      const url  = URL.createObjectURL(blob)

      // Try download link first
      const a        = document.createElement('a')
      a.href         = url
      a.download     = filename
      a.style.display = 'none'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)

      // Clean up after delay
      setTimeout(() => URL.revokeObjectURL(url), 5000)

    } else if (isMobile) {
      // Android Chrome: direct blob download
      const blob = pdf.output('blob')
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement('a')
      a.href     = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      setTimeout(() => URL.revokeObjectURL(url), 5000)

    } else {
      // Desktop: standard jsPDF save
      pdf.save(filename)
    }
  } catch (err) {
    console.error('[exportPDF] Download failed:', err)

    // Last resort fallback: data URI
    try {
      const dataUri = pdf.output('datauristring')
      const a       = document.createElement('a')
      a.href        = dataUri
      a.download    = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    } catch (fallbackErr) {
      console.error('[exportPDF] Fallback also failed:', fallbackErr)
      alert('Download failed. Please try on a desktop browser.')
    }
  }
}

// ─────────────────────────────────────────────────────────────────
// Wait for all images + fonts inside container
// ─────────────────────────────────────────────────────────────────
function waitForAssets(container) {
  return new Promise(resolve => {
    const images  = Array.from(container.querySelectorAll('img'))
    const pending = images.filter(img => !img.complete)

    if (pending.length === 0) {
      // No images — just wait for fonts
      if (document.fonts?.ready) {
        document.fonts.ready.then(() => setTimeout(resolve, 200))
      } else {
        setTimeout(resolve, 300)
      }
      return
    }

    let loaded = 0
    const done = () => {
      loaded++
      if (loaded >= pending.length) {
        if (document.fonts?.ready) {
          document.fonts.ready.then(() => setTimeout(resolve, 200))
        } else {
          setTimeout(resolve, 300)
        }
      }
    }

    pending.forEach(img => {
      img.onload  = done
      img.onerror = done // Don't block on broken images
    })

    // Timeout safety — don't wait forever
    setTimeout(resolve, 8000)
  })
}