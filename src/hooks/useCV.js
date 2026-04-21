import { useState, useCallback } from 'react'
import { demoCV } from '../data/defaultCV.js'
import { uid } from '../utils/uid.js'

export function useCV() {
  const [cv, setCV] = useState(demoCV)
  const [template, setTemplate] = useState('classic')

  const updatePersonal = useCallback((field, value) => {
    setCV(prev => ({ ...prev, personal: { ...prev.personal, [field]: value } }))
  }, [])

  const updateSummary = useCallback((value) => {
    setCV(prev => ({ ...prev, summary: value }))
  }, [])

  const addExperience = useCallback(() => {
    setCV(prev => ({
      ...prev,
      experience: [...prev.experience, { id: uid(), company: '', role: '', start: '', end: '', current: false, description: '' }],
    }))
  }, [])

  const updateExperience = useCallback((id, field, value) => {
    setCV(prev => ({
      ...prev,
      experience: prev.experience.map(e => e.id === id ? { ...e, [field]: value } : e),
    }))
  }, [])

  const removeExperience = useCallback((id) => {
    setCV(prev => ({ ...prev, experience: prev.experience.filter(e => e.id !== id) }))
  }, [])

  const addEducation = useCallback(() => {
    setCV(prev => ({
      ...prev,
      education: [...prev.education, { id: uid(), institution: '', degree: '', field: '', start: '', end: '', gpa: '' }],
    }))
  }, [])

  const updateEducation = useCallback((id, field, value) => {
    setCV(prev => ({
      ...prev,
      education: prev.education.map(e => e.id === id ? { ...e, [field]: value } : e),
    }))
  }, [])

  const removeEducation = useCallback((id) => {
    setCV(prev => ({ ...prev, education: prev.education.filter(e => e.id !== id) }))
  }, [])

  const addSkill = useCallback((skill) => {
    const trimmed = skill.trim()
    if (!trimmed) return
    setCV(prev => prev.skills.includes(trimmed) ? prev : { ...prev, skills: [...prev.skills, trimmed] })
  }, [])

  const removeSkill = useCallback((skill) => {
    setCV(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }))
  }, [])

  const addLanguage = useCallback(() => {
    setCV(prev => ({
      ...prev,
      languages: [...prev.languages, { id: uid(), name: '', level: 'Intermediate' }],
    }))
  }, [])

  const updateLanguage = useCallback((id, field, value) => {
    setCV(prev => ({
      ...prev,
      languages: prev.languages.map(l => l.id === id ? { ...l, [field]: value } : l),
    }))
  }, [])

  const removeLanguage = useCallback((id) => {
    setCV(prev => ({ ...prev, languages: prev.languages.filter(l => l.id !== id) }))
  }, [])

  const resetCV = useCallback(() => setCV(demoCV), [])

  return {
    cv, template, setTemplate,
    updatePersonal, updateSummary,
    addExperience, updateExperience, removeExperience,
    addEducation, updateEducation, removeEducation,
    addSkill, removeSkill,
    addLanguage, updateLanguage, removeLanguage,
    resetCV,
  }
}