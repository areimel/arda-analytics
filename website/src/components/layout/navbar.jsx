import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { Menu, X, Code2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { getBrandInfo, getNavigation, getHeaderCTA } from '@/lib/content'
import { NavBarLink } from './NavBarLink'
import { MobileNavBarLink } from './MobileNavBarLink'

export function Navbar() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
	const [menuVisible, setMenuVisible] = useState(false)

	// Show menu with animation
	useEffect(() => {
		if (mobileMenuOpen) {
			// Wait for next tick to trigger transition
			setTimeout(() => setMenuVisible(true), 10)
		} else {
			setMenuVisible(false)
		}
	}, [mobileMenuOpen])

	// Handle closing with transition
	const handleCloseMenu = () => {
		setMenuVisible(false)
		setTimeout(() => setMobileMenuOpen(false), 350)
	}

	// Get content from JSON
	const brandInfo = getBrandInfo()
	const navigation = getNavigation()
	const headerCTA = getHeaderCTA()

	return (
		<>
			<header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
				<nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
					<div className="flex lg:flex-1">
						<Link to="/" className="-m-1.5 p-1.5 flex items-center space-x-2">
							<Code2 className="h-8 w-8" />
							<span className="font-mono text-xl font-bold">{brandInfo.logoText}</span>
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
					<div className="hidden lg:flex lg:gap-x-8">
						{navigation.map((item) => (
							<NavBarLink key={item.name} item={item} />
						))}
					</div>
					<div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center lg:space-x-4">
						<ThemeToggle />
						<Button asChild variant={headerCTA.secondary.variant}>
							{headerCTA.secondary.external ? (
								<a href={headerCTA.secondary.href} target="_blank" rel="noopener noreferrer">
									{headerCTA.secondary.text}
								</a>
							) : (
								<Link to={headerCTA.secondary.href}>
									{headerCTA.secondary.text}
								</Link>
							)}
						</Button>
						<Button asChild variant={headerCTA.primary.variant}>
							{headerCTA.primary.external ? (
								<a href={headerCTA.primary.href} target="_blank" rel="noopener noreferrer">
									{headerCTA.primary.text}
								</a>
							) : (
								<a href={headerCTA.primary.href}>
									{headerCTA.primary.text}
								</a>
							)}
						</Button>
					</div>
				</nav>
			</header>

			{/* Mobile menu rendered outside header for full viewport height */}
			{mobileMenuOpen && (
				<div className="fixed inset-0 z-50 flex lg:hidden">
					{/* Overlay */}
					<div className="absolute inset-0 bg-black/30" onClick={handleCloseMenu} />
					{/* Menu panel with slide transition */}
					<div className={`relative ml-auto h-full w-full max-w-xs sm:max-w-sm bg-background px-6 py-6 shadow-xl ring-1 ring-border overflow-y-auto transition-transform duration-[350ms] ease-in-out ${menuVisible ? 'translate-x-0' : 'translate-x-full'}`}>
						<div className="flex items-center justify-between">
							<Link to="/" className="-m-1.5 p-1.5 flex items-center space-x-2">
								<Code2 className="h-8 w-8" />
								<span className="font-mono text-xl font-bold">{brandInfo.logoText}</span>
							</Link>
							<Button
								variant="ghost"
								size="icon"
								onClick={handleCloseMenu}
							>
								<span className="sr-only">Close menu</span>
								<X className="h-6 w-6" aria-hidden="true" />
							</Button>
						</div>
						<div className="mt-6 flow-root">
							<div className="-my-6 divide-y divide-border">
								<div className="space-y-2 py-6">
									{navigation.map((item) => (
										<MobileNavBarLink 
											key={item.name} 
											item={item} 
											onLinkClick={() => setMobileMenuOpen(false)}
										/>
									))}
								</div>
								<div className="py-6 space-y-4">
									<div className="flex items-center justify-between">
										<span className="text-sm font-medium">Theme</span>
										<ThemeToggle />
									</div>
									<Button asChild variant={headerCTA.secondary.variant} className="w-full">
										{headerCTA.secondary.external ? (
											<a href={headerCTA.secondary.href} target="_blank" rel="noopener noreferrer">
												{headerCTA.secondary.text}
											</a>
										) : (
											<Link to={headerCTA.secondary.href}>
												{headerCTA.secondary.text}
											</Link>
										)}
									</Button>
									<Button asChild variant={headerCTA.primary.variant} className="w-full">
										{headerCTA.primary.external ? (
											<a href={headerCTA.primary.href} target="_blank" rel="noopener noreferrer">
												{headerCTA.primary.text}
											</a>
										) : (
											<a href={headerCTA.primary.href}>
												{headerCTA.primary.text}
											</a>
										)}
									</Button>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	)
} 