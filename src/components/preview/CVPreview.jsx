import { motion, AnimatePresence } from 'framer-motion'
import { ClassicTemplate }   from '../templates/ClassicTemplate.jsx'
import { ModernTemplate }    from '../templates/ModernTemplate.jsx'
import { ExecutiveTemplate } from '../templates/ExecutiveTemplate.jsx'

// ─────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────
const A4_WIDTH_PX   = 794   // 210mm at 96dpi
const DESKTOP_SCALE = 0.84

// ─────────────────────────────────────────────────────────────────
// Template renderer
// ─────────────────────────────────────────────────────────────────
function TemplateRenderer({ cv, template, theme }) {
  const props = { cv, theme }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={template}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18, ease: 'easeInOut' }}
        style={{ width: '100%' }}
      >
        {template === 'modern'    ? <ModernTemplate    {...props} /> :
         template === 'executive' ? <ExecutiveTemplate {...props} /> :
                                    <ClassicTemplate   {...props} />}
      </motion.div>
    </AnimatePresence>
  )
}

// ─────────────────────────────────────────────────────────────────
// CV content wrapper — always 794px, always #cv-preview
// html2canvas targets this element directly
// transform is NEVER applied here
// ─────────────────────────────────────────────────────────────────
function CVContent({ cv, template, theme }) {
  return (
    <div
      id="cv-preview"
      data-cv-content="true"
      style={{
        width:      `${A4_WIDTH_PX}px`,
        minWidth:   `${A4_WIDTH_PX}px`,
        maxWidth:   `${A4_WIDTH_PX}px`,
        background: '#ffffff',
        // No transform, no scale, no overflow: hidden
        // This ensures html2canvas captures the full content
        position:   'relative',
        boxSizing:  'border-box',
      }}
    >
      <TemplateRenderer cv={cv} template={template} theme={theme} />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
// CVPreview — main export
//
// Props:
//   cv       — full CV data object
//   template — 'classic' | 'modern' | 'executive'
//   theme    — theme object { primary, accent, accentLight, ... }
//   scaled   — boolean (default: true)
//              true  → desktop display with scale(0.84)
//              false → raw 794px, used by mobile preview wrappers
// ─────────────────────────────────────────────────────────────────
export function CVPreview({ cv, template, theme, scaled = true }) {

  // ── Raw mode: no transform, no shadow ──
  // Used by MobilePreviewScaled / TabletPreviewScaled
  // Parent handles the CSS transform externally
  if (!scaled) {
    return (
      <div
        data-export-ignore-scale="true"
        style={{
          width:     `${A4_WIDTH_PX}px`,
          minWidth:  `${A4_WIDTH_PX}px`,
          overflow:  'hidden',
          borderRadius: '3px',
        }}
      >
        <CVContent cv={cv} template={template} theme={theme} />
      </div>
    )
  }

  // ── Scaled mode: desktop display ──
  // Outer wrapper handles visual scale — transform is here, NOT on #cv-preview
  // marginBottom compensates for the space lost due to scale-down
  const marginCompensation = -(A4_WIDTH_PX * (1 - DESKTOP_SCALE) * 0.5)

  return (
    <div
      data-export-ignore-scale="true"
      style={{
        // Visual scaling for screen only — NEVER affects export
        transform:       `scale(${DESKTOP_SCALE})`,
        transformOrigin: 'top center',
        marginBottom:    `${marginCompensation}px`,

        // Fixed A4 width
        width:    `${A4_WIDTH_PX}px`,
        minWidth: `${A4_WIDTH_PX}px`,

        // Visual styling
        borderRadius: '3px',
        overflow:     'hidden',
        boxShadow: [
          '0 0 0 1px rgba(0,0,0,0.06)',
          '0 2px 4px rgba(0,0,0,0.06)',
          '0 8px 24px rgba(0,0,0,0.12)',
          '0 24px 64px rgba(0,0,0,0.18)',
          '0 48px 96px rgba(0,0,0,0.14)',
        ].join(', '),
      }}
    >
      {/*
        ┌─────────────────────────────────┐
        │  data-export-ignore-scale       │  ← transform lives here
        │  ┌─────────────────────────┐    │
        │  │  id="cv-preview"        │    │  ← html2canvas targets this
        │  │  width: 794px (fixed)   │    │  ← NO transform here
        │  │  <TemplateRenderer />   │    │
        │  └─────────────────────────┘    │
        └─────────────────────────────────┘
      */}
      <CVContent cv={cv} template={template} theme={theme} />
    </div>
  )
}