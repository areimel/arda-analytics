import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { Menu, X, Code2 } from 'lucide-react'
import { useState } from 'react'

const navigation = [
	{ name: 'Home', href: '/' },
	{ name: 'Demo', href: '/demo' },
	{ name: 'Docs', href: '/docs' },
]

export function Navbar() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
	const location = useLocation()

	return (
		<header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
				<div className="flex lg:flex-1">
					<Link to="/" className="-m-1.5 p-1.5 flex items-center space-x-2">
						<Code2 className="h-8 w-8" />
						<span className="font-mono text-xl font-bold">ARDA Analytics</span>
					</Link>
				</div>
				<div className="flex lg:hidden">
					<Button
						variant="ghost"
						size="icon"
						onClick={() => setMobileMenuOpen(true)}
					>
						<span className="sr-only">Open main menu</span>
						<Menu className="h-6 w-6" aria-hidden="true" />
					</Button>
				</div>
				<div className="hidden lg:flex lg:gap-x-12">
					{navigation.map((item) => (
						<Link
							key={item.name}
							to={item.href}
							className={`text-sm font-semibold leading-6 transition-colors hover:text-primary ${
								location.pathname === item.href
									? 'text-primary'
									: 'text-muted-foreground'
							}`}
						>
							{item.name}
						</Link>
					))}
				</div>
				<div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center lg:space-x-4">
					<ThemeToggle />
					<Button asChild variant="outline">
						<a href="https://github.com" target="_blank" rel="noopener noreferrer">
							GitHub
						</a>
					</Button>
					<Button asChild>
						<a href="#get-started">Get Started</a>
					</Button>
				</div>
			</nav>
			{/* Mobile menu */}
			{mobileMenuOpen && (
				<div className="lg:hidden">
					<div className="fixed inset-0 z-10" />
					<div className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-background px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-border">
						<div className="flex items-center justify-between">
							<Link to="/" className="-m-1.5 p-1.5 flex items-center space-x-2">
								<Code2 className="h-8 w-8" />
								<span className="font-mono text-xl font-bold">ARDA Analytics</span>
							</Link>
							<Button
								variant="ghost"
								size="icon"
								onClick={() => setMobileMenuOpen(false)}
							>
								<span className="sr-only">Close menu</span>
								<X className="h-6 w-6" aria-hidden="true" />
							</Button>
						</div>
						<div className="mt-6 flow-root">
							<div className="-my-6 divide-y divide-border">
								<div className="space-y-2 py-6">
									{navigation.map((item) => (
										<Link
											key={item.name}
											to={item.href}
											className={`-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 transition-colors hover:bg-accent ${
												location.pathname === item.href
													? 'text-primary bg-accent'
													: 'text-muted-foreground'
											}`}
											onClick={() => setMobileMenuOpen(false)}
										>
											{item.name}
										</Link>
									))}
								</div>
								<div className="py-6 space-y-4">
									<div className="flex items-center justify-between">
										<span className="text-sm font-medium">Theme</span>
										<ThemeToggle />
									</div>
									<Button asChild variant="outline" className="w-full">
										<a href="https://github.com" target="_blank" rel="noopener noreferrer">
											GitHub
										</a>
									</Button>
									<Button asChild className="w-full">
										<a href="#get-started">Get Started</a>
									</Button>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</header>
	)
} 