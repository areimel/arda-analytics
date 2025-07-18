import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PageHead } from '@/components/seo/page-head'
import { LiveEventViewer } from '@/components/demo/LiveEventViewer'
import { BackButton } from '@/components/shared/BackButton'
import { IconPageHeader } from '@/components/shared/IconPageHeader'
import { StatusCard } from '@/components/shared/StatusCard'
import { CodeDisplayCard } from '@/components/shared/CodeDisplayCard'
import { MousePointer, ExternalLink, Download, Star, Play } from 'lucide-react'
import { useState, useEffect } from 'react'
import { getBrandInfo } from '@/lib/content'

export function ClickEventsPage() {
	const [pluginLoaded, setPluginLoaded] = useState(false)
	const brandInfo = getBrandInfo()

	// Initialize ARDA Analytics plugin
	useEffect(() => {
		const initPlugin = async () => {
			if (typeof window !== 'undefined') {
				window.dataLayer = window.dataLayer || []
				
				window.ARDAAnalytics = {
					pushToDataLayer: (eventName) => {
						try {
							const gtmEvent = {
								event: "CustomEvent",
								eventLabel: eventName
							}
							
							window.dataLayer.push(gtmEvent)
							
							window.dispatchEvent(new CustomEvent('arda-event-logged', {
								detail: {
									eventName: eventName,
									success: true,
									timestamp: Date.now(),
									metadata: { gtmEvent }
								}
							}))
							
							console.log('ARDA Analytics - Event pushed:', eventName, gtmEvent)
							return { success: true, eventData: gtmEvent }
						} catch (error) {
							console.error('ARDA Analytics - Event push failed:', error)
							
							window.dispatchEvent(new CustomEvent('arda-event-logged', {
								detail: {
									eventName: eventName,
									success: false,
									timestamp: Date.now(),
									metadata: { error: error.message }
								}
							}))
							
							return { success: false, error: error.message }
						}
					}
				}
				
				console.log('ARDA Analytics Demo Plugin Initialized')
				setPluginLoaded(true)
			}
		}

		initPlugin()
	}, [])

	const triggerEvent = (eventName) => {
		if (window.ARDAAnalytics) {
			window.ARDAAnalytics.pushToDataLayer(eventName)
		}
	}

	return (
		<>
			<PageHead page="click-events-demo" />
			<div className="min-h-screen bg-background">
				<div className="container mx-auto px-4 py-8 max-w-6xl">
					{/* Back Navigation */}
					<BackButton to="/demo" label="Back to Demos" variant="ghost" />

					{/* Header */}
					<IconPageHeader
						icon={<MousePointer className="h-8 w-8" />}
						title="Click Events Demo"
						description="Interactive demonstration of click event tracking. Each button below triggers a different event type. Watch the floating event viewer to see events in real-time."
						showIconBackground={true}
					/>

					{/* Plugin Status */}
					<div className="mb-8">
						<StatusCard
							status={pluginLoaded ? 'ready' : 'loading'}
							message={pluginLoaded ? 'ARDA Analytics Plugin Ready (Demo Mode)' : 'Loading plugin...'}
						/>
					</div>

					{/* Interactive Demo Section */}
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
						{/* CTA Buttons */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Play className="h-5 w-5" />
									Call-to-Action Buttons
								</CardTitle>
								<CardDescription>
									Primary and secondary CTA tracking for conversion optimization
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<Button 
									size="lg" 
									className="w-full"
									onClick={() => triggerEvent('cta_primary_click')}
								>
									Get Started Free
								</Button>
								<Button 
									variant="outline" 
									size="lg" 
									className="w-full"
									onClick={() => triggerEvent('cta_secondary_click')}
								>
									View Pricing
								</Button>
								<Button 
									variant="ghost" 
									size="lg" 
									className="w-full"
									onClick={() => triggerEvent('cta_tertiary_click')}
								>
									Learn More
								</Button>
							</CardContent>
						</Card>

						{/* Navigation Events */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<ExternalLink className="h-5 w-5" />
									Navigation Events
								</CardTitle>
								<CardDescription>
									Track user navigation patterns and menu interactions
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<Button 
									variant="outline" 
									className="w-full"
									onClick={() => triggerEvent('navigation_menu_click')}
								>
									Main Menu Click
								</Button>
								<Button 
									variant="outline" 
									className="w-full"
									onClick={() => triggerEvent('footer_link_click')}
								>
									Footer Link Click
								</Button>
								<Button 
									variant="outline" 
									className="w-full"
									onClick={() => triggerEvent('breadcrumb_click')}
								>
									Breadcrumb Navigation
								</Button>
							</CardContent>
						</Card>

						{/* Content Engagement */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Download className="h-5 w-5" />
									Content Interaction
								</CardTitle>
								<CardDescription>
									Track user engagement with content and resources
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<Button 
									variant="outline" 
									className="w-full"
									onClick={() => triggerEvent('resource_download')}
								>
									Download Resource
								</Button>
								<Button 
									variant="outline" 
									className="w-full"
									onClick={() => triggerEvent('documentation_viewed')}
								>
									View Documentation
								</Button>
								<Button 
									variant="outline" 
									className="w-full"
									onClick={() => triggerEvent('external_link_clicked')}
								>
									External Link Click
								</Button>
							</CardContent>
						</Card>

						{/* Social Actions */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Star className="h-5 w-5" />
									Social Interactions
								</CardTitle>
								<CardDescription>
									Track social engagement and sharing behavior
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<Button 
									variant="outline" 
									className="w-full"
									onClick={() => triggerEvent('social_share_twitter')}
								>
									Share on Twitter
								</Button>
								<Button 
									variant="outline" 
									className="w-full"
									onClick={() => triggerEvent('social_share_linkedin')}
								>
									Share on LinkedIn
								</Button>
								<Button 
									variant="outline" 
									className="w-full"
									onClick={() => triggerEvent('newsletter_signup_click')}
								>
									Newsletter Signup
								</Button>
							</CardContent>
						</Card>
					</div>

					{/* Code Example */}
					<CodeDisplayCard
						title="Implementation Example"
						description="How to implement click tracking in your application"
						code={`// React Component Example
import { useEffect } from 'react';
import ARDAAnalytics from '@arda-analytics/plugin';

function MyComponent() {
  useEffect(() => {
    // Initialize plugin
    const analytics = new ARDAAnalytics({ debug: true });
    window.ARDAAnalytics = analytics;
  }, []);

  const handleCtaClick = () => {
    // Track primary CTA click
    window.ARDAAnalytics.pushEvent('cta_primary_click');
  };

  const handleResourceDownload = () => {
    // Track resource download
    window.ARDAAnalytics.pushEvent('resource_download');
  };

  return (
    <div>
      <button onClick={handleCtaClick}>
        Get Started Free
      </button>
      <button onClick={handleResourceDownload}>
        Download Guide
      </button>
    </div>
  );
}

// HTML Example
<button onclick="window.ARDAAnalytics.pushEvent('cta_primary_click')">
  Get Started
</button>

<a href="/guide.pdf" 
   onclick="window.ARDAAnalytics.pushEvent('resource_download')">
  Download Guide
</a>`}
						className="mb-8"
					/>

					{/* Event Naming Guide */}
					<CodeDisplayCard
						title="Click Event Naming Convention"
						description="Recommended patterns for naming click events"
						code={`// Call-to-Action Events
cta_primary_click
cta_secondary_click
cta_hero_banner_click

// Navigation Events
navigation_menu_click
footer_link_click
breadcrumb_click

// Content Events
resource_download
documentation_viewed
external_link_clicked

// Social Events
social_share_twitter
social_share_linkedin
newsletter_signup_click`}
						showCopy={false}
					/>
				</div>
			</div>
			
			{/* Floating Live Event Viewer */}
			<LiveEventViewer />
		</>
	)
}