import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ArrowLeft } from 'lucide-react'

export function BackButton({ 
	to, 
	label, 
	variant = 'ghost',
	iconType = 'chevron',
	className = '',
	...props 
}) {
	const IconComponent = iconType === 'chevron' ? ChevronLeft : ArrowLeft
	
	return (
		<div className={`mb-6 ${className}`}>
			<Button variant={variant} asChild {...props}>
				<Link to={to}>
					<IconComponent className="h-4 w-4 mr-2" />
					{label}
				</Link>
			</Button>
		</div>
	)
}