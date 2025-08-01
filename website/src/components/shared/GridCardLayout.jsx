export function GridCardLayout({ 
	children, 
	columns = { base: 1, md: 2, lg: 3 }, 
	gap = 8, 
	className = '',
	...props 
}) {
	// Build the responsive grid classes
	const gridClasses = [
		'grid',
		`grid-cols-${columns.base}`,
		columns.md && `md:grid-cols-${columns.md}`,
		columns.lg && `lg:grid-cols-${columns.lg}`,
		columns.xl && `xl:grid-cols-${columns.xl}`,
		`gap-${gap}`,
		className
	].filter(Boolean).join(' ')

	return (
		<div className={gridClasses} {...props}>
			{children}
		</div>
	)
}