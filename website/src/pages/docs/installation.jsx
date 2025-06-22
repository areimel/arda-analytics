import { useState } from 'react';
import { Package, Globe, Server, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CodeBlock, InstallationSteps } from '@/components/ui/code-block';
import documentationData from '@/data/documentation.json';

const iconMap = {
  package: Package,
  globe: Globe,
  server: Server
};

export default function Installation() {
  const [selectedMethod, setSelectedMethod] = useState('npm');
  const { installation } = documentationData;

  const selectedInstallation = installation.methods.find(
    method => method.id === selectedMethod
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Installation Guide</h1>
          <p className="text-lg text-muted-foreground">
            Get started with ARDA Analytics in minutes. Choose your preferred installation method below.
          </p>
        </div>

        {/* Installation Method Selector */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Choose Installation Method</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {installation.methods.map((method) => {
              const Icon = iconMap[method.icon];
              const isSelected = selectedMethod === method.id;
              
              return (
                <Card 
                  key={method.id} 
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    isSelected ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedMethod(method.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'
                      }`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <CardTitle className="text-lg">{method.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{method.description}</CardDescription>
                    {isSelected && (
                      <div className="mt-3">
                        <Badge variant="secondary">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Selected
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Selected Installation Steps */}
        {selectedInstallation && (
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary text-primary-foreground rounded-lg">
                {React.createElement(iconMap[selectedInstallation.icon], { className: "h-5 w-5" })}
              </div>
              <div>
                <h2 className="text-2xl font-semibold">{selectedInstallation.title}</h2>
                <p className="text-muted-foreground">{selectedInstallation.description}</p>
              </div>
            </div>

            <InstallationSteps steps={selectedInstallation.steps} />
          </div>
        )}

        {/* Quick Start Example */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Start Example</CardTitle>
              <CardDescription>
                Once installed, here's a basic example to get you started immediately
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock
                language="javascript"
                title="Basic Usage"
                code={`// Initialize ARDA Analytics
const analytics = ArdalAnalytics.init({
  apiKey: 'your-api-key-here',
  trackPageViews: true,
  enableDebug: false
});

// Track a custom event
analytics.track('user_signup', {
  method: 'email',
  plan: 'free',
  timestamp: Date.now()
});

// Identify a user
analytics.identify('user-123', {
  name: 'John Doe',
  email: 'john@example.com',
  signup_date: '2024-01-15'
});

// Track page views manually
analytics.page('Landing Page', {
  category: 'marketing',
  source: 'google'
});`}
              />
            </CardContent>
          </Card>
        </div>

        {/* Next Steps */}
        <div className="bg-muted/50 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">What's Next?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">📚 Documentation</h4>
              <p className="text-sm text-muted-foreground">
                Explore the complete API reference and configuration options
              </p>
              <Button variant="outline" size="sm" asChild>
                <a href="/docs/api">View API Docs</a>
              </Button>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">🔧 Framework Integration</h4>
              <p className="text-sm text-muted-foreground">
                Learn how to integrate with React, Vue, and other frameworks
              </p>
              <Button variant="outline" size="sm" asChild>
                <a href="/docs/frameworks">View Integrations</a>
              </Button>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">🎮 Try the Demo</h4>
              <p className="text-sm text-muted-foreground">
                See ARDA Analytics in action with our interactive demo
              </p>
              <Button variant="outline" size="sm" asChild>
                <a href="/demo">View Demo</a>
              </Button>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">❓ Troubleshooting</h4>
              <p className="text-sm text-muted-foreground">
                Common issues and solutions to get you up and running
              </p>
              <Button variant="outline" size="sm" asChild>
                <a href="/docs/troubleshooting">Get Help</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 