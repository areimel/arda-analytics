import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

export function CTAContent({ brandInfo, siteData }) {
	return (
		<div className="mx-auto max-w-2xl text-center">
			<h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-mono">
				Ready to get started?
			</h2>
			<p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
				Join thousands of developers who trust {brandInfo.name} for their tracking needs.
			</p>
			<div className="mt-10 flex items-center justify-center gap-x-6">
				<Button asChild size="lg">
					<Link to="/demo">Try Live Demo</Link>
				</Button>
				<Button asChild variant="outline" size="lg">
					<a href={siteData.github} target="_blank" rel="noopener noreferrer">
						View on GitHub
					</a>
				</Button>
			</div>
		</div>
	)
}