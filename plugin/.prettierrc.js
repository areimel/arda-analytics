module.exports = {
	// Use tabs for indentation
	useTabs: true,
	tabWidth: 4,

	// Code style
	semi: true,
	singleQuote: true,
	quoteProps: 'as-needed',
	trailingComma: 'all',

	// Bracket spacing
	bracketSpacing: true,
	bracketSameLine: false,

	// Arrow functions
	arrowParens: 'avoid',

	// Line length
	printWidth: 80,

	// Line endings
	endOfLine: 'lf',

	// Files to format
	overrides: [
		{
			files: '*.json',
			options: {
				parser: 'json',
				useTabs: true,
			},
		},
		{
			files: '*.md',
			options: {
				parser: 'markdown',
				useTabs: false,
				tabWidth: 2,
			},
		},
	],
}; 