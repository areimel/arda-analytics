import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@/components/theme-provider'
import { Layout } from '@/components/layout/layout'
import { HomePage } from '@/pages/home'
import { DemoPage } from '@/pages/demo'
import { DocsPage } from '@/pages/docs'
import './App.css'

function App() {
	return (
		<ThemeProvider defaultTheme="system" storageKey="arda-ui-theme">
			<Router>
				<Routes>
					<Route path="/" element={<Layout />}>
						<Route index element={<HomePage />} />
						<Route path="demo" element={<DemoPage />} />
						<Route path="docs" element={<DocsPage />} />
					</Route>
				</Routes>
			</Router>
		</ThemeProvider>
	)
}

export default App
