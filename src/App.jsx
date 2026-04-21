import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, RefreshCw, FileText, User, AlignLeft, Briefcase, GraduationCap, Zap, Globe, Sparkles } from 'lucide-react'
import { useCV } from './hooks/useCV.js'
import { exportPDF } from './utils/exportPDF.js'
import { THEMES } from './data/themes.js'
import { AnimatedStep } from './components/ui/AnimatedStep.jsx'
import { AIModal } from './components/ui/AIModal.jsx'
import { PersonalForm } from './components/form/PersonalForm.jsx'
import { SummaryForm } from './components/form/SummaryForm.jsx'
import { ExperienceForm } from './components/form/ExperienceForm.jsx'
import { EducationForm } from './components/form/EducationForm.jsx'
import { SkillsForm } from './components/form/SkillsForm.jsx'
import { LanguagesForm } from './components/form/LanguagesForm.jsx'
import { CVPreview } from './components/preview/CVPreview.jsx'

const STEPS = [
  { id: 'personal',   label: 'Personal',   icon: User },
  { id: 'summary',    label: 'Summary',     icon: AlignLeft },
  { id: 'experience', label: 'Experience',  icon: Briefcase },
  { id: 'education',  label: 'Education',   icon: GraduationCap },
  { id: 'skills',     label: 'Skills',      icon: Zap },
  { id: 'languages',  label: 'Languages',   icon: Globe },
]

const TEMPLATES = ['classic', 'modern', 'executive']

export default function App() {
  const [activeStep, setActiveStep] = useState('personal')
  const [exporting, setExporting]   = useState(false)
  const [themeId, setThemeId]       = useState('navy')
  const [showThemes, setShowThemes] = useState(false)
  const [showAI, setShowAI]         = useState(false)

  const cvHook = useCV()
  const { cv, template, setTemplate, resetCV } = cvHook

  const activeTheme = THEMES.find(t => t.id === themeId) || THEMES[0]
  const activeIndex = STEPS.findIndex(s => s.id === activeStep)

  async function handleExport() {
    setExporting(true)
    await exportPDF(cv.personal.name || 'my-cv')
    setExporting(false)
  }

  function renderStep() {
    const props = { dark: true }
    switch (activeStep) {
      case 'personal':   return <PersonalForm   personal={cv.personal}     updatePersonal={cvHook.updatePersonal} />
      case 'summary':    return <SummaryForm     summary={cv.summary}       updateSummary={cvHook.updateSummary} />
      case 'experience': return <ExperienceForm  experience={cv.experience} addExperience={cvHook.addExperience} updateExperience={cvHook.updateExperience} removeExperience={cvHook.removeExperience} />
      case 'education':  return <EducationForm   education={cv.education}   addEducation={cvHook.addEducation}   updateEducation={cvHook.updateEducation}   removeEducation={cvHook.removeEducation} />
      case 'skills':     return <SkillsForm      skills={cv.skills}         addSkill={cvHook.addSkill}           removeSkill={cvHook.removeSkill} />
      case 'languages':  return <LanguagesForm   languages={cv.languages}   addLanguage={cvHook.addLanguage}     updateLanguage={cvHook.updateLanguage}     removeLanguage={cvHook.removeLanguage} />
      default: return null
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: '#0f0f1e', fontFamily: '"DM Sans", sans-serif' }}>

      {/* ══════════ TOP BAR ══════════ */}
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', height: '56px', background: '#1a1a2e', borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0, gap: '12px' }}>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '9px', background: 'linear-gradient(135deg, #c9a84c, #e8cc7a)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(201,168,76,0.4)' }}>
            <FileText size={15} color="#1a1a2e" />
          </div>
          <div>
            <span style={{ fontSize: '15px', fontWeight: 700, color: '#fff', letterSpacing: '-0.3px' }}>CVcraft</span>
            <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', marginLeft: '6px' }}>Pro</span>
          </div>
        </div>

        {/* Step tabs */}
        <nav style={{ display: 'flex', gap: '2px', flex: 1, justifyContent: 'center' }}>
          {STEPS.map((step, idx) => {
            const Icon = step.icon
            const active  = activeStep === step.id
            const done    = idx < activeIndex
            return (
              <motion.button
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '5px',
                  padding: '5px 13px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                  background: active ? '#c9a84c' : done ? 'rgba(201,168,76,0.1)' : 'transparent',
                  color: active ? '#1a1a2e' : done ? '#c9a84c' : 'rgba(255,255,255,0.4)',
                  fontSize: '12px', fontWeight: active ? 700 : 500,
                  fontFamily: '"DM Sans", sans-serif', transition: 'all 0.2s ease',
                  position: 'relative',
                }}
              >
                <Icon size={12} />
                {step.label}
                {done && !active && (
                  <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#c9a84c', position: 'absolute', top: '4px', right: '4px' }} />
                )}
              </motion.button>
            )
          })}
        </nav>

        {/* Right actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>

          {/* Template */}
          <div style={{ display: 'flex', gap: '2px', background: 'rgba(255,255,255,0.06)', borderRadius: '9px', padding: '3px' }}>
            {TEMPLATES.map(t => (
              <motion.button key={t} onClick={() => setTemplate(t)} whileTap={{ scale: 0.95 }}
                style={{ padding: '4px 11px', borderRadius: '7px', border: 'none', cursor: 'pointer', background: template === t ? 'rgba(255,255,255,0.12)' : 'transparent', color: template === t ? '#fff' : 'rgba(255,255,255,0.35)', fontSize: '11px', fontWeight: template === t ? 600 : 400, fontFamily: '"DM Sans", sans-serif', textTransform: 'capitalize', transition: 'all 0.2s ease' }}>
                {t}
              </motion.button>
            ))}
          </div>

          {/* Theme */}
          <div style={{ position: 'relative' }}>
            <motion.button onClick={() => setShowThemes(s => !s)} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '5px 11px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.65)', fontSize: '11px', cursor: 'pointer', fontFamily: '"DM Sans", sans-serif' }}>
              <div style={{ width: '11px', height: '11px', borderRadius: '50%', background: activeTheme.accent }} />
              {activeTheme.name}
            </motion.button>

            <AnimatePresence>
              {showThemes && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  style={{ position: 'absolute', top: '38px', right: 0, background: '#1e1e35', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '8px', zIndex: 200, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3px', width: '210px', boxShadow: '0 12px 40px rgba(0,0,0,0.5)' }}>
                  {THEMES.map(th => (
                    <button key={th.id} onClick={() => { setThemeId(th.id); setShowThemes(false) }}
                      style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', borderRadius: '8px', border: 'none', cursor: 'pointer', background: themeId === th.id ? 'rgba(255,255,255,0.08)' : 'transparent', color: '#fff', fontSize: '11px', fontFamily: '"DM Sans", sans-serif', transition: 'background 0.15s', textAlign: 'left' }}>
                      <div style={{ width: '13px', height: '13px', borderRadius: '50%', background: th.accent, flexShrink: 0, boxShadow: `0 0 6px ${th.accent}60` }} />
                      {th.name}
                      {themeId === th.id && <span style={{ marginLeft: 'auto', fontSize: '10px', color: '#c9a84c' }}>✓</span>}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* AI Button */}
          <motion.button onClick={() => setShowAI(true)} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 13px', borderRadius: '8px', border: '1px solid rgba(201,168,76,0.35)', background: 'rgba(201,168,76,0.1)', color: '#c9a84c', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif' }}>
            <Sparkles size={13} /> AI Coach
          </motion.button>

          {/* Reset */}
          <motion.button onClick={resetCV} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}
            style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 11px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'rgba(255,255,255,0.4)', fontSize: '11px', cursor: 'pointer', fontFamily: '"DM Sans", sans-serif' }}>
            <RefreshCw size={11} /> Reset
          </motion.button>

          {/* Download */}
          <motion.button onClick={handleExport} disabled={exporting} whileHover={{ scale: 1.04, boxShadow: '0 4px 20px rgba(201,168,76,0.4)' }} whileTap={{ scale: 0.96 }}
            style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '7px 16px', borderRadius: '9px', border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg, #c9a84c, #e8cc7a)', color: '#1a1a2e', fontSize: '12px', fontWeight: 700, fontFamily: '"DM Sans", sans-serif', opacity: exporting ? 0.6 : 1, boxShadow: '0 2px 12px rgba(201,168,76,0.3)' }}>
            <Download size={13} />
            {exporting ? 'Exporting…' : 'Download PDF'}
          </motion.button>
        </div>
      </header>

      {/* Progress bar */}
      <div style={{ height: '2px', background: 'rgba(255,255,255,0.06)', flexShrink: 0 }}>
        <motion.div
          style={{ height: '100%', background: 'linear-gradient(90deg, #c9a84c, #e8cc7a)', transformOrigin: 'left' }}
          animate={{ width: `${((activeIndex + 1) / STEPS.length) * 100}%` }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        />
      </div>

      {/* ══════════ MAIN ══════════ */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* Form Panel */}
        <div style={{ width: '420px', flexShrink: 0, display: 'flex', flexDirection: 'column', background: '#1a1a2e', borderRight: '1px solid rgba(255,255,255,0.06)' }}>

          {/* Section header */}
          <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {(() => { const Icon = STEPS[activeIndex].icon; return (
                <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={14} color="#c9a84c" />
                </div>
              )})()}
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>
                {STEPS[activeIndex].label}
              </span>
            </div>
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)', background: 'rgba(255,255,255,0.05)', padding: '3px 10px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)' }}>
              {activeIndex + 1} / {STEPS.length}
            </span>
          </div>

          {/* Scrollable form with animation */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
            <AnimatedStep stepKey={activeStep}>
              {renderStep()}
            </AnimatedStep>
          </div>

          {/* Prev / Next footer */}
          <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.06)', background: '#16162a', flexShrink: 0 }}>

            {/* Dots */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '5px', marginBottom: '14px' }}>
              {STEPS.map((_, i) => (
                <motion.div key={i} onClick={() => setActiveStep(STEPS[i].id)}
                  animate={{ width: i === activeIndex ? '20px' : '6px', background: i === activeIndex ? '#c9a84c' : i < activeIndex ? 'rgba(201,168,76,0.4)' : 'rgba(255,255,255,0.12)' }}
                  transition={{ duration: 0.2 }}
                  style={{ height: '6px', borderRadius: '3px', cursor: 'pointer' }}
                />
              ))}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <motion.button
                onClick={() => { if (activeIndex > 0) setActiveStep(STEPS[activeIndex - 1].id) }}
                disabled={activeIndex === 0}
                whileHover={{ scale: activeIndex === 0 ? 1 : 1.02 }}
                whileTap={{ scale: activeIndex === 0 ? 1 : 0.97 }}
                style={{ flex: '0 0 auto', padding: '11px 20px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)', fontSize: '13px', cursor: activeIndex === 0 ? 'not-allowed' : 'pointer', fontFamily: '"DM Sans", sans-serif', opacity: activeIndex === 0 ? 0.3 : 1, transition: 'opacity 0.2s' }}>
                ← Prev
              </motion.button>

              <motion.button
                onClick={() => { if (activeIndex < STEPS.length - 1) setActiveStep(STEPS[activeIndex + 1].id) }}
                disabled={activeIndex === STEPS.length - 1}
                whileHover={{ scale: activeIndex === STEPS.length - 1 ? 1 : 1.02, boxShadow: activeIndex === STEPS.length - 1 ? 'none' : '0 4px 16px rgba(201,168,76,0.35)' }}
                whileTap={{ scale: 0.97 }}
                style={{
                  flex: 1, padding: '12px', borderRadius: '10px', border: 'none',
                  background: activeIndex === STEPS.length - 1
                    ? 'rgba(255,255,255,0.06)'
                    : 'linear-gradient(135deg, #c9a84c, #e8cc7a)',
                  color: activeIndex === STEPS.length - 1 ? 'rgba(255,255,255,0.25)' : '#1a1a2e',
                  fontSize: '13px', fontWeight: 700, cursor: activeIndex === STEPS.length - 1 ? 'not-allowed' : 'pointer',
                  fontFamily: '"DM Sans", sans-serif',
                  boxShadow: activeIndex === STEPS.length - 1 ? 'none' : '0 2px 10px rgba(201,168,76,0.25)',
                }}>
                {activeIndex === STEPS.length - 1 ? '✓ All Done' : 'Next Step →'}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        <div
          style={{ flex: 1, overflowY: 'auto', overflowX: 'auto', padding: '40px 32px', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', background: 'linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 50%, #0f0f1e 100%)' }}
          onClick={() => showThemes && setShowThemes(false)}
        >
          <CVPreview cv={cv} template={template} theme={activeTheme} />
        </div>
      </div>

      {/* AI Modal */}
      {showAI && <AIModal cv={cv} onClose={() => setShowAI(false)} />}
    </div>
  )
}