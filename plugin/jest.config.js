module.exports = {
	// Test environment
	testEnvironment: 'jsdom',

	// Root directory
	rootDir: '.',

	// Test files
	testMatch: [
		'<rootDir>/src/**/__tests__/**/*.{test,spec}.{js,ts}',
		'<rootDir>/src/**/*.{test,spec}.{js,ts}',
	],

	// Coverage (disabled for initial setup)
	collectCoverage: false,
	coverageDirectory: 'coverage',
	coverageReporters: ['text', 'lcov', 'html'],
	collectCoverageFrom: [
		'src/**/*.{js,ts}',
		'!src/**/*.d.ts',
		'!src/**/__tests__/**',
		'!src/**/*.test.{js,ts}',
		'!src/**/*.spec.{js,ts}',
	],

	// Module paths
	moduleDirectories: ['node_modules', 'src'],
	
	// Module name mapping to handle .js imports for TypeScript files
	moduleNameMapper: {
		'^(\\.{1,2}/.*)\\.js$': '$1',
	},
	
	// Transform files
	transform: {
		'^.+\\.(js|ts)$': 'babel-jest',
	},

	// Setup files
	setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.js'],

	// Module file extensions (prioritize .ts over .js)
	moduleFileExtensions: ['ts', 'js', 'json'],

	// Clear mocks
	clearMocks: true,
	restoreMocks: true,

	// Verbose output
	verbose: true,

	// Coverage thresholds (reduced for initial setup)
	coverageThreshold: {
		global: {
			branches: 20,
			functions: 20,
			lines: 20,
			statements: 20,
		},
	},

	// Add extensionsToTreatAsEsm for better ES module support
	extensionsToTreatAsEsm: ['.ts'],
	
	// Globals for TypeScript compilation
	globals: {
		'ts-jest': {
			useESM: true
		}
	}
}; 