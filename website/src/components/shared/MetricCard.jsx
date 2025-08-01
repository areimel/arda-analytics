import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

export function MetricCard({
	title,
	value,
	icon,
	subtitle,
	showProgress = false,
	progressValue = 0,
	format = 'number',
	className = '',
	...props
}) {
	const formatValue = (val) => {
		if (format === 'time') {
			const mins = Math.floor(val / 60)
			const secs = val % 60
			return `${mins}:${secs.toString().padStart(2, '0')}`
		}
		if (format === 'percentage') {
			return `${val}%`
		}
		return val
	}

	return (
		<Card className={className} {...props}>
			<CardHeader className="pb-3">
				<CardTitle className="text-sm font-medium flex items-center gap-2">
					{icon}
					{title}
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold font-mono">{formatValue(value)}</div>
				{subtitle && (
					<div className="text-xs text-muted-foreground mt-1">
						{subtitle}
					</div>
				)}
				{showProgress && (
					<Progress value={progressValue} className="mt-2" />
				)}
			</CardContent>
		</Card>
	)
}