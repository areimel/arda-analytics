import { AnimatedBlobBackground } from '../shared/AnimatedBlobBackground'

export function HeroSection({ children }) {
	return (
		<section className="relative isolate px-6 pt-14 lg:px-8">
			{/* <AnimatedBlobBackground 
				blobCount={10}
				speed={3}
				blur="blur-xl"
				minSize={150}
				maxSize={500}
				minOpacity={0.3}
				maxOpacity={0.5}
				bounceEdges={true}
				fps={60}
			/> */}
			<div className="mx-auto max-w-4xl py-32 sm:py-48 lg:py-56">
				<div className="text-center">
					{children}
				</div>
			</div>
		</section>
	)
}