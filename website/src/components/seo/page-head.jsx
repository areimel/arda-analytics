import { useEffect } from 'react'
import { getSiteMetadata, getPageMetadata, generatePageTitle } from '@/lib/content'

export function PageHead({ page = 'home' }) {
  const siteData = getSiteMetadata()
  const pageData = getPageMetadata(page)
  
  useEffect(() => {
    // Set document title
    document.title = generatePageTitle(page)
    
    // Set meta description
    const description = pageData.description || siteData.description
    updateMetaTag('description', description)
    
    // Set meta keywords
    const keywords = pageData.keywords ? pageData.keywords.join(', ') : siteData.keywords.join(', ')
    updateMetaTag('keywords', keywords)
    
    // Set Open Graph tags
    updateMetaTag('og:title', generatePageTitle(page), 'property')
    updateMetaTag('og:description', description, 'property')
    updateMetaTag('og:url', `${siteData.url}${page === 'home' ? '' : `/${page}`}`, 'property')
    updateMetaTag('og:site_name', siteData.name, 'property')
    updateMetaTag('og:type', 'website', 'property')
    
    if (pageData.ogImage) {
      updateMetaTag('og:image', `${siteData.url}${pageData.ogImage}`, 'property')
    }
    
    // Set Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image', 'name')
    updateMetaTag('twitter:title', generatePageTitle(page), 'name')
    updateMetaTag('twitter:description', description, 'name')
    
    if (siteData.twitter) {
      updateMetaTag('twitter:site', siteData.twitter, 'name')
    }
    
    // Set canonical URL
    updateCanonicalTag(`${siteData.url}${page === 'home' ? '' : `/${page}`}`)
    
  }, [page, siteData, pageData])
  
  return null // This component doesn't render anything
}

// Helper function to update meta tags
function updateMetaTag(name, content, attribute = 'name') {
  let meta = document.querySelector(`meta[${attribute}="${name}"]`)
  
  if (!meta) {
    meta = document.createElement('meta')
    meta.setAttribute(attribute, name)
    document.head.appendChild(meta)
  }
  
  meta.setAttribute('content', content)
}

// Helper function to update canonical link
function updateCanonicalTag(href) {
  let canonical = document.querySelector('link[rel="canonical"]')
  
  if (!canonical) {
    canonical = document.createElement('link')
    canonical.setAttribute('rel', 'canonical')
    document.head.appendChild(canonical)
  }
  
  canonical.setAttribute('href', href)
} 