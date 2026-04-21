import { dateRange } from '../../utils/formatDate.js'

function SectionHeading({ children, theme }) {
  return (
    <div style={{ marginBottom: '14px' }}>
      <h2 style={{ fontFamily: '-apple-system, sans-serif', fontSize: '10px', letterSpacing: '2.5px', textTransform: 'uppercase', fontWeight: 700, color: theme.accent, margin: '0 0 6px 0' }}>{children}</h2>
      <div style={{ width: '28px', height: '2.5px', background: theme.primary, borderRadius: '2px' }} />
    </div>
  )
}

export function ModernTemplate({ cv, theme }) {
  const t = theme || { primary: '#1a1a2e', accent: '#c9a84c', accentLight: '#f0e6c8', headerBg: '#1a1a2e', headerText: '#ffffff' }
  const p = cv.personal
  const initials = (p.name || 'CV').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif', color: '#1a1a2e', background: '#fff', minHeight: '297mm' }}>
      <header style={{ padding: '40px 48px 28px', borderBottom: `3px solid ${t.primary}` }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '24px' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', flexShrink: 0, background: t.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Georgia, serif', fontSize: '28px', color: t.accent, overflow: 'hidden' }}>
            {p.photo ? <img src={p.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initials}
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: '34px', color: t.primary, margin: 0, lineHeight: 1.05 }}>{p.name || 'Your Name'}</h1>
            {p.title && <p style={{ fontSize: '11px', color: t.accent, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', margin: '6px 0 0' }}>{p.title}</p>}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '14px' }}>
              {p.email   && <span style={{ fontSize: '11px', color: '#666' }}>✉ {p.email}</span>}
              {p.phone   && <span style={{ fontSize: '11px', color: '#666' }}>✆ {p.phone}</span>}
              {p.address && <span style={{ fontSize: '11px', color: '#666' }}>⊙ {p.address}</span>}
              {p.website && <span style={{ fontSize: '11px', color: '#666' }}>⊕ {p.website}</span>}
            </div>
          </div>
        </div>
      </header>

      <div style={{ padding: '32px 48px 48px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
        {cv.summary && (
          <section>
            <SectionHeading theme={t}>Profile</SectionHeading>
            <p style={{ fontSize: '12px', color: '#555', lineHeight: 1.78, margin: 0 }}>{cv.summary}</p>
          </section>
        )}
        {cv.experience.length > 0 && (
          <section>
            <SectionHeading theme={t}>Work Experience</SectionHeading>
            {cv.experience.map(exp => (
              <div key={exp.id} style={{ paddingLeft: '14px', borderLeft: `2.5px solid ${t.accentLight}`, marginBottom: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#1a1a2e' }}>{exp.role}</span>
                    {exp.company && <span style={{ fontSize: '12px', color: '#888', marginLeft: '6px' }}>at {exp.company}</span>}
                  </div>
                  <span style={{ fontSize: '10px', color: '#aaa', whiteSpace: 'nowrap', marginLeft: '12px', flexShrink: 0 }}>{dateRange(exp.start, exp.end, exp.current)}</span>
                </div>
                {exp.description && <div style={{ fontSize: '11.5px', color: '#555', marginTop: '7px', lineHeight: 1.68, whiteSpace: 'pre-line' }}>{exp.description}</div>}
              </div>
            ))}
          </section>
        )}
        {cv.education.length > 0 && (
          <section>
            <SectionHeading theme={t}>Education</SectionHeading>
            {cv.education.map(edu => (
              <div key={edu.id} style={{ paddingLeft: '14px', borderLeft: `2.5px solid ${t.accentLight}`, marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <p style={{ fontSize: '12px', fontWeight: 600, color: '#1a1a2e', margin: 0 }}>{[edu.degree, edu.field].filter(Boolean).join(' in ')}</p>
                    <p style={{ fontSize: '11px', color: '#777', margin: '2px 0 0' }}>{edu.institution}{edu.gpa ? ` · GPA ${edu.gpa}` : ''}</p>
                  </div>
                  <span style={{ fontSize: '10px', color: '#aaa', whiteSpace: 'nowrap', marginLeft: '12px' }}>{dateRange(edu.start, edu.end, false)}</span>
                </div>
              </div>
            ))}
          </section>
        )}
        {(cv.skills.length > 0 || cv.languages.length > 0) && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
            {cv.skills.length > 0 && (
              <section>
                <SectionHeading theme={t}>Skills</SectionHeading>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                  {cv.skills.map(s => (
                    <span key={s} style={{ fontSize: '10px', padding: '3px 10px', background: t.accentLight, border: `1px solid ${t.accent}`, borderRadius: '12px', color: t.primary }}>{s}</span>
                  ))}
                </div>
              </section>
            )}
            {cv.languages.length > 0 && (
              <section>
                <SectionHeading theme={t}>Languages</SectionHeading>
                {cv.languages.map(l => (
                  <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid #f4f4f4', fontSize: '11px' }}>
                    <span style={{ color: '#333' }}>{l.name}</span>
                    <span style={{ fontSize: '10px', color: t.accent, fontWeight: 600 }}>{l.level}</span>
                  </div>
                ))}
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  )
}