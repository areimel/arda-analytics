import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getBrandInfo } from '@/lib/content'

export function LiveEventViewer({ events }) {
	const brandInfo = getBrandInfo()

	return (
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
							No events yet. Try clicking the buttons to trigger GA events!
						</div>
					) : (
						events.map((event, index) => (
							<div key={index} className="flex items-center justify-between p-3 rounded-md bg-muted/50 text-sm font-mono border-l-4 border-l-blue-500">
								<div className="flex items-center space-x-3">
									<Badge variant="outline" className="text-xs">
										{event.type}
									</Badge>
									<div className="text-xs space-y-1">
										{event.category && (
											<div className="text-muted-foreground">
												<span className="font-medium">Category:</span> {event.category}
											</div>
										)}
										{event.action && (
											<div className="text-muted-foreground">
												<span className="font-medium">Action:</span> {event.action}
											</div>
										)}
										{event.label && (
											<div className="text-muted-foreground">
												<span className="font-medium">Label:</span> {event.label}
											</div>
										)}
									</div>
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
	)
}