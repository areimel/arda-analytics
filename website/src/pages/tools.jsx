import { Link } from 'react-router-dom'
import { PageHead } from '@/components/seo/page-head'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Link as LinkIcon, QrCode, ChevronRight } from 'lucide-react'

export function ToolsPage() {
	const tools = [
		{
			id: 'tracking-url-builder',
			title: 'Tracking URL Builder',
			description: 'Build custom tracking URLs with UTM parameters for campaign tracking and analytics',
			icon: <LinkIcon className="h-6 w-6" />,
			href: '/tools/tracking-url-builder',
			features: ['UTM Parameters', 'Custom Parameters', 'QR Code Generation', 'URL Validation'],
			category: 'Marketing'
		},
		{
			id: 'qr-code-generator',
			title: 'QR Code Generator',
			description: 'Generate customizable QR codes with various formats, sizes, and color options',
			icon: <QrCode className="h-6 w-6" />,
			href: '/tools/qr-code-generator',
			features: ['Multiple Formats', 'Custom Colors', 'Size Control', 'Error Correction'],
			category: 'Utilities'
		}
	]

	return (
		<>
			<PageHead page="tools" />
			<div className="min-h-screen bg-background">
				<div className="container mx-auto px-4 py-8 max-w-6xl">
					{/* Header */}
					<div className="text-center mb-12">
						<h1 className="text-4xl font-bold mb-4 font-mono">Developer Tools</h1>
						<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
							A collection of useful tools for developers, marketers, and content creators. 
							All tools are free to use and work entirely in your browser.
						</p>
					</div>

					{/* Tools Grid */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
						{tools.map((tool) => (
							<Card key={tool.id} className="group hover:shadow-lg transition-all duration-300 hover:ring-2 hover:ring-primary/20">
								<CardHeader>
									<div className="flex items-start justify-between">
										<div className="flex items-center gap-3">
											<div className="p-2 bg-primary/10 rounded-lg text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
												{tool.icon}
											</div>
											<div>
												<CardTitle className="text-xl">{tool.title}</CardTitle>
												<Badge variant="secondary" className="mt-1">
													{tool.category}
												</Badge>
											</div>
										</div>
										<ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
									</div>
									<CardDescription className="text-base mt-3">
										{tool.description}
									</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										<div>
											<h4 className="text-sm font-medium mb-2">Features:</h4>
											<div className="flex flex-wrap gap-2">
												{tool.features.map((feature, index) => (
													<Badge key={index} variant="outline" className="text-xs">
														{feature}
													</Badge>
												))}
											</div>
										</div>
										<Button asChild className="w-full">
											<Link to={tool.href}>
												Open Tool
											</Link>
										</Button>
									</div>
								</CardContent>
							</Card>
						))}
					</div>

					{/* Coming Soon Section */}
					<div className="text-center">
						<h2 className="text-2xl font-semibold mb-4">More Tools Coming Soon</h2>
						<p className="text-muted-foreground mb-6">
							We're constantly adding new tools to help developers and marketers. 
							Have a suggestion? Let us know!
						</p>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
							<Card className="opacity-60">
								<CardContent className="p-6 text-center">
									<div className="h-12 w-12 bg-muted rounded-lg mx-auto mb-3"></div>
									<h3 className="font-medium mb-2">Image Optimizer</h3>
									<p className="text-sm text-muted-foreground">Compress and optimize images for web</p>
								</CardContent>
							</Card>
							<Card className="opacity-60">
								<CardContent className="p-6 text-center">
									<div className="h-12 w-12 bg-muted rounded-lg mx-auto mb-3"></div>
									<h3 className="font-medium mb-2">Color Palette Generator</h3>
									<p className="text-sm text-muted-foreground">Generate beautiful color schemes</p>
								</CardContent>
							</Card>
							<Card className="opacity-60">
								<CardContent className="p-6 text-center">
									<div className="h-12 w-12 bg-muted rounded-lg mx-auto mb-3"></div>
									<h3 className="font-medium mb-2">JSON Formatter</h3>
									<p className="text-sm text-muted-foreground">Format and validate JSON data</p>
								</CardContent>
							</Card>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
