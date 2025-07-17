export function SectionContainer({ children, className = "" }) {
	return (
		<section className={`py-24 sm:py-32 ${className}`}>
			<div className="mx-auto max-w-7xl px-6 lg:px-8">
				{children}
			</div>
		</section>
	)
}