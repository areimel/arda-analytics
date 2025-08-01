import { Link, useLocation } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

export function MobileNavBarLink({ item, onLinkClick }) {
	const [isExpanded, setIsExpanded] = useState(false)
	const location = useLocation()

	// Check if current page is within this nav item's scope
	const isActive = item.dropdown 
		? item.dropdown.some(dropdownItem => location.pathname === dropdownItem.href)
		: location.pathname === item.href

	// Handle link click for items without dropdown
	const handleDirectLinkClick = () => {
		onLinkClick()
	}

	// Handle accordion toggle
	const handleToggle = () => {
		setIsExpanded(!isExpanded)
	}

	// Handle submenu item click
	const handleSubmenuClick = () => {
		setIsExpanded(false)
		onLinkClick()
	}

	// Single link without dropdown
	if (!item.dropdown) {
		return (
			<Link
				to={item.href}
				className={`-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 transition-colors hover:bg-accent ${
					isActive
						? 'text-primary bg-accent'
						: 'text-muted-foreground'
				}`}
				onClick={handleDirectLinkClick}
			>
				{item.name}
			</Link>
		)
	}

	// Accordion-style link with dropdown
	return (
		<div className="space-y-1">
			{/* Main accordion header */}
			<div className="flex items-center justify-between">
				<Link
					to={item.href}
					className={`flex-1 -mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 transition-colors hover:bg-accent ${
						isActive
							? 'text-primary bg-accent'
							: 'text-muted-foreground'
					}`}
					onClick={handleDirectLinkClick}
				>
					{item.name}
				</Link>
				<button
					onClick={handleToggle}
					className="p-2 text-muted-foreground hover:text-primary transition-colors"
					aria-expanded={isExpanded}
					aria-label={`Toggle ${item.name} submenu`}
				>
					<ChevronDown 
						className={`h-5 w-5 transition-transform duration-200 ${
							isExpanded ? 'rotate-180' : ''
						}`} 
					/>
				</button>
			</div>

			{/* Submenu items */}
			{isExpanded && (
				<div className="pl-4 space-y-1">
					{item.dropdown.map((dropdownItem) => (
						<Link
							key={dropdownItem.href}
							to={dropdownItem.href}
							className={`-mx-3 block rounded-lg px-3 py-2 transition-colors hover:bg-accent/50 ${
								location.pathname === dropdownItem.href
									? 'text-primary bg-accent/50'
									: 'text-muted-foreground'
							}`}
							onClick={handleSubmenuClick}
						>
							<div className="text-sm font-medium">{dropdownItem.name}</div>
							{dropdownItem.description && (
								<div className="text-xs text-muted-foreground/80 mt-1">
									{dropdownItem.description}
								</div>
							)}
						</Link>
					))}
				</div>
			)}
		</div>
	)
} 