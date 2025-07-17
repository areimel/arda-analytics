import { FeatureItem } from './FeatureItem.jsx'

export function FeatureGrid({ features }) {
	return (
		<div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
			<dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
				{features.primary.map((feature) => (
					<FeatureItem key={feature.title} feature={feature} />
				))}
			</dl>
		</div>
	)
}