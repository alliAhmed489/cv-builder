import { dateRange } from '../../utils/formatDate.js'

// ── Default theme fallback (navy/gold) ──
const DEFAULT_THEME = {
  primary:      '#1a1a2e',
  accent:       '#c9a84c',
  accentLight:  '#f0e6c8',
  headerBg:     '#1a1a2e',
  headerText:   '#ffffff',
}

// ── Sub-components receive theme ──

function SectionHeading({ children, theme }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
      <h2 style={{
        fontFamily: '"DM Serif Display", serif',
        fontSize: '10px',
        letterSpacing: '2px',
        textTransform: 'uppercase',
        color: theme.accent,
        fontWeight: 400,
        margin: 0,
        whiteSpace: 'nowrap',
      }}>
        {children}
      </h2>
      <div style={{ flex: 1, height: '1px', background: theme.accentLight }} />
    </div>
  )
}

function ContactBadge({ icon, value }) {
  if (!value) return null
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '4px',
      fontSize: '11px', color: 'rgba(255,255,255,0.72)',
    }}>
      <span style={{ fontSize: '10px', opacity: 0.8 }}>{icon}</span>
      {value}
    </span>
  )
}

// ── Main component ──
export function ClassicTemplate({ cv, theme }) {
  // Always merge with defaults so missing keys never crash
  const t = { ...DEFAULT_THEME, ...theme }
  const p = cv.personal

  const initials = (p.name || 'CV')
    .split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif',
      color: '#1a1a2e',
      background: '#ffffff',
      minHeight: '297mm',
    }}>

      {/* ══ HEADER ══ */}
      <header style={{
        background: t.headerBg,
        padding: '36px 44px',
        display: 'flex',
        alignItems: 'center',
        gap: '24px',
      }}>
        {/* Avatar */}
        <div style={{
          width: '72px', height: '72px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)',
          border: '2px solid rgba(255,255,255,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'Georgia, serif',
          fontSize: '26px', color: t.accent,
          flexShrink: 0, overflow: 'hidden',
        }}>
          {p.photo
            ? <img src={p.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : initials
          }
        </div>

        {/* Name block */}
        <div style={{ flex: 1 }}>
          <h1 style={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: '30px',
            color: t.headerText,
            margin: 0, lineHeight: 1.1,
          }}>
            {p.name || 'Your Name'}
          </h1>

          {p.title && (
            <p style={{
              fontSize: '12px', color: t.accent,
              marginTop: '5px', fontWeight: 400,
              letterSpacing: '1.5px', textTransform: 'uppercase',
            }}>
              {p.title}
            </p>
          )}

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '14px' }}>
            <ContactBadge icon="✉" value={p.email} />
            <ContactBadge icon="✆" value={p.phone} />
            <ContactBadge icon="⊙" value={p.address} />
            <ContactBadge icon="⊕" value={p.website} />
          </div>
        </div>
      </header>

      {/* ══ BODY ══ */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px' }}>

        {/* Left column */}
        <div style={{ padding: '32px 36px 40px', borderRight: '1px solid #f2f2f2' }}>

          {cv.summary && (
            <section style={{ marginBottom: '28px' }}>
              <SectionHeading theme={t}>Professional Summary</SectionHeading>
              <p style={{ fontSize: '12px', color: '#555', lineHeight: 1.75, margin: 0 }}>
                {cv.summary}
              </p>
            </section>
          )}

          {cv.experience.length > 0 && (
            <section style={{ marginBottom: '28px' }}>
              <SectionHeading theme={t}>Work Experience</SectionHeading>
              {cv.experience.map((exp, idx) => (
                <div key={exp.id} style={{ marginBottom: idx < cv.experience.length - 1 ? '20px' : 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <p style={{ fontSize: '13px', fontWeight: 600, color: t.primary, margin: 0 }}>
                        {exp.role || 'Role'}
                      </p>
                      {exp.company && (
                        <p style={{ fontSize: '11px', color: '#888', fontStyle: 'italic', marginTop: '2px', marginBottom: 0 }}>
                          {exp.company}
                        </p>
                      )}
                    </div>
                    <span style={{
                      fontSize: '10px', color: '#999',
                      background: '#f5f5f3', padding: '2px 8px',
                      borderRadius: '10px', whiteSpace: 'nowrap',
                      marginLeft: '12px', flexShrink: 0,
                    }}>
                      {dateRange(exp.start, exp.end, exp.current)}
                    </span>
                  </div>
                  {exp.description && (
                    <div style={{
                      fontSize: '11.5px', color: '#555',
                      marginTop: '7px', lineHeight: 1.68,
                      whiteSpace: 'pre-line',
                    }}>
                      {exp.description}
                    </div>
                  )}
                </div>
              ))}
            </section>
          )}

          {cv.experience.length === 0 && !cv.summary && (
            <p style={{ fontSize: '12px', color: '#ccc', fontStyle: 'italic' }}>
              Fill in the form on the left to populate your CV.
            </p>
          )}
        </div>

        {/* Right / sidebar column */}
        <div style={{ padding: '28px 22px 40px', background: '#fafafa' }}>

          {cv.education.length > 0 && (
            <section style={{ marginBottom: '24px' }}>
              <SectionHeading theme={t}>Education</SectionHeading>
              {cv.education.map((edu, idx) => (
                <div key={edu.id} style={{ marginBottom: idx < cv.education.length - 1 ? '14px' : 0 }}>
                  <p style={{ fontSize: '12px', fontWeight: 600, color: t.primary, margin: 0 }}>
                    {edu.institution}
                  </p>
                  <p style={{ fontSize: '11px', color: '#777', fontStyle: 'italic', margin: '2px 0 0' }}>
                    {[edu.degree, edu.field].filter(Boolean).join(' in ')}
                  </p>
                  {edu.gpa && (
                    <p style={{ fontSize: '10px', color: '#999', margin: '2px 0 0' }}>GPA: {edu.gpa}</p>
                  )}
                  <p style={{ fontSize: '10px', color: '#bbb', margin: '2px 0 0' }}>
                    {dateRange(edu.start, edu.end, false)}
                  </p>
                </div>
              ))}
            </section>
          )}

          {cv.skills.length > 0 && (
            <section style={{ marginBottom: '24px' }}>
              <SectionHeading theme={t}>Skills</SectionHeading>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                {cv.skills.map(s => (
                  <span key={s} style={{
                    fontSize: '10px', padding: '3px 9px',
                    background: t.accentLight,
                    borderRadius: '10px',
                    color: t.primary,
                  }}>
                    {s}
                  </span>
                ))}
              </div>
            </section>
          )}

          {cv.languages.length > 0 && (
            <section>
              <SectionHeading theme={t}>Languages</SectionHeading>
              {cv.languages.map(l => (
                <div key={l.id} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '5px 0', borderBottom: '1px solid #f0f0f0', fontSize: '11px',
                }}>
                  <span style={{ color: '#333' }}>{l.name}</span>
                  <span style={{
                    fontSize: '10px', padding: '1px 7px',
                    background: t.accentLight, color: t.primary,
                    borderRadius: '10px',
                  }}>
                    {l.level}
                  </span>
                </div>
              ))}
            </section>
          )}
        </div>
      </div>
    </div>
  )
}