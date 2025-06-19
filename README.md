# ARDA Analytics

A vanilla JavaScript analytics plugin with orchestrator architecture that can be distributed via NPM and CDN.

## Overview

ARDA Analytics is a modern, lightweight analytics plugin built with vanilla JavaScript. It features an orchestrator architecture that makes it highly extensible and maintainable. The plugin can be easily integrated into any web project and distributed through both NPM and CDN.

## Features

- 🎯 **Vanilla JavaScript** - No framework dependencies
- 🏗️ **Orchestrator Architecture** - Modular and extensible design
- 📦 **Multiple Distribution Formats** - NPM package and CDN-ready
- 🔧 **Easy Integration** - Works with any web framework
- 📊 **Comprehensive Analytics** - Track user interactions and events
- 🚀 **Performance Optimized** - Lightweight and fast
- 🛡️ **Type Safe** - Includes TypeScript declarations

## Project Structure

This is a monorepo containing:

- `plugin/` - The core analytics plugin
- `website/` - React.js demo and documentation website
- `docs/` - Additional documentation and guides

## Installation

### Via NPM

```bash
npm install arda-analytics
# or
pnpm add arda-analytics
# or
yarn add arda-analytics
```

### Via CDN

```html
<script src="https://cdn.jsdelivr.net/npm/arda-analytics@latest/dist/arda-analytics.min.js"></script>
```

## Quick Start

```javascript
// Initialize the plugin
const analytics = new ARDAAnalytics({
	// Your configuration options
});

// Track events
analytics.track('page_view', {
	page: '/home',
	title: 'Home Page'
});
```

## Development

This project uses pnpm workspaces for monorepo management.

```bash
# Install dependencies
pnpm install

# Start development servers
pnpm dev

# Build all packages
pnpm build

# Run tests
pnpm test
```

## Documentation

Visit our [documentation website](https://arda-analytics.dev) for comprehensive guides, API reference, and examples.

## Contributing

We welcome contributions! Please read our contributing guidelines before submitting pull requests.

## License

MIT License - see [LICENSE](LICENSE) file for details.

---

Built with ❤️ by the ARDA Analytics Team 