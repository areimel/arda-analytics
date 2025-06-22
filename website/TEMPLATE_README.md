# NPM Library Website Template

This is a complete website template for showcasing and documenting NPM libraries. It features a modern design with JSON-powered content management, making it easy to customize for different projects.

## Features

### 🎨 **Modern Design System**
- Tailwind CSS with Shadcn-ui components
- Dark/light mode support with system preference detection
- Responsive design for all screen sizes
- Tech-focused aesthetic with JetBrains Mono font

### 📄 **JSON-Powered Content**
- All content stored in JSON files for easy editing
- Content gets baked into the build (not dynamically loaded)
- Easy rebranding and customization
- SEO metadata management

### 🔧 **Developer Experience**
- React + Vite for fast development
- TypeScript ready
- Path aliases (`@/`) for clean imports
- Hot module replacement
- Optimized production builds

### 📚 **Complete Pages**
- **Homepage**: Marketing landing with features, installation guides, and CTAs
- **Demo Page**: Interactive playground with real-time event tracking
- **Documentation**: API reference and integration guides
- **Responsive Navigation**: Mobile-friendly with theme toggle

## Quick Start

### 1. **Customize Content**

Edit the JSON files in `src/data/` to match your project:

#### `src/data/branding.json`
```json
{
  "brand": {
    "name": "Your Library Name",
    "tagline": "Your Tagline Here",
    "shortName": "YLN",
    "logoText": "Your Library"
  },
  "product": {
    "type": "JavaScript Library",
    "bundleSize": "<3KB",
    "license": "MIT",
    "version": "1.0.0"
  }
}
```

#### `src/data/metadata-seo.json`
```json
{
  "site": {
    "name": "Your Library Name",
    "description": "Your library description for SEO",
    "url": "https://your-domain.com",
    "keywords": ["your", "keywords", "here"]
  }
}
```

#### `src/data/header-footer.json`
```json
{
  "header": {
    "navigation": [
      { "name": "Home", "href": "/" },
      { "name": "Demo", "href": "/demo" },
      { "name": "Docs", "href": "/docs" }
    ]
  }
}
```

### 2. **Update Package Information**

Edit `package.json`:
```json
{
  "name": "your-library-website",
  "description": "Website for Your Library"
}
```

### 3. **Customize Styling** (Optional)

- Update colors in `tailwind.config.js`
- Modify CSS variables in `src/index.css`
- Add your own logo/icons

### 4. **Deploy**

```bash
# Build for production
pnpm build

# Preview build locally
pnpm preview

# Deploy to your hosting platform
# (Netlify, Vercel, GitHub Pages, etc.)
```

## File Structure

```
src/
├── data/                    # JSON content files
│   ├── branding.json       # Brand info, features, product details
│   ├── metadata-seo.json   # SEO metadata for all pages
│   └── header-footer.json  # Navigation and footer content
├── components/
│   ├── seo/               # SEO components
│   ├── layout/            # Header, footer, layout
│   └── ui/                # Shadcn-ui components
├── pages/                 # React page components
├── lib/                   # Utilities and content helpers
└── App.jsx               # Main app with routing
```

## Customization Guide

### Adding New Pages

1. Create a new page component in `src/pages/`
2. Add route to `src/App.jsx`
3. Add navigation link to `header-footer.json`
4. Add SEO metadata to `metadata-seo.json`

### Changing Branding

1. Update `src/data/branding.json` with your info
2. Replace any hardcoded references
3. Update social media links in `header-footer.json`
4. Add your own logo/favicon

### Adding Features

Add new features to `branding.json`:
```json
{
  "features": {
    "primary": [
      {
        "title": "New Feature",
        "description": "Feature description",
        "icon": "zap",
        "color": "blue"
      }
    ]
  }
}
```

### Custom Icons

Use any Lucide React icon name in the JSON files:
- `zap`, `shield`, `code-2`, `globe`, etc.
- Icons are automatically imported and rendered

## Content Management

All content is managed through JSON files:

- **Branding**: Company/product information, features, highlights
- **SEO**: Page titles, descriptions, keywords, Open Graph data
- **Navigation**: Header/footer links, CTAs, social media

This approach allows for:
- Easy content updates without code changes
- Consistent branding across all pages
- Simple reuse for multiple projects
- Better SEO management

## Building for Production

The website builds into static files that can be deployed anywhere:

```bash
pnpm build
# Creates optimized build in dist/
```

**Build outputs:**
- Minified CSS and JavaScript
- Optimized images
- Pre-rendered HTML with SEO metadata
- Service worker for caching (if enabled)

## Template Reuse

To use this template for a new project:

1. **Fork/clone** this repository
2. **Update JSON files** with your content
3. **Replace** any specific references
4. **Customize** styling as needed
5. **Deploy** to your hosting platform

The JSON-powered approach makes it easy to maintain multiple library websites from the same template.

## Technologies Used

- **React 19** - UI framework
- **Vite** - Build tool and dev server  
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn-ui** - Component library
- **Lucide React** - Icon library
- **React Router** - Client-side routing

## License

This template is released under the MIT license. Feel free to use it for your own projects! 