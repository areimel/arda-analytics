export function DocsPage() {
	return (
		<div className="container mx-auto px-6 py-8">
			<div className="max-w-4xl mx-auto">
				<h1 className="text-4xl font-bold font-mono mb-8">Documentation</h1>
				
				<div className="prose prose-gray dark:prose-invert max-w-none">
					<h2>Quick Start</h2>
					<p>Get up and running with ARDA Analytics in just a few minutes.</p>
					
					<h3>CDN Installation</h3>
					<pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
						<code>{`<script src="https://cdn.example.com/arda-analytics.min.js"></script>
<script>
  ARDA.init({
    apiKey: 'your-api-key',
    trackingId: 'your-tracking-id'
  });
</script>`}</code>
					</pre>
					
					<h3>NPM Installation</h3>
					<pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
						<code>{`npm install arda-analytics

import ARDA from 'arda-analytics';

ARDA.init({
  apiKey: 'your-api-key',
  trackingId: 'your-tracking-id'
});`}</code>
					</pre>
					
					<h2>API Reference</h2>
					<h3>ARDA.init(config)</h3>
					<p>Initialize the analytics plugin with your configuration.</p>
					
					<h3>ARDA.track(event, properties)</h3>
					<p>Track a custom event with optional properties.</p>
					
					<h3>ARDA.identify(userId, traits)</h3>
					<p>Identify a user and set user traits.</p>
				</div>
			</div>
		</div>
	)
} 