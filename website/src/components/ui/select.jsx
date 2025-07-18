import { forwardRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'

const Select = ({ children, onValueChange, ...props }) => {
	const [isOpen, setIsOpen] = useState(false)
	const [value, setValue] = useState('')

	const handleSelect = (selectedValue) => {
		setValue(selectedValue)
		setIsOpen(false)
		onValueChange?.(selectedValue)
	}

	return (
		<div className="relative" {...props}>
			<div onClick={() => setIsOpen(!isOpen)}>
				{children}
			</div>
			{isOpen && (
				<div className="absolute z-50 mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-md">
					{children}
				</div>
			)}
		</div>
	)
}

const SelectTrigger = forwardRef(({ className = '', children, ...props }, ref) => {
	return (
		<button
			ref={ref}
			className={`flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
			{...props}
		>
			{children}
			<ChevronDown className="h-4 w-4 opacity-50" />
		</button>
	)
})

const SelectValue = ({ placeholder, ...props }) => {
	return <span className="text-muted-foreground">{placeholder}</span>
}

const SelectContent = ({ children, ...props }) => {
	return (
		<div
			className="max-h-96 overflow-hidden p-1"
			{...props}
		>
			{children}
		</div>
	)
}

const SelectItem = forwardRef(({ className = '', children, value, ...props }, ref) => {
	return (
		<div
			ref={ref}
			className={`relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 px-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 ${className}`}
			{...props}
		>
			{children}
		</div>
	)
})

SelectTrigger.displayName = 'SelectTrigger'
SelectItem.displayName = 'SelectItem'

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem }