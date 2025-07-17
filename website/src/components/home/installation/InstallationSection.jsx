import { SectionContainer, SectionHeader } from '../shared'
import { InstallationCard } from './InstallationCard'
import { getBrandInfo } from '@/lib/content'

export function InstallationSection() {
	const brandInfo = getBrandInfo()
	
	const installationMethods = [
		{
			title: 'CDN (Quick Start)',
			code: `<!-- Add to your HTML head -->
<script src="https://cdn.example.com/${brandInfo.shortName.toLowerCase()}-analytics.min.js"></script>
<script>
  ${brandInfo.shortName}.init({
    apiKey: 'your-api-key',
    trackingId: 'your-tracking-id'
  });
</script>`
		},
		{
			title: 'NPM (Framework)',
			code: `# Install via npm
npm install ${brandInfo.shortName.toLowerCase()}-analytics

# Import and initialize
import ${brandInfo.shortName} from '${brandInfo.shortName.toLowerCase()}-analytics';

${brandInfo.shortName}.init({
  apiKey: 'your-api-key',
  trackingId: 'your-tracking-id'
});`
		}
	]

	return (
		<SectionContainer id="get-started" className="bg-muted/50">
			<SectionHeader 
				title="Get Started in Seconds"
				description="Choose your preferred installation method and start tracking immediately."
			/>
			<div className="mx-auto mt-16 max-w-4xl">
				<div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
					{installationMethods.map((method, index) => (
						<InstallationCard
							key={index}
							title={method.title}
							code={method.code}
						/>
					))}
				</div>
			</div>
		</SectionContainer>
	)
}