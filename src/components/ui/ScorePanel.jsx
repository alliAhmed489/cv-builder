import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CVScore } from './CVScore';
import { ATSChecker } from './ATSChecker';

export function ScorePanel({ cv, onImprove }) {
  const [activeTab, setActiveTab] = useState('cv'); // 'cv' or 'ats'

  return (
    <div style={{
      width: '100%',
      maxWidth: '400px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      boxSizing: 'border-box'
    }}>
      {/* Toggle Tabs */}
      <div style={{
        display: 'flex',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '10px',
        padding: '4px',
      }}>
        <button
          onClick={() => setActiveTab('cv')}
          style={{
            flex: 1,
            padding: '8px',
            borderRadius: '8px',
            border: 'none',
            background: activeTab === 'cv' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
            color: activeTab === 'cv' ? '#fff' : 'rgba(255, 255, 255, 0.5)',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s',
            fontFamily: "'DM Sans', sans-serif"
          }}
        >
          CV Score
        </button>
        <button
          onClick={() => setActiveTab('ats')}
          style={{
            flex: 1,
            padding: '8px',
            borderRadius: '8px',
            border: 'none',
            background: activeTab === 'ats' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
            color: activeTab === 'ats' ? '#fff' : 'rgba(255, 255, 255, 0.5)',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s',
            fontFamily: "'DM Sans', sans-serif"
          }}
        >
          ATS Analyzer
        </button>
      </div>

      {/* Content Area with Animation */}
      <div style={{ position: 'relative' }}>
        <AnimatePresence mode="wait">
          {activeTab === 'cv' && (
            <motion.div
              key="cv"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              <CVScore cv={cv} onImprove={onImprove} />
            </motion.div>
          )}
          {activeTab === 'ats' && (
            <motion.div
              key="ats"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              <ATSChecker cv={cv} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
