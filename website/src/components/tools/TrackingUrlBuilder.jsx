import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { QuickQrCode } from './QuickQrCode'
import { Copy, Check, RotateCcw, Link as LinkIcon } from 'lucide-react'

export function TrackingUrlBuilder() {
	const [baseUrl, setBaseUrl] = useState('')
	const [utmSource, setUtmSource] = useState('')
	const [utmMedium, setUtmMedium] = useState('')
	const [utmCampaign, setUtmCampaign] = useState('')
	const [utmTerm, setUtmTerm] = useState('')
	const [utmContent, setUtmContent] = useState('')
	const [customParams, setCustomParams] = useState([{ key: '', value: '' }])
	const [copied, setCopied] = useState(false)
	const [trackingUrl, setTrackingUrl] = useState('')
	const [urlError, setUrlError] = useState('')

	const buildTrackingUrl = () => {
		if (!baseUrl.trim()) {
			setUrlError('Please enter a base URL')
			return
		}

		setUrlError('')

		try {
			const url = new URL(baseUrl)
			
			// Add UTM parameters
			if (utmSource.trim()) url.searchParams.set('utm_source', utmSource.trim())
			if (utmMedium.trim()) url.searchParams.set('utm_medium', utmMedium.trim())
			if (utmCampaign.trim()) url.searchParams.set('utm_campaign', utmCampaign.trim())
			if (utmTerm.trim()) url.searchParams.set('utm_term', utmTerm.trim())
			if (utmContent.trim()) url.searchParams.set('utm_content', utmContent.trim())

			// Add custom parameters
			customParams.forEach(param => {
				if (param.key.trim() && param.value.trim()) {
					url.searchParams.set(param.key.trim(), param.value.trim())
				}
			})

			setTrackingUrl(url.toString())
		} catch (error) {
			console.error('URL building error:', error)
			setUrlError('Please enter a valid URL (e.g., https://example.com)')
		}
	}

	const copyToClipboard = async () => {
		if (!trackingUrl) return
		
		try {
			await navigator.clipboard.writeText(trackingUrl)
			setCopied(true)
			setTimeout(() => setCopied(false), 2000)
		} catch (err) {
			console.error('Failed to copy to clipboard:', err)
		}
	}

	const resetForm = () => {
		setBaseUrl('')
		setUtmSource('')
		setUtmMedium('')
		setUtmCampaign('')
		setUtmTerm('')
		setUtmContent('')
		setCustomParams([{ key: '', value: '' }])
		setTrackingUrl('')
		setUrlError('')
	}

	const addCustomParam = () => {
		setCustomParams([...customParams, { key: '', value: '' }])
	}

	const updateCustomParam = (index, field, value) => {
		const updated = customParams.map((param, i) => 
			i === index ? { ...param, [field]: value } : param
		)
		setCustomParams(updated)
	}

	const removeCustomParam = (index) => {
		if (customParams.length > 1) {
			setCustomParams(customParams.filter((_, i) => i !== index))
		}
	}

	return (
		<div className="space-y-8">
			<Card>
				<CardHeader>
					<CardTitle>URL Builder</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					{/* Base URL */}
					<div className="space-y-2">
						<label className="text-sm font-medium">Base URL *</label>
						<Input
							placeholder="https://example.com/page"
							value={baseUrl}
							onChange={(e) => setBaseUrl(e.target.value)}
							className={urlError ? 'border-red-500' : ''}
						/>
						{urlError && (
							<p className="text-sm text-red-500">{urlError}</p>
						)}
					</div>

					{/* UTM Parameters */}
					<div className="space-y-4">
						<h3 className="text-lg font-semibold">UTM Parameters</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<label className="text-sm font-medium">UTM Source</label>
								<Input
									placeholder="google, facebook, newsletter"
									value={utmSource}
									onChange={(e) => setUtmSource(e.target.value)}
								/>
							</div>
							<div className="space-y-2">
								<label className="text-sm font-medium">UTM Medium</label>
								<Input
									placeholder="cpc, email, social"
									value={utmMedium}
									onChange={(e) => setUtmMedium(e.target.value)}
								/>
							</div>
							<div className="space-y-2">
								<label className="text-sm font-medium">UTM Campaign</label>
								<Input
									placeholder="summer_sale, product_launch"
									value={utmCampaign}
									onChange={(e) => setUtmCampaign(e.target.value)}
								/>
							</div>
							<div className="space-y-2">
								<label className="text-sm font-medium">UTM Term</label>
								<Input
									placeholder="keyword1, keyword2"
									value={utmTerm}
									onChange={(e) => setUtmTerm(e.target.value)}
								/>
							</div>
						</div>
						<div className="space-y-2">
							<label className="text-sm font-medium">UTM Content</label>
							<Input
								placeholder="ad_variation_1, header_link"
								value={utmContent}
								onChange={(e) => setUtmContent(e.target.value)}
							/>
						</div>
					</div>

					{/* Custom Parameters */}
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<h3 className="text-lg font-semibold">Custom Parameters</h3>
							<Button variant="outline" size="sm" onClick={addCustomParam}>
								Add Parameter
							</Button>
						</div>
						{customParams.map((param, index) => (
							<div key={index} className="flex gap-2">
								<Input
									placeholder="Parameter name"
									value={param.key}
									onChange={(e) => updateCustomParam(index, 'key', e.target.value)}
								/>
								<Input
									placeholder="Parameter value"
									value={param.value}
									onChange={(e) => updateCustomParam(index, 'value', e.target.value)}
								/>
								{customParams.length > 1 && (
									<Button 
										variant="outline" 
										size="sm" 
										onClick={() => removeCustomParam(index)}
									>
										Remove
									</Button>
								)}
							</div>
						))}
					</div>

					{/* Actions */}
					<div className="flex gap-2">
						<Button onClick={buildTrackingUrl} disabled={!baseUrl.trim()}>
							<LinkIcon className="h-4 w-4 mr-2" />
							Build URL
						</Button>
						<Button variant="outline" onClick={resetForm}>
							<RotateCcw className="h-4 w-4 mr-2" />
							Reset
						</Button>
					</div>
				</CardContent>
			</Card>

			{/* Generated URL */}
			{trackingUrl && (
				<Card>
					<CardHeader>
						<CardTitle>Generated Tracking URL</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex gap-2">
							<Input
								value={trackingUrl}
								readOnly
								className="font-mono text-sm"
							/>
							<Button onClick={copyToClipboard} variant="outline">
								{copied ? (
									<Check className="h-4 w-4" />
								) : (
									<Copy className="h-4 w-4" />
								)}
							</Button>
						</div>
						<div className="text-sm text-muted-foreground">
							Character count: {trackingUrl.length}
						</div>
					</CardContent>
				</Card>
			)}

			{/* Quick QR Code */}
			{trackingUrl && (
				<QuickQrCode 
					text={trackingUrl} 
					title="Quick QR Code" 
					className="max-w-sm mx-auto"
				/>
			)}
		</div>
	)
} 