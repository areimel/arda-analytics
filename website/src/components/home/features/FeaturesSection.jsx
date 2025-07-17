import { SectionContainer, SectionHeader } from '../shared'
import { FeatureGrid } from './FeatureGrid.jsx'

export function FeaturesSection({ brandInfo, features }) {
	return (
		<SectionContainer>
			<SectionHeader 
				title={`Why Choose ${brandInfo.name}?`}
				description="Built by developers, for developers. Every feature designed with performance and privacy in mind."
			/>
			<FeatureGrid features={features} />
		</SectionContainer>
	)
}