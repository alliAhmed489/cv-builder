export async function exportPDF(filename = 'my-cv') {
  const cvEl = document.getElementById('cv-preview')
  if (!cvEl) return

  // ── إضافة style للطباعة ──
  const style = document.createElement('style')
  style.id = 'print-style'
  style.textContent = `
    @media print {
      @page {
        size: A4;
        margin: 0;
      }

      body > * {
        display: none !important;
      }

      #print-container {
        display: block !important;
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 210mm !important;
        z-index: 99999 !important;
      }

      #cv-preview {
        width: 210mm !important;
        min-width: 210mm !important;
        transform: none !important;
        box-shadow: none !important;
        margin: 0 !important;
        padding: 0 !important;
      }

      * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        color-adjust: exact !important;
      }
    }
  `
  document.head.appendChild(style)

  // ── clone الـ CV في container مؤقت ──
  const container = document.createElement('div')
  container.id = 'print-container'
  container.style.display = 'none'

  const clone = cvEl.cloneNode(true)
  clone.id = 'cv-preview'
  clone.style.width = '210mm'
  clone.style.transform = 'none'
  container.appendChild(clone)
  document.body.appendChild(container)

  // ── تحديث الـ metadata ──
  const originalTitle = document.title
  const now = new Date()
  const dateStr = now.toLocaleDateString('en-GB', {
    day: '2-digit', month: 'long', year: 'numeric'
  })

  // اسم الملف + التاريخ كـ document title (بيظهر في الـ PDF metadata)
  document.title = `${filename} — CV — ${dateStr}`

  // ── إضافة meta tags للـ PDF metadata ──
  const metaTags = [
    { name: 'author',      content: filename },
    { name: 'description', content: `Professional CV for ${filename} — Generated ${dateStr}` },
    { name: 'created',     content: now.toISOString() },
  ]
  const addedMetas = metaTags.map(m => {
    const meta = document.createElement('meta')
    meta.name    = m.name
    meta.content = m.content
    document.head.appendChild(meta)
    return meta
  })

  // ── طباعة ──
  window.print()

  // ── تنظيف بعد الطباعة ──
  setTimeout(() => {
    document.title = originalTitle
    document.head.removeChild(style)
    document.body.removeChild(container)
    addedMetas.forEach(m => document.head.removeChild(m))
  }, 1500)
}