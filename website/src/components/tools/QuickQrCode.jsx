import { useState, useEffect } from 'react'
import QRCode from 'qrcode'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

export function QuickQrCode({ text, title = "QR Code", className = "" }) {
	const [qrCodeUrl, setQrCodeUrl] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState('')

	useEffect(() => {
		if (!text || text.trim() === '') {
			setQrCodeUrl('')
			return
		}

		setIsLoading(true)
		setError('')

		QRCode.toDataURL(text, {
			width: 200,
			margin: 2,
			color: {
				dark: '#000000',
				light: '#FFFFFF'
			}
		})
		.then(url => {
			setQrCodeUrl(url)
			setIsLoading(false)
		})
		.catch(err => {
			setError('Failed to generate QR code')
			setIsLoading(false)
		})
	}, [text])

	if (!text || text.trim() === '') {
		return null
	}

	return (
		<Card className={className}>
			<CardHeader>
				<CardTitle className="text-lg">{title}</CardTitle>
			</CardHeader>
			<CardContent className="flex flex-col items-center space-y-4">
				{isLoading && (
					<div className="flex items-center justify-center w-[200px] h-[200px]">
						<Loader2 className="h-8 w-8 animate-spin" />
					</div>
				)}
				{error && (
					<div className="flex items-center justify-center w-[200px] h-[200px] text-red-500 text-sm">
						{error}
					</div>
				)}
				{qrCodeUrl && !isLoading && !error && (
					<img 
						src={qrCodeUrl} 
						alt="QR Code" 
						className="border rounded-lg"
						width={200}
						height={200}
					/>
				)}
			</CardContent>
		</Card>
	)
} 