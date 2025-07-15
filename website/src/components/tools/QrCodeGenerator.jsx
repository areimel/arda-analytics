import { useState, useEffect } from 'react'
import QRCode from 'qrcode'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Copy, Check, Download, RotateCcw, Loader2, QrCode as QrCodeIcon } from 'lucide-react'

export function QrCodeGenerator({ initialText = '' }) {
	const [text, setText] = useState(initialText)
	const [qrCodeUrl, setQrCodeUrl] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState('')
	const [copied, setCopied] = useState(false)
	
	// Configuration options
	const [size, setSize] = useState(400)
	const [margin, setMargin] = useState(4)
	const [darkColor, setDarkColor] = useState('#000000')
	const [lightColor, setLightColor] = useState('#FFFFFF')
	const [format, setFormat] = useState('png')
	const [errorCorrectionLevel, setErrorCorrectionLevel] = useState('M')

	// Generate QR code on initial load if initialText is provided
	useEffect(() => {
		if (initialText.trim()) {
			generateQrCode()
		}
	}, [initialText])

	const generateQrCode = async () => {
		if (!text.trim()) {
			setError('Please enter text or URL to generate QR code')
			return
		}

		setIsLoading(true)
		setError('')

		try {
			const options = {
				width: size,
				margin: margin,
				color: {
					dark: darkColor,
					light: lightColor
				},
				errorCorrectionLevel: errorCorrectionLevel
			}

			if (format === 'svg') {
				const svgString = await QRCode.toString(text, { ...options, type: 'svg' })
				setQrCodeUrl(svgString)
			} else {
				const url = await QRCode.toDataURL(text, { ...options, type: `image/${format}` })
				setQrCodeUrl(url)
			}
		} catch (err) {
			setError('Failed to generate QR code. Please check your input.')
			console.error('QR code generation error:', err)
		} finally {
			setIsLoading(false)
		}
	}

	const copyToClipboard = async () => {
		if (!qrCodeUrl) return
		
		try {
			if (format === 'svg') {
				await navigator.clipboard.writeText(qrCodeUrl)
			} else {
				const response = await fetch(qrCodeUrl)
				const blob = await response.blob()
				await navigator.clipboard.write([
					new ClipboardItem({ [blob.type]: blob })
				])
			}
			setCopied(true)
			setTimeout(() => setCopied(false), 2000)
		} catch (err) {
			// Fallback: copy the data URL as text
			console.error('Clipboard copy error:', err)
			try {
				await navigator.clipboard.writeText(qrCodeUrl)
				setCopied(true)
				setTimeout(() => setCopied(false), 2000)
			} catch (fallbackErr) {
				console.error('Failed to copy to clipboard:', fallbackErr)
			}
		}
	}

	const downloadQrCode = () => {
		if (!qrCodeUrl) return

		const link = document.createElement('a')
		link.download = `qrcode.${format}`
		
		if (format === 'svg') {
			// Create blob URL for SVG
			const blob = new Blob([qrCodeUrl], { type: 'image/svg+xml' })
			link.href = URL.createObjectURL(blob)
		} else {
			link.href = qrCodeUrl
		}
		
		document.body.appendChild(link)
		link.click()
		document.body.removeChild(link)
		
		// Clean up blob URL for SVG
		if (format === 'svg') {
			URL.revokeObjectURL(link.href)
		}
	}

	const resetForm = () => {
		setText('')
		setSize(400)
		setMargin(4)
		setDarkColor('#000000')
		setLightColor('#FFFFFF')
		setFormat('png')
		setErrorCorrectionLevel('M')
		setQrCodeUrl('')
		setError('')
	}

	return (
		<div className="space-y-8">
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				{/* Configuration Panel */}
				<Card>
					<CardHeader>
						<CardTitle>QR Code Configuration</CardTitle>
					</CardHeader>
					<CardContent className="space-y-6">
						{/* Text Input */}
						<div className="space-y-2">
							<label className="text-sm font-medium">Text or URL *</label>
							<Input
								placeholder="Enter text or URL to encode"
								value={text}
								onChange={(e) => setText(e.target.value)}
								className={error && !text.trim() ? 'border-red-500' : ''}
							/>
							{error && !text.trim() && (
								<p className="text-sm text-red-500">{error}</p>
							)}
						</div>

						{/* Size and Margin */}
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<label className="text-sm font-medium">Size (px)</label>
								<Input
									type="number"
									min="100"
									max="1000"
									value={size}
									onChange={(e) => setSize(Number(e.target.value))}
								/>
							</div>
							<div className="space-y-2">
								<label className="text-sm font-medium">Margin</label>
								<Input
									type="number"
									min="0"
									max="10"
									value={margin}
									onChange={(e) => setMargin(Number(e.target.value))}
								/>
							</div>
						</div>

						{/* Colors */}
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<label className="text-sm font-medium">Foreground Color</label>
								<div className="flex gap-2">
									<Input
										type="color"
										value={darkColor}
										onChange={(e) => setDarkColor(e.target.value)}
										className="w-12 h-10 p-1"
									/>
									<Input
										value={darkColor}
										onChange={(e) => setDarkColor(e.target.value)}
										placeholder="#000000"
									/>
								</div>
							</div>
							<div className="space-y-2">
								<label className="text-sm font-medium">Background Color</label>
								<div className="flex gap-2">
									<Input
										type="color"
										value={lightColor}
										onChange={(e) => setLightColor(e.target.value)}
										className="w-12 h-10 p-1"
									/>
									<Input
										value={lightColor}
										onChange={(e) => setLightColor(e.target.value)}
										placeholder="#FFFFFF"
									/>
								</div>
							</div>
						</div>

						{/* Format and Error Correction */}
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<label className="text-sm font-medium">Format</label>
								<select
									value={format}
									onChange={(e) => setFormat(e.target.value)}
									className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
								>
									<option value="png">PNG</option>
									<option value="jpeg">JPEG</option>
									<option value="webp">WebP</option>
									<option value="svg">SVG</option>
								</select>
							</div>
							<div className="space-y-2">
								<label className="text-sm font-medium">Error Correction</label>
								<select
									value={errorCorrectionLevel}
									onChange={(e) => setErrorCorrectionLevel(e.target.value)}
									className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
								>
									<option value="L">Low (~7%)</option>
									<option value="M">Medium (~15%)</option>
									<option value="Q">Quartile (~25%)</option>
									<option value="H">High (~30%)</option>
								</select>
							</div>
						</div>

						{/* Actions */}
						<div className="flex gap-2">
							<Button onClick={generateQrCode} disabled={!text.trim() || isLoading}>
								<QrCodeIcon className="h-4 w-4 mr-2" />
								{isLoading ? 'Generating...' : 'Generate QR Code'}
							</Button>
							<Button variant="outline" onClick={resetForm}>
								<RotateCcw className="h-4 w-4 mr-2" />
								Reset
							</Button>
						</div>
					</CardContent>
				</Card>

				{/* QR Code Preview */}
				<Card>
					<CardHeader>
						<CardTitle>QR Code Preview</CardTitle>
					</CardHeader>
					<CardContent className="flex flex-col items-center space-y-4">
						{isLoading && (
							<div className="flex items-center justify-center w-[300px] h-[300px]">
								<Loader2 className="h-8 w-8 animate-spin" />
							</div>
						)}
						{error && text.trim() && (
							<div className="flex items-center justify-center w-[300px] h-[300px] text-red-500 text-sm text-center">
								{error}
							</div>
						)}
						{qrCodeUrl && !isLoading && !error && (
							<>
								{format === 'svg' ? (
									<div 
										dangerouslySetInnerHTML={{ __html: qrCodeUrl }} 
										className="border rounded-lg"
										style={{ maxWidth: '300px', maxHeight: '300px' }}
									/>
								) : (
									<img 
										src={qrCodeUrl} 
										alt="QR Code" 
										className="border rounded-lg max-w-[300px] max-h-[300px]"
									/>
								)}
								<div className="flex gap-2">
									<Button onClick={copyToClipboard} variant="outline">
										{copied ? (
											<Check className="h-4 w-4 mr-2" />
										) : (
											<Copy className="h-4 w-4 mr-2" />
										)}
										{copied ? 'Copied!' : 'Copy'}
									</Button>
									<Button onClick={downloadQrCode} variant="outline">
										<Download className="h-4 w-4 mr-2" />
										Download
									</Button>
								</div>
							</>
						)}
						{!qrCodeUrl && !isLoading && (
							<div className="flex items-center justify-center w-[300px] h-[300px] text-muted-foreground text-sm text-center">
								{text.trim() ? 'Click "Generate QR Code" to create your QR code' : 'Enter text or URL and click "Generate QR Code"'}
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	)
} 