import { useTranslation } from 'react-i18next'
import { Globe } from 'lucide-react'
import { motion } from 'framer-motion'

export function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const isEn = i18n.language === 'en'

  const toggleLang = () => {
    i18n.changeLanguage(isEn ? 'ar' : 'en')
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleLang}
      title="Change Language"
      className="group flex items-center justify-center gap-2 px-3 py-1.5 rounded-full border border-[#c9a84c]/20 bg-[#1a1a2e]/60 text-white/80 hover:text-white hover:border-[#c9a84c]/60 hover:bg-[#c9a84c]/10 hover:shadow-[0_0_12px_rgba(201,168,76,0.25)] transition-all duration-300 backdrop-blur-sm shrink-0"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <Globe size={14} className="text-[#c9a84c] group-hover:rotate-12 transition-transform duration-300" />
      <span className="text-[11px] font-bold tracking-wide uppercase mt-[1px]">
        {isEn ? 'عربي' : 'EN'}
      </span>
    </motion.button>
  )
}
