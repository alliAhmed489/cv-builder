import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Download, RefreshCw, FileText, User, AlignLeft,
  Briefcase, GraduationCap, Zap, Globe, Sparkles,
  ChevronLeft, ChevronRight, GripVertical
} from 'lucide-react'
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor, TouchSensor, useSensor, useSensors
} from '@dnd-kit/core'
import {
  SortableContext, arrayMove, sortableKeyboardCoordinates, horizontalListSortingStrategy, useSortable
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useCV } from './hooks/useCV.js'
import { exportPDF } from './utils/exportPDF.js'
import { THEMES } from './data/themes.js'
import { AnimatedStep } from './components/ui/AnimatedStep.jsx'
import { ScorePanel } from './components/ui/ScorePanel.jsx'
import { AIModal } from './components/ui/AIModal.jsx'
import { LanguageSwitcher } from './components/ui/LanguageSwitcher.jsx'
import { PersonalForm } from './components/form/PersonalForm.jsx'
import { SummaryForm } from './components/form/SummaryForm.jsx'
import { ExperienceForm } from './components/form/ExperienceForm.jsx'
import { EducationForm } from './components/form/EducationForm.jsx'
import { SkillsForm } from './components/form/SkillsForm.jsx'
import { LanguagesForm } from './components/form/LanguagesForm.jsx'
import { CVPreview } from './components/preview/CVPreview.jsx'

const INITIAL_STEPS = [
  { id: 'personal',   label: 'Personal',   icon: User },
  { id: 'summary',    label: 'Summary',     icon: AlignLeft },
  { id: 'experience', label: 'Experience',  icon: Briefcase },
  { id: 'education',  label: 'Education',   icon: GraduationCap },
  { id: 'skills',     label: 'Skills',      icon: Zap },
  { id: 'languages',  label: 'Languages',   icon: Globe },
]

const TEMPLATES = ['classic', 'modern', 'executive']

function useBreakpoint() {
  const [bp, setBp] = useState(() => {
    const w = window.innerWidth
    return w < 768 ? 'mobile' : w < 1024 ? 'tablet' : 'desktop'
  })
  useEffect(() => {
    const handler = () => {
      const w = window.innerWidth
      setBp(w < 768 ? 'mobile' : w < 1024 ? 'tablet' : 'desktop')
    }
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])
  return bp
}

function SortableTab({ step, active, done, isTablet, isMobile, onClick }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: step.id })
  const { t, i18n } = useTranslation()

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    display: 'flex', alignItems: 'center', gap: isMobile ? '6px' : '4px',
    padding: isMobile ? '7px 12px' : (isTablet ? '5px 8px' : '5px 12px'),
    borderRadius: '8px', border: isDragging ? '1px solid #c9a84c' : '1px solid transparent',
    cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
    background: active ? '#c9a84c' : done ? 'rgba(201,168,76,0.12)' : (isMobile ? 'rgba(255,255,255,0.05)' : 'transparent'),
    color: active ? '#1a1a2e' : done ? '#c9a84c' : (isMobile ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.4)'),
    fontSize: isMobile ? '12px' : (isTablet ? '11px' : '12px'),
    fontWeight: active ? 700 : (isMobile ? 400 : 500),
    fontFamily: "'DM Sans', sans-serif",
    opacity: isDragging ? 0.6 : 1,
    boxShadow: isDragging ? '0 8px 16px rgba(0,0,0,0.3)' : 'none',
    zIndex: isDragging ? 10 : 1,
    position: 'relative'
  }

  const Icon = step.icon

  return (
    <div ref={setNodeRef} style={style}>
      <div {...attributes} {...listeners} style={{ cursor: 'grab', display: 'flex', alignItems: 'center', opacity: active ? 0.6 : 0.4 }}>
        <GripVertical size={13} />
      </div>
      <button onClick={onClick} style={{ background: 'none', border: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '5px', padding: 0, cursor: 'pointer', fontSize: 'inherit', fontWeight: 'inherit', fontFamily: 'inherit' }}>
        <Icon size={11} />
        {isMobile && t(`steps.${step.id}`)}
        {!isMobile && !isTablet && t(`steps.${step.id}`)}
        {!isMobile && isTablet && <span style={{ fontSize: '10px' }}>{i18n.language === 'ar' ? t(`steps.${step.id}`) : t(`steps.${step.id}`).slice(0, 3)}</span>}
      </button>
    </div>
  )
}

export default function App() {
  const [activeStep, setActiveStep] = useState('personal')
  const [exporting, setExporting]   = useState(false)
  const [themeId, setThemeId]       = useState('navy')
  const [showThemes, setShowThemes] = useState(false)
  const [showAI, setShowAI]         = useState(false)
  const [mobileTab, setMobileTab]   = useState('form')

  const [steps, setSteps]           = useState(INITIAL_STEPS)

  const cvHook = useCV()
  const { cv, template, setTemplate, resetCV } = cvHook
  const bp = useBreakpoint()

  const activeTheme = THEMES.find(t => t.id === themeId) || THEMES[0]
  const activeIndex = steps.findIndex(s => s.id === activeStep)
  const isMobile    = bp === 'mobile'
  const isTablet    = bp === 'tablet'

  const { t, i18n } = useTranslation()

  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = i18n.language
  }, [i18n.language])



  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (active.id !== over?.id) {
      setSteps((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id)
        const newIndex = items.findIndex((i) => i.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  // Prevent double-tap on mobile + proper error handling
  async function handleExport() {
    if (exporting) return
    setExporting(true)
    try {
      await exportPDF(cv.personal.name || 'my-cv')
    } catch (err) {
      console.error('[handleExport]', err)
      alert(t('app.export_failed'))
    } finally {
      setExporting(false)
    }
  }

  function renderStep() {
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

  const applyAI = (field, value) => {
    if (field === 'title')   cvHook.updatePersonal('title', value)
    if (field === 'summary') cvHook.updateSummary(value)
  }

  // ─────────────────────────────────────────────
  // MOBILE LAYOUT
  // ─────────────────────────────────────────────
  if (isMobile) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column',
        height: '100dvh', background: '#0a0a18',
        fontFamily: "'DM Sans', sans-serif", overflow: 'hidden',
      }}>

        {/* Header */}
        <header style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 16px', height: '52px', background: '#1a1a2e',
          borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0, zIndex: 50,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img src="/cv_builder_logo.svg" alt="CV Builder Logo" style={{ width: '28px', height: '28px' }} />
            <span style={{ fontSize: '15px', fontWeight: 700, color: '#fff' }}>CVcraft</span>
          </div>

          {/* Edit / Preview toggle & Language Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <LanguageSwitcher />
            <div style={{ display: 'flex', background: 'rgba(255,255,255,0.06)', borderRadius: '9px', padding: '3px', gap: '2px' }}>
            {['form', 'preview'].map(tab => (
              <button key={tab} onClick={() => setMobileTab(tab)} style={{
                padding: '5px 14px', borderRadius: '7px', border: 'none', cursor: 'pointer',
                background: mobileTab === tab ? '#c9a84c' : 'transparent',
                color: mobileTab === tab ? '#1a1a2e' : 'rgba(255,255,255,0.45)',
                fontSize: '12px', fontWeight: mobileTab === tab ? 700 : 400,
                fontFamily: "'DM Sans', sans-serif", transition: 'all 0.15s',
              }}>
                {tab === 'form' ? t('app.edit') : t('app.preview')}
              </button>
            ))}
            </div>
          </div>
        </header>

        {/* Progress bar */}
        <div style={{ height: '2px', background: 'rgba(255,255,255,0.06)', flexShrink: 0 }}>
          <motion.div
            style={{ height: '100%', background: 'linear-gradient(90deg, #c9a84c, #e8cc7a)' }}
            animate={{ width: `${((activeIndex + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.35 }}
          />
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
          <AnimatePresence mode="wait">

            {/* ── Edit tab ── */}
            {mobileTab === 'form' && (
              <motion.div key="form"
                initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.22 }}
                style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', background: '#1a1a2e' }}
              >
                {/* Step tabs — horizontal scroll */}
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={steps.map(s => s.id)} strategy={horizontalListSortingStrategy}>
                    <div style={{
                      display: 'flex', gap: '4px', padding: '10px 14px',
                      background: '#16162a', borderBottom: '1px solid rgba(255,255,255,0.06)',
                      overflowX: 'auto', flexShrink: 0, scrollbarWidth: 'none',
                    }}>
                      {steps.map((step, idx) => {
                        const active = activeStep === step.id
                        const done   = idx < activeIndex
                        return (
                          <SortableTab 
                            key={step.id} step={step} active={active} done={done}
                            isTablet={false} isMobile={true} onClick={() => setActiveStep(step.id)} 
                          />
                        )
                      })}
                    </div>
                  </SortableContext>
                </DndContext>

                {/* Section label */}
                <div style={{
                  padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {(() => { const Icon = steps[activeIndex]?.icon; return Icon ? <Icon size={14} color="#c9a84c" /> : null })()}
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>{t(`steps.${steps[activeIndex]?.id}`)}</span>
                  </div>
                  <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)', background: 'rgba(255,255,255,0.05)', padding: '3px 10px', borderRadius: '20px' }}>
                    {activeIndex + 1} / {steps.length}
                  </span>
                </div>

                {/* Form scroll — paddingBottom leaves room for sticky bar */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '16px', paddingBottom: '100px' }}>
                  <AnimatedStep stepKey={activeStep}>{renderStep()}</AnimatedStep>
                  <div style={{ marginTop: '24px', paddingBottom: '24px' }}>
                    <ScorePanel cv={cv} onImprove={setActiveStep} />
                  </div>
                </div>

                {/* Prev / Next */}
                <div style={{
                  padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.06)',
                  background: '#16162a', display: 'flex', gap: '10px', flexShrink: 0,
                }}>
                  <button
                    onClick={() => { if (activeIndex > 0) setActiveStep(steps[activeIndex - 1].id) }}
                    disabled={activeIndex === 0}
                    style={{
                      width: '44px', height: '44px', borderRadius: '10px',
                      border: '1px solid rgba(255,255,255,0.1)',
                      background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)',
                      cursor: activeIndex === 0 ? 'not-allowed' : 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      opacity: activeIndex === 0 ? 0.3 : 1, flexShrink: 0,
                    }}
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={() => { if (activeIndex < steps.length - 1) setActiveStep(steps[activeIndex + 1].id) }}
                    disabled={activeIndex === steps.length - 1}
                    style={{
                      flex: 1, height: '44px', borderRadius: '10px', border: 'none',
                      background: activeIndex === steps.length - 1 ? 'rgba(255,255,255,0.06)' : 'linear-gradient(135deg, #c9a84c, #e8cc7a)',
                      color: activeIndex === steps.length - 1 ? 'rgba(255,255,255,0.25)' : '#1a1a2e',
                      fontSize: '13px', fontWeight: 700,
                      cursor: activeIndex === steps.length - 1 ? 'not-allowed' : 'pointer',
                      fontFamily: "'DM Sans', sans-serif",
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
                    }}
                  >
                    {activeIndex === steps.length - 1 ? t('app.done') : <>{t('app.next')} <ChevronRight size={16} /></>}
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── Preview tab ── */}
            {mobileTab === 'preview' && (
              <motion.div key="preview"
                initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 24 }} transition={{ duration: 0.22 }}
                style={{
                  position: 'absolute', inset: 0,
                  overflowY: 'auto', overflowX: 'auto',  // scroll vertically AND horizontally
                  background: 'linear-gradient(135deg, #0f0f1e, #1a1a2e)',
                  padding: '16px', paddingBottom: '100px',
                }}
              >
                {/* Template + Theme selector row */}
                <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
                  {TEMPLATES.map(t => (
                    <button key={t} onClick={() => setTemplate(t)} style={{
                      padding: '6px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                      background: template === t ? '#c9a84c' : 'rgba(255,255,255,0.08)',
                      color: template === t ? '#1a1a2e' : 'rgba(255,255,255,0.5)',
                      fontSize: '11px', fontWeight: template === t ? 700 : 400,
                      fontFamily: "'DM Sans', sans-serif", textTransform: 'capitalize',
                    }}>
                      {t}
                    </button>
                  ))}
                  <div style={{ display: 'flex', gap: '6px', marginLeft: '4px' }}>
                    {THEMES.slice(0, 4).map(th => (
                      <button key={th.id} onClick={() => setThemeId(th.id)} style={{
                        width: '26px', height: '26px', borderRadius: '50%', padding: 0,
                        border: themeId === th.id ? '2px solid #fff' : '2px solid transparent',
                        background: th.accent, cursor: 'pointer', transition: 'border 0.15s',
                      }} />
                    ))}
                  </div>
                </div>

                {/* Scaled CV — fills width, scrolls vertically */}
                <MobilePreviewScaled cv={cv} template={template} theme={activeTheme} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Hidden CV for PDF Export when in Edit Tab */}
          {isMobile && mobileTab !== 'preview' && (
            <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
              <CVPreview cv={cv} template={template} theme={activeTheme} scaled={false} />
            </div>
          )}
        </div>

        {/* Sticky bottom action bar */}
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          padding: '12px 16px',
          background: 'rgba(22,22,42,0.97)',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(20px)',
          display: 'flex', gap: '10px', zIndex: 100,
        }}>
          <motion.button disabled style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            padding: '13px', borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)',
            color: 'rgba(255,255,255,0.4)', fontSize: '13px', fontWeight: 700,
            cursor: 'not-allowed', fontFamily: "'DM Sans', sans-serif",
          }}>
            <Sparkles size={15} /> 
            <span style={{ textDecoration: 'line-through' }}>{t('app.ai_coach')}</span>
            <span style={{
              background: 'rgba(201,168,76,0.2)', color: '#c9a84c', 
              fontSize: '10px', padding: '2px 6px', borderRadius: '6px', marginLeft: '2px', textDecoration: 'none'
            }}>{t('app.updating')}</span>
          </motion.button>

          <motion.button onClick={handleExport} disabled={exporting} whileTap={{ scale: 0.95 }} style={{
            flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            padding: '13px', borderRadius: '12px', border: 'none',
            background: exporting ? 'rgba(201,168,76,0.5)' : 'linear-gradient(135deg, #c9a84c, #e8cc7a)',
            color: '#1a1a2e', fontSize: '13px', fontWeight: 800,
            cursor: exporting ? 'not-allowed' : 'pointer',
            fontFamily: "'DM Sans', sans-serif",
            boxShadow: '0 4px 16px rgba(201,168,76,0.35)',
          }}>
            <Download size={15} />
            {exporting ? t('app.exporting') : t('app.download_pdf')}
          </motion.button>
        </div>

        {showAI && <AIModal cv={cv} onClose={() => setShowAI(false)} onApply={applyAI} />}
      </div>
    )
  }

  // ─────────────────────────────────────────────
  // TABLET + DESKTOP LAYOUT
  // ─────────────────────────────────────────────
  const formWidth = isTablet ? '42%' : '420px'

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      height: '100dvh', overflow: 'hidden',
      background: '#0a0a18', fontFamily: "'DM Sans', sans-serif",
      position: 'relative'
    }}>

      {/* Wrapping the rest of the content so it stays above parallax */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* ── Top navigation bar ── */}
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 16px', height: '56px', background: '#1a1a2e',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        flexShrink: 0, gap: '8px', overflow: 'visible',
      }}>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <img src="/cv_builder_logo.svg" alt="CV Builder Logo" style={{ width: '30px', height: '30px' }} />
          {!isTablet && <span style={{ fontSize: '15px', fontWeight: 700, color: '#fff' }}>CVcraft</span>}
        </div>

        {/* Step tabs */}
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={steps.map(s => s.id)} strategy={horizontalListSortingStrategy}>
            <nav style={{ display: 'flex', gap: '2px', flex: 1, justifyContent: 'center', overflow: 'hidden' }}>
              {steps.map((step, idx) => {
                const active = activeStep === step.id
                const done   = idx < activeIndex
                return (
                  <SortableTab 
                    key={step.id} step={step} active={active} done={done}
                    isTablet={isTablet} isMobile={false} onClick={() => setActiveStep(step.id)} 
                  />
                )
              })}
            </nav>
          </SortableContext>
        </DndContext>

        {/* Right actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
          
          <LanguageSwitcher />

          {/* Template switcher */}
          <div style={{ display: 'flex', gap: '2px', background: 'rgba(255,255,255,0.06)', borderRadius: '8px', padding: '3px' }}>
            {TEMPLATES.map(t => (
              <button key={t} onClick={() => setTemplate(t)} style={{
                padding: '4px 10px', borderRadius: '6px', border: 'none', cursor: 'pointer',
                background: template === t ? 'rgba(255,255,255,0.12)' : 'transparent',
                color: template === t ? '#fff' : 'rgba(255,255,255,0.35)',
                fontSize: '11px', fontFamily: "'DM Sans', sans-serif",
                textTransform: 'capitalize', transition: 'all 0.15s',
              }}>
                {t}
              </button>
            ))}
          </div>

          {/* Theme picker */}
          <div style={{ position: 'relative' }}>
            <button onClick={() => setShowThemes(s => !s)} style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '5px 10px', borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.12)',
              background: 'rgba(255,255,255,0.05)',
              color: 'rgba(255,255,255,0.6)', fontSize: '11px',
              cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
            }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: activeTheme.accent }} />
              {!isTablet && activeTheme.name}
            </button>

            <AnimatePresence>
              {showThemes && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }}
                  style={{
                    position: 'absolute', top: '38px', right: 0,
                    background: '#1e1e35', border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px', padding: '8px', zIndex: 200,
                    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3px',
                    width: '200px', boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
                  }}
                >
                  {THEMES.map(th => (
                    <button key={th.id} onClick={() => { setThemeId(th.id); setShowThemes(false) }} style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      padding: '7px 10px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                      background: themeId === th.id ? 'rgba(255,255,255,0.08)' : 'transparent',
                      color: '#fff', fontSize: '11px',
                      fontFamily: "'DM Sans', sans-serif", textAlign: 'left',
                    }}>
                      <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: th.accent, flexShrink: 0 }} />
                      {th.name}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* AI Coach */}
          <motion.button
            disabled
            style={{
              display: 'flex', alignItems: 'center', gap: '5px',
              padding: '6px 12px', borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)',
              fontSize: '12px', fontWeight: 600, cursor: 'not-allowed',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            <Sparkles size={13} />
            {!isTablet && <span style={{ textDecoration: 'line-through' }}>{t('app.ai_coach')}</span>}
            <span style={{
              background: 'rgba(201,168,76,0.2)', color: '#c9a84c', 
              fontSize: '9px', padding: '1px 5px', borderRadius: '4px', marginLeft: '2px', textDecoration: 'none'
            }}>{t('app.updating')}</span>
          </motion.button>

          {/* Reset */}
          <button onClick={resetCV} style={{
            width: '32px', height: '32px', borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.1)', background: 'transparent',
            color: 'rgba(255,255,255,0.4)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <RefreshCw size={12} />
          </button>

          {/* Download PDF */}
          <motion.button
            onClick={handleExport} disabled={exporting}
            whileHover={{ scale: exporting ? 1 : 1.04 }}
            whileTap={{ scale: exporting ? 1 : 0.96 }}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '7px 14px', borderRadius: '9px', border: 'none',
              cursor: exporting ? 'not-allowed' : 'pointer',
              background: exporting ? 'rgba(201,168,76,0.5)' : 'linear-gradient(135deg, #c9a84c, #e8cc7a)',
              color: '#1a1a2e', fontSize: '12px', fontWeight: 700,
              fontFamily: "'DM Sans', sans-serif",
              boxShadow: '0 2px 12px rgba(201,168,76,0.3)',
            }}
          >
            <Download size={13} />
            {exporting ? t('app.exporting') : t('app.download_pdf')}
          </motion.button>
        </div>
      </header>

      {/* Progress bar */}
      <div style={{ height: '2px', background: 'rgba(255,255,255,0.06)', flexShrink: 0 }}>
        <motion.div
          style={{ height: '100%', background: 'linear-gradient(90deg, #c9a84c, #e8cc7a)' }}
          animate={{ width: `${((activeIndex + 1) / steps.length) * 100}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      {/* ── Main: form + preview ── */}
      <div
        style={{ flex: 1, display: 'flex', overflow: 'hidden' }}
        onClick={() => showThemes && setShowThemes(false)}
      >

        {/* Form panel */}
        <div style={{
          width: formWidth, flexShrink: 0, display: 'flex', flexDirection: 'column',
          background: '#1a1a2e', borderRight: '1px solid rgba(255,255,255,0.06)',
        }}>

          {/* Panel header */}
          <div style={{
            padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {(() => {
                const Icon = steps[activeIndex]?.icon
                if (!Icon) return null
                return (
                  <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={13} color="#c9a84c" />
                  </div>
                )
              })()}
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>
                {t(`steps.${steps[activeIndex]?.id}`)}
              </span>
            </div>
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)', background: 'rgba(255,255,255,0.05)', padding: '3px 10px', borderRadius: '20px' }}>
              {activeIndex + 1} / {steps.length}
            </span>
          </div>

          {/* Scrollable form body */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
            <AnimatedStep stepKey={activeStep}>{renderStep()}</AnimatedStep>
            <div style={{ marginTop: '24px', paddingBottom: '24px' }}>
              <ScorePanel cv={cv} onImprove={setActiveStep} />
            </div>
          </div>

          {/* Footer: progress dots + prev/next */}
          <div style={{
            padding: '14px 20px', borderTop: '1px solid rgba(255,255,255,0.06)',
            background: '#16162a', flexShrink: 0,
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '5px', marginBottom: '12px' }}>
              {steps.map((_, i) => (
                <motion.div
                  key={i}
                  onClick={() => setActiveStep(steps[i].id)}
                  animate={{
                    width: i === activeIndex ? '18px' : '6px',
                    background: i === activeIndex ? '#c9a84c' : i < activeIndex ? 'rgba(201,168,76,0.4)' : 'rgba(255,255,255,0.12)',
                  }}
                  transition={{ duration: 0.2 }}
                  style={{ height: '6px', borderRadius: '3px', cursor: 'pointer' }}
                />
              ))}
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => { if (activeIndex > 0) setActiveStep(steps[activeIndex - 1].id) }}
                disabled={activeIndex === 0}
                style={{
                  padding: '10px 16px', borderRadius: '10px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)',
                  fontSize: '13px', cursor: activeIndex === 0 ? 'not-allowed' : 'pointer',
                  fontFamily: "'DM Sans', sans-serif", opacity: activeIndex === 0 ? 0.3 : 1,
                }}
              >
                ← {t('app.prev')}
              </button>
              <motion.button
                onClick={() => { if (activeIndex < steps.length - 1) setActiveStep(steps[activeIndex + 1].id) }}
                disabled={activeIndex === steps.length - 1}
                whileHover={{ scale: activeIndex === steps.length - 1 ? 1 : 1.02 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  flex: 1, padding: '11px', borderRadius: '10px', border: 'none',
                  background: activeIndex === steps.length - 1 ? 'rgba(255,255,255,0.06)' : 'linear-gradient(135deg, #c9a84c, #e8cc7a)',
                  color: activeIndex === steps.length - 1 ? 'rgba(255,255,255,0.25)' : '#1a1a2e',
                  fontSize: '13px', fontWeight: 700,
                  cursor: activeIndex === steps.length - 1 ? 'not-allowed' : 'pointer',
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {activeIndex === steps.length - 1 ? t('app.all_done') : t('app.next_step')}
              </motion.button>
            </div>
          </div>
        </div>

        {/* ── Preview panel ── */}
        {/* FIX: overflowY:auto + alignItems:flex-start ensures full CV is scrollable */}
        <div style={{
  flex: 1,
  overflowY: 'auto',
  overflowX: 'auto',
  padding: isTablet ? '24px 16px 48px' : '40px 32px 64px',
  background: 'linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 50%, #0f0f1e 100%)',
}}>
  <div style={{
    width: 'fit-content',
    margin: '0 auto',
  }}>
    {isTablet
      ? <TabletPreviewScaled cv={cv} template={template} theme={activeTheme} />
      : <CVPreview cv={cv} template={template} theme={activeTheme} />
    }
  </div>
</div>
      </div>

      {showAI && <AIModal cv={cv} onClose={() => setShowAI(false)} onApply={applyAI} />}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
// MobilePreviewScaled
// Two-div approach: outer = visual height for scroll container
//                  inner = absolute + transform:scale (no clipping)
// ─────────────────────────────────────────────────────────────────
function MobilePreviewScaled({ cv, template, theme }) {
  const [scale, setScale] = useState(1)
  const [cvHeight, setCvHeight] = useState(1123)

  useEffect(() => {
    const update = () => {
      // Zoom in more on mobile (min scale 0.6) so it's not too far.
      // The container now allows horizontal scrolling to see the edges.
      const rawScale = window.innerWidth / 794
      setScale(Math.max(rawScale, 0.6))
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  useEffect(() => {
    const el = document.getElementById('cv-preview')
    if (!el) return
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setCvHeight(entry.target.offsetHeight || 1123)
      }
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [cv, template])

  const scaledH = Math.round(cvHeight * scale)   // Actual height × scale

  return (
    // Outer: tells scroll container the true visual height post-scale
    <div style={{ width: '100%', minHeight: `${scaledH}px`, position: 'relative' }}>
      {/* Inner: transform anchored top-left — overflow:visible so nothing clips */}
      <div style={{
        position: 'absolute', top: 0, left: 0,
        transformOrigin: 'top left',
        transform: `scale(${scale})`,
        width: '794px',
        overflow: 'visible',
        boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
        borderRadius: '4px',
      }}>
        <CVPreview cv={cv} template={template} theme={theme} scaled={false} />
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
// TabletPreviewScaled
// Same two-div approach as MobilePreviewScaled
// ─────────────────────────────────────────────────────────────────
function TabletPreviewScaled({ cv, template, theme }) {
  const [scale, setScale] = useState(1)
  const [cvHeight, setCvHeight] = useState(1123)

  useEffect(() => {
    const update = () => {
      // Preview panel is ~58% of viewport minus padding
      const panelW = window.innerWidth * 0.58 - 32
      setScale(Math.min(panelW / 794, 1))
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  useEffect(() => {
    const el = document.getElementById('cv-preview')
    if (!el) return
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setCvHeight(entry.target.offsetHeight || 1123)
      }
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [cv, template])

  const scaledH = Math.round(cvHeight * scale)

  return (
    // Outer: correct visual height for scroll
    <div style={{ width: '100%', minHeight: `${scaledH}px`, position: 'relative' }}>
      {/* Inner: scale from top-left, overflow visible */}
      <div style={{
        position: 'absolute', top: 0, left: 0,
        transformOrigin: 'top left',
        transform: `scale(${scale})`,
        width: '794px',
        overflow: 'visible',
        boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
        borderRadius: '4px',
      }}>
        <CVPreview cv={cv} template={template} theme={theme} scaled={false} />
      </div>
    </div>
  )
}