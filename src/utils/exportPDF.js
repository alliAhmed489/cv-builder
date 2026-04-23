export async function exportPDF(filename = 'my-cv') {
  const cvEl = document.getElementById('cv-preview')
  if (!cvEl) return

  // ── نجيب نسخة من الـ CV ──
  const clone = cvEl.cloneNode(true)

  // ── نفتح نافذة جديدة ──
  const printWindow = window.open('', '_blank')

  if (!printWindow) {
    alert('Please allow popups to download PDF')
    return
  }

  // ── HTML للنافذة الجديدة ──
  printWindow.document.write(`
    <html>
      <head>
        <title>${filename}</title>
        <style>
          body {
            margin: 0;
            padding: 0;
            background: white;
          }

          #cv-preview {
            width: 210mm;
            margin: auto;
          }

          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        </style>
      </head>
      <body>
        ${clone.outerHTML}
      </body>
    </html>
  `)

  printWindow.document.close()

  // 🔥 مهم: نستنى شوية
  setTimeout(() => {
    printWindow.focus()
    printWindow.print()
  }, 500)
}