import { Link } from 'react-router-dom'
import { PageHead } from '@/components/seo/page-head'
import { TrackingUrlBuilder } from '@/components/tools/TrackingUrlBuilder'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ExternalLink } from 'lucide-react'

export function TrackingUrlBuilderPage() {
	return (
		<>
			<PageHead page="tracking-url-builder" />
			<div className="min-h-screen bg-background">
				<div className="container mx-auto px-4 py-8 max-w-6xl">
					{/* Header */}
					<div className="mb-8">
						<div className="flex items-center gap-4 mb-6">
							<Button asChild variant="outline" size="sm">
								<Link to="/tools">
									<ArrowLeft className="h-4 w-4 mr-2" />
									Back to Tools
								</Link>
							</Button>
						</div>
						<div className="text-center">
							<h1 className="text-4xl font-bold mb-4 font-mono">Tracking URL Builder</h1>
							<p className="text-lg text-muted-foreground max-w-3xl mx-auto">
								Create custom tracking URLs with UTM parameters for your marketing campaigns. 
								Perfect for tracking the performance of your ads, emails, and social media posts.
							</p>
						</div>
					</div>

					{/* Tool */}
					<TrackingUrlBuilder />

					{/* Help Section */}
					<div className="mt-12 bg-muted/50 rounded-lg p-8">
						<h2 className="text-2xl font-semibold mb-4">About UTM Parameters</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
							<div>
								<h3 className="text-lg font-medium mb-3">What are UTM Parameters?</h3>
								<p className="text-muted-foreground mb-4">
									UTM parameters are tags added to URLs that help you track the effectiveness of your marketing campaigns in Google Analytics and other analytics tools.
								</p>
								<div className="space-y-2 text-sm">
									<div><strong>utm_source:</strong> Identifies the source (google, facebook, newsletter)</div>
									<div><strong>utm_medium:</strong> Identifies the medium (cpc, email, social)</div>
									<div><strong>utm_campaign:</strong> Identifies the campaign (summer_sale, product_launch)</div>
									<div><strong>utm_term:</strong> Identifies paid search keywords</div>
									<div><strong>utm_content:</strong> Differentiates similar content or links</div>
								</div>
							</div>
							<div>
								<h3 className="text-lg font-medium mb-3">Best Practices</h3>
								<ul className="text-muted-foreground space-y-2 text-sm">
									<li>• Use consistent naming conventions</li>
									<li>• Keep parameters lowercase</li>
									<li>• Use underscores or hyphens instead of spaces</li>
									<li>• Be descriptive but concise</li>
									<li>• Always include source, medium, and campaign</li>
									<li>• Test your URLs before using them</li>
								</ul>
								<Button asChild variant="outline" size="sm" className="mt-4">
									<a href="https://support.google.com/analytics/answer/1033863" target="_blank" rel="noopener noreferrer">
										Learn More
										<ExternalLink className="h-4 w-4 ml-2" />
									</a>
								</Button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
