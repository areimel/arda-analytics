import { Outlet } from 'react-router-dom'
import { Navbar } from './navbar'
import { Footer } from './footer'

export function Layout() {
	return (
		<div className="min-h-screen bg-background font-sans antialiased">
			{/* Google Tag Manager (noscript) */}
			<noscript>
				<iframe 
					src="https://www.googletagmanager.com/ns.html?id=GTM-5GL3P7JD"
					height="0" 
					width="0" 
					style={{ display: 'none', visibility: 'hidden' }}
				></iframe>
			</noscript>
			<Navbar />
			<main>
				<Outlet />
			</main>
			<Footer />
		</div>
	)
} 