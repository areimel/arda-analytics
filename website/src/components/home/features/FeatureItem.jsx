import * as LucideIcons from 'lucide-react'

export function FeatureItem({ feature }) {
	const IconComponent = LucideIcons[feature.icon.split('-').map(word => 
		word.charAt(0).toUpperCase() + word.slice(1)
	).join('')]
	
	return (
		<div className="relative pl-16">
			<dt className="text-base font-semibold leading-7">
				<div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
					{IconComponent && <IconComponent className="h-6 w-6 text-primary-foreground" aria-hidden="true" />}
				</div>
				{feature.title}
			</dt>
			<dd className="mt-2 text-base leading-7 text-muted-foreground">{feature.description}</dd>
		</div>
	)
}