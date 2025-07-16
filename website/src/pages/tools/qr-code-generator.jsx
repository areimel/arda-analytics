import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { PageHead } from '@/components/seo/page-head'
import { QrCodeGenerator } from '@/components/tools/QrCodeGenerator'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ExternalLink } from 'lucide-react'

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
						<div className="flex items-center gap-4 mb-6">
							<Button asChild variant="outline" size="sm">
								<Link to="/tools">
									<ArrowLeft className="h-4 w-4 mr-2" />
									Back to Tools
								</Link>
							</Button>
						</div>
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
					<div className="mt-12 bg-muted/50 rounded-lg p-8">
						<h2 className="text-2xl font-semibold mb-4">About QR Codes</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
							<div>
								<h3 className="text-lg font-medium mb-3">What are QR Codes?</h3>
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
							<div>
								<h3 className="text-lg font-medium mb-3">Error Correction Levels</h3>
								<div className="text-muted-foreground space-y-2 text-sm mb-4">
									<div><strong>Low (7%):</strong> Best for clean environments</div>
									<div><strong>Medium (15%):</strong> Balanced option for most uses</div>
									<div><strong>Quartile (25%):</strong> Good for potentially dirty surfaces</div>
									<div><strong>High (30%):</strong> Maximum damage resistance</div>
								</div>
								<p className="text-muted-foreground text-sm mb-4">
									Higher error correction allows the QR code to still be readable even if partially damaged or obscured.
								</p>
								<Button asChild variant="outline" size="sm">
									<a href="https://en.wikipedia.org/wiki/QR_code" target="_blank" rel="noopener noreferrer">
										Learn More
										<ExternalLink className="h-4 w-4 ml-2" />
									</a>
								</Button>
							</div>
						</div>
					</div>

					{/* URL Parameter Feature */}
					<div className="mt-8 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
						<h3 className="text-lg font-medium mb-2 text-blue-900 dark:text-blue-100">💡 Pro Tip</h3>
						<p className="text-blue-800 dark:text-blue-200 text-sm">
							You can auto-generate QR codes by adding a URL parameter: 
							<code className="mx-1 px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded text-xs">
								/tools/qr-code-generator?url=your-website.com
							</code>
						</p>
					</div>
				</div>
			</div>
		</>
	)
}
