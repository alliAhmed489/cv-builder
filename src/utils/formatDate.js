export function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr + '-01')
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

export function dateRange(start, end, current) {
  const s = formatDate(start)
  const e = current ? 'Present' : formatDate(end)
  if (!s && !e) return ''
  if (!s) return e
  if (!e) return s
  return `${s} — ${e}`
}