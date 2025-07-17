import * as LucideIcons from 'lucide-react'

export function HeroStats({ bundleSize }) {
	return (
		<div className="mt-8 flex items-center justify-center space-x-8 text-sm text-muted-foreground">
			<div className="flex items-center space-x-2">
				<LucideIcons.Code2 className="h-4 w-4" />
				<span className="font-mono">{bundleSize} gzipped</span>
			</div>
			<div className="flex items-center space-x-2">
				<LucideIcons.Shield className="h-4 w-4" />
				<span>GDPR Compliant</span>
			</div>
			<div className="flex items-center space-x-2">
				<LucideIcons.Zap className="h-4 w-4" />
				<span>Zero Dependencies</span>
			</div>
		</div>
	)
}