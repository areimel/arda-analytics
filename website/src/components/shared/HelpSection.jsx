import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ExternalLink } from 'lucide-react'

export function HelpSection({
	title,
	description,
	sections = [],
	className = '',
	...props
}) {
	return (
		<Card className={`${className}`} {...props}>
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				{description && (
					<CardDescription>{description}</CardDescription>
				)}
			</CardHeader>
			<CardContent>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{sections.map((section, index) => (
						<div key={index}>
							<h4 className="font-medium mb-3">{section.title}</h4>
							<div className="space-y-2">
								{typeof section.content === 'string' ? (
									<p className="text-sm text-muted-foreground">{section.content}</p>
								) : (
									section.content
								)}
								{section.items && (
									<ul className="text-sm text-muted-foreground space-y-1">
										{section.items.map((item, itemIndex) => (
											<li key={itemIndex} className="flex items-start">
												<span className="text-primary mr-2">•</span>
												{item}
											</li>
										))}
									</ul>
								)}
								{section.action && (
									<Button 
										variant="outline" 
										size="sm" 
										asChild
										className="mt-2"
									>
										<a 
											href={section.action.href} 
											target={section.action.external ? '_blank' : undefined}
											rel={section.action.external ? 'noopener noreferrer' : undefined}
										>
											{section.action.label}
											{section.action.external && (
												<ExternalLink className="ml-2 h-4 w-4" />
											)}
										</a>
									</Button>
								)}
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	)
}