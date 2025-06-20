import { Button } from '@/components/ui/button'
import { Code2, Zap, Shield, BarChart3 } from 'lucide-react'
import { Link } from 'react-router-dom'

export function HomePage() {
	return (
		<div className="flex flex-col">
			{/* Hero Section */}
			<section className="relative isolate px-6 pt-14 lg:px-8">
				<div className="mx-auto max-w-4xl py-32 sm:py-48 lg:py-56">
					<div className="text-center">
						<h1 className="text-4xl font-bold tracking-tight sm:text-6xl font-mono">
							Analytics Made{' '}
							<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
								Simple
							</span>
						</h1>
						<p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
							A lightweight, privacy-focused analytics plugin that gives you the insights you need without the complexity you don't. 
							Deploy in minutes, not hours.
						</p>
						<div className="mt-10 flex items-center justify-center gap-x-6">
							<Button asChild size="lg">
								<Link to="/demo">Try Live Demo</Link>
							</Button>
							<Button asChild variant="outline" size="lg">
								<Link to="/docs">Read Docs</Link>
							</Button>
						</div>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section className="py-24 sm:py-32 bg-gray-50 dark:bg-gray-900">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="mx-auto max-w-2xl text-center">
						<h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-mono">Why Choose ARDA Analytics?</h2>
						<p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
							Built by developers, for developers. Every feature designed with performance and privacy in mind.
						</p>
					</div>
					<div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-4">
						<div className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow-sm border">
							<Zap className="h-8 w-8 text-blue-600" />
							<h3 className="mt-4 text-lg font-semibold">Lightweight</h3>
							<p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Less than 5KB gzipped</p>
						</div>
						<div className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow-sm border">
							<Shield className="h-8 w-8 text-green-600" />
							<h3 className="mt-4 text-lg font-semibold">Privacy First</h3>
							<p className="mt-2 text-sm text-gray-600 dark:text-gray-400">GDPR compliant by design</p>
						</div>
						<div className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow-sm border">
							<BarChart3 className="h-8 w-8 text-purple-600" />
							<h3 className="mt-4 text-lg font-semibold">Real-time</h3>
							<p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Instant analytics tracking</p>
						</div>
						<div className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow-sm border">
							<Code2 className="h-8 w-8 text-orange-600" />
							<h3 className="mt-4 text-lg font-semibold">Developer Friendly</h3>
							<p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Clean APIs & TypeScript</p>
						</div>
					</div>
				</div>
			</section>
		</div>
	)
} 