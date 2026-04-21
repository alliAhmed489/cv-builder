import { motion, AnimatePresence } from 'framer-motion'
import { ClassicTemplate }   from '../templates/ClassicTemplate.jsx'
import { ModernTemplate }    from '../templates/ModernTemplate.jsx'
import { ExecutiveTemplate } from '../templates/ExecutiveTemplate.jsx'

export function CVPreview({ cv, template, theme }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="cv-shadow"
      style={{
        width: '794px',
        minWidth: '794px',
        transform: 'scale(0.84)',
        transformOrigin: 'top center',
        marginBottom: '-128px',
        borderRadius: '4px',
        overflow: 'hidden',
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={template}
          id="cv-preview"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.2 }}
          style={{ background: '#ffffff', width: '794px' }}
        >
          {template === 'classic'   && <ClassicTemplate   cv={cv} theme={theme} />}
          {template === 'modern'    && <ModernTemplate    cv={cv} theme={theme} />}
          {template === 'executive' && <ExecutiveTemplate cv={cv} theme={theme} />}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}