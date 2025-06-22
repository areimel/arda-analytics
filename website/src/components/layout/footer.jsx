import { Link } from 'react-router-dom'
import { Code2, Github, Twitter } from 'lucide-react'
import { getBrandInfo, getFooterData, getSiteMetadata } from '@/lib/content'

const iconMap = {
  github: Github,
  twitter: Twitter,
  discord: Code2, // Using Code2 as placeholder for Discord
}

export function Footer() {
  const brandInfo = getBrandInfo()
  const footerData = getFooterData()
  const siteData = getSiteMetadata()

  return (
    <footer className="bg-muted/50 border-t">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        {/* Main footer content */}
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          {/* Brand section */}
          <div className="space-y-8">
            <Link to="/" className="flex items-center space-x-2">
              <Code2 className="h-8 w-8" />
              <span className="font-mono text-xl font-bold">{brandInfo.logoText}</span>
            </Link>
            <p className="text-sm leading-6 text-muted-foreground max-w-xs">
              {siteData.description}
            </p>
            <div className="flex space-x-6">
              {footerData.social.map((item) => {
                const IconComponent = iconMap[item.icon] || Code2
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <span className="sr-only">{item.name}</span>
                    <IconComponent className="h-6 w-6" aria-hidden="true" />
                  </a>
                )
              })}
            </div>
          </div>
          
          {/* Links sections */}
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              {footerData.sections.slice(0, 2).map((section) => (
                <div key={section.title}>
                  <h3 className="text-sm font-semibold leading-6">{section.title}</h3>
                  <ul role="list" className="mt-6 space-y-4">
                    {section.links.map((link) => (
                      <li key={link.name}>
                        {link.external ? (
                          <a
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm leading-6 text-muted-foreground hover:text-primary transition-colors"
                          >
                            {link.name}
                          </a>
                        ) : (
                          <Link
                            to={link.href}
                            className="text-sm leading-6 text-muted-foreground hover:text-primary transition-colors"
                          >
                            {link.name}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              {footerData.sections.slice(2).map((section) => (
                <div key={section.title}>
                  <h3 className="text-sm font-semibold leading-6">{section.title}</h3>
                  <ul role="list" className="mt-6 space-y-4">
                    {section.links.map((link) => (
                      <li key={link.name}>
                        {link.external ? (
                          <a
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm leading-6 text-muted-foreground hover:text-primary transition-colors"
                          >
                            {link.name}
                          </a>
                        ) : (
                          <Link
                            to={link.href}
                            className="text-sm leading-6 text-muted-foreground hover:text-primary transition-colors"
                          >
                            {link.name}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Bottom section */}
        <div className="mt-16 border-t pt-8 sm:mt-20 lg:mt-24">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-5 text-muted-foreground">
              {footerData.legal.copyright}
            </p>
            <div className="mt-4 flex space-x-6 sm:mt-0">
              {footerData.legal.links.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-xs leading-5 text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
} 