import { dateRange } from '../../utils/formatDate.js'

function SectionHeading({ children, theme }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
      <div style={{ width: '4px', height: '18px', background: theme.primary, borderRadius: '2px', flexShrink: 0 }} />
      <h2 style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: theme.primary, fontWeight: 700, margin: 0 }}>
        {children}
      </h2>
      <div style={{ flex: 1, height: '1px', background: '#e8e8e4' }} />
    </div>
  )
}

export function ExecutiveTemplate({ cv, theme }) {
  const t = theme || { primary: '#1a1a2e', accent: '#c9a84c', accentLight: '#f0e6c8', headerBg: '#1a1a2e', headerText: '#ffffff' }
  const p = cv.personal
  const initials = (p.name || 'CV').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  const firstName = (p.name || 'Your Name').split(' ')[0]
  const lastName  = (p.name || '').split(' ').slice(1).join(' ')

  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif', color: '#1a1a2e', background: '#fff', minHeight: '297mm' }}>

      {/* HEADER */}
      <header style={{ display: 'flex', borderBottom: `3px solid ${t.primary}` }}>
        <div style={{ flex: 1, padding: '40px 36px 32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ width: '32px', height: '3px', background: t.accent }} />
            {p.title && <span style={{ fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', color: t.accent, fontWeight: 600 }}>{p.title}</span>}
          </div>
          <h1 style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: '42px', color: t.primary, margin: 0, lineHeight: 1, letterSpacing: '-1px', fontWeight: 700 }}>
            {firstName}
          </h1>
          <h1 style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: '42px', color: t.accent, margin: 0, lineHeight: 1.1, letterSpacing: '-1px', fontWeight: 700 }}>
            {lastName}
          </h1>
        </div>
        <div style={{ width: '220px', flexShrink: 0, background: '#f9f9f7', padding: '32px 24px', borderLeft: '1px solid #ebebeb', display: 'flex', flexDirection: 'column', gap: '10px', justifyContent: 'center' }}>
          {p.photo
            ? <img src={p.photo} alt="" style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: `2px solid ${t.primary}`, marginBottom: '8px' }} />
            : <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: t.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
                <span style={{ fontFamily: 'Georgia, serif', fontSize: '18px', color: t.accent, fontWeight: 700 }}>{initials}</span>
              </div>
          }
          {p.email   && <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ fontSize: '11px', color: '#888' }}>✉</span><span style={{ fontSize: '11px', color: '#555' }}>{p.email}</span></div>}
          {p.phone   && <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ fontSize: '11px', color: '#888' }}>✆</span><span style={{ fontSize: '11px', color: '#555' }}>{p.phone}</span></div>}
          {p.address && <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ fontSize: '11px', color: '#888' }}>⊙</span><span style={{ fontSize: '11px', color: '#555' }}>{p.address}</span></div>}
          {p.website && <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ fontSize: '11px', color: '#888' }}>⊕</span><span style={{ fontSize: '11px', color: '#555' }}>{p.website}</span></div>}
        </div>
      </header>

      {/* BODY */}
      <div style={{ padding: '36px 36px 48px' }}>
        {cv.summary && (
          <div style={{ marginBottom: '32px' }}>
            <SectionHeading theme={t}>Profile</SectionHeading>
            <p style={{ fontSize: '12.5px', color: '#444', lineHeight: 1.8, margin: 0 }}>{cv.summary}</p>
          </div>
        )}
        {cv.experience.length > 0 && (
          <div style={{ marginBottom: '32px' }}>
            <SectionHeading theme={t}>Professional Experience</SectionHeading>
            {cv.experience.map((exp, idx) => (
              <div key={exp.id} style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '0 24px', marginBottom: idx < cv.experience.length - 1 ? '24px' : 0 }}>
                <div style={{ paddingTop: '2px' }}>
                  <p style={{ fontSize: '11px', color: t.accent, fontWeight: 600, margin: '0 0 4px' }}>{dateRange(exp.start, exp.end, exp.current)}</p>
                  <p style={{ fontSize: '11px', color: '#888', margin: 0, fontStyle: 'italic' }}>{exp.company}</p>
                </div>
                <div style={{ borderLeft: `2px solid ${t.accentLight}`, paddingLeft: '20px' }}>
                  <p style={{ fontSize: '13px', fontWeight: 700, color: t.primary, margin: '0 0 6px' }}>{exp.role}</p>
                  {exp.description && <div style={{ fontSize: '11.5px', color: '#555', lineHeight: 1.7, whiteSpace: 'pre-line' }}>{exp.description}</div>}
                </div>
              </div>
            ))}
          </div>
        )}
        {cv.education.length > 0 && (
          <div style={{ marginBottom: '32px' }}>
            <SectionHeading theme={t}>Education</SectionHeading>
            {cv.education.map((edu, idx) => (
              <div key={edu.id} style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '0 24px', marginBottom: idx < cv.education.length - 1 ? '16px' : 0 }}>
                <div style={{ paddingTop: '2px' }}>
                  <p style={{ fontSize: '11px', color: t.accent, fontWeight: 600, margin: '0 0 4px' }}>{dateRange(edu.start, edu.end, false)}</p>
                  {edu.gpa && <p style={{ fontSize: '10px', color: '#aaa', margin: 0 }}>GPA {edu.gpa}</p>}
                </div>
                <div style={{ borderLeft: `2px solid ${t.accentLight}`, paddingLeft: '20px' }}>
                  <p style={{ fontSize: '13px', fontWeight: 700, color: t.primary, margin: '0 0 3px' }}>{[edu.degree, edu.field].filter(Boolean).join(' in ')}</p>
                  <p style={{ fontSize: '11px', color: '#888', margin: 0, fontStyle: 'italic' }}>{edu.institution}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        {(cv.skills.length > 0 || cv.languages.length > 0) && (
          <div style={{ display: 'grid', gridTemplateColumns: cv.languages.length > 0 ? '1fr 200px' : '1fr', gap: '32px' }}>
            {cv.skills.length > 0 && (
              <div>
                <SectionHeading theme={t}>Core Skills</SectionHeading>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {cv.skills.map(s => (
                    <span key={s} style={{ fontSize: '11px', padding: '4px 12px', border: `1px solid ${t.primary}`, borderRadius: '2px', color: t.primary, fontWeight: 500 }}>{s}</span>
                  ))}
                </div>
              </div>
            )}
            {cv.languages.length > 0 && (
              <div>
                <SectionHeading theme={t}>Languages</SectionHeading>
                {cv.languages.map(l => (
                  <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0', borderBottom: '1px solid #f0f0f0', fontSize: '12px' }}>
                    <span style={{ color: t.primary, fontWeight: 500 }}>{l.name}</span>
                    <span style={{ fontSize: '10px', color: '#888' }}>{l.level}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}