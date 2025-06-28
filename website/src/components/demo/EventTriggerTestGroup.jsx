import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Play, Code, Activity, MousePointer, Eye, Clock, Download, Video, FormInput, Zap } from 'lucide-react'
import { useState, useEffect } from 'react'

export function EventTriggerTestGroup() {
	const [pluginReady, setPluginReady] = useState(false)

	useEffect(() => {
		// Check if ARDA plugin is available and ready
		const checkPlugin = () => {
			if (typeof window !== 'undefined' && window.ARDAAnalytics) {
				setPluginReady(true)
			}
		}

		checkPlugin()
		
		// Check periodically in case plugin loads after component mounts
		const interval = setInterval(checkPlugin, 500)
		
		return () => clearInterval(interval)
	}, [])

	// Helper function to push events using the ARDA plugin
	const pushEvent = (eventName) => {
		try {
			if (window.ARDAAnalytics && window.ARDAAnalytics.pushToDataLayer) {
				// Call the plugin's pushToDataLayer function directly
				const result = window.ARDAAnalytics.pushToDataLayer(eventName)
				if (!result.success) {
					console.warn('Failed to push event:', eventName, result.error)
				}
			} else if (window.dataLayer) {
				// Fallback to direct dataLayer push for demo purposes
				window.dataLayer.push({
					event: "CustomEvent",
					eventLabel: eventName
				})
				
				// Manually trigger the custom event for the live viewer
				window.dispatchEvent(new CustomEvent('arda-event-logged', {
					detail: {
						eventName: eventName,
						success: true,
						timestamp: Date.now(),
						metadata: { fallback: true }
					}
				}))
			} else {
				console.warn('ARDA Analytics plugin or dataLayer not available')
			}
		} catch (error) {
			console.error('Error pushing event:', error)
		}
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center space-x-2">
					<Play className="h-5 w-5" />
					<span>Event Triggers</span>
				</CardTitle>
				<CardDescription>
					Click buttons to trigger events using the new event name-only format.
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-6">
				{/* Plugin Status */}
				<div className={`text-xs p-2 rounded-md ${
					pluginReady ? 'bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400' : 'bg-yellow-50 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400'
				}`}>
					{pluginReady ? '✓ Plugin Ready' : '⚠ Using Fallback Mode'}
				</div>

				{/* User Interaction Events */}
				<div>
					<h4 className="text-sm font-medium mb-3 text-blue-600 dark:text-blue-400">
						<MousePointer className="h-4 w-4 inline mr-1" />
						User Interactions
					</h4>
					<div className="grid grid-cols-2 gap-2">
						<Button 
							onClick={() => pushEvent('cta_primary_click')}
							size="sm"
							className="transition-all hover:scale-105 bg-blue-600 hover:bg-blue-700"
						>
							<Zap className="h-4 w-4 mr-2" />
							CTA Primary
						</Button>
						
						<Button 
							onClick={() => pushEvent('cta_secondary_click')}
							size="sm"
							className="transition-all hover:scale-105 bg-blue-500 hover:bg-blue-600"
						>
							<MousePointer className="h-4 w-4 mr-2" />
							CTA Secondary
						</Button>
						
						<Button 
							onClick={() => pushEvent('hero_banner_click')}
							size="sm"
							className="transition-all hover:scale-105 bg-blue-400 hover:bg-blue-500"
						>
							<Eye className="h-4 w-4 mr-2" />
							Hero Banner
						</Button>
						
						<Button 
							onClick={() => pushEvent('navigation_menu_click')}
							size="sm"
							className="transition-all hover:scale-105 bg-blue-300 text-blue-900 hover:bg-blue-400"
						>
							<Activity className="h-4 w-4 mr-2" />
							Nav Menu
						</Button>
					</div>
				</div>

				{/* Content Engagement Events */}
				<div>
					<h4 className="text-sm font-medium mb-3 text-red-600 dark:text-red-400">
						<Video className="h-4 w-4 inline mr-1" />
						Content Engagement
					</h4>
					<div className="grid grid-cols-2 gap-2">
						<Button 
							onClick={() => pushEvent('video_play_started')}
							size="sm"
							className="transition-all hover:scale-105 bg-red-600 hover:bg-red-700"
						>
							<Video className="h-4 w-4 mr-2" />
							Video Play
						</Button>
						
						<Button 
							onClick={() => pushEvent('documentation_viewed')}
							size="sm"
							className="transition-all hover:scale-105 bg-red-500 hover:bg-red-600"
						>
							<Code className="h-4 w-4 mr-2" />
							Docs View
						</Button>
						
						<Button 
							onClick={() => pushEvent('resource_downloaded')}
							size="sm"
							className="transition-all hover:scale-105 bg-red-400 hover:bg-red-500"
						>
							<Download className="h-4 w-4 mr-2" />
							Download
						</Button>
						
						<Button 
							onClick={() => pushEvent('external_link_clicked')}
							size="sm"
							className="transition-all hover:scale-105 bg-red-300 text-red-900 hover:bg-red-400"
						>
							<Eye className="h-4 w-4 mr-2" />
							External Link
						</Button>
					</div>
				</div>

				{/* Form & Conversion Events */}
				<div>
					<h4 className="text-sm font-medium mb-3 text-green-600 dark:text-green-400">
						<FormInput className="h-4 w-4 inline mr-1" />
						Forms & Conversions
					</h4>
					<div className="grid grid-cols-2 gap-2">
						<Button 
							onClick={() => pushEvent('contact_form_submit')}
							size="sm"
							className="transition-all hover:scale-105 bg-green-600 hover:bg-green-700"
						>
							<FormInput className="h-4 w-4 mr-2" />
							Contact Form
						</Button>
						
						<Button 
							onClick={() => pushEvent('newsletter_signup')}
							size="sm"
							className="transition-all hover:scale-105 bg-green-500 hover:bg-green-600"
						>
							<Activity className="h-4 w-4 mr-2" />
							Newsletter
						</Button>
						
						<Button 
							onClick={() => pushEvent('demo_request_submitted')}
							size="sm"
							className="transition-all hover:scale-105 bg-green-400 hover:bg-green-500"
						>
							<Zap className="h-4 w-4 mr-2" />
							Demo Request
						</Button>
						
						<Button 
							onClick={() => pushEvent('pricing_inquiry_started')}
							size="sm"
							className="transition-all hover:scale-105 bg-green-300 text-green-900 hover:bg-green-400"
						>
							<Clock className="h-4 w-4 mr-2" />
							Pricing
						</Button>
					</div>
				</div>

				{/* Instructions */}
				<div className="text-xs text-muted-foreground p-3 bg-muted/30 rounded-md">
					<p className="font-medium mb-1">New Event Architecture:</p>
					<ul className="space-y-1 list-disc list-inside">
						<li>Buttons call <code className="text-xs bg-muted px-1 rounded">pushEvent(eventName)</code> directly</li>
						<li>Plugin handles GTM dataLayer formatting automatically</li>
						<li>Events appear in the floating Live Event Viewer</li>
						<li>Check browser console for detailed logging</li>
					</ul>
				</div>
			</CardContent>
		</Card>
	)
}