import { useState } from 'react';
import { Book, Code, Zap, Shield, Settings, Users, ChevronRight, Search, Package, Globe, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { PageHead } from '@/components/seo/page-head';

export function DocsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const sections = [
    {
      title: 'Getting Started',
      description: 'Learn the basics and get up and running quickly',
      icon: <Zap className="h-5 w-5" />,
      items: [
        { name: 'Installation', href: '/docs/installation', description: 'NPM, CDN, and self-hosted installation methods' },
        { name: 'Quick Start', href: '/docs/quick-start', description: 'Get started in 5 minutes with basic tracking' },
        { name: 'Configuration', href: '/docs/configuration', description: 'Configure privacy, performance, and custom options' }
      ]
    },
    {
      title: 'API Reference',
      description: 'Complete API documentation and examples',
      icon: <Code className="h-5 w-5" />,
      items: [
        { name: 'Core Methods', href: '/docs/api', description: 'init(), track(), identify(), and page() methods' },
        { name: 'Event Tracking', href: '/docs/api#track', description: 'Track custom events with properties' },
        { name: 'User Management', href: '/docs/api#identify', description: 'Identify and manage user data' }
      ]
    },
    {
      title: 'Framework Integration',
      description: 'Integration guides for popular frameworks',
      icon: <Settings className="h-5 w-5" />,
      items: [
        { name: 'React', href: '/docs/frameworks#react', description: 'Hooks, context, and component integration' },
        { name: 'Vue.js', href: '/docs/frameworks#vue', description: 'Composition API and plugin setup' },
        { name: 'Astro', href: '/docs/frameworks#astro', description: 'Static site generation integration' },
        { name: 'Vanilla JS', href: '/docs/frameworks#vanilla', description: 'Pure JavaScript implementation' }
      ]
    },
    {
      title: 'Platform Integration',
      description: 'CMS and marketing platform integrations',
      icon: <Globe className="h-5 w-5" />,
      items: [
        { name: 'WordPress', href: '/docs/frameworks#wordpress', description: 'Theme and plugin integration guides' },
        { name: 'Google Tag Manager', href: '/docs/frameworks#gtm', description: 'Deploy via GTM with custom variables' },
        { name: 'HubSpot', href: '/docs/frameworks#hubspot', description: 'CRM and Marketing Hub integration' }
      ]
    },
    {
      title: 'Privacy & Security',
      description: 'GDPR compliance and privacy features',
      icon: <Shield className="h-5 w-5" />,
      items: [
        { name: 'GDPR Compliance', href: '/docs/privacy/gdpr', description: 'Built-in privacy controls and consent management' },
        { name: 'Data Retention', href: '/docs/privacy/retention', description: 'Configure data retention policies' },
        { name: 'Cookie Consent', href: '/docs/privacy/cookies', description: 'Cookie-free tracking options' }
      ]
    },
    {
      title: 'Troubleshooting',
      description: 'Common issues and solutions',
      icon: <Wrench className="h-5 w-5" />,
      items: [
        { name: 'Installation Issues', href: '/docs/troubleshooting#installation', description: 'Common installation problems and fixes' },
        { name: 'Event Tracking', href: '/docs/troubleshooting#events', description: 'Debugging event tracking issues' },
        { name: 'Performance', href: '/docs/troubleshooting#performance', description: 'Optimize performance and reduce bundle size' }
      ]
    }
  ];

  const filteredSections = sections.map(section => ({
    ...section,
    items: section.items.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(section => section.items.length > 0);

  return (
    <>
      <PageHead page="docs" />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Documentation</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to integrate ARDA Analytics into your applications. 
              From quick start guides to advanced configuration options.
            </p>
          </div>

          {/* Search */}
          <div className="mb-8 max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search documentation..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Documentation Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {(searchTerm ? filteredSections : sections).map((section, index) => (
              <Card key={index} className="h-fit">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      {section.icon}
                    </div>
                    <div>
                      <CardTitle>{section.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {section.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {section.items.map((item, itemIndex) => (
                      <a
                        key={itemIndex}
                        href={item.href}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                      >
                        <div>
                          <div className="font-medium group-hover:text-primary">
                            {item.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {item.description}
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* No Results */}
          {searchTerm && filteredSections.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No documentation found for "{searchTerm}"</p>
              <Button variant="outline" onClick={() => setSearchTerm('')} className="mt-4">
                Clear Search
              </Button>
            </div>
          )}

          {/* Popular Pages */}
          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-6">Popular Pages</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <a href="/docs/installation">
                <Card className="group hover:shadow-md transition-all cursor-pointer hover:ring-2 hover:ring-primary/20">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Package className="h-5 w-5 text-blue-600" />
                      </div>
                      <h3 className="font-semibold">Installation Guide</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      NPM, CDN, and self-hosted setup options with step-by-step instructions.
                    </p>
                  </CardContent>
                </Card>
              </a>

              <a href="/docs/api">
                <Card className="group hover:shadow-md transition-all cursor-pointer hover:ring-2 hover:ring-primary/20">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Code className="h-5 w-5 text-green-600" />
                      </div>
                      <h3 className="font-semibold">API Reference</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Complete API documentation with examples, parameters, and return types.
                    </p>
                  </CardContent>
                </Card>
              </a>

              <a href="/docs/frameworks">
                <Card className="group hover:shadow-md transition-all cursor-pointer hover:ring-2 hover:ring-primary/20">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Settings className="h-5 w-5 text-purple-600" />
                      </div>
                      <h3 className="font-semibold">Framework Integration</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      React, Vue, Astro, WordPress, and other platform integrations.
                    </p>
                  </CardContent>
                </Card>
              </a>
            </div>
          </div>

          {/* Getting Started CTA */}
          <div className="mt-12 text-center bg-muted/50 rounded-lg p-8">
            <h2 className="text-2xl font-semibold mb-4">Ready to get started?</h2>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              Jump right in with our installation guide, or try our interactive demo to see ARDA Analytics in action.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <a href="/docs/installation">Get Started</a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="/demo">Try Demo</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 