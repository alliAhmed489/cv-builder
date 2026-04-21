import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { Button } from '../ui/Button.jsx'

const SUGGESTIONS = ['JavaScript','TypeScript','React','Node.js','Python','SQL','Docker','AWS','Git','Figma','Leadership','Agile']

export function SkillsForm({ skills, addSkill, removeSkill }) {
  const [input, setInput] = useState('')

  function handleAdd() {
    addSkill(input)
    setInput('')
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex gap-2">
        <input type="text" value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAdd() } }}
          placeholder="Type a skill and press Enter…"
          className="flex-1 px-3 py-2 rounded-lg border border-stone-200 bg-white text-sm text-navy-500 placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-navy-500/20 focus:border-navy-400 transition-colors" />
        <Button variant="primary" size="md" onClick={handleAdd} disabled={!input.trim()}>
          <Plus size={14} /> Add
        </Button>
      </div>
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {skills.map(skill => (
            <span key={skill} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-navy-500 text-white rounded-full text-xs font-medium">
              {skill}
              <button type="button" onClick={() => removeSkill(skill)} className="text-white/50 hover:text-white">
                <X size={11} />
              </button>
            </span>
          ))}
        </div>
      )}
      <div>
        <p className="text-xs text-stone-400 mb-2">Suggestions — click to add</p>
        <div className="flex flex-wrap gap-1.5">
          {SUGGESTIONS.filter(s => !skills.includes(s)).map(s => (
            <button key={s} type="button" onClick={() => addSkill(s)}
              className="px-2.5 py-1 rounded-full border border-stone-200 text-xs text-stone-500 hover:border-navy-400 hover:text-navy-500 transition-all">
              + {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}