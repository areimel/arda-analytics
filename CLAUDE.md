# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ARDA Analytics is a vanilla JavaScript analytics plugin with an orchestrator architecture pattern. It's a monorepo containing:

- `plugin/` - Core analytics plugin built with TypeScript/Webpack
- `website/` - React demo site with Vite
- `docs/` - Documentation (workspace configured but not currently used)

The plugin uses a service-oriented architecture with micro-services for different analytics functions (UTM tracking, form handling, GTM integration, user journey tracking).

## Common Commands

### Development
```bash
# Install dependencies (uses pnpm workspaces)
pnpm install

# Start all development servers in parallel
pnpm dev

# Plugin development server only (port 8080)
cd plugin && pnpm dev

# Website development server only
cd website && pnpm dev
```

### Building
```bash
# Build all packages
pnpm build

# Build plugin only (creates UMD, CommonJS, and ESM bundles)
cd plugin && pnpm build

# Build website only
cd website && pnpm build
```

### Testing & Quality
```bash
# Run tests in all packages
pnpm test

# Plugin tests with Jest
cd plugin && pnpm test
cd plugin && pnpm test:watch
cd plugin && pnpm test:coverage

# Linting (all packages)
pnpm lint

# Plugin linting with TypeScript ESLint
cd plugin && pnpm lint
cd plugin && pnpm lint:fix
```

## Architecture Overview

### Plugin Architecture
The plugin follows an orchestrator pattern with a main service class (`AnalyticsService`) that coordinates multiple micro-services:

- **UTM Tracking** (`analytics-micro-services/utm-tracking.ts`) - Captures and manages UTM parameters
- **Form Tracking** (`analytics-micro-services/utm-form.ts`) - Automatically adds UTM fields to forms
- **GTM Integration** (`analytics-micro-services/gtm-event-push.ts`) - Pushes events to Google Tag Manager
- **User Journey Tracking** (`analytics-micro-services/user-journey-tracking.ts`) - Tracks user interaction sequences

### Main Entry Points
- `plugin/src/index.ts` - Main plugin class (`ARDAAnalytics`) that wraps the `AnalyticsService`
- `plugin/src/analytics.service.ts` - Central orchestrator service
- `plugin/src/analytics-functions.service.ts` - High-level analytics functions

### Build System
- **Plugin**: Uses Webpack with Babel/TypeScript compilation
- **Website**: Uses Vite with React/TypeScript
- **Distribution**: Plugin builds to multiple formats (UMD for CDN, CommonJS, ESM)

### Development Patterns
- The plugin is designed to work with or without framework dependencies
- Uses TypeScript with comprehensive type definitions
- Includes debug mode functionality controlled by configuration
- Supports both auto-initialization and manual initialization
- MutationObserver for dynamic form detection
- Service pattern with static methods for ease of use

### Testing
- Plugin uses Jest with jsdom environment
- Tests are located in `plugin/src/__tests__/`
- Coverage reports generated in `plugin/coverage/`

### Build Outputs
Plugin builds create:
- `dist/arda-analytics.min.js` - Minified UMD for CDN
- `dist/index.js` - CommonJS for Node.js/NPM
- `dist/index.esm.js` - ES modules for modern bundlers
- `dist/index.d.ts` - TypeScript declarations