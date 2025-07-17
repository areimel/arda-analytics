export function IconWrapper({ icon: Icon, className = "" }) {
	return (
		<div className={`absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary ${className}`}>
			{Icon && <Icon className="h-6 w-6 text-primary-foreground" aria-hidden="true" />}
		</div>
	)
}