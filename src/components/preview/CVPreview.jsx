import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ClassicTemplate }   from '../templates/ClassicTemplate.jsx'
import { ModernTemplate }    from '../templates/ModernTemplate.jsx'
import { ExecutiveTemplate } from '../templates/ExecutiveTemplate.jsx'

// ─── Constants ───────────────────────────────────────────────────
const A4_WIDTH_PX   = 794    // 210mm at 96 dpi
const A4_HEIGHT_PX  = 1123   // 297mm at 96 dpi
const DESKTOP_SCALE = 0.84

// Scaled visual dimensions (what the user sees on screen)
const SCALED_WIDTH  = Math.round(A4_WIDTH_PX  * DESKTOP_SCALE)  // 667px
const SCALED_HEIGHT = Math.round(A4_HEIGHT_PX * DESKTOP_SCALE)  // 943px

// ─── TemplateRenderer ─────────────────────────────────────────────
// key includes theme.id so React re-renders on theme change too
function TemplateRenderer({ cv, template, theme }) {
  const animKey = `${template}-${theme?.id || 'default'}`

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={animKey}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        style={{ width: '100%' }}
      >
        {template === 'modern'
          ? <ModernTemplate    cv={cv} theme={theme} />
          : template === 'executive'
          ? <ExecutiveTemplate cv={cv} theme={theme} />
          : <ClassicTemplate   cv={cv} theme={theme} />
        }
      </motion.div>
    </AnimatePresence>
  )
}

// ─── CVContent ────────────────────────────────────────────────────
// This is the ONLY element with id="cv-preview".
// It is ALWAYS 794px wide and NEVER has a transform applied.
// html2canvas targets this element directly for PDF export.
function CVContent({ cv, template, theme }) {
  return (
    <div
      id="cv-preview"
      style={{
        width:      `${A4_WIDTH_PX}px`,
        minWidth:   `${A4_WIDTH_PX}px`,
        maxWidth:   `${A4_WIDTH_PX}px`,
        background: '#ffffff',
        position:   'relative',
        boxSizing:  'border-box',
        // ⚠️ NO transform, NO overflow:hidden, NO fixed height
        // These would break html2canvas capture
      }}
    >
      <TemplateRenderer cv={cv} template={template} theme={theme} />
    </div>
  )
}

// ─── CVPreview ────────────────────────────────────────────────────
/**
 * Props:
 *   cv       — full CV state
 *   template — 'classic' | 'modern' | 'executive'
 *   theme    — { id, primary, accent, accentLight, headerBg, headerText }
 *   scaled   — true  → desktop: scale(0.84) applied on a WRAPPER (never on #cv-preview)
 *              false → raw 794px; parent (mobile/tablet) handles its own transform
 */
export function CVPreview({ cv, template, theme, scaled = true }) {
  const [cvHeight, setCvHeight] = useState(A4_HEIGHT_PX)
  const containerRef = useRef(null)

  // Track dynamic height of the CV content
  useEffect(() => {
    const el = document.getElementById('cv-preview')
    if (!el) return

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        // Use scrollHeight or offsetHeight to get the true height
        setCvHeight(entry.target.offsetHeight || A4_HEIGHT_PX)
      }
    })
    
    observer.observe(el)
    return () => observer.disconnect()
  }, [cv, template])

  // ── Raw / unscaled mode ──────────────────────────────────────────
  // Used by MobilePreviewScaled and TabletPreviewScaled in App.jsx.
  // Parent applies transform: scale(...) on its own wrapper.
  if (!scaled) {
    return (
      <div style={{ width: `${A4_WIDTH_PX}px`, minWidth: `${A4_WIDTH_PX}px` }}>
        <CVContent cv={cv} template={template} theme={theme} />
      </div>
    )
  }

  // ── Desktop scaled mode ──────────────────────────────────────────
  //
  // FIX: Instead of applying transform on the element itself
  // (which keeps its original layout space and causes clipping),
  // we use a two-div approach:
  //
  //  ┌──────────────────────────────────────────────────────────────┐
  //  │ outer  (SCALED_WIDTH × SCALED_HEIGHT)  ← layout space        │
  //  │  ┌────────────────────────────────────────────────────────┐  │
  //  │  │ inner  position:absolute, transform:scale(0.84)        │  │
  //  │  │  ┌──────────────────────────────────────────────────┐  │  │
  //  │  │  │ #cv-preview  794px wide, NO transform            │  │  │
  //  │  │  └──────────────────────────────────────────────────┘  │  │
  //  │  └────────────────────────────────────────────────────────┘  │
  //  └──────────────────────────────────────────────────────────────┘
  //
  // The outer div declares the VISUAL (scaled) dimensions so the
  // scroll container knows exactly how much space to allocate.
  // The inner div applies the transform and sits absolutely inside.
  // This prevents both clipping and incorrect scroll height.

  const dynamicScaledHeight = Math.round(cvHeight * DESKTOP_SCALE)

  return (
    <div
      ref={containerRef}
      style={{
        // Declare the post-scale visual footprint dynamically
        width:    `${SCALED_WIDTH}px`,
        height:   `${dynamicScaledHeight}px`,
        minWidth: `${SCALED_WIDTH}px`,
        position: 'relative',
        flexShrink: 0,
        transition: 'height 0.2s ease', // Smooth height adjustments
      }}
    >
      {/* Scale wrapper — transform lives here, NEVER on #cv-preview */}
      <div
        data-export-ignore-scale="true"
        style={{
          position:        'absolute',
          top:             0,
          left:            0,
          transformOrigin: 'top left',
          transform:       `scale(${DESKTOP_SCALE})`,
          width:           `${A4_WIDTH_PX}px`,
          borderRadius:    '4px',
          overflow:        'visible',          // never clip content
          boxShadow: [
            '0 0 0 1px rgba(0,0,0,0.06)',
            '0 2px 4px rgba(0,0,0,0.06)',
            '0 8px 24px rgba(0,0,0,0.12)',
            '0 24px 64px rgba(0,0,0,0.18)',
            '0 48px 96px rgba(0,0,0,0.14)',
          ].join(', '),
        }}
      >
        <CVContent cv={cv} template={template} theme={theme} />
      </div>
    </div>
  )
}