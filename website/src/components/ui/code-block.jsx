import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from './button';

export function CodeBlock({ 
  code, 
  language = 'javascript', 
  title = null,
  showCopy = true,
  className = ""
}) {
  const [copied, setCopied] = useState(false);
  const isDark = document.documentElement.classList.contains('dark');
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <div className={`relative group rounded-lg border bg-muted/50 ${className}`}>
      {title && (
        <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/30 rounded-t-lg">
          <span className="text-sm font-medium text-muted-foreground">
            {title}
          </span>
          {showCopy && (
            <Button
              variant="ghost"
              size="sm"
              onClick={copyToClipboard}
              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              {copied ? (
                <Check className="h-3 w-3 text-green-500" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>
          )}
        </div>
      )}
      
      <div className="relative">
        <SyntaxHighlighter
          language={language}
          style={isDark ? oneDark : oneLight}
          customStyle={{
            margin: 0,
            borderRadius: title ? '0 0 0.5rem 0.5rem' : '0.5rem',
            background: 'transparent',
            fontSize: '0.875rem',
            lineHeight: '1.5'
          }}
          codeTagProps={{
            style: {
              fontFamily: 'JetBrains Mono, Fira Code, Monaco, Consolas, monospace'
            }
          }}
        >
          {code}
        </SyntaxHighlighter>
        
        {showCopy && !title && (
          <Button
            variant="ghost"
            size="sm"
            onClick={copyToClipboard}
            className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 hover:bg-background"
          >
            {copied ? (
              <Check className="h-3 w-3 text-green-500" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </Button>
        )}
      </div>
    </div>
  );
}

// Installation Steps Component
export function InstallationSteps({ steps }) {
  return (
    <div className="space-y-6">
      {steps.map((step, index) => (
        <div key={index} className="relative">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
              {step.step}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-foreground mb-2">
                {step.title}
              </h4>
              <CodeBlock 
                code={step.code}
                language={step.language}
                className="mb-4"
              />
            </div>
          </div>
          {index < steps.length - 1 && (
            <div className="absolute left-4 top-8 w-px h-6 bg-border"></div>
          )}
        </div>
      ))}
    </div>
  );
}

// Framework Integration Component
export function FrameworkExample({ example }) {
  return (
    <div className="border rounded-lg p-6 space-y-4">
      <div>
        <h4 className="font-semibold text-lg mb-2">{example.title}</h4>
        <p className="text-muted-foreground mb-4">{example.description}</p>
      </div>
      
      <CodeBlock 
        code={example.code}
        language={example.language}
        title={example.title}
      />
    </div>
  );
} 