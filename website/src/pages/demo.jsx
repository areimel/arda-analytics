import { Link } from 'react-router-dom'
import { PageHead } from '@/components/seo/page-head'
import { PageHeader } from '@/components/shared/PageHeader'
import { InfoCard } from '@/components/shared/InfoCard'
import { GridCardLayout } from '@/components/shared/GridCardLayout'
import { Button } from '@/components/ui/button'
import { MousePointer, FileText, Eye, Play } from 'lucide-react'

export function DemoPage() {
	const demos = [
		{
			id: 'click-events',
			title: 'Click Events Demo',
			description: 'Interactive demonstration of click event tracking for buttons, links, and CTAs',
			icon: <MousePointer className="h-6 w-6" />,
			href: '/demo/click-events',
			features: ['Button Clicks', 'CTA Tracking', 'Navigation Events', 'Link Tracking'],
			category: 'User Interactions'
		},
		{
			id: 'form-events',
			title: 'Form Events Demo',
			description: 'Form interaction tracking including submissions, field changes, and validation',
			icon: <FileText className="h-6 w-6" />,
			href: '/demo/form-events',
			features: ['Form Submissions', 'Field Changes', 'Validation Events', 'Multi-step Forms'],
			category: 'Conversions'
		},
		{
			id: 'page-view-events',
			title: 'Page View Events Demo',
			description: 'Page view tracking, content engagement, and scroll depth measurement',
			icon: <Eye className="h-6 w-6" />,
			href: '/demo/page-view-events',
			features: ['Page Views', 'Scroll Depth', 'Time on Page', 'Content Engagement'],
			category: 'Engagement'
		}
	]

	return (
		<>
			<PageHead page="demo" />
			<div className="min-h-screen bg-background">
				<div className="container mx-auto px-4 py-8 max-w-6xl">
					{/* Header */}
					<PageHeader 
						title="Interactive Demos"
						description="Experience ARDA Analytics in action with our interactive demonstrations. Each demo showcases different event tracking scenarios with live examples."
						useMono={true}
					/>

					{/* Demos Grid */}
					<GridCardLayout className="mb-12">
						{demos.map((demo) => (
							<InfoCard
								key={demo.id}
								variant="demo"
								title={demo.title}
								description={demo.description}
								icon={demo.icon}
								category={demo.category}
								features={demo.features}
								href={demo.href}
								buttonText="Launch Demo"
								buttonIcon={<Play className="h-4 w-4" />}
							/>
						))}
					</GridCardLayout>

					{/* Getting Started Section */}
					<div className="text-center bg-muted/50 rounded-lg p-8">
						<h2 className="text-2xl font-semibold mb-4">Ready to implement?</h2>
						<p className="text-muted-foreground mb-6 max-w-lg mx-auto">
							After exploring our demos, check out our installation guide and API documentation to start tracking events in your own application.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<Button asChild size="lg">
								<Link to="/docs/installation">Get Started</Link>
							</Button>
							<Button variant="outline" size="lg" asChild>
								<Link to="/docs">View Documentation</Link>
							</Button>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}