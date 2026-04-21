import { motion, AnimatePresence } from 'framer-motion'
import { Plus } from 'lucide-react'
import { Input } from '../ui/Input.jsx'
import { SectionCard } from '../ui/SectionCard.jsx'

export function ExperienceForm({ experience, addExperience, updateExperience, removeExperience }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}
    >
      {/* Empty state */}
      {experience.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ textAlign: 'center', padding: '32px 16px', borderRadius: '14px', border: '1px dashed rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)' }}
        >
          <p style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: 600, color: 'rgba(255,255,255,0.5)' }}>No experience added</p>
          <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255,255,255,0.25)' }}>Click below to add your first role</p>
        </motion.div>
      )}

      {/* Cards */}
      <AnimatePresence>
        {experience.map((exp, idx) => (
          <SectionCard
            key={exp.id}
            title={exp.role || 'New Position'}
            subtitle={exp.company}
            onRemove={() => removeExperience(exp.id)}
            defaultOpen={idx === 0}
          >
            <Input dark label="Company" id={`ec-${exp.id}`}
              value={exp.company} onChange={e => updateExperience(exp.id, 'company', e.target.value)}
              placeholder="Google" />

            <Input dark label="Job Title" id={`er-${exp.id}`}
              value={exp.role} onChange={e => updateExperience(exp.id, 'role', e.target.value)}
              placeholder="Senior Software Engineer" />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Input dark label="Start Date" id={`es-${exp.id}`} type="month"
                value={exp.start} onChange={e => updateExperience(exp.id, 'start', e.target.value)} />
              <Input dark label="End Date" id={`ee-${exp.id}`} type="month"
                value={exp.end} onChange={e => updateExperience(exp.id, 'end', e.target.value)} />
            </div>

            {/* Currently working */}
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <div
                onClick={() => updateExperience(exp.id, 'current', !exp.current)}
                style={{
                  width: '36px', height: '20px', borderRadius: '10px', flexShrink: 0,
                  background: exp.current ? '#c9a84c' : 'rgba(255,255,255,0.1)',
                  position: 'relative', cursor: 'pointer', transition: 'background 0.2s ease',
                }}
              >
                <motion.div
                  animate={{ x: exp.current ? 18 : 2 }}
                  transition={{ duration: 0.2 }}
                  style={{ position: 'absolute', top: '2px', width: '16px', height: '16px', borderRadius: '50%', background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }}
                />
              </div>
              <span style={{ fontSize: '12px', color: exp.current ? '#c9a84c' : 'rgba(255,255,255,0.45)' }}>
                Currently working here
              </span>
            </label>

            <Input dark label="Responsibilities & Achievements" id={`ed-${exp.id}`}
              value={exp.description}
              onChange={e => updateExperience(exp.id, 'description', e.target.value)}
              placeholder={"• Led redesign of dashboard, reducing tickets by 34%.\n• Managed a team of 4 designers across 3 squads."}
              rows={5}
              hint="Start each line with • for best formatting" />
          </SectionCard>
        ))}
      </AnimatePresence>

      {/* Add button */}
      <motion.button
        onClick={addExperience}
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
        <Plus size={15} /> Add Experience
      </motion.button>
    </motion.div>
  )
}