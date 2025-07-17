export function MetricCard({ highlight, index }) {
	return (
		<div key={index} className="rounded-lg bg-card p-8 text-center border">
			<div className="text-3xl font-bold font-mono text-primary mb-2">
				{highlight.value}
			</div>
			<div className="text-sm font-medium text-muted-foreground">
				{highlight.description}
			</div>
			<div className="text-xs text-muted-foreground mt-1">
				{highlight.label}
			</div>
		</div>
	)
}