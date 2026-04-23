import html2canvas from "html2canvas"
import jsPDF from "jspdf"

export async function exportPDF(filename = 'my-cv') {
  const cvEl = document.getElementById('cv-preview')
  if (!cvEl) {
    console.error("CV element not found")
    return
  }

  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)

  try {
    // ─────────────────────────────
    // 📱 MOBILE → generate real PDF
    // ─────────────────────────────
    if (isMobile) {
      const canvas = await html2canvas(cvEl, {
        scale: 2,
        useCORS: true,
      })

      const imgData = canvas.toDataURL('image/png')

      const pdf = new jsPDF('p', 'mm', 'a4')

      const imgWidth = 210
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)

      pdf.save(`${filename}.pdf`)
      return
    }

    // ─────────────────────────────
    // 💻 DESKTOP → print
    // ─────────────────────────────

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
          top: 0;
          left: 0;
          width: 210mm;
          z-index: 99999;
        }

        #cv-preview {
          width: 210mm !important;
          transform: none !important;
          box-shadow: none !important;
        }

        * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
      }
    `
    document.head.appendChild(style)

    const container = document.createElement('div')
    container.id = 'print-container'
    container.style.display = 'none'

    const clone = cvEl.cloneNode(true)
    clone.style.width = '210mm'
    clone.style.transform = 'none'

    container.appendChild(clone)
    document.body.appendChild(container)

    await new Promise(resolve => setTimeout(resolve, 300))

    window.print()

    setTimeout(() => {
      if (style.parentNode) document.head.removeChild(style)
      if (container.parentNode) document.body.removeChild(container)
    }, 1500)

  } catch (err) {
    console.error("PDF export error:", err)
  }
}