import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

export function HeroActions() {
	return (
		<div className="mt-10 flex items-center justify-center gap-x-6">
			<Button asChild size="lg">
				<Link to="/demo">Try Live Demo</Link>
			</Button>
			<Button asChild variant="outline" size="lg">
				<Link to="/docs">Read Docs</Link>
			</Button>
		</div>
	)
}