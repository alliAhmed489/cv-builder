import { motion, AnimatePresence } from 'framer-motion'
import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Input } from '../ui/Input.jsx'
import { SectionCard } from '../ui/SectionCard.jsx'

const LEVELS = ['Native', 'Fluent', 'Advanced', 'Intermediate', 'Basic']

export function LanguagesForm({ languages, addLanguage, updateLanguage, removeLanguage }) {
  const { t } = useTranslation()
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}
    >
      {/* Empty state */}
      {languages.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ textAlign: 'center', padding: '32px 16px', borderRadius: '14px', border: '1px dashed rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)' }}
        >
          <p style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: 600, color: 'rgba(255,255,255,0.5)' }}>{t('languages.empty')}</p>
          <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255,255,255,0.25)' }}>{t('languages.empty_hint')}</p>
        </motion.div>
      )}

      {/* Cards */}
      <AnimatePresence>
        {languages.map(lang => (
          <SectionCard
            key={lang.id}
            title={lang.name || t('languages.name')}
            subtitle={lang.level}
            onRemove={() => removeLanguage(lang.id)}
            defaultOpen
          >
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Input dark label={t('languages.name')} id={`ln-${lang.id}`}
                value={lang.name}
                onChange={e => updateLanguage(lang.id, 'name', e.target.value)}
                placeholder={t('languages.name_placeholder')} />

              {/* Custom select */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                <label style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1.2px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>
                  {t('languages.level')}
                </label>
                <select
                  value={lang.level}
                  onChange={e => updateLanguage(lang.id, 'level', e.target.value)}
                  style={{
                    width: '100%', padding: '11px 14px', borderRadius: '10px',
                    border: '1.5px solid rgba(255,255,255,0.08)',
                    background: 'rgba(255,255,255,0.04)',
                    color: 'rgba(255,255,255,0.85)', fontSize: '13px',
                    fontFamily: "'DM Sans', sans-serif", outline: 'none',
                    cursor: 'pointer', transition: 'all 0.2s ease',
                  }}
                  onFocus={e => { e.target.style.borderColor = 'rgba(201,168,76,0.7)'; e.target.style.boxShadow = '0 0 0 3px rgba(201,168,76,0.1)' }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none' }}
                >
                  {LEVELS.map(l => <option key={l} value={l} style={{ background: '#1a1a2e' }}>{t(`languages.levels.${l}`)}</option>)}
                </select>
              </div>
            </div>
          </SectionCard>
        ))}
      </AnimatePresence>

      {/* Add button */}
      <motion.button
        onClick={addLanguage}
        whileHover={{ scale: 1.02, borderColor: 'rgba(201,168,76,0.5)' }}
        whileTap={{ scale: 0.97 }}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          padding: '12px', borderRadius: '12px', border: '1.5px dashed rgba(255,255,255,0.12)',
          background: 'rgba(255,255,255,0.02)', color: 'rgba(255,255,255,0.4)',
          fontSize: '13px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
          marginTop: '4px', transition: 'all 0.2s ease', width: '100%',
        }}
      >
        <Plus size={15} /> {t('languages.add')}
      </motion.button>
    </motion.div>
  )
}