export function Button({ children, onClick, variant = 'secondary', size = 'md', disabled = false, className = '', type = 'button' }) {
  const base = 'inline-flex items-center justify-center gap-1.5 font-sans font-medium rounded-lg transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed select-none'
  const sizes = { sm: 'px-3 py-1.5 text-xs', md: 'px-4 py-2 text-sm', lg: 'px-5 py-2.5 text-sm' }
  const variants = {
    primary: 'bg-navy-500 text-white hover:bg-navy-600 active:scale-[0.98] shadow-sm',
    secondary: 'bg-white text-navy-500 border border-stone-200 hover:bg-stone-50 active:scale-[0.98] shadow-sm',
    ghost: 'bg-transparent text-stone-500 hover:bg-stone-100 hover:text-navy-500 active:scale-[0.98]',
    danger: 'bg-transparent text-red-500 hover:bg-red-50 active:scale-[0.98]',
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}>
      {children}
    </button>
  )
}