import React, { useEffect } from 'react';
import { motion, animate, useMotionValue, useTransform } from 'framer-motion';
import { useCVScore } from '../../hooks/useCVScore';

export function CVScore({ cv, onImprove }) {
  const { score, missingSections } = useCVScore(cv);

  // Determine color and helper text based on score
  let color = '#ef4444'; // Red
  let text = 'Complete your profile to improve score';
  if (score > 40 && score <= 70) {
    color = '#eab308'; // Yellow
    text = 'Strong profile!';
  } else if (score > 70) {
    color = '#22c55e'; // Green
    text = 'Outstanding CV!';
  }

  // Cap score between 0 and 100
  const displayScore = Math.min(Math.max(score, 0), 100);

  // Framer motion value for counting up
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);

  useEffect(() => {
    const animation = animate(count, displayScore, { duration: 0.8, ease: "easeOut" });
    return animation.stop;
  }, [displayScore]);

  const handleImprove = () => {
    if (missingSections.length > 0 && onImprove) {
      onImprove(missingSections[0]);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      style={{
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        borderRadius: '12px',
        padding: '16px',
        width: '100%',
        maxWidth: '400px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        fontFamily: "'DM Sans', sans-serif",
        boxSizing: 'border-box'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: '#fff' }}>CV Score</h3>
        <motion.span style={{ fontSize: '20px', fontWeight: 800, color }}>
          <motion.span>{rounded}</motion.span>
          <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>/100</span>
        </motion.span>
      </div>

      <div style={{ height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', overflow: 'hidden' }}>
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${displayScore}%`, backgroundColor: color }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ height: '100%', borderRadius: '3px' }}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2px' }}>
        <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)' }}>{text}</span>
        {missingSections.length > 0 ? (
          <button style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#fff',
            padding: '6px 12px',
            borderRadius: '6px',
            fontSize: '11px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s',
            fontFamily: "'DM Sans', sans-serif"
          }}
          onClick={handleImprove}
          onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)' }}
          onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}
          >
            Improve Score
          </button>
        ) : (
          <span style={{ fontSize: '11px', color: '#22c55e', fontWeight: 600, padding: '6px 12px' }}>
            All complete!
          </span>
        )}
      </div>
    </motion.div>
  );
}
