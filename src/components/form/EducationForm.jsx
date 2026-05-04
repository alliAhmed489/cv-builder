import { motion, AnimatePresence } from 'framer-motion'
import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Input } from '../ui/Input.jsx'
import { SectionCard } from '../ui/SectionCard.jsx'

export function EducationForm({ education, addEducation, updateEducation, removeEducation }) {
  const { t } = useTranslation()
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}
    >
      {/* Empty state */}
      {education.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ textAlign: 'center', padding: '32px 16px', borderRadius: '14px', border: '1px dashed rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)' }}
        >
          <p style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: 600, color: 'rgba(255,255,255,0.5)' }}>{t('education.empty')}</p>
          <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255,255,255,0.25)' }}>{t('education.empty_hint')}</p>
        </motion.div>
      )}

      {/* Cards */}
      <AnimatePresence>
        {education.map((edu, idx) => (
          <SectionCard
            key={edu.id}
            title={edu.institution || t('education.institution')}
            subtitle={[edu.degree, edu.field].filter(Boolean).join(' in ')}
            onRemove={() => removeEducation(edu.id)}
            defaultOpen={idx === 0}
          >
            <Input dark label={t('education.institution')} id={`ei-${edu.id}`}
              value={edu.institution}
              onChange={e => updateEducation(edu.id, 'institution', e.target.value)}
              placeholder={t('education.institution_placeholder')} />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Input dark label={t('education.degree')} id={`ed-${edu.id}`}
                value={edu.degree}
                onChange={e => updateEducation(edu.id, 'degree', e.target.value)}
                placeholder={t('education.degree_placeholder')} />
              <Input dark label={t('education.field')} id={`ef-${edu.id}`}
                value={edu.field}
                onChange={e => updateEducation(edu.id, 'field', e.target.value)}
                placeholder={t('education.field_placeholder')} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Input dark label={t('education.start_date')} id={`es-${edu.id}`} type="month"
                value={edu.start}
                onChange={e => updateEducation(edu.id, 'start', e.target.value)} />
              <Input dark label={t('education.end_date')} id={`ee-${edu.id}`} type="month"
                value={edu.end}
                onChange={e => updateEducation(edu.id, 'end', e.target.value)} />
            </div>

            <Input dark label={t('education.gpa')} id={`eg-${edu.id}`}
              value={edu.gpa}
              onChange={e => updateEducation(edu.id, 'gpa', e.target.value)}
              placeholder={t('education.gpa_placeholder')} />
          </SectionCard>
        ))}
      </AnimatePresence>

      {/* Add button */}
      <motion.button
        onClick={addEducation}
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
        <Plus size={15} /> {t('education.add')}
      </motion.button>
    </motion.div>
  )
}