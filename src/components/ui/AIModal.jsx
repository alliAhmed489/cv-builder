import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles, Check, TrendingUp, Award, Lightbulb, CheckCircle, AlertCircle } from 'lucide-react'
import { analyzeCV } from '../../utils/aiService.js'

// ─────────────────────────────────────────────
// Main Modal
// ─────────────────────────────────────────────
export function AIModal({ cv, onClose, onApply }) {
  const [status, setStatus]   = useState('idle')   // idle | loading | success | error
  const [result, setResult]   = useState(null)
  const [error, setError]     = useState('')
  const [applied, setApplied] = useState({})

  // ── Analyze ──
  async function handleAnalyze() {
    setStatus('loading')
    setError('')
    setResult(null)
    setApplied({})
    try {
      const data = await analyzeCV(cv)
      setResult(data)
      setStatus('success')
    } catch (err) {
      setError(err.message)
      setStatus('error')
    }
  }

  // ── Apply suggestion to CV ──
  function handleApply(field, value) {
    if (onApply) onApply(field, value)
    setApplied(prev => ({ ...prev, [field]: true }))
    setTimeout(() => setApplied(prev => ({ ...prev, [field]: false })), 2500)
  }

  // ── Score color ──
  const scoreColor = !result ? '#c9a84c'
    : result.overallScore >= 80 ? '#4ade80'
    : result.overallScore >= 60 ? '#c9a84c'
    : '#f87171'

  const scoreEmoji = !result ? ''
    : result.overallScore >= 80 ? '🎉 Excellent CV!'
    : result.overallScore >= 60 ? '👍 Good — room to improve'
    : '💪 Needs work'

  return (
    <AnimatePresence>
      {/* ── Backdrop ── */}
      <motion.div
        key="ai-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={e => e.target === e.currentTarget && onClose()}
        style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(0,0,0,0.82)',
          backdropFilter: 'blur(12px)',
          display: 'flex', alignItems: 'center',
          justifyContent: 'center', padding: '20px',
        }}
      >
        {/* ── Modal ── */}
        <motion.div
          key="ai-modal"
          initial={{ opacity: 0, scale: 0.88, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.88, y: 40 }}
          transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{
            width: '100%', maxWidth: '560px',
            maxHeight: '90vh', display: 'flex', flexDirection: 'column',
            background: 'linear-gradient(180deg, #1c1c32 0%, #14142a 100%)',
            border: '1px solid rgba(201,168,76,0.22)',
            borderRadius: '24px',
            boxShadow: '0 48px 120px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,255,255,0.03), 0 0 60px rgba(201,168,76,0.06)',
          }}
        >
          {/* ── Header ── */}
          <ModalHeader onClose={onClose} />

          {/* ── Body ── */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
            <AnimatePresence mode="wait">

              {/* Idle */}
              {status === 'idle' && (
                <IdleState key="idle" onAnalyze={handleAnalyze} />
              )}

              {/* Loading */}
              {status === 'loading' && (
                <LoadingState key="loading" />
              )}

              {/* Error */}
              {status === 'error' && (
                <ErrorState key="error" error={error} onRetry={handleAnalyze} />
              )}

              {/* Success */}
              {status === 'success' && result && (
                <ResultsState
                  key="results"
                  result={result}
                  scoreColor={scoreColor}
                  scoreEmoji={scoreEmoji}
                  applied={applied}
                  onApply={handleApply}
                  onReanalyze={handleAnalyze}
                />
              )}

            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// ─────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────

function ModalHeader({ onClose }) {
  return (
    <div style={{
      padding: '22px 24px 18px',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', flexShrink: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '42px', height: '42px', borderRadius: '13px',
          background: 'linear-gradient(135deg, rgba(201,168,76,0.22), rgba(201,168,76,0.06))',
          border: '1px solid rgba(201,168,76,0.28)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 24px rgba(201,168,76,0.18)',
        }}>
          <Sparkles size={19} color="#c9a84c" />
        </div>
        <div>
          <p style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#fff', letterSpacing: '-0.3px' }}>
            AI CV Coach
          </p>
          <p style={{ margin: 0, fontSize: '11px', color: 'rgba(255,255,255,0.32)' }}>
            Powered by OpenAI GPT-4o
          </p>
        </div>
      </div>

      <button
        onClick={onClose}
        style={{
          width: '34px', height: '34px', borderRadius: '10px',
          border: '1px solid rgba(255,255,255,0.08)',
          background: 'rgba(255,255,255,0.04)',
          color: 'rgba(255,255,255,0.42)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.09)'; e.currentTarget.style.color = '#fff' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'rgba(255,255,255,0.42)' }}
      >
        <X size={15} />
      </button>
    </div>
  )
}

function IdleState({ onAnalyze }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.25 }}
      style={{ textAlign: 'center', padding: '16px 0 8px' }}
    >
      {/* Floating icon */}
      <motion.div
        animate={{
          y: [0, -10, 0],
          boxShadow: [
            '0 0 24px rgba(201,168,76,0.15)',
            '0 0 48px rgba(201,168,76,0.35)',
            '0 0 24px rgba(201,168,76,0.15)',
          ],
        }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          width: '84px', height: '84px', borderRadius: '26px',
          background: 'linear-gradient(135deg, rgba(201,168,76,0.18), rgba(201,168,76,0.05))',
          border: '1px solid rgba(201,168,76,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 24px',
        }}
      >
        <Sparkles size={36} color="#c9a84c" />
      </motion.div>

      <h3 style={{ margin: '0 0 10px', fontSize: '21px', fontWeight: 800, color: '#fff', letterSpacing: '-0.4px' }}>
        Analyze Your CV
      </h3>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', lineHeight: 1.75, margin: '0 0 28px', maxWidth: '330px', marginLeft: 'auto', marginRight: 'auto' }}>
        Get instant AI-powered feedback and apply improvements directly to your CV with one click.
      </p>

      {/* Feature chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', marginBottom: '32px' }}>
        {['📊 CV Score', '💼 Job Title', '✍️ Summary', '🎯 Skills', '💡 Tips'].map((f, i) => (
          <motion.span
            key={f}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            style={{
              fontSize: '11px', padding: '5px 13px', borderRadius: '99px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.09)',
              color: 'rgba(255,255,255,0.5)',
            }}
          >
            {f}
          </motion.span>
        ))}
      </div>

      {/* CTA */}
      <motion.button
        onClick={onAnalyze}
        whileHover={{ scale: 1.05, boxShadow: '0 16px 40px rgba(201,168,76,0.5)' }}
        whileTap={{ scale: 0.95 }}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '10px',
          padding: '15px 40px', borderRadius: '14px', border: 'none',
          cursor: 'pointer',
          background: 'linear-gradient(135deg, #c9a84c, #e8cc7a)',
          color: '#1a1a2e', fontSize: '15px', fontWeight: 800,
          fontFamily: "'DM Sans', sans-serif",
          boxShadow: '0 8px 24px rgba(201,168,76,0.38)',
          letterSpacing: '-0.2px',
        }}
      >
        <Sparkles size={18} /> Analyze My CV
      </motion.button>
    </motion.div>
  )
}

function LoadingState() {
  const steps = ['Reading your CV…', 'Analyzing experience…', 'Optimizing for ATS…', 'Generating suggestions…']
  const [step, setStep] = useState(0)

  useState(() => {
    const interval = setInterval(() => {
      setStep(s => (s + 1) % steps.length)
    }, 1400)
    return () => clearInterval(interval)
  })

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ textAlign: 'center', padding: '52px 0' }}
    >
      {/* Spinner */}
      <div style={{ position: 'relative', width: '68px', height: '68px', margin: '0 auto 28px' }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
          style={{
            width: '68px', height: '68px', borderRadius: '50%',
            border: '3px solid rgba(201,168,76,0.12)',
            borderTop: '3px solid #c9a84c',
          }}
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute', inset: '10px',
            borderRadius: '50%',
            border: '2px solid rgba(201,168,76,0.06)',
            borderBottom: '2px solid rgba(201,168,76,0.4)',
          }}
        />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Sparkles size={20} color="#c9a84c" />
        </div>
      </div>

      <p style={{ color: '#fff', fontSize: '15px', fontWeight: 700, margin: '0 0 8px' }}>
        Analyzing your CV…
      </p>

      <AnimatePresence mode="wait">
        <motion.p
          key={step}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.3 }}
          style={{ color: 'rgba(255,255,255,0.35)', fontSize: '12px', margin: '0 0 24px' }}
        >
          {steps[step]}
        </motion.p>
      </AnimatePresence>

      {/* Dots */}
      <div style={{ display: 'flex', gap: '7px', justifyContent: 'center' }}>
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            animate={{ opacity: [0.25, 1, 0.25], scale: [0.7, 1.15, 0.7] }}
            transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.22 }}
            style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#c9a84c' }}
          />
        ))}
      </div>
    </motion.div>
  )
}

function ErrorState({ error, onRetry }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      style={{ padding: '8px 0' }}
    >
      <div style={{
        background: 'rgba(239,68,68,0.07)',
        border: '1px solid rgba(239,68,68,0.2)',
        borderRadius: '16px', padding: '22px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <AlertCircle size={18} color="#f87171" />
          <p style={{ margin: 0, color: '#f87171', fontSize: '14px', fontWeight: 700 }}>
            Analysis Failed
          </p>
        </div>

        <p style={{ color: 'rgba(248,113,113,0.75)', fontSize: '12px', margin: '0 0 18px', lineHeight: 1.65 }}>
          {error}
        </p>

        {/* Setup guide */}
        <div style={{
          background: 'rgba(0,0,0,0.25)',
          borderRadius: '12px', padding: '16px', marginBottom: '18px',
          border: '1px solid rgba(255,255,255,0.05)',
        }}>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '12px', margin: '0 0 10px', fontWeight: 600 }}>
            🔧 Quick Setup Guide
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {[
              '1. Get API key from platform.openai.com',
              '2. Create .env.local in project root',
              '3. Add: OPENAI_API_KEY=sk-...',
              '4. Restart: npm run dev',
            ].map((step, i) => (
              <code key={i} style={{ fontSize: '11px', color: '#c9a84c', display: 'block', lineHeight: 1.6 }}>
                {step}
              </code>
            ))}
          </div>
        </div>

        <motion.button
          onClick={onRetry}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 22px', borderRadius: '10px',
            border: '1px solid rgba(248,113,113,0.3)',
            background: 'rgba(239,68,68,0.12)',
            color: '#f87171', fontSize: '13px', fontWeight: 700,
            cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
          }}
        >
          <Sparkles size={14} /> Try Again
        </motion.button>
      </div>
    </motion.div>
  )
}

function ResultsState({ result, scoreColor, scoreEmoji, applied, onApply, onReanalyze }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
    >
      {/* Score card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '18px', padding: '20px',
          display: 'flex', alignItems: 'center', gap: '20px',
        }}
      >
        {/* Circle */}
        <div style={{ position: 'relative', width: '76px', height: '76px', flexShrink: 0 }}>
          <svg width="76" height="76" viewBox="0 0 76 76">
            <circle cx="38" cy="38" r="32" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
            <motion.circle
              cx="38" cy="38" r="32"
              fill="none" stroke={scoreColor} strokeWidth="5"
              strokeDasharray="201.1"
              initial={{ strokeDashoffset: 201.1 }}
              animate={{ strokeDashoffset: 201.1 - (result.overallScore / 100) * 201.1 }}
              transition={{ duration: 1.4, ease: 'easeOut', delay: 0.2 }}
              strokeLinecap="round" transform="rotate(-90 38 38)"
            />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, type: 'spring' }}
              style={{ fontSize: '20px', fontWeight: 900, color: scoreColor, lineHeight: 1 }}
            >
              {result.overallScore}
            </motion.span>
            <span style={{ fontSize: '8px', color: 'rgba(255,255,255,0.28)', letterSpacing: '1.2px', marginTop: '2px' }}>
              SCORE
            </span>
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <p style={{ margin: '0 0 6px', fontSize: '15px', fontWeight: 700, color: '#fff' }}>
            {scoreEmoji}
          </p>
          {result.tips?.[0] && (
            <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255,255,255,0.42)', lineHeight: 1.65 }}>
              {result.tips[0]}
            </p>
          )}
        </div>
      </motion.div>

      {/* Job Title */}
      <ResultCard
        delay={0.1}
        icon={<Award size={15} color="#c9a84c" />}
        label="Improved Job Title"
        value={result.job_title}
        reason={result.titleReason}
        applyLabel="Apply Title"
        applied={applied.title}
        onApply={() => onApply('title', result.job_title)}
      />

      {/* Summary */}
      <ResultCard
        delay={0.15}
        icon={<TrendingUp size={15} color="#c9a84c" />}
        label="Improved Summary"
        value={result.summary}
        reason={result.summaryReason}
        applyLabel="Apply Summary"
        applied={applied.summary}
        onApply={() => onApply('summary', result.summary)}
      />

      {/* Skills */}
      {result.skills?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '18px', padding: '18px 20px',
          }}
        >
          <SectionLabel icon={<Sparkles size={14} color="#c9a84c" />} text="Suggested Skills" />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {result.skills.map((skill, i) => (
              <motion.span
                key={skill}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.25 + i * 0.06 }}
                style={{
                  fontSize: '12px', padding: '6px 15px',
                  background: 'rgba(201,168,76,0.1)',
                  border: '1px solid rgba(201,168,76,0.25)',
                  borderRadius: '99px', color: '#e8cc7a', fontWeight: 600,
                }}
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Tips */}
      {result.tips?.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '18px', padding: '18px 20px',
          }}
        >
          <SectionLabel icon={<Lightbulb size={14} color="#c9a84c" />} text="Pro Tips" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {result.tips.slice(1).map((tip, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}
              >
                <div style={{
                  width: '22px', height: '22px', borderRadius: '50%', flexShrink: 0,
                  background: 'rgba(201,168,76,0.12)',
                  border: '1px solid rgba(201,168,76,0.28)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginTop: '1px',
                }}>
                  <span style={{ fontSize: '11px', color: '#c9a84c', fontWeight: 700 }}>{i + 1}</span>
                </div>
                <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255,255,255,0.58)', lineHeight: 1.7 }}>
                  {tip}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Re-analyze */}
      <motion.button
        onClick={onReanalyze}
        whileHover={{ scale: 1.02, borderColor: 'rgba(201,168,76,0.3)' }}
        whileTap={{ scale: 0.97 }}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          padding: '13px', borderRadius: '13px',
          border: '1px solid rgba(255,255,255,0.08)',
          background: 'rgba(255,255,255,0.03)',
          color: 'rgba(255,255,255,0.38)', fontSize: '12px',
          cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
          transition: 'all 0.2s',
        }}
      >
        <Sparkles size={13} /> Analyze Again
      </motion.button>
    </motion.div>
  )
}

// ── Shared small components ──

function SectionLabel({ icon, text }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
      {icon}
      <span style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.38)', letterSpacing: '1.3px', textTransform: 'uppercase' }}>
        {text}
      </span>
    </div>
  )
}

function ResultCard({ icon, label, value, reason, applyLabel, applied, onApply, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '18px', padding: '18px 20px',
      }}
    >
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {icon}
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.38)', letterSpacing: '1.3px', textTransform: 'uppercase' }}>
            {label}
          </span>
        </div>

        {/* Apply button */}
        <motion.button
          onClick={onApply}
          whileHover={{ scale: applied ? 1 : 1.06 }}
          whileTap={{ scale: 0.92 }}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '6px 14px', borderRadius: '9px',
            border: applied
              ? '1px solid rgba(74,222,128,0.4)'
              : '1px solid rgba(201,168,76,0.38)',
            background: applied
              ? 'rgba(74,222,128,0.1)'
              : 'rgba(201,168,76,0.1)',
            color: applied ? '#4ade80' : '#c9a84c',
            fontSize: '11px', fontWeight: 700,
            cursor: applied ? 'default' : 'pointer',
            fontFamily: "'DM Sans', sans-serif",
            transition: 'all 0.2s',
          }}
        >
          {applied
            ? <><CheckCircle size={12} /> Applied!</>
            : <><Check size={12} /> {applyLabel}</>
          }
        </motion.button>
      </div>

      {/* Value */}
      <p style={{ margin: '0 0 9px', fontSize: '13px', color: '#fff', lineHeight: 1.72, fontWeight: 500 }}>
        {value}
      </p>

      {/* Reason */}
      {reason && (
        <p style={{ margin: 0, fontSize: '11px', color: 'rgba(255,255,255,0.28)', lineHeight: 1.6, fontStyle: 'italic' }}>
          {reason}
        </p>
      )}
    </motion.div>
  )
}