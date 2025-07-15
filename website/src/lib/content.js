// Import JSON content files (these get bundled at build time)
import seoData from '@/data/metadata-seo.json'
import brandingData from '@/data/branding.json'
import headerFooterData from '@/data/header-footer.json'

// Utility functions to access content
export const getSeoData = () => seoData
export const getBrandingData = () => brandingData
export const getHeaderFooterData = () => headerFooterData

// Specific content getters
export const getSiteMetadata = () => seoData.site
export const getPageMetadata = (page) => seoData.pages[page] || {}
export const getBrandInfo = () => brandingData.brand
export const getProductInfo = () => brandingData.product
export const getFeatures = () => brandingData.features
export const getNavigation = () => headerFooterData.header.navigation
export const getHeaderCTA = () => headerFooterData.header.cta
export const getFooterData = () => headerFooterData.footer

// Helper function to get icon component name from string
export const getIconName = (iconString) => {
  // Convert kebab-case to PascalCase for Lucide React components
  return iconString
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')
}

// Helper to get color classes for features
export const getFeatureColorClasses = (color) => {
  const colorMap = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    purple: 'text-purple-600',
    cyan: 'text-cyan-600',
    orange: 'text-orange-600',
    red: 'text-red-600',
  }
  return colorMap[color] || 'text-blue-600'
}

// Helper to generate page title
export const generatePageTitle = (page) => {
  const pageData = getPageMetadata(page)
  const siteData = getSiteMetadata()
  
  if (pageData.title) {
    return pageData.title
  }
  
  return page ? `${page} - ${siteData.name}` : siteData.name
} 