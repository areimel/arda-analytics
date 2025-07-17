export function CodeBlock({ code }) {
	return (
		<div className="bg-muted rounded-md p-4 font-mono text-sm overflow-x-auto">
			<pre>{code}</pre>
		</div>
	)
}