export function PageHeader({ title, description, useMono = false, children }) {
	return (
		<div className="text-center mb-12">
			<h1 className={`text-4xl font-bold mb-4 ${useMono ? 'font-mono' : ''}`}>
				{title}
			</h1>
			<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
				{description}
			</p>
			{children}
		</div>
	)
}