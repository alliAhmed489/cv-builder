import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, animate, useMotionValue, useTransform } from 'framer-motion';
import { useATS } from '../../hooks/useATS';
import { ChevronDown, ChevronUp, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

export function ATSChecker({ cv }) {
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const { score, status, issues, suggestions, missingKeywords } = useATS(cv, jobTitle, jobDescription);
  const [expandedSection, setExpandedSection] = useState(null); // 'issues', 'suggestions', 'missing'

  let color = '#ef4444';
  if (status === 'Medium') color = '#eab308';
  if (status === 'High') color = '#22c55e';

  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);

  useEffect(() => {
    const animation = animate(count, score, { duration: 0.8, ease: "easeOut" });
    return animation.stop;
  }, [score, count]);

  const toggleSection = (section) => {
    setExpandedSection(prev => prev === section ? null : section);
  };

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.03)',
      border: '1px solid rgba(255, 255, 255, 0.06)',
      borderRadius: '12px',
      padding: '16px',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      boxShadow: `0 4px 30px ${color}15`,
      fontFamily: "'DM Sans', sans-serif",
      boxSizing: 'border-box'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', fontWeight: 600, textTransform: 'uppercase' }}>Target Job Title</label>
        <input 
          type="text" 
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          placeholder="e.g. Frontend Developer"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            padding: '8px 12px',
            color: '#fff',
            fontSize: '13px',
            fontFamily: "'DM Sans', sans-serif",
            outline: 'none',
            transition: 'border 0.2s'
          }}
          onFocus={(e) => e.target.style.borderColor = '#c9a84c'}
          onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', fontWeight: 600, textTransform: 'uppercase' }}>Job Description (Optional)</label>
        <textarea 
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the full job description here..."
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            padding: '8px 12px',
            color: '#fff',
            fontSize: '13px',
            fontFamily: "'DM Sans', sans-serif",
            outline: 'none',
            transition: 'border 0.2s',
            height: '80px',
            resize: 'vertical'
          }}
          onFocus={(e) => e.target.style.borderColor = '#c9a84c'}
          onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: '#fff' }}>ATS Compatibility</h3>
        <motion.span style={{ fontSize: '20px', fontWeight: 800, color }}>
          <motion.span>{rounded}</motion.span>
          <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>/100</span>
        </motion.span>
      </div>

      <div style={{ height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', overflow: 'hidden' }}>
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${score}%`, backgroundColor: color }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ height: '100%', borderRadius: '3px' }}
        />
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2px' }}>
        <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)' }}>Status: <span style={{ color, fontWeight: 600 }}>{status}</span></span>
      </div>

      <div style={{ display: 'flex', gap: '6px', marginTop: '4px', flexWrap: 'wrap' }}>
        <button 
          onClick={() => toggleSection('issues')}
          style={{
            flex: '1 1 30%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
            color: '#fff', padding: '8px', borderRadius: '8px', fontSize: '11px', fontWeight: 600,
            cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            transition: 'background 0.2s'
          }}
          onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)' }}
          onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><XCircle size={13} color="#ef4444" /> Issues</span>
          {expandedSection === 'issues' ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>
        <button 
          onClick={() => toggleSection('missing')}
          style={{
            flex: '1 1 30%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
            color: '#fff', padding: '8px', borderRadius: '8px', fontSize: '11px', fontWeight: 600,
            cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            transition: 'background 0.2s'
          }}
          onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)' }}
          onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><AlertTriangle size={13} color="#eab308" /> Missing</span>
          {expandedSection === 'missing' ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>
        <button 
          onClick={() => toggleSection('suggestions')}
          style={{
            flex: '1 1 30%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
            color: '#fff', padding: '8px', borderRadius: '8px', fontSize: '11px', fontWeight: 600,
            cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            transition: 'background 0.2s'
          }}
          onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)' }}
          onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><CheckCircle size={13} color="#22c55e" /> Suggest</span>
          {expandedSection === 'suggestions' ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>
      </div>

      <AnimatePresence>
        {expandedSection === 'issues' && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ 
              background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.1)', 
              borderRadius: '8px', padding: '12px', maxHeight: '150px', overflowY: 'auto',
              display: 'flex', flexDirection: 'column', gap: '8px'
            }}>
              {issues.length > 0 ? issues.map((issue, idx) => (
                <div key={idx} style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', display: 'flex', gap: '6px' }}>
                  <span style={{ color: '#ef4444' }}>•</span> {issue}
                </div>
              )) : (
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>No major issues found.</div>
              )}
            </div>
          </motion.div>
        )}

        {expandedSection === 'missing' && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ 
              background: 'rgba(234, 179, 8, 0.05)', border: '1px solid rgba(234, 179, 8, 0.1)', 
              borderRadius: '8px', padding: '12px', maxHeight: '150px', overflowY: 'auto',
              display: 'flex', flexWrap: 'wrap', gap: '6px'
            }}>
              {missingKeywords && missingKeywords.length > 0 ? missingKeywords.map((kw, idx) => (
                <span key={idx} style={{ 
                  background: 'rgba(234, 179, 8, 0.1)', color: '#eab308', 
                  padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600,
                  textTransform: 'capitalize'
                }}>
                  {kw}
                </span>
              )) : (
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>All high-value keywords matched!</div>
              )}
            </div>
          </motion.div>
        )}

        {expandedSection === 'suggestions' && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ 
              background: 'rgba(34, 197, 94, 0.05)', border: '1px solid rgba(34, 197, 94, 0.1)', 
              borderRadius: '8px', padding: '12px', maxHeight: '150px', overflowY: 'auto',
              display: 'flex', flexDirection: 'column', gap: '8px'
            }}>
              {suggestions.length > 0 ? suggestions.map((sug, idx) => (
                <div key={idx} style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', display: 'flex', gap: '6px' }}>
                  <span style={{ color: '#22c55e' }}>•</span> {sug}
                </div>
              )) : (
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>Your CV looks great!</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
