import { motion, AnimatePresence } from 'framer-motion'
import { ClassicTemplate }   from '../templates/ClassicTemplate.jsx'
import { ModernTemplate }    from '../templates/ModernTemplate.jsx'
import { ExecutiveTemplate } from '../templates/ExecutiveTemplate.jsx'

/**
 * CVPreview — renders the active CV template.
 * Used for both the on-screen preview and PDF export (id="cv-preview").
 *
 * On desktop: scaled down via CSS transform for display.
 * On mobile/tablet: parent handles scaling externally.
 *
 * Props:
 *   cv       — full CV state
 *   template — 'classic' | 'modern' | 'executive'
 *   theme    — theme object from themes.js
 *   scaled   — if true, apply desktop scale transform (default: true)
 */
export function CVPreview({ cv, template, theme, scaled = true }) {
  const content = (
    <div id="cv-preview" style={{ background: '#ffffff', width: '794px' }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={template}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.2 }}
        >
          {template === 'classic'   && <ClassicTemplate   cv={cv} theme={theme} />}
          {template === 'modern'    && <ModernTemplate    cv={cv} theme={theme} />}
          {template === 'executive' && <ExecutiveTemplate cv={cv} theme={theme} />}
          {/* Fallback if template not matched */}
          {!['classic','modern','executive'].includes(template) && <ClassicTemplate cv={cv} theme={theme} />}
        </motion.div>
      </AnimatePresence>
    </div>
  )

  if (!scaled) {
  return (
    <div
      style={{
        width: '794px',
        maxWidth: '100%',   // 👈 مهم جدًا
        background: '#fff',
        borderRadius: '4px',
        overflow: 'hidden',
      }}
    >
      {content}
    </div>
  )
}

  // Desktop: scale 0.84 for screen display
  return (
    <div
      style={{
        width: '794px',
        minWidth: '794px',
        transform: 'scale(0.84)',
        transformOrigin: 'top left',
        marginBottom: '-128px',
        borderRadius: '4px',
        overflow: 'hidden',
        boxShadow: '0 0 0 1px rgba(0,0,0,0.05), 0 4px 6px rgba(0,0,0,0.05), 0 12px 40px rgba(0,0,0,0.15), 0 40px 80px rgba(0,0,0,0.2)',
      }}
    >
      {content}
    </div>
  )
}
