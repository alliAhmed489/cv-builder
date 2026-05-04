import { Input } from '../ui/Input.jsx'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

export function SummaryForm({ summary, updateSummary }) {
  const { t } = useTranslation()

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
    >
      {/* Tip box */}
      <div style={{
        padding: '12px 16px', borderRadius: '12px',
        background: 'rgba(201,168,76,0.06)',
        border: '1px solid rgba(201,168,76,0.15)',
      }}>
        <p style={{ margin: 0, fontSize: '12px', color: 'rgba(201,168,76,0.8)', lineHeight: 1.65 }}>
          💡 <strong style={{ color: '#c9a84c' }}>Tip:</strong> Write 3–4 sentences highlighting
          your experience, core strengths, and what makes you unique.
        </p>
      </div>

      <Input
        dark
        label={t('summary.title')}
        id="sf-summary"
        value={summary}
        onChange={e => updateSummary(e.target.value)}
        placeholder={t('summary.placeholder')}
        rows={8}
      />

      {/* Character count */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '8px' }}>
        <div style={{
          height: '3px', flex: 1, borderRadius: '99px',
          background: 'rgba(255,255,255,0.06)', overflow: 'hidden',
        }}>
          <div style={{
            height: '100%', borderRadius: '99px', transition: 'all 0.3s ease',
            width: `${Math.min((summary.length / 600) * 100, 100)}%`,
            background: summary.length > 600 ? '#f87171' : summary.length > 300 ? '#c9a84c' : 'rgba(255,255,255,0.2)',
          }} />
        </div>
        <span style={{
          fontSize: '11px', minWidth: '70px', textAlign: 'right',
          color: summary.length > 600 ? '#f87171' : 'rgba(255,255,255,0.25)',
        }}>
          {summary.length} / 600
        </span>
      </div>
    </motion.div>
  )
}