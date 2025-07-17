import { useState, useEffect, useRef } from 'react'

export function AnimatedBlobBackground({
	blobCount = 5,
	speed = 1,
	minSpeed = 0.5,
	maxSpeed = 2,
	blur = 'blur-3xl',
	minSize = 200,
	maxSize = 400,
	minOpacity = 0.2,
	maxOpacity = 0.4,
	colors = [
		'from-primary/40 to-secondary/40',
		'from-secondary/30 to-accent/30',
		'from-accent/35 to-primary/35',
		'from-primary/25 to-secondary/25',
		'from-secondary/40 to-accent/40',
		'from-accent/30 to-primary/30',
		'from-primary/35 to-accent/35',
		'from-secondary/25 to-primary/25'
	],
	fps = 60,
	bounceEdges = true,
	className = ''
}) {
	const containerRef = useRef(null)
	const [blobs, setBlobs] = useState([])

	useEffect(() => {
		const initializeBlobs = () => {
			const containerRect = containerRef.current?.getBoundingClientRect()
			if (!containerRect) return

			const newBlobs = Array.from({ length: blobCount }, (_, i) => {
				const size = minSize + Math.random() * (maxSize - minSize)
				const baseSpeed = minSpeed + Math.random() * (maxSpeed - minSpeed)
				const opacity = minOpacity + Math.random() * (maxOpacity - minOpacity)
				
				// Create gradient with random opacity
				const colorIndex = i % colors.length
				const baseGradient = colors[colorIndex]
				const gradientWithOpacity = baseGradient.replace(/\/\d+(\.\d+)?/g, `/${Math.round(opacity * 100)}`)
				
				return {
					id: i + 1,
					x: Math.random() * (containerRect.width - size),
					y: Math.random() * (containerRect.height - size),
					vx: (Math.random() - 0.5) * baseSpeed * speed,
					vy: (Math.random() - 0.5) * baseSpeed * speed,
					size,
					gradient: gradientWithOpacity,
					opacity
				}
			})
			setBlobs(newBlobs)
		}

		const animate = () => {
			setBlobs(prevBlobs => {
				const containerRect = containerRef.current?.getBoundingClientRect()
				if (!containerRect) return prevBlobs

				return prevBlobs.map(blob => {
					let newX = blob.x + blob.vx * speed
					let newY = blob.y + blob.vy * speed
					let newVx = blob.vx
					let newVy = blob.vy

					if (bounceEdges) {
						// Bounce off edges
						if (newX <= 0 || newX >= containerRect.width - blob.size) {
							newVx = -blob.vx
							newX = Math.max(0, Math.min(containerRect.width - blob.size, newX))
						}
						if (newY <= 0 || newY >= containerRect.height - blob.size) {
							newVy = -blob.vy
							newY = Math.max(0, Math.min(containerRect.height - blob.size, newY))
						}
					} else {
						// Wrap around edges
						if (newX < -blob.size) newX = containerRect.width
						if (newX > containerRect.width) newX = -blob.size
						if (newY < -blob.size) newY = containerRect.height
						if (newY > containerRect.height) newY = -blob.size
					}

					return {
						...blob,
						x: newX,
						y: newY,
						vx: newVx,
						vy: newVy
					}
				})
			})
		}

		// Initialize blobs after component mounts
		const timer = setTimeout(initializeBlobs, 100)
		
		// Animation loop
		const interval = 1000 / fps
		const animationId = setInterval(animate, interval)

		return () => {
			clearTimeout(timer)
			clearInterval(animationId)
		}
	}, [blobCount, speed, minSpeed, maxSpeed, minSize, maxSize, minOpacity, maxOpacity, colors, fps, bounceEdges])

	return (
		<div 
			ref={containerRef}
			className={`absolute inset-0 -z-10 overflow-hidden ${className}`}
			aria-hidden="true"
		>
			{blobs.map(blob => (
				<div
					key={blob.id}
					className={`absolute rounded-full ${blur} bg-gradient-to-br ${blob.gradient} transition-transform duration-75 ease-linear`}
					style={{
						width: `${blob.size}px`,
						height: `${blob.size}px`,
						left: `${blob.x}px`,
						top: `${blob.y}px`,
					}}
				/>
			))}
		</div>
	)
}