import { CodeBlock } from './CodeBlock'

export function InstallationCard({ title, code }) {
	return (
		<div className="rounded-lg border bg-card p-8">
			<h3 className="text-xl font-semibold mb-4 font-mono">{title}</h3>
			<CodeBlock code={code} />
		</div>
	)
}