import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChevronRight } from 'lucide-react'

export function InfoCard({
	variant = 'tool',
	title,
	description,
	icon,
	category,
	features = [],
	href,
	buttonText = 'Open',
	buttonIcon,
	items = [],
	iconColor = 'blue',
	className = '',
	external = false,
	...props
}) {
	const baseCardClasses = "group hover:shadow-lg transition-all duration-300 hover:ring-2 hover:ring-primary/20"
	
	const iconColorClasses = {
		blue: 'bg-blue-100 text-blue-600',
		green: 'bg-green-100 text-green-600',
		purple: 'bg-purple-100 text-purple-600',
		orange: 'bg-orange-100 text-orange-600',
		red: 'bg-red-100 text-red-600'
	}

	// Tool/Demo card variant
	if (variant === 'tool' || variant === 'demo') {
		return (
			<Card className={`${baseCardClasses} ${className}`} {...props}>
				<CardHeader>
					<div className="flex items-start justify-between">
						<div className="flex items-center gap-3">
							<div className="p-2 bg-primary/10 rounded-lg text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
								{icon}
							</div>
							<div>
								<CardTitle className="text-xl">{title}</CardTitle>
								{category && (
									<Badge variant="secondary" className="mt-1">
										{category}
									</Badge>
								)}
							</div>
						</div>
						<ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
					</div>
					<CardDescription className="text-base mt-3">
						{description}
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{features.length > 0 && (
							<div>
								<h4 className="text-sm font-medium mb-2">Features:</h4>
								<div className="flex flex-wrap gap-2">
									{features.map((feature, index) => (
										<Badge key={index} variant="outline" className="text-xs">
											{feature}
										</Badge>
									))}
								</div>
							</div>
						)}
						<Button asChild className="w-full">
							<Link to={href} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined}>
								{buttonIcon && <span className="mr-2">{buttonIcon}</span>}
								{buttonText}
							</Link>
						</Button>
					</div>
				</CardContent>
			</Card>
		)
	}

	// Docs section card variant
	if (variant === 'docs-section') {
		return (
			<Card className={`h-fit ${className}`} {...props}>
				<CardHeader>
					<div className="flex items-center gap-3">
						<div className="p-2 bg-primary/10 rounded-lg text-primary">
							{icon}
						</div>
						<div>
							<CardTitle>{title}</CardTitle>
							<CardDescription className="mt-1">
								{description}
							</CardDescription>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<div className="space-y-3">
						{items.map((item, itemIndex) => (
							<a
								key={itemIndex}
								href={item.href}
								className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors group"
							>
								<div>
									<div className="font-medium group-hover:text-primary">
										{item.name}
									</div>
									<div className="text-sm text-muted-foreground">
										{item.description}
									</div>
								</div>
								<ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
							</a>
						))}
					</div>
				</CardContent>
			</Card>
		)
	}

	// Docs popular card variant
	if (variant === 'docs-popular') {
		return (
			<a href={href} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined}>
				<Card className={`group hover:shadow-md transition-all cursor-pointer hover:ring-2 hover:ring-primary/20 ${className}`} {...props}>
					<CardContent className="p-6">
						<div className="flex items-center gap-3 mb-3">
							<div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconColorClasses[iconColor]}`}>
								{icon}
							</div>
							<h3 className="font-semibold">{title}</h3>
						</div>
						<p className="text-sm text-muted-foreground">
							{description}
						</p>
					</CardContent>
				</Card>
			</a>
		)
	}

	// Default fallback
	return null
}