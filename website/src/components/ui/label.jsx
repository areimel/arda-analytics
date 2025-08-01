import { forwardRef } from 'react'

const Label = forwardRef(({ className = '', ...props }, ref) => {
	return (
		<label
			ref={ref}
			className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
			{...props}
		/>
	)
})

Label.displayName = 'Label'

export { Label }