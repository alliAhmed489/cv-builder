import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function SectionCard({ title, subtitle, onRemove, children, defaultOpen = true }) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(defaultOpen)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8, scale: 0.98 }}
      transition={{ duration: 0.22 }}
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '14px',
        overflow: 'hidden',
        marginBottom: '12px',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          padding: '13px 16px',
          background: open ? 'rgba(201,168,76,0.04)' : 'transparent',
          borderBottom: open ? '1px solid rgba(255,255,255,0.06)' : 'none',
          cursor: 'pointer',
          transition: 'background 0.2s ease',
        }}
        onClick={() => setOpen(o => !o)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
          <div style={{ width: '3px', height: '18px', borderRadius: '2px', background: open ? '#c9a84c' : 'rgba(255,255,255,0.15)', flexShrink: 0, transition: 'background 0.2s' }} />
          <div style={{ minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: open ? '#fff' : 'rgba(255,255,255,0.7)', transition: 'color 0.2s', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {title || t('app.untitled')}
            </p>
            {subtitle && (
              <p style={{ margin: '1px 0 0', fontSize: '11px', color: 'rgba(255,255,255,0.35)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {subtitle}
              </p>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
          {onRemove && (
            <button
              type="button"
              onClick={e => { e.stopPropagation(); onRemove() }}
              style={{ width: '28px', height: '28px', borderRadius: '7px', border: 'none', background: 'rgba(239,68,68,0.1)', color: 'rgba(239,68,68,0.7)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.2)'; e.currentTarget.style.color = '#f87171' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = 'rgba(239,68,68,0.7)' }}
            >
              <Trash2 size={12} />
            </button>
          )}
          <motion.div
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            style={{ color: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center' }}
          >
            <ChevronDown size={15} />
          </motion.div>
        </div>
      </div>

      {/* Body */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '18px 18px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}