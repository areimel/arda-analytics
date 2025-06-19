module.exports = {
	env: {
		browser: true,
		es2021: true,
		node: true,
		jest: true,
	},
	extends: [
		'eslint:recommended',
	],
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
	},
	rules: {
		// Indentation
		'indent': ['error', 'tab'],
		'no-tabs': 'off',

		// Code quality
		'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
		'no-console': 'warn',
		'no-debugger': 'error',
		'prefer-const': 'error',
		'no-var': 'error',

		// Style consistency
		'semi': ['error', 'always'],
		'quotes': ['error', 'single'],
		'comma-dangle': ['error', 'always-multiline'],
		'object-curly-spacing': ['error', 'always'],
		'array-bracket-spacing': ['error', 'never'],

		// Best practices
		'eqeqeq': ['error', 'always'],
		'curly': ['error', 'all'],
		'dot-notation': 'error',
		'no-eval': 'error',
		'no-implied-eval': 'error',
		'no-new-func': 'error',
		'no-new-wrappers': 'error',
		'no-throw-literal': 'error',
	},
	overrides: [
		{
			files: ['**/*.test.js', '**/*.spec.js'],
			env: {
				jest: true,
			},
			rules: {
				'no-console': 'off',
			},
		},
	],
}; 