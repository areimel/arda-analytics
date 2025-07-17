import { SectionContainer } from '../shared/SectionContainer'
import { SectionHeader } from '../shared/SectionHeader'
import { MetricCard } from './MetricCard'

export function MetricsSection({ highlights }) {
	return (
		<SectionContainer className="bg-muted/50">
			<SectionHeader title="Performance Metrics" />
			<div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-3 lg:mx-0 lg:max-w-none">
				{highlights.map((highlight, index) => (
					<MetricCard key={index} highlight={highlight} index={index} />
				))}
			</div>
		</SectionContainer>
	)
}