import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export function Input({
  label, id, type = 'text', value, onChange,
  placeholder = '', rows, hint = '', dark = false, optional = false,
}) {
  const { t } = useTranslation()
  const [focused, setFocused] = useState(false)

  // ── Dark mode input (for left panel) ──
  if (dark || true) {
    const borderColor = focused
      ? 'rgba(201,168,76,0.7)'
      : 'rgba(255,255,255,0.08)'
    const bg = focused
      ? 'rgba(201,168,76,0.04)'
      : 'rgba(255,255,255,0.04)'
    const glow = focused
      ? '0 0 0 3px rgba(201,168,76,0.1), 0 1px 3px rgba(0,0,0,0.3)'
      : '0 1px 3px rgba(0,0,0,0.2)'

    const sharedStyle = {
      width: '100%',
      padding: '11px 14px',
      borderRadius: '10px',
      border: `1.5px solid ${borderColor}`,
      background: bg,
      color: focused ? '#fff' : 'rgba(255,255,255,0.85)',
      fontSize: '13px',
      fontFamily: "'DM Sans', sans-serif",
      outline: 'none',
      transition: 'all 0.2s ease',
      boxShadow: glow,
      boxSizing: 'border-box',
      lineHeight: '1.6',
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
        {label && (
          <label
            htmlFor={id}
            style={{
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '1.2px',
              textTransform: 'uppercase',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            {label}
            {optional && <span style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 400, fontSize: '10px', textTransform: 'none', letterSpacing: 'normal' }}> {t('app.optional')}</span>}
          </label>
        )}

        {rows ? (
          <textarea
            id={id} value={value} onChange={onChange}
            placeholder={placeholder} rows={rows}
            style={{ ...sharedStyle, resize: 'vertical', minHeight: '90px' }}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
        ) : (
          <input
            id={id} type={type} value={value}
            onChange={onChange} placeholder={placeholder}
            style={sharedStyle}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
        )}

        {hint && (
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)', margin: 0, lineHeight: 1.5 }}>
            {hint}
          </p>
        )}
      </div>
    )
  }
}