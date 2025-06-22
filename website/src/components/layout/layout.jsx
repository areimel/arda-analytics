import { Outlet } from 'react-router-dom'
import { Navbar } from './navbar'
import { Footer } from './footer'

export function Layout() {
	return (
		<div className="min-h-screen bg-background font-sans antialiased">
			<Navbar />
			<main>
				<Outlet />
			</main>
			<Footer />
		</div>
	)
} 