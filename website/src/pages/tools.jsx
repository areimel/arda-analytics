import { PageHead } from '@/components/seo/page-head'
import { PageHeader } from '@/components/shared/PageHeader'
import { InfoCard } from '@/components/shared/InfoCard'
import { GridCardLayout } from '@/components/shared/GridCardLayout'
import { Card, CardContent } from '@/components/ui/card'
import { Link as LinkIcon, QrCode } from 'lucide-react'

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
					<PageHeader
						title="Developer Tools"
						description="A collection of useful tools for developers, marketers, and content creators. All tools are free to use and work entirely in your browser."
						useMono={true}
					/>

					{/* Tools Grid */}
					<GridCardLayout columns={{ base: 1, md: 2 }} gap={8} className="mb-12">
						{tools.map((tool) => (
							<InfoCard
								key={tool.id}
								variant="tool"
								title={tool.title}
								description={tool.description}
								icon={tool.icon}
								category={tool.category}
								features={tool.features}
								href={tool.href}
								buttonText="Open Tool"
							/>
						))}
					</GridCardLayout>

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
