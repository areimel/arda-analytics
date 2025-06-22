# ARDA Analytics - Project Setup Plan

## Project Overview
Building a vanilla JavaScript analytics plugin with orchestrator architecture that can be distributed via NPM and CDN, plus a React.js demo/documentation website.

---

## Phase 1: Project Structure & Configuration
- [x] Initialize project structure
	- [x] Create root package.json with pnpm workspace configuration
	- [x] Set up workspace directories: `plugin/`, `website/`, `docs/`
	- [x] Create .gitignore for Node.js project with build artifacts
	- [x] Add .editorconfig with tab indentation preference
	- [x] Create basic README.md with project overview

- [x] Configure build tooling for plugin
	- [x] Set up webpack/rollup for plugin bundling with source maps
	- [x] Configure build to output single minified file for CDN distribution
	- [x] Configure build to output ES modules and CommonJS for NPM distribution
	- [x] Set up development build with source maps for debugging
	- [x] Add build scripts to package.json

---

## Phase 2: Plugin Architecture Setup
- [x] Create orchestrator-style plugin structure
	- [x] Main orchestrator file (`src/index.js`) - handles initialization and coordination
	- [x] Core modules directory (`src/core/`) 
		- [x] `config.js` - configuration management
		- [x] `events.js` - event handling system
		- [x] `storage.js` - data storage utilities
		- [x] `api.js` - API communication layer
	- [x] Utilities directory (`src/utils/`)
		- [x] `dom.js` - DOM manipulation helpers
		- [x] `validation.js` - input validation utilities
		- [x] `helpers.js` - general utility functions
	- [x] Types directory (`src/types/`) - JSDoc type definitions

- [x] Plugin core functionality framework
	- [x] Initialize plugin class/object structure in main orchestrator
	- [x] Set up module registration system for loading core modules
	- [x] Implement configuration merging and validation
	- [x] Create event system for inter-module communication
	- [x] Add error handling and logging framework
	- [x] Implement graceful degradation for unsupported browsers

- [x] Distribution preparation
	- [x] Configure build output for multiple formats (UMD, ES6, CommonJS)
	- [x] Set up package.json exports field for modern module resolution
	- [x] Create TypeScript declaration files (.d.ts) for better IDE support
	- [x] Add source map generation for debugging

---

## Phase 3: NPM Package Configuration
- [x] Configure package.json for NPM publishing
	- [x] Set correct entry points (main, module, browser fields)
	- [x] Configure files array to include only necessary distribution files
	- [x] Add proper keywords and description for discoverability
	- [x] Set up semantic versioning strategy
	- [x] Configure publish scripts and pre-publish hooks

- [x] Set up development workflow
	- [x] Add linting with ESLint (configured for vanilla JS)
	- [x] Set up Prettier for code formatting (tabs configuration)
	- [x] Create pre-commit hooks with husky
	- [x] Add test framework setup (Jest or similar)
	- [x] Configure CI/CD workflow for automated testing and publishing

---

## Phase 4: Demo Website Setup (React.js)
- [x] Initialize React application in `website/` directory
	- [x] Create React app with modern tooling (Vite or Create React App)
	- [x] Configure build output to separate `dist/` directory
	- [x] Set up routing with React Router for multiple pages
	- [x] Configure Tailwind CSS with Shadcn-ui component library
	- [x] Set up dark/light mode toggle with theme persistence
	- [x] Configure tech-y aesthetic with monospace fonts (JetBrains Mono, Fira Code, or similar)
	- [x] Add responsive design framework

- [x] Create website page structure
	- [x] Marketing homepage (`/`)
		- [x] Hero section with plugin overview
		- [x] Features showcase section
		- [x] Getting started/installation section
		- [x] Code examples section
		- [x] Call-to-action for documentation
	- [x] Demo pages (`/demo/*`)
		- [x] Interactive demo playground
		- [x] Feature-specific demo pages
		- [x] Live code examples with syntax highlighting
		- [x] Real-time plugin functionality showcase
	- [x] Documentation pages (`/docs/*`)
		- [x] API reference documentation
		- [x] Configuration options guide
		- [x] Integration examples for different frameworks
		- [x] Troubleshooting guide

- [x] Website functionality
	- [ ] Integrate the actual plugin for live demonstrations
	- [x] Add syntax highlighting for code examples (Prism.js or highlight.js) with dark/light theme support
	- [x] Implement search functionality for documentation
	- [x] Add responsive navigation with dark/light mode toggle
	- [x] Configure Shadcn-ui components for consistent tech aesthetic
	- [x] Set up monospace font stack for code blocks and technical elements
	- [x] Configure meta tags and SEO optimization

- [x] **JSON-Powered Content System** (Additional Enhancement)
	- [x] Create metadata-seo.json for page metadata and SEO
	- [x] Create branding.json for brand identity and product info
	- [x] Create header-footer.json for navigation and footer content
	- [x] Build content management utilities and helpers
	- [x] Implement SEO component with dynamic meta tag management
	- [x] Update all components to use JSON-driven content
	- [x] Create template documentation for reusability

---

## Phase 5: Documentation & Integration Examples
- [x] Create comprehensive documentation
	- [x] API documentation with JSDoc integration
	- [x] Installation guides for different environments
	- [x] Framework-specific integration examples:
		- [x] React integration example
		- [x] Vue.js integration example
		- [x] Astro integration example
		- [x] Vanilla HTML/CSS/JS example
        - [x] Google Tag Manager integration guide
		- [x] WordPress plugin integration
		- [x] HubSpot integration guide

- [x] Code examples and snippets
	- [x] Basic usage examples
	- [x] Advanced configuration examples
	- [x] Custom event handler examples
	- [x] Integration with popular analytics services

---

## Pause: Developing Plugin

---

## Phase 6: Distribution & Publishing Setup
- [ ] CDN distribution preparation
	- [ ] Create CDN-ready build with all dependencies bundled
	- [ ] Set up versioned releases for CDN hosting
	- [ ] Generate integrity hashes for security
	- [ ] Create CDN usage documentation

- [ ] NPM publishing workflow
	- [ ] Configure automated version bumping
	- [ ] Set up GitHub Actions for automated publishing
	- [ ] Create release notes automation
	- [ ] Configure npm provenance for security

- [ ] Website deployment
	- [ ] Configure website build for static hosting
	- [ ] Set up deployment to GitHub Pages, Netlify, or Vercel
	- [ ] Configure custom domain if needed
	- [ ] Set up automated deployment on main branch updates

---

## Phase 7: Development Tools & Quality Assurance
- [ ] Testing framework
	- [ ] Unit tests for core plugin functionality
	- [ ] Integration tests for module communication
	- [ ] Browser compatibility testing setup
	- [ ] Performance testing and benchmarking

- [ ] Development environment
	- [ ] Hot reload development server for plugin
	- [ ] Live reload for website development
	- [ ] Source map debugging configuration
	- [ ] Development vs production build configurations

- [ ] Quality assurance
	- [ ] Bundle size monitoring and optimization
	- [ ] Performance profiling tools
	- [ ] Accessibility testing for website
	- [ ] Cross-browser testing setup

---

## Next Steps
Once this foundation is established, you can provide the specific analytics functionality requirements and we can extend the plugin with the actual features and capabilities you need.

**Note**: This plan uses source maps correctly - they'll allow the bundled single-file plugin to map back to the original source files for debugging, while still providing the single-file distribution you want for easy CDN usage.