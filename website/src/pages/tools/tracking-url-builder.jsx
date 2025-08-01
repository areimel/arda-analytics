import { PageHead } from '@/components/seo/page-head'
import { TrackingUrlBuilder } from '@/components/tools/TrackingUrlBuilder'
import { BackButton } from '@/components/shared/BackButton'
import { HelpSection } from '@/components/shared/HelpSection'

export function TrackingUrlBuilderPage() {
	return (
		<>
			<PageHead page="tracking-url-builder" />
			<div className="min-h-screen bg-background">
				<div className="container mx-auto px-4 py-8 max-w-6xl">
					{/* Header */}
					<div className="mb-8">
						<BackButton to="/tools" label="Back to Tools" variant="outline" iconType="arrow" />
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
					<HelpSection
						title="About UTM Parameters"
						className="mt-12"
						sections={[
							{
								title: "What are UTM Parameters?",
								content: (
									<div>
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
								)
							},
							{
								title: "Best Practices",
								items: [
									"Use consistent naming conventions",
									"Keep parameters lowercase",
									"Use underscores or hyphens instead of spaces",
									"Be descriptive but concise",
									"Always include source, medium, and campaign",
									"Test your URLs before using them"
								],
								action: {
									label: "Learn More",
									href: "https://support.google.com/analytics/answer/1033863",
									external: true
								}
							}
						]}
					/>
				</div>
			</div>
		</>
	)
}
