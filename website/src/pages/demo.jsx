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
	const [events, setEvents] = useState([])
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
				
				// Mock dataLayer if it doesn't exist
				if (typeof window !== 'undefined') {
					window.dataLayer = window.dataLayer || []
					
					// Hook into dataLayer pushes to capture events
					const originalPush = window.dataLayer.push
					window.dataLayer.push = function(data) {
						// Log to console for debugging
						console.log('ARDA Analytics - DataLayer Push:', data)
						
						// If this is a GAEvent, add it to our live stream
						if (data.event === 'GAEvent') {
							addEvent({
								type: 'GAEvent',
								category: data.eventCategory,
								action: data.eventAction,
								label: data.eventLabel,
								value: data.eventValue,
								timestamp: new Date().toLocaleTimeString(),
								source: 'plugin'
							})
						}
						
						return originalPush.call(this, data)
					}
					
					// Simulate plugin initialization
					console.log('ARDA Analytics Plugin Demo Mode Initialized')
					setPluginLoaded(true)
					
					// Add a welcome event
					addEvent({
						type: 'plugin_init',
						category: 'system',
						action: 'initialization',
						label: 'demo-mode',
						value: '1',
						timestamp: new Date().toLocaleTimeString(),
						source: 'system'
					})
				}
			} catch (error) {
				console.error('Failed to initialize ARDA Analytics:', error)
				setPluginError(error.message)
			}
		}

		initPlugin()
	}, [])

	// Add event to the live stream
	const addEvent = (eventData) => {
		setEvents(prev => [eventData, ...prev.slice(0, 19)]) // Keep last 20 events
	}

	// Handle manual events from the test group
	const handleEventTriggered = (eventData) => {
		addEvent(eventData)
	}

	return (
		<>
			<PageHead page="demo" />
			<div className="container mx-auto px-6 py-8">
				<div className="max-w-4xl mx-auto">
					<div className="text-center mb-8">
						<h1 className="text-4xl font-bold font-mono mb-4">Interactive Demo</h1>
						<p className="text-lg text-muted-foreground">
							See {brandInfo.name} in action. Click the buttons below to trigger events and watch them appear in real-time.
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
					
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
						<EventTriggerTestGroup onEventTriggered={handleEventTriggered} />
						<LiveEventViewer events={events} />
					</div>

					{/* Code Examples */}
					<div className="space-y-8">
						<Card>
							<CardHeader>
								<CardTitle className="font-mono">Basic Implementation</CardTitle>
								<CardDescription>
									Here's how the GA Event tracking above is implemented
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="bg-muted rounded-md p-4 font-mono text-sm overflow-x-auto">
									<pre>{`// HTML - Add data attributes to any element
<button 
  data-event="GAEvent"
  data-category="demo"
  data-action="button-click"
  data-label="cta-primary"
  data-value="1">
  Click Me
</button>

// JavaScript - Initialize ${brandInfo.name}
import ARDAAnalytics from '@arda-analytics/plugin';

const analytics = new ARDAAnalytics({
  debug: true  // Enable console logging
});

// The plugin automatically detects clicks on elements with
// data-event="GAEvent" and pushes to window.dataLayer:
// {
//   event: 'GAEvent',
//   eventCategory: 'demo',
//   eventAction: 'button-click', 
//   eventLabel: 'cta-primary',
//   eventValue: '1'
// }

// Your GTM tags will automatically pick up these events!`}</pre>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle className="font-mono">Advanced Usage</CardTitle>
								<CardDescription>
									More complex implementations and customizations
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="bg-muted rounded-md p-4 font-mono text-sm overflow-x-auto">
									<pre>{`// Nested elements - plugin searches up the DOM tree
<div data-event="GAEvent" 
     data-category="engagement" 
     data-action="section-click"
     data-label="hero-section"
     data-value="3">
  <h2>Click anywhere in this section</h2>
  <p>Even clicking this text will trigger the event!</p>
  <button>Or this button</button>
</div>

// Dynamic elements work too - uses event delegation
document.getElementById('container').innerHTML = \`
  <button data-event="GAEvent" 
          data-category="dynamic"
          data-action="runtime-button"
          data-label="generated-\${Date.now()}"
          data-value="5">
    Dynamic Button
  </button>
\`;

// Plugin configuration options
const analytics = new ARDAAnalytics({
  debug: false,        // Disable console logging in production
  autoInit: true       // Initialize automatically (default)
});

// Manual control
analytics.destroy();  // Clean up event listeners`}</pre>
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
		</>
	)
}