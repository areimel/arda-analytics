import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PageHead } from '@/components/seo/page-head'
import { LiveEventViewer } from '@/components/demo/LiveEventViewer'
import { EventTriggerTestGroup } from '@/components/demo/EventTriggerTestGroup'
import { Play, Code, Activity, MousePointer, Eye, Clock, AlertCircle } from 'lucide-react'
import { useState, useEffect } from 'react'
import { getBrandInfo, getProductInfo } from '@/lib/content'

export function DemoPage() {
	const [pluginLoaded, setPluginLoaded] = useState(false)
	const [pluginError, setPluginError] = useState(null)
	
	// Get content from JSON
	const brandInfo = getBrandInfo()
	const productInfo = getProductInfo()

	// Initialize ARDA Analytics plugin
	useEffect(() => {
		const initPlugin = async () => {
			try {
				// In a real implementation, you'd load the plugin from npm or CDN
				// For demo purposes, we'll simulate the plugin being available
				
				if (typeof window !== 'undefined') {
					window.dataLayer = window.dataLayer || []
					
					// Create a simple plugin interface for demo purposes
					// This mimics the actual plugin's pushToDataLayer function
					window.ARDAAnalytics = {
						pushToDataLayer: (eventName) => {
							try {
								// Build the GTM event object (matching our plugin format)
								const gtmEvent = {
									event: "CustomEvent",
									eventLabel: eventName
								}
								
								// Push to dataLayer
								window.dataLayer.push(gtmEvent)
								
								// Dispatch custom event for live viewer
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
								
								// Dispatch error event for live viewer
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
					
					// Send initial system event
					setTimeout(() => {
						window.dispatchEvent(new CustomEvent('arda-event-logged', {
							detail: {
								eventName: 'plugin_initialized',
								success: true,
								timestamp: Date.now(),
								metadata: { message: 'Demo plugin ready' }
							}
						}))
					}, 100)
				}
			} catch (error) {
				console.error('Failed to initialize ARDA Analytics:', error)
				setPluginError(error.message)
			}
		}

		initPlugin()
	}, [])

	return (
		<>
			<PageHead page="demo" />
			<div className="container mx-auto px-6 py-8">
				<div className="max-w-4xl mx-auto">
					<div className="text-center mb-8">
						<h1 className="text-4xl font-bold font-mono mb-4">Interactive Demo</h1>
						<p className="text-lg text-muted-foreground">
							See {brandInfo.name} in action. Click the buttons below to trigger events and watch them appear in the floating live viewer.
						</p>
					</div>

					{/* Plugin Status */}
					<div className="mb-6">
						{pluginError ? (
							<Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/30">
								<CardContent className="flex items-center space-x-2 pt-6">
									<AlertCircle className="h-5 w-5 text-red-600" />
									<span className="text-sm text-red-700 dark:text-red-400">
										Plugin Error: {pluginError}
									</span>
								</CardContent>
							</Card>
						) : (
							<Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/30">
								<CardContent className="flex items-center space-x-2 pt-6">
									<div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
									<span className="text-sm text-green-700 dark:text-green-400 font-mono">
										{pluginLoaded ? 'ARDA Analytics Plugin Ready (Demo Mode)' : 'Loading plugin...'}
									</span>
								</CardContent>
							</Card>
						)}
					</div>
					
					{/* Event Trigger Test Group - Now takes full width */}
					<div className="mb-12">
						<EventTriggerTestGroup />
					</div>

					{/* Code Examples */}
					<div className="space-y-8">
						<Card>
							<CardHeader>
								<CardTitle className="font-mono">New Simple Implementation</CardTitle>
								<CardDescription>
									The new event architecture using event names only
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="bg-muted rounded-md p-4 font-mono text-sm overflow-x-auto">
									<pre>{`// JavaScript - Initialize ${brandInfo.name}
import ARDAAnalytics from '@arda-analytics/plugin';

const analytics = new ARDAAnalytics({
  debug: true  // Enable console logging
});

// Push events using just event names
analytics.pushEvent('cta_primary_click');
analytics.pushEvent('video_play_started');
analytics.pushEvent('contact_form_submit');

// The plugin automatically formats events for GTM:
// {
//   event: 'CustomEvent',
//   eventLabel: 'cta_primary_click'
// }

// Your GTM tags pick up CustomEvent with eventLabel!`}</pre>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle className="font-mono">React/HTML Integration</CardTitle>
								<CardDescription>
									How to integrate with your React components or HTML
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="bg-muted rounded-md p-4 font-mono text-sm overflow-x-auto">
									<pre>{`// React Component Example
import { useEffect } from 'react';

function MyComponent() {
  useEffect(() => {
    // Initialize plugin
    window.ARDAAnalytics = new ARDAAnalytics();
  }, []);

  const handleButtonClick = () => {
    // Simple event push with just event name
    window.ARDAAnalytics.pushEvent('button_clicked');
  };

  return (
    <button onClick={handleButtonClick}>
      Click Me
    </button>
  );
}

// Or even simpler with direct calls
<button onClick={() => window.ARDAAnalytics.pushEvent('hero_cta_click')}>
  Get Started
</button>

// HTML Example
<button onclick="window.ARDAAnalytics.pushEvent('purchase_completed')">
  Complete Purchase
</button>`}</pre>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle className="font-mono">Event Naming Convention</CardTitle>
								<CardDescription>
									Recommended patterns for naming your events
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="bg-muted rounded-md p-4 font-mono text-sm overflow-x-auto">
									<pre>{`// User Interactions
'cta_primary_click'
'cta_secondary_click'
'navigation_menu_click'
'hero_banner_click'

// Content Engagement
'video_play_started'
'documentation_viewed'
'resource_downloaded'
'external_link_clicked'

// Forms & Conversions
'contact_form_submit'
'newsletter_signup'
'demo_request_submitted'
'pricing_inquiry_started'

// E-commerce (examples)
'product_viewed'
'add_to_cart'
'checkout_started'
'purchase_completed'

// Custom Business Events
'feature_toggle_enabled'
'dashboard_accessed'
'api_documentation_searched'`}</pre>
								</div>
							</CardContent>
						</Card>

						{/* Performance Metrics */}
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							<Card className="text-center">
								<CardHeader>
									<CardTitle className="text-2xl font-mono">{productInfo.bundleSize}</CardTitle>
									<CardDescription>Minified bundle size</CardDescription>
								</CardHeader>
							</Card>
							<Card className="text-center">
								<CardHeader>
									<CardTitle className="text-2xl font-mono">{'<1ms'}</CardTitle>
									<CardDescription>Event processing time</CardDescription>
								</CardHeader>
							</Card>
							<Card className="text-center">
								<CardHeader>
									<CardTitle className="text-2xl font-mono">Zero</CardTitle>
									<CardDescription>Dependencies required</CardDescription>
								</CardHeader>
							</Card>
						</div>
					</div>
				</div>
			</div>
			
			{/* Floating Live Event Viewer */}
			<LiveEventViewer />
		</>
	)
}