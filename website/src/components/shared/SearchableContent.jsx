import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'

export function SearchableContent({ 
	placeholder = "Search...", 
	data = [], 
	searchFields = ['name', 'description'], 
	onFilter,
	children,
	noResultsMessage = "No results found",
	className = ''
}) {
	const [searchTerm, setSearchTerm] = useState('')

	// Default filter function if none provided
	const defaultFilter = (items, term) => {
		if (!term) return items
		
		return items.map(section => ({
			...section,
			items: section.items?.filter(item =>
				searchFields.some(field =>
					item[field]?.toLowerCase().includes(term.toLowerCase())
				)
			) || []
		})).filter(section => section.items?.length > 0)
	}

	const filteredData = onFilter ? onFilter(data, searchTerm) : defaultFilter(data, searchTerm)
	const hasResults = searchTerm ? filteredData.length > 0 : true

	return (
		<div className={className}>
			{/* Search Input */}
			<div className="mb-8 max-w-md mx-auto">
				<div className="relative">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
					<Input
						placeholder={placeholder}
						className="pl-10"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
				</div>
			</div>

			{/* Content */}
			{hasResults ? (
				typeof children === 'function' ? children(searchTerm ? filteredData : data, searchTerm) : children
			) : (
				/* No Results */
				<div className="text-center py-8">
					<p className="text-muted-foreground">
						{noResultsMessage} "{searchTerm}"
					</p>
					<Button variant="outline" onClick={() => setSearchTerm('')} className="mt-4">
						Clear Search
					</Button>
				</div>
			)}
		</div>
	)
}