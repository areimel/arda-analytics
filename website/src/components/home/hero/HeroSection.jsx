import { BackgroundBlur } from '../shared/BackgroundBlur'

export function HeroSection({ children }) {
	return (
		<section className="relative isolate px-6 pt-14 lg:px-8">
			<BackgroundBlur />
			<div className="mx-auto max-w-4xl py-32 sm:py-48 lg:py-56">
				<div className="text-center">
					{children}
				</div>
			</div>
		</section>
	)
}