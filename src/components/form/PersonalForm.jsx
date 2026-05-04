import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Camera, X } from 'lucide-react'
import { Input } from '../ui/Input.jsx'

export function PersonalForm({ personal, updatePersonal }) {
  const { t } = useTranslation()
  const fileRef = useRef(null)
  const initials = (personal.name || 'CV').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  const p = field => e => updatePersonal(field, e.target.value)

  function handlePhoto(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => updatePersonal('photo', ev.target.result)
    reader.readAsDataURL(file)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

      {/* Photo */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 16px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)' }}
      >
        <div style={{ width: '48px', height: '48px', borderRadius: '50%', flexShrink: 0, overflow: 'hidden', background: 'rgba(201,168,76,0.1)', border: '2px solid rgba(201,168,76,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {personal.photo
            ? <img src={personal.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <span style={{ fontSize: '15px', fontWeight: 700, color: '#c9a84c' }}>{initials}</span>
          }
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ margin: '0 0 2px', fontSize: '12px', fontWeight: 600, color: '#fff' }}>{t('personal.photo')}</p>
          <p style={{ margin: 0, fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>{t('personal.photo_hint')}</p>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          {personal.photo && (
            <motion.button whileTap={{ scale: 0.9 }} type="button" onClick={() => updatePersonal('photo', '')}
              style={{ width: '32px', height: '32px', borderRadius: '9px', border: 'none', background: 'rgba(239,68,68,0.12)', color: '#f87171', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <X size={13} />
            </motion.button>
          )}
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.94 }} type="button" onClick={() => fileRef.current?.click()}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0 13px', height: '32px', borderRadius: '9px', border: 'none', background: 'linear-gradient(135deg, #c9a84c, #e8cc7a)', color: '#1a1a2e', fontSize: '11px', fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
            <Camera size={12} /> {personal.photo ? t('personal.change') : t('personal.upload')}
          </motion.button>
        </div>
        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhoto} />
      </motion.div>

      <Input dark label={t('personal.full_name')}          id="pf-name"    value={personal.name}    onChange={p('name')}    placeholder={t('personal.name_placeholder')} />
      <Input dark label={t('personal.job_title')}          id="pf-title"   value={personal.title}   onChange={p('title')}   placeholder={t('personal.title_placeholder')} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <Input dark label={t('personal.email')} id="pf-email" type="email" value={personal.email} onChange={p('email')} placeholder={t('personal.email_placeholder')} />
        <Input dark label={t('personal.phone')} id="pf-phone" type="tel"   value={personal.phone} onChange={p('phone')} placeholder={t('personal.phone_placeholder')} />
      </div>
      <Input dark label={t('personal.address')}            id="pf-address" value={personal.address} onChange={p('address')} placeholder={t('personal.address_placeholder')} />
      <Input dark label={t('personal.website')} id="pf-website" value={personal.website} onChange={p('website')} placeholder={t('personal.website_placeholder')} />
    </div>
  )
}