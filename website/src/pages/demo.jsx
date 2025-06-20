import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Play, Code, Activity, MousePointer, Eye, Clock } from 'lucide-react'
import { useState } from 'react'

export function DemoPage() {
	const [events, setEvents] = useState([])

	const trackEvent = (eventType) => {
		const event = {
			type: eventType,
			timestamp: new Date().toLocaleTimeString()
		}
		setEvents(prev => [event, ...prev.slice(0, 9)])
	}

	return (
		<div className="container mx-auto px-6 py-8">
			<div className="max-w-4xl mx-auto">
				<h1 className="text-4xl font-bold font-mono mb-8 text-center">Interactive Demo</h1>
				
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					<div className="space-y-4">
						<h2 className="text-2xl font-semibold mb-4">Try These Events</h2>
						<div className="space-y-2">
							<Button onClick={() => trackEvent('button_click')} className="w-full">
								Track Button Click
							</Button>
							<Button onClick={() => trackEvent('page_view')} variant="outline" className="w-full">
								Track Page View
							</Button>
							<Button onClick={() => trackEvent('custom_event')} variant="secondary" className="w-full">
								Track Custom Event
							</Button>
						</div>
					</div>
					
					<div>
						<h2 className="text-2xl font-semibold mb-4">Live Event Log</h2>
						<div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 h-64 overflow-y-auto">
							{events.length === 0 ? (
								<p className="text-gray-500 text-center">No events yet. Try clicking a button!</p>
							) : (
								events.map((event, index) => (
									<div key={index} className="font-mono text-sm mb-2 p-2 bg-white dark:bg-gray-700 rounded">
										<span className="font-semibold">{event.type}</span> - {event.timestamp}
									</div>
								))
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
} 