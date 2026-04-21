import { dateRange } from '../../utils/formatDate.js'

function SectionHeading({ children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
      <h2 style={{ fontFamily: '"DM Serif Display", Georgia, "Times New Roman", serif', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: '#c9a84c', fontWeight: 400, margin: 0, whiteSpace: 'nowrap' }}>
        {children}
      </h2>
      <div style={{ flex: 1, height: '1px', background: '#f0e6c8' }} />
    </div>
  )
}

export function ClassicTemplate({ cv }) {
  const p = cv.personal
  const initials = (p.name || 'CV').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div style={{ fontFamily: '"DM Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif', color: '#1a1a2e', background: '#fff', minHeight: '297mm' }}>
      <header style={{ background: '#1a1a2e', padding: '36px 44px', display: 'flex', alignItems: 'center', gap: '24px' }}>
        <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: '#2d2d4a', border: '2px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"DM Serif Display", Georgia, "Times New Roman", serif', fontSize: '26px', color: '#c9a84c', flexShrink: 0, overflow: 'hidden' }}>
          {p.photo ? <img src={p.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initials}
        </div>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontFamily: '"DM Serif Display", Georgia, "Times New Roman", serif', fontSize: '30px', color: '#fff', margin: 0, lineHeight: 1.1 }}>{p.name || 'Your Name'}</h1>
          {p.title && <p style={{ fontSize: '12px', color: '#c9a84c', marginTop: '5px', fontWeight: 300, letterSpacing: '1.5px', textTransform: 'uppercase' }}>{p.title}</p>}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '14px' }}>
            {p.email && <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)' }}>✉ {p.email}</span>}
            {p.phone && <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)' }}>✆ {p.phone}</span>}
            {p.address && <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)' }}>⊙ {p.address}</span>}
            {p.website && <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)' }}>⊕ {p.website}</span>}
          </div>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px' }}>
        <div style={{ padding: '32px 36px 40px', borderRight: '1px solid #f2f2f2' }}>
          {cv.summary && (
            <section style={{ marginBottom: '28px' }}>
              <SectionHeading>Professional Summary</SectionHeading>
              <p style={{ fontSize: '12px', color: '#555', lineHeight: 1.75, margin: 0 }}>{cv.summary}</p>
            </section>
          )}
          {cv.experience.length > 0 && (
            <section style={{ marginBottom: '28px' }}>
              <SectionHeading>Work Experience</SectionHeading>
              {cv.experience.map((exp, idx) => (
                <div key={exp.id} style={{ marginBottom: idx < cv.experience.length - 1 ? '20px' : 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <p style={{ fontSize: '13px', fontWeight: 600, color: '#1a1a2e', margin: 0 }}>{exp.role}</p>
                      {exp.company && <p style={{ fontSize: '11px', color: '#888', fontStyle: 'italic', margin: '2px 0 0' }}>{exp.company}</p>}
                    </div>
                    <span style={{ fontSize: '10px', color: '#999', background: '#f5f5f3', padding: '2px 8px', borderRadius: '10px', whiteSpace: 'nowrap', marginLeft: '12px', flexShrink: 0 }}>
                      {dateRange(exp.start, exp.end, exp.current)}
                    </span>
                  </div>
                  {exp.description && <div style={{ fontSize: '11.5px', color: '#555', marginTop: '7px', lineHeight: 1.68, whiteSpace: 'pre-line' }}>{exp.description}</div>}
                </div>
              ))}
            </section>
          )}
        </div>

        <div style={{ padding: '28px 22px 40px', background: '#fafafa' }}>
          {cv.education.length > 0 && (
            <section style={{ marginBottom: '24px' }}>
              <SectionHeading>Education</SectionHeading>
              {cv.education.map(edu => (
                <div key={edu.id} style={{ marginBottom: '14px' }}>
                  <p style={{ fontSize: '12px', fontWeight: 600, color: '#1a1a2e', margin: 0 }}>{edu.institution}</p>
                  <p style={{ fontSize: '11px', color: '#777', fontStyle: 'italic', margin: '2px 0 0' }}>{[edu.degree, edu.field].filter(Boolean).join(' in ')}</p>
                  {edu.gpa && <p style={{ fontSize: '10px', color: '#999', margin: '2px 0 0' }}>GPA: {edu.gpa}</p>}
                  <p style={{ fontSize: '10px', color: '#bbb', margin: '2px 0 0' }}>{dateRange(edu.start, edu.end, false)}</p>
                </div>
              ))}
            </section>
          )}
          {cv.skills.length > 0 && (
            <section style={{ marginBottom: '24px' }}>
              <SectionHeading>Skills</SectionHeading>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                {cv.skills.map(s => <span key={s} style={{ fontSize: '10px', padding: '3px 9px', background: '#eef0f6', borderRadius: '10px', color: '#3a3a5c' }}>{s}</span>)}
              </div>
            </section>
          )}
          {cv.languages.length > 0 && (
            <section>
              <SectionHeading>Languages</SectionHeading>
              {cv.languages.map(l => (
                <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0', borderBottom: '1px solid #f0f0f0', fontSize: '11px' }}>
                  <span style={{ color: '#333' }}>{l.name}</span>
                  <span style={{ fontSize: '10px', padding: '1px 7px', background: '#f0e6c8', color: '#8b6914', borderRadius: '10px' }}>{l.level}</span>
                </div>
              ))}
            </section>
          )}
        </div>
      </div>
    </div>
  )
}