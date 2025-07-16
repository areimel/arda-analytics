import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getBrandInfo } from '@/lib/content'
import { useState, useEffect } from 'react'
import { Minimize2, Maximize2, X, Activity } from 'lucide-react'

export function LiveEventViewer() {
	const [events, setEvents] = useState([])
	const [isMinimized, setIsMinimized] = useState(false)
	const [isVisible, setIsVisible] = useState(true)
	
	const brandInfo = getBrandInfo()

	useEffect(() => {
		// Listen for events from the ARDA plugin
		const handleARDAEvent = (event) => {
			const { eventName, success, timestamp, metadata } = event.detail
			
			const newEvent = {
				type: 'plugin_event',
				eventName: eventName,
				success: success,
				timestamp: new Date(timestamp).toLocaleTimeString(),
				metadata: metadata,
				source: 'plugin'
			}
			
			setEvents(prev => [newEvent, ...prev.slice(0, 19)]) // Keep last 20 events
		}

		// Add event listener for plugin events
		window.addEventListener('arda-event-logged', handleARDAEvent)
		
		// Add initial event to show the viewer is ready
		setEvents([{
			type: 'system',
			eventName: 'viewer_ready',
			success: true,
			timestamp: new Date().toLocaleTimeString(),
			metadata: { message: 'Live Event Viewer initialized' },
			source: 'system'
		}])

		// Cleanup
		return () => {
			window.removeEventListener('arda-event-logged', handleARDAEvent)
		}
	}, [])

	if (!isVisible) return null

	return (
		<div className="fixed bottom-4 left-4 z-50 w-80 max-w-sm">
			<Card className="border-2 border-blue-200 bg-white/95 backdrop-blur-sm shadow-lg dark:border-blue-800 dark:bg-gray-900/95">
				<CardHeader className="pb-2">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-2">
							<Activity className="h-4 w-4 text-blue-600" />
							<CardTitle className="text-sm">Live Events</CardTitle>
							<div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
						</div>
						<div className="flex items-center space-x-1">
							<Button
								variant="ghost"
								size="sm"
								className="h-6 w-6 p-0"
								onClick={() => setIsMinimized(!isMinimized)}
							>
								{isMinimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
							</Button>
							<Button
								variant="ghost"
								size="sm"
								className="h-6 w-6 p-0"
								onClick={() => setIsVisible(false)}
							>
								<X className="h-3 w-3" />
							</Button>
						</div>
					</div>
					{!isMinimized && (
						<CardDescription className="text-xs">
							Events tracked by {brandInfo.name}
						</CardDescription>
					)}
				</CardHeader>
				{!isMinimized && (
					<CardContent>
						<div className="space-y-2 max-h-60 overflow-y-auto">
							{events.length === 0 ? (
								<div className="text-center text-muted-foreground py-4 text-xs">
									Waiting for events...
								</div>
							) : (
								events.map((event, index) => (
									<div key={index} className={`p-2 rounded-md text-xs font-mono border-l-4 ${
										event.success ? 'border-l-green-500 bg-green-50 dark:bg-green-950/30' : 'border-l-red-500 bg-red-50 dark:bg-red-950/30'
									}`}>
										<div className="flex items-center justify-between mb-1">
											<Badge variant="outline" className="text-xs">
												{event.type}
											</Badge>
											<span className="text-xs text-muted-foreground">
												{event.timestamp}
											</span>
										</div>
										<div className="font-medium text-xs mb-1">
											{event.eventName}
										</div>
										{event.metadata && Object.keys(event.metadata).length > 0 && (
											<div className="text-xs text-muted-foreground">
												{event.metadata.gtmEvent && (
													<div>→ GTM: {event.metadata.gtmEvent.event}</div>
												)}
												{event.metadata.error && (
													<div className="text-red-600">Error: {event.metadata.error}</div>
												)}
												{event.metadata.message && (
													<div>{event.metadata.message}</div>
												)}
											</div>
										)}
									</div>
								))
							)}
						</div>
					</CardContent>
				)}
			</Card>
		</div>
	)
}