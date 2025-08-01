import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { PageHead } from '@/components/seo/page-head'
import { QrCodeGenerator } from '@/components/tools/QrCodeGenerator'
import { BackButton } from '@/components/shared/BackButton'
import { HelpSection } from '@/components/shared/HelpSection'
import { CodeDisplayCard } from '@/components/shared/CodeDisplayCard'

export function QrCodeGeneratorPage() {
	const location = useLocation()
	const [initialText, setInitialText] = useState('')

	useEffect(() => {
		// Check for URL parameter on load
		const searchParams = new URLSearchParams(location.search)
		const urlParam = searchParams.get('url')
		if (urlParam) {
			setInitialText(decodeURIComponent(urlParam))
		}
	}, [location.search])

	return (
		<>
			<PageHead page="qr-code-generator" />
			<div className="min-h-screen bg-background">
				<div className="container mx-auto px-4 py-8 max-w-6xl">
					{/* Header */}
					<div className="mb-8">
						<BackButton to="/tools" label="Back to Tools" variant="outline" iconType="arrow" />
						<div className="text-center">
							<h1 className="text-4xl font-bold mb-4 font-mono">QR Code Generator</h1>
							<p className="text-lg text-muted-foreground max-w-3xl mx-auto">
								Generate customizable QR codes for URLs, text, or any data. 
								Choose from multiple formats, colors, and sizes to match your needs.
							</p>
						</div>
					</div>

					{/* Tool */}
					<QrCodeGenerator initialText={initialText} />

					{/* Help Section */}
					<HelpSection
						title="About QR Codes"
						className="mt-12"
						sections={[
							{
								title: "What are QR Codes?",
								content: (
									<div>
										<p className="text-muted-foreground mb-4">
											QR (Quick Response) codes are two-dimensional barcodes that can store various types of information such as URLs, text, contact information, and more.
										</p>
										<div className="space-y-2 text-sm">
											<div><strong>URLs:</strong> Link to websites, landing pages, or online content</div>
											<div><strong>Text:</strong> Store plain text messages or instructions</div>
											<div><strong>Contact Info:</strong> vCard format for easy contact sharing</div>
											<div><strong>WiFi:</strong> Network credentials for easy connection</div>
											<div><strong>Email:</strong> Pre-filled email composition</div>
										</div>
									</div>
								)
							},
							{
								title: "Error Correction Levels",
								content: (
									<div>
										<div className="text-muted-foreground space-y-2 text-sm mb-4">
											<div><strong>Low (7%):</strong> Best for clean environments</div>
											<div><strong>Medium (15%):</strong> Balanced option for most uses</div>
											<div><strong>Quartile (25%):</strong> Good for potentially dirty surfaces</div>
											<div><strong>High (30%):</strong> Maximum damage resistance</div>
										</div>
										<p className="text-muted-foreground text-sm mb-4">
											Higher error correction allows the QR code to still be readable even if partially damaged or obscured.
										</p>
									</div>
								),
								action: {
									label: "Learn More",
									href: "https://en.wikipedia.org/wiki/QR_code",
									external: true
								}
							}
						]}
					/>

					{/* URL Parameter Feature */}
					<CodeDisplayCard
						title="💡 Pro Tip"
						description="You can auto-generate QR codes by adding a URL parameter"
						code="/tools/qr-code-generator?url=your-website.com"
						language="url"
						className="mt-8"
					/>
				</div>
			</div>
		</>
	)
}
