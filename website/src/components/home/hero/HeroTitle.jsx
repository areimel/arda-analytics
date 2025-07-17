export function HeroTitle({ tagline }) {
	return (
		<h1 className="text-4xl font-bold tracking-tight sm:text-6xl font-mono">
			{tagline.split(' ').slice(0, -1).join(' ')}{' '}
			<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
				{tagline.split(' ').slice(-1)[0]}
			</span>
		</h1>
	)
}