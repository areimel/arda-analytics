import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PageHead } from '@/components/seo/page-head'
import { Play, Code, Activity, MousePointer, Eye, Clock } from 'lucide-react'
import { useState } from 'react'
import { getBrandInfo, getProductInfo } from '@/lib/content'

export function DemoPage() {
	const [events, setEvents] = useState([])
	
	// Get content from JSON
	const brandInfo = getBrandInfo()
	const productInfo = getProductInfo()

	const trackEvent = (eventType) => {
		const event = {
			type: eventType,
			timestamp: new Date().toLocaleTimeString()
		}
		setEvents(prev => [event, ...prev.slice(0, 9)])
	}

	return (
		<>
			<PageHead page="demo" />
			<div className="container mx-auto px-6 py-8">
				<div className="max-w-4xl mx-auto">
					<div className="text-center mb-12">
						<h1 className="text-4xl font-bold font-mono mb-4">Interactive Demo</h1>
						<p className="text-lg text-muted-foreground">
							See {brandInfo.name} in action. Click the buttons below to trigger events and watch them appear in real-time.
						</p>
					</div>
					
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center space-x-2">
									<Play className="h-5 w-5" />
									<span>Event Triggers</span>
								</CardTitle>
								<CardDescription>
									Try different analytics events and see them tracked in real-time
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="grid grid-cols-2 gap-2">
									<Button 
										onClick={() => trackEvent('button_click')}
										size="sm"
									>
										<MousePointer className="h-4 w-4 mr-2" />
										Button Click
									</Button>
									<Button 
										variant="outline"
										onClick={() => trackEvent('page_scroll')}
										size="sm"
									>
										<Activity className="h-4 w-4 mr-2" />
										Scroll Event
									</Button>
									<Button 
										variant="secondary"
										onClick={() => trackEvent('video_play')}
										size="sm"
									>
										<Play className="h-4 w-4 mr-2" />
										Video Play
									</Button>
									<Button 
										variant="outline"
										onClick={() => trackEvent('form_submit')}
										size="sm"
									>
										<Code className="h-4 w-4 mr-2" />
										Form Submit
									</Button>
									<Button 
										variant="ghost"
										onClick={() => trackEvent('file_download')}
										size="sm"
									>
										<Eye className="h-4 w-4 mr-2" />
										File Download
									</Button>
									<Button 
										variant="ghost"
										onClick={() => trackEvent('custom_event')}
										size="sm"
									>
										<Clock className="h-4 w-4 mr-2" />
										Custom Event
									</Button>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Live Event Stream</CardTitle>
								<CardDescription>
									Real-time events as they're tracked by {brandInfo.name}
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-2 max-h-80 overflow-y-auto">
									{events.length === 0 ? (
										<div className="text-center text-muted-foreground py-8">
											No events yet. Try clicking the buttons on the left!
										</div>
									) : (
										events.map((event, index) => (
											<div key={index} className="flex items-center justify-between p-2 rounded-md bg-muted/50 text-sm font-mono">
												<div className="flex items-center space-x-2">
													<Badge variant="outline" className="text-xs">
														{event.type}
													</Badge>
												</div>
												<span className="text-xs text-muted-foreground">
													{event.timestamp}
												</span>
											</div>
										))
									)}
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Code Examples */}
					<div className="space-y-8">
						<Card>
							<CardHeader>
								<CardTitle className="font-mono">Basic Implementation</CardTitle>
								<CardDescription>
									Here's how the events above are implemented in your code
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="bg-muted rounded-md p-4 font-mono text-sm overflow-x-auto">
									<pre>{`// Initialize ${brandInfo.name}
${brandInfo.shortName}.init({
  apiKey: 'your-api-key',
  trackingId: 'your-tracking-id',
  debug: true // Enable console logging
});

// Track button clicks
document.querySelector('#cta-button').addEventListener('click', () => {
  ${brandInfo.shortName}.track('button_click', {
    button: 'CTA Primary',
    page: window.location.pathname
  });
});

// Track scroll depth
let maxScroll = 0;
window.addEventListener('scroll', () => {
  const scrollPercent = Math.round(
    (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
  );
  
  if (scrollPercent > maxScroll && scrollPercent % 25 === 0) {
    maxScroll = scrollPercent;
    ${brandInfo.shortName}.track('page_scroll', { depth: scrollPercent });
  }
});

// Track custom events
${brandInfo.shortName}.track('custom_event', {
  action: 'feature_demo',
  category: 'engagement',
  value: 1
});`}</pre>
								</div>
							</CardContent>
						</Card>

						{/* Performance Metrics */}
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							<Card className="text-center">
								<CardHeader>
									<CardTitle className="text-2xl font-mono">{productInfo.bundleSize}</CardTitle>
									<CardDescription>Gzipped bundle size</CardDescription>
								</CardHeader>
							</Card>
							<Card className="text-center">
								<CardHeader>
									<CardTitle className="text-2xl font-mono">{'<1ms'}</CardTitle>
									<CardDescription>Average event processing</CardDescription>
								</CardHeader>
							</Card>
							<Card className="text-center">
								<CardHeader>
									<CardTitle className="text-2xl font-mono">99.9%</CardTitle>
									<CardDescription>Uptime reliability</CardDescription>
								</CardHeader>
							</Card>
						</div>
					</div>
				</div>
			</div>
		</>
	)
} 