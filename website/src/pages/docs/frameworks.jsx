import { useState } from 'react';
import { ChevronRight, ExternalLink, Star, Users, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CodeBlock, FrameworkExample } from '@/components/ui/code-block';
import documentationData from '@/data/documentation.json';

const frameworkIcons = {
  react: '⚛️',
  vue: '💚',
  astro: '🚀',
  vanilla: '🟨',
  wordpress: '🌐',
  gtm: '🏷️',
  hubspot: '🧡'
};

const difficultyColors = {
  Easy: 'bg-green-100 text-green-800 border-green-200',
  Medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  Hard: 'bg-red-100 text-red-800 border-red-200'
};

export default function Frameworks() {
  const [selectedFramework, setSelectedFramework] = useState('react');
  const { frameworks } = documentationData;

  const frameworkKeys = Object.keys(frameworks);
  const currentFramework = frameworks[selectedFramework];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Framework Integration</h1>
          <p className="text-lg text-muted-foreground">
            ARDA Analytics works seamlessly with all major frameworks and platforms. 
            Choose your framework below to see detailed integration guides.
          </p>
        </div>

        {/* Framework Overview */}
        <div className="mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="text-center">
              <CardContent className="pt-6">
                <Zap className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                <div className="text-2xl font-bold">7</div>
                <div className="text-sm text-muted-foreground">Integrations</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <Users className="h-8 w-8 mx-auto mb-2 text-green-500" />
                <div className="text-2xl font-bold">10K+</div>
                <div className="text-sm text-muted-foreground">Downloads</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <Star className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                <div className="text-2xl font-bold">4.9</div>
                <div className="text-sm text-muted-foreground">Rating</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <ExternalLink className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                <div className="text-2xl font-bold">&lt;5KB</div>
                <div className="text-sm text-muted-foreground">Bundle Size</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Framework Selector */}
        <div className="mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {frameworkKeys.map((key) => {
              const framework = frameworks[key];
              const isSelected = selectedFramework === key;
              
              return (
                <Card 
                  key={key}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    isSelected ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedFramework(key)}
                >
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl mb-2">{frameworkIcons[key]}</div>
                    <div className="font-medium text-sm">{framework.title}</div>
                    <div className="flex items-center justify-center mt-2">
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${difficultyColors[framework.difficulty] || difficultyColors.Easy}`}
                      >
                        {framework.difficulty}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Selected Framework Details */}
        {currentFramework && (
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="text-4xl">{frameworkIcons[selectedFramework]}</div>
              <div>
                <h2 className="text-3xl font-bold">{currentFramework.title}</h2>
                <p className="text-muted-foreground mb-2">{currentFramework.description}</p>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={difficultyColors[currentFramework.difficulty]}>
                    {currentFramework.difficulty}
                  </Badge>
                  <Badge variant="secondary">
                    {currentFramework.examples.length} Example{currentFramework.examples.length !== 1 ? 's' : ''}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Examples */}
            <div className="space-y-6">
              {currentFramework.examples.map((example, index) => (
                <FrameworkExample key={index} example={example} />
              ))}
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Need Help Getting Started?</CardTitle>
              <CardDescription>
                Check out these resources to get up and running quickly
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium flex items-center gap-2">
                    📋 Installation Guide
                    <ChevronRight className="h-4 w-4" />
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Step-by-step installation for all methods
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <a href="/docs/installation">View Installation</a>
                  </Button>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium flex items-center gap-2">
                    🔧 API Reference
                    <ChevronRight className="h-4 w-4" />
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Complete API documentation with examples
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <a href="/docs/api">View API Docs</a>
                  </Button>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium flex items-center gap-2">
                    🎮 Interactive Demo
                    <ChevronRight className="h-4 w-4" />
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Try ARDA Analytics in your browser
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <a href="/demo">Try Demo</a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Popular Integrations */}
        <div className="bg-muted/50 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Popular Integrations</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['react', 'vue', 'vanilla', 'wordpress'].map((key) => {
              const framework = frameworks[key];
              return (
                <div 
                  key={key} 
                  className="flex items-center gap-3 p-3 bg-background rounded-lg cursor-pointer hover:shadow-sm transition-shadow"
                  onClick={() => setSelectedFramework(key)}
                >
                  <div className="text-xl">{frameworkIcons[key]}</div>
                  <div>
                    <div className="font-medium text-sm">{framework.title}</div>
                    <div className="text-xs text-muted-foreground">{framework.difficulty}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
} 