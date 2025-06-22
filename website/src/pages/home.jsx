import { Button } from '@/components/ui/button'
import { PageHead } from '@/components/seo/page-head'
import { Link } from 'react-router-dom'
import * as LucideIcons from 'lucide-react'
import { getBrandInfo, getFeatures, getFeatureColorClasses, getSiteMetadata, getProductInfo } from '@/lib/content'

export function HomePage() {
	// Get content from JSON
	const brandInfo = getBrandInfo()
	const features = getFeatures()
	const siteData = getSiteMetadata()
	const productInfo = getProductInfo()

	return (
		<>
			<PageHead page="home" />
			<div className="flex flex-col">
				{/* Hero Section */}
				<section className="relative isolate px-6 pt-14 lg:px-8">
					<div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
						<div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-secondary opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
					</div>
					<div className="mx-auto max-w-4xl py-32 sm:py-48 lg:py-56">
						<div className="text-center">
							<h1 className="text-4xl font-bold tracking-tight sm:text-6xl font-mono">
								{brandInfo.tagline.split(' ').slice(0, -1).join(' ')}{' '}
								<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
									{brandInfo.tagline.split(' ').slice(-1)[0]}
								</span>
							</h1>
							<p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
								{siteData.description}
							</p>
							<div className="mt-10 flex items-center justify-center gap-x-6">
								<Button asChild size="lg">
									<Link to="/demo">Try Live Demo</Link>
								</Button>
								<Button asChild variant="outline" size="lg">
									<Link to="/docs">Read Docs</Link>
								</Button>
							</div>
							<div className="mt-8 flex items-center justify-center space-x-8 text-sm text-muted-foreground">
								<div className="flex items-center space-x-2">
									<LucideIcons.Code2 className="h-4 w-4" />
									<span className="font-mono">{productInfo.bundleSize} gzipped</span>
								</div>
								<div className="flex items-center space-x-2">
									<LucideIcons.Shield className="h-4 w-4" />
									<span>GDPR Compliant</span>
								</div>
								<div className="flex items-center space-x-2">
									<LucideIcons.Zap className="h-4 w-4" />
									<span>Zero Dependencies</span>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Installation Section */}
				<section id="get-started" className="py-24 sm:py-32 bg-muted/50">
					<div className="mx-auto max-w-7xl px-6 lg:px-8">
						<div className="mx-auto max-w-2xl text-center">
							<h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-mono">Get Started in Seconds</h2>
							<p className="mt-4 text-lg text-muted-foreground">
								Choose your preferred installation method and start tracking immediately.
							</p>
						</div>
						<div className="mx-auto mt-16 max-w-4xl">
							<div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
								{/* CDN Installation */}
								<div className="rounded-lg border bg-card p-8">
									<h3 className="text-xl font-semibold mb-4 font-mono">CDN (Quick Start)</h3>
									<div className="bg-muted rounded-md p-4 font-mono text-sm overflow-x-auto">
										<pre>{`<!-- Add to your HTML head -->
<script src="https://cdn.example.com/${brandInfo.shortName.toLowerCase()}-analytics.min.js"></script>
<script>
  ${brandInfo.shortName}.init({
    apiKey: 'your-api-key',
    trackingId: 'your-tracking-id'
  });
</script>`}</pre>
									</div>
								</div>

								{/* NPM Installation */}
								<div className="rounded-lg border bg-card p-8">
									<h3 className="text-xl font-semibold mb-4 font-mono">NPM (Framework)</h3>
									<div className="bg-muted rounded-md p-4 font-mono text-sm overflow-x-auto">
										<pre>{`# Install via npm
npm install ${brandInfo.shortName.toLowerCase()}-analytics

# Import and initialize
import ${brandInfo.shortName} from '${brandInfo.shortName.toLowerCase()}-analytics';

${brandInfo.shortName}.init({
  apiKey: 'your-api-key',
  trackingId: 'your-tracking-id'
});`}</pre>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Features Section */}
				<section className="py-24 sm:py-32">
					<div className="mx-auto max-w-7xl px-6 lg:px-8">
						<div className="mx-auto max-w-2xl text-center">
							<h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-mono">Why Choose {brandInfo.name}?</h2>
							<p className="mt-4 text-lg text-muted-foreground">
								Built by developers, for developers. Every feature designed with performance and privacy in mind.
							</p>
						</div>
						<div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
							<dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
								{features.primary.map((feature) => {
									const IconComponent = LucideIcons[feature.icon.split('-').map(word => 
										word.charAt(0).toUpperCase() + word.slice(1)
									).join('')]
									
									return (
										<div key={feature.title} className="relative pl-16">
											<dt className="text-base font-semibold leading-7">
												<div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
													{IconComponent && <IconComponent className="h-6 w-6 text-primary-foreground" aria-hidden="true" />}
												</div>
												{feature.title}
											</dt>
											<dd className="mt-2 text-base leading-7 text-muted-foreground">{feature.description}</dd>
										</div>
									)
								})}
							</dl>
						</div>
					</div>
				</section>

				{/* Performance Metrics Section */}
				<section className="py-24 sm:py-32 bg-muted/50">
					<div className="mx-auto max-w-7xl px-6 lg:px-8">
						<div className="mx-auto max-w-2xl text-center">
							<h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-mono">Performance Metrics</h2>
						</div>
						<div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-3 lg:mx-0 lg:max-w-none">
							{features.highlights.map((highlight, index) => (
								<div key={index} className="rounded-lg bg-card p-8 text-center border">
									<div className="text-3xl font-bold font-mono text-primary mb-2">
										{highlight.value}
									</div>
									<div className="text-sm font-medium text-muted-foreground">
										{highlight.description}
									</div>
									<div className="text-xs text-muted-foreground mt-1">
										{highlight.label}
									</div>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* CTA Section */}
				<section className="bg-muted/50">
					<div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
						<div className="mx-auto max-w-2xl text-center">
							<h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-mono">
								Ready to get started?
							</h2>
							<p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
								Join thousands of developers who trust {brandInfo.name} for their tracking needs.
							</p>
							<div className="mt-10 flex items-center justify-center gap-x-6">
								<Button asChild size="lg">
									<Link to="/demo">Try Live Demo</Link>
								</Button>
								<Button asChild variant="outline" size="lg">
									<a href={siteData.github} target="_blank" rel="noopener noreferrer">
										View on GitHub
									</a>
								</Button>
							</div>
						</div>
					</div>
				</section>
			</div>
		</>
	)
} 