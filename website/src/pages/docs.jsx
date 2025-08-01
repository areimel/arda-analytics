import { Code, Zap, Shield, Settings, Package, Globe, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHead } from '@/components/seo/page-head';
import { PageHeader } from '@/components/shared/PageHeader';
import { InfoCard } from '@/components/shared/InfoCard';
import { GridCardLayout } from '@/components/shared/GridCardLayout';
import { SearchableContent } from '@/components/shared/SearchableContent';

export function DocsPage() {
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

  return (
    <>
      <PageHead page="docs" />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <PageHeader 
            title="Documentation"
            description="Everything you need to integrate ARDA Analytics into your applications. From quick start guides to advanced configuration options."
          />

          <SearchableContent 
            placeholder="Search documentation..."
            data={sections}
            searchFields={['name', 'description']}
            noResultsMessage="No documentation found for"
          >
            {(displayData) => (
              <GridCardLayout columns={{ base: 1, lg: 2 }} gap={8}>
                {displayData.map((section, index) => (
                  <InfoCard
                    key={index}
                    variant="docs-section"
                    title={section.title}
                    description={section.description}
                    icon={section.icon}
                    items={section.items}
                  />
                ))}
              </GridCardLayout>
            )}
          </SearchableContent>

          {/* Popular Pages */}
          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-6">Popular Pages</h2>
            <GridCardLayout columns={{ base: 1, md: 3 }} gap={6}>
              <InfoCard
                variant="docs-popular"
                title="Installation Guide"
                description="NPM, CDN, and self-hosted setup options with step-by-step instructions."
                icon={<Package className="h-5 w-5" />}
                href="/docs/installation"
                iconColor="blue"
              />
              <InfoCard
                variant="docs-popular"
                title="API Reference"
                description="Complete API documentation with examples, parameters, and return types."
                icon={<Code className="h-5 w-5" />}
                href="/docs/api"
                iconColor="green"
              />
              <InfoCard
                variant="docs-popular"
                title="Framework Integration"
                description="React, Vue, Astro, WordPress, and other platform integrations."
                icon={<Settings className="h-5 w-5" />}
                href="/docs/frameworks"
                iconColor="purple"
              />
            </GridCardLayout>
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