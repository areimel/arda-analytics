import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Play, Code, Activity, MousePointer, Eye, Clock, Download, Video, FormInput } from 'lucide-react'

export function EventTriggerTestGroup({ onEventTriggered }) {
	// Handle manual event logging (for buttons that don't use GA tracking)
	const handleManualEvent = (eventType, eventData) => {
		if (onEventTriggered) {
			onEventTriggered({
				type: eventType,
				...eventData,
				timestamp: new Date().toLocaleTimeString(),
				source: 'manual'
			})
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
					Try different analytics events. Buttons with GA tracking use real plugin functionality.
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-6">
				{/* GA Event Tracking Buttons - These use our actual plugin */}
				<div>
					<h4 className="text-sm font-medium mb-3 text-green-600 dark:text-green-400">
						✓ GA Event Tracking (Real Plugin)
					</h4>
					<div className="grid grid-cols-2 gap-2">
						<Button 
							data-event="GAEvent"
							data-category="demo"
							data-action="button-click"
							data-label="cta-primary"
							data-value="1"
							size="sm"
							className="transition-all hover:scale-105"
						>
							<MousePointer className="h-4 w-4 mr-2" />
							CTA Button
						</Button>
						
						<Button 
							data-event="GAEvent"
							data-category="engagement"
							data-action="video-interaction"
							data-label="demo-video"
							data-value="5"
							variant="outline"
							size="sm"
							className="transition-all hover:scale-105"
						>
							<Video className="h-4 w-4 mr-2" />
							Video Play
						</Button>
						
						<Button 
							data-event="GAEvent"
							data-category="downloads"
							data-action="file-download"
							data-label="documentation-pdf"
							data-value="3"
							variant="secondary"
							size="sm"
							className="transition-all hover:scale-105"
						>
							<Download className="h-4 w-4 mr-2" />
							Download
						</Button>
						
						<Button 
							data-event="GAEvent"
							data-category="forms"
							data-action="form-submit"
							data-label="contact-form"
							data-value="10"
							variant="outline"
							size="sm"
							className="transition-all hover:scale-105"
						>
							<FormInput className="h-4 w-4 mr-2" />
							Form Submit
						</Button>
					</div>
				</div>

				{/* Manual Event Tracking - For comparison */}
				<div>
					<h4 className="text-sm font-medium mb-3 text-blue-600 dark:text-blue-400">
						⚡ Manual Events (Demo Only)
					</h4>
					<div className="grid grid-cols-2 gap-2">
						<Button 
							onClick={() => handleManualEvent('scroll_depth', { 
								category: 'engagement', 
								action: 'scroll', 
								label: '75%',
								value: '75'
							})}
							variant="ghost"
							size="sm"
							className="transition-all hover:scale-105"
						>
							<Activity className="h-4 w-4 mr-2" />
							Scroll Event
						</Button>
						
						<Button 
							onClick={() => handleManualEvent('page_timing', { 
								category: 'performance', 
								action: 'time-on-page', 
								label: 'demo-page',
								value: '30'
							})}
							variant="ghost"
							size="sm"
							className="transition-all hover:scale-105"
						>
							<Clock className="h-4 w-4 mr-2" />
							Time Event
						</Button>
					</div>
				</div>

				{/* Instructions */}
				<div className="text-xs text-muted-foreground p-3 bg-muted/30 rounded-md">
					<p className="font-medium mb-1">How it works:</p>
					<ul className="space-y-1 list-disc list-inside">
						<li><span className="text-green-600 dark:text-green-400">GA Event buttons</span> use data attributes and trigger our plugin</li>
						<li><span className="text-blue-600 dark:text-blue-400">Manual buttons</span> simulate other event types for demo purposes</li>
						<li>Check browser console to see dataLayer pushes from GA events</li>
					</ul>
				</div>
			</CardContent>
		</Card>
	)
}