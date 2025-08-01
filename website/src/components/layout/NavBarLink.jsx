import { Link, useLocation } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

export function NavBarLink({ item }) {
	const [isOpen, setIsOpen] = useState(false)
	const [timeoutId, setTimeoutId] = useState(null)
	const location = useLocation()
	const dropdownRef = useRef(null)

	// Check if current page is within this nav item's scope
	const isActive = item.dropdown 
		? item.dropdown.some(dropdownItem => location.pathname === dropdownItem.href)
		: location.pathname === item.href

	// Handle mouse enter with slight delay for better UX
	const handleMouseEnter = () => {
		if (timeoutId) {
			clearTimeout(timeoutId)
			setTimeoutId(null)
		}
		setIsOpen(true)
	}

	// Handle mouse leave with delay to prevent accidental closes
	const handleMouseLeave = () => {
		const id = setTimeout(() => {
			setIsOpen(false)
		}, 150)
		setTimeoutId(id)
	}

	// Cleanup timeout on unmount
	useEffect(() => {
		return () => {
			if (timeoutId) {
				clearTimeout(timeoutId)
			}
		}
	}, [timeoutId])

	// Handle keyboard navigation
	const handleKeyDown = (e) => {
		if (e.key === 'Escape') {
			setIsOpen(false)
		} else if (e.key === 'Enter' || e.key === ' ') {
			if (item.dropdown) {
				e.preventDefault()
				setIsOpen(!isOpen)
			}
		}
	}

	// Single link without dropdown
	if (!item.dropdown) {
		return (
			<Link
				to={item.href}
				className={`text-sm font-semibold leading-6 transition-colors hover:text-primary ${
					isActive ? 'text-primary' : 'text-muted-foreground'
				}`}
			>
				{item.name}
			</Link>
		)
	}

	// Link with dropdown menu
	return (
		<div 
			className="relative"
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			ref={dropdownRef}
		>
			{/* Main navigation button */}
			<button
				className={`flex items-center space-x-1 text-sm font-semibold leading-6 transition-colors hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md px-2 py-1 ${
					isActive ? 'text-primary' : 'text-muted-foreground'
				}`}
				onKeyDown={handleKeyDown}
				aria-expanded={isOpen}
				aria-haspopup="true"
			>
				<span>{item.name}</span>
				<ChevronDown 
					className={`h-4 w-4 transition-transform duration-200 ${
						isOpen ? 'rotate-180' : ''
					}`} 
				/>
			</button>

			{/* Dropdown menu */}
			{isOpen && (
				<div className="absolute top-full left-0 mt-2 w-80 bg-background border border-border rounded-lg shadow-lg p-2 z-50">
					<div className="space-y-1">
						{item.dropdown.map((dropdownItem) => (
							<Link
								key={dropdownItem.href}
								to={dropdownItem.href}
								className={`block px-3 py-2 rounded-md transition-colors hover:bg-accent hover:text-accent-foreground ${
									location.pathname === dropdownItem.href
										? 'bg-accent text-accent-foreground'
										: 'text-muted-foreground'
								}`}
								onClick={() => setIsOpen(false)}
							>
								<div className="font-medium text-sm">{dropdownItem.name}</div>
								{dropdownItem.description && (
									<div className="text-xs text-muted-foreground mt-1">
										{dropdownItem.description}
									</div>
								)}
							</Link>
						))}
					</div>
				</div>
			)}
		</div>
	)
} 