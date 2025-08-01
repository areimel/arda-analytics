import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Copy } from 'lucide-react'
import { useState } from 'react'

export function CodeDisplayCard({
	title,
	description,
	code,
	language = 'javascript',
	showCopy = true,
	className = '',
	...props
}) {
	const [copied, setCopied] = useState(false)

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(code)
			setCopied(true)
			setTimeout(() => setCopied(false), 2000)
		} catch (err) {
			console.error('Failed to copy code:', err)
		}
	}

	return (
		<Card className={className} {...props}>
			<CardHeader>
				<div className="flex items-center justify-between">
					<div>
						<CardTitle className="font-mono">{title}</CardTitle>
						{description && (
							<CardDescription className="mt-1">
								{description}
							</CardDescription>
						)}
					</div>
					{showCopy && (
						<Button
							variant="outline"
							size="sm"
							onClick={handleCopy}
							className="flex items-center gap-2"
						>
							<Copy className="h-4 w-4" />
							{copied ? 'Copied!' : 'Copy'}
						</Button>
					)}
				</div>
			</CardHeader>
			<CardContent>
				<div className="bg-muted rounded-md p-4 font-mono text-sm overflow-x-auto">
					<pre>{code}</pre>
				</div>
			</CardContent>
		</Card>
	)
}