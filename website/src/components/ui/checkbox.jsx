import { forwardRef } from 'react'
import { Check } from 'lucide-react'

const Checkbox = forwardRef(({ className = '', checked, onCheckedChange, ...props }, ref) => {
	return (
		<button
			ref={ref}
			role="checkbox"
			aria-checked={checked}
			onClick={() => onCheckedChange?.(!checked)}
			className={`peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground ${className}`}
			data-state={checked ? 'checked' : 'unchecked'}
			{...props}
		>
			{checked && <Check className="h-4 w-4" />}
		</button>
	)
})

Checkbox.displayName = 'Checkbox'

export { Checkbox }