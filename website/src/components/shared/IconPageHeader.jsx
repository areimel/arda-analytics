export function IconPageHeader({
	icon,
	title,
	description,
	showIconBackground = false,
	iconBgColor = 'bg-primary/10 text-primary',
	className = '',
	...props
}) {
	return (
		<div className={`text-center mb-12 ${className}`} {...props}>
			<div className="flex items-center justify-center gap-3 mb-4">
				{showIconBackground ? (
					<div className={`p-3 rounded-lg ${iconBgColor}`}>
						{icon}
					</div>
				) : (
					icon
				)}
				<h1 className="text-4xl font-bold font-mono">{title}</h1>
			</div>
			<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
				{description}
			</p>
		</div>
	)
}