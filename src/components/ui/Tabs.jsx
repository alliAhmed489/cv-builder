export function Tabs({ tabs, active, onChange }) {
  return (
    <div className="flex gap-1 overflow-x-auto px-4 py-2 border-b border-stone-100 bg-white">
      {tabs.map(tab => (
        <button key={tab.id} type="button" onClick={() => onChange(tab.id)}
          className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
            active === tab.id ? 'bg-navy-500 text-white shadow-sm' : 'text-stone-500 hover:bg-stone-100 hover:text-navy-500'
          }`}>
          {tab.label}
        </button>
      ))}
    </div>
  )
}