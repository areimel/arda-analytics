export function SectionHeader({ title, description }) {
	return (
		<div className="mx-auto max-w-2xl text-center">
			<h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-mono">
				{title}
			</h2>
			{description && (
				<p className="mt-4 text-lg text-muted-foreground">
					{description}
				</p>
			)}
		</div>
	)
}