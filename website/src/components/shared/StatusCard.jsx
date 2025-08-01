import { Card, CardContent } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'

export function StatusCard({
	status = 'ready',
	message,
	variant = 'plugin',
	className = '',
	...props
}) {
	const statusConfig = {
		ready: {
			borderColor: 'border-green-200 dark:border-green-800',
			bgColor: 'bg-green-50 dark:bg-green-950/30',
			dotColor: 'bg-green-500 animate-pulse',
			textColor: 'text-green-700 dark:text-green-400'
		},
		loading: {
			borderColor: 'border-yellow-200 dark:border-yellow-800',
			bgColor: 'bg-yellow-50 dark:bg-yellow-950/30',
			dotColor: 'bg-yellow-500',
			textColor: 'text-yellow-700 dark:text-yellow-400'
		},
		error: {
			borderColor: 'border-red-200 dark:border-red-800',
			bgColor: 'bg-red-50 dark:bg-red-950/30',
			dotColor: 'bg-red-500',
			textColor: 'text-red-700 dark:text-red-400'
		}
	}

	const config = statusConfig[status]

	return (
		<Card className={`${config.borderColor} ${config.bgColor} ${className}`} {...props}>
			<CardContent className="flex items-center space-x-2 pt-6">
				{status === 'error' ? (
					<AlertCircle className="h-5 w-5 text-red-600" />
				) : (
					<div className={`h-2 w-2 ${config.dotColor} rounded-full`}></div>
				)}
				<span className={`text-sm font-mono ${config.textColor}`}>
					{message}
				</span>
			</CardContent>
		</Card>
	)
}