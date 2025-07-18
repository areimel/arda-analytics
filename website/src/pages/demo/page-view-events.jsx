import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PageHead } from '@/components/seo/page-head'
import { LiveEventViewer } from '@/components/demo/LiveEventViewer'
import { BackButton } from '@/components/shared/BackButton'
import { IconPageHeader } from '@/components/shared/IconPageHeader'
import { StatusCard } from '@/components/shared/StatusCard'
import { MetricCard } from '@/components/shared/MetricCard'
import { CodeDisplayCard } from '@/components/shared/CodeDisplayCard'
import { Eye, Clock, BarChart3, Target, Play, Pause } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'

export function PageViewEventsPage() {
	const [pluginLoaded, setPluginLoaded] = useState(false)
	const [timeOnPage, setTimeOnPage] = useState(0)
	const [scrollPercent, setScrollPercent] = useState(0)
	const [isVisible, setIsVisible] = useState(true)
	const [readingProgress, setReadingProgress] = useState(0)
	const intervalRef = useRef(null)
	const contentRef = useRef(null)

	// Initialize ARDA Analytics plugin
	useEffect(() => {
		const initPlugin = async () => {
			if (typeof window !== 'undefined') {
				window.dataLayer = window.dataLayer || []
				
				window.ARDAAnalytics = {
					pushToDataLayer: (eventName) => {
						try {
							const gtmEvent = {
								event: "CustomEvent",
								eventLabel: eventName
							}
							
							window.dataLayer.push(gtmEvent)
							
							window.dispatchEvent(new CustomEvent('arda-event-logged', {
								detail: {
									eventName: eventName,
									success: true,
									timestamp: Date.now(),
									metadata: { gtmEvent }
								}
							}))
							
							console.log('ARDA Analytics - Event pushed:', eventName, gtmEvent)
							return { success: true, eventData: gtmEvent }
						} catch (error) {
							console.error('ARDA Analytics - Event push failed:', error)
							
							window.dispatchEvent(new CustomEvent('arda-event-logged', {
								detail: {
									eventName: eventName,
									success: false,
									timestamp: Date.now(),
									metadata: { error: error.message }
								}
							}))
							
							return { success: false, error: error.message }
						}
					}
				}
				
				console.log('ARDA Analytics Demo Plugin Initialized')
				setPluginLoaded(true)
				
				// Send page view event
				setTimeout(() => {
					triggerEvent('page_view_demo_loaded')
				}, 100)
			}
		}

		initPlugin()
	}, [])

	// Time tracking
	useEffect(() => {
		intervalRef.current = setInterval(() => {
			if (isVisible) {
				setTimeOnPage(prev => prev + 1)
			}
		}, 1000)

		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current)
			}
		}
	}, [isVisible])

	// Page visibility tracking
	useEffect(() => {
		const handleVisibilityChange = () => {
			if (document.hidden) {
				setIsVisible(false)
				triggerEvent('page_visibility_hidden')
			} else {
				setIsVisible(true)
				triggerEvent('page_visibility_visible')
			}
		}

		document.addEventListener('visibilitychange', handleVisibilityChange)
		return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
	}, [])

	// Scroll tracking
	useEffect(() => {
		const handleScroll = () => {
			const scrollTop = window.pageYOffset
			const docHeight = document.body.offsetHeight
			const winHeight = window.innerHeight
			const scrollPercent = Math.round((scrollTop / (docHeight - winHeight)) * 100)
			
			setScrollPercent(Math.min(100, Math.max(0, scrollPercent)))
			
			// Trigger scroll depth events at milestones
			if (scrollPercent >= 25 && scrollPercent < 50) {
				triggerEvent('scroll_depth_25_percent')
			} else if (scrollPercent >= 50 && scrollPercent < 75) {
				triggerEvent('scroll_depth_50_percent')
			} else if (scrollPercent >= 75 && scrollPercent < 100) {
				triggerEvent('scroll_depth_75_percent')
			} else if (scrollPercent >= 100) {
				triggerEvent('scroll_depth_100_percent')
			}
		}

		window.addEventListener('scroll', handleScroll)
		return () => window.removeEventListener('scroll', handleScroll)
	}, [])

	// Reading progress tracking
	useEffect(() => {
		const handleScroll = () => {
			if (contentRef.current) {
				const element = contentRef.current
				const rect = element.getBoundingClientRect()
				const elementHeight = element.offsetHeight
				const windowHeight = window.innerHeight
				
				if (rect.top < windowHeight && rect.bottom > 0) {
					const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0)
					const progress = Math.round((visibleHeight / elementHeight) * 100)
					setReadingProgress(Math.min(100, Math.max(0, progress)))
				}
			}
		}

		window.addEventListener('scroll', handleScroll)
		handleScroll() // Initial call
		return () => window.removeEventListener('scroll', handleScroll)
	}, [])

	// Time-based events
	useEffect(() => {
		const timers = [
			setTimeout(() => triggerEvent('time_on_page_10_seconds'), 10000),
			setTimeout(() => triggerEvent('time_on_page_30_seconds'), 30000),
			setTimeout(() => triggerEvent('time_on_page_60_seconds'), 60000),
			setTimeout(() => triggerEvent('time_on_page_300_seconds'), 300000),
		]

		return () => timers.forEach(timer => clearTimeout(timer))
	}, [])

	const triggerEvent = (eventName) => {
		if (window.ARDAAnalytics) {
			window.ARDAAnalytics.pushToDataLayer(eventName)
		}
	}

	const formatTime = (seconds) => {
		const mins = Math.floor(seconds / 60)
		const secs = seconds % 60
		return `${mins}:${secs.toString().padStart(2, '0')}`
	}

	return (
		<>
			<PageHead page="page-view-events-demo" />
			<div className="min-h-screen bg-background">
				<div className="container mx-auto px-4 py-8 max-w-6xl">
					{/* Back Navigation */}
					<BackButton to="/demo" label="Back to Demos" variant="ghost" />

					{/* Header */}
					<IconPageHeader
						icon={<Eye className="h-8 w-8" />}
						title="Page View Events Demo"
						description="Interactive demonstration of page view and engagement tracking. Scroll, interact, and switch tabs to see various engagement events being tracked."
						showIconBackground={true}
					/>

					{/* Plugin Status */}
					<div className="mb-8">
						<StatusCard
							status={pluginLoaded ? 'ready' : 'loading'}
							message={pluginLoaded ? 'ARDA Analytics Plugin Ready (Demo Mode)' : 'Loading plugin...'}
						/>
					</div>

					{/* Real-time Metrics */}
					<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
						<MetricCard
							title="Time on Page"
							value={timeOnPage}
							icon={<Clock className="h-4 w-4" />}
							subtitle={`Status: ${isVisible ? 'Active' : 'Hidden'}`}
							format="time"
						/>

						<MetricCard
							title="Scroll Depth"
							value={scrollPercent}
							icon={<BarChart3 className="h-4 w-4" />}
							format="percentage"
							showProgress={true}
							progressValue={scrollPercent}
						/>

						<MetricCard
							title="Reading Progress"
							value={readingProgress}
							icon={<Target className="h-4 w-4" />}
							format="percentage"
							showProgress={true}
							progressValue={readingProgress}
						/>

						<MetricCard
							title="Page Status"
							value={isVisible ? 'Visible' : 'Hidden'}
							icon={<Eye className="h-4 w-4" />}
							subtitle="Tab visibility state"
						/>
					</div>

					{/* Interactive Demo Section */}
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
						{/* Manual Events */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Play className="h-5 w-5" />
									Manual Page Events
								</CardTitle>
								<CardDescription>
									Trigger specific page view and engagement events manually
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<Button 
									className="w-full"
									onClick={() => triggerEvent('content_section_viewed')}
								>
									Content Section Viewed
								</Button>
								<Button 
									variant="outline" 
									className="w-full"
									onClick={() => triggerEvent('page_interaction_high_engagement')}
								>
									High Engagement Detected
								</Button>
								<Button 
									variant="outline" 
									className="w-full"
									onClick={() => triggerEvent('video_content_visible')}
								>
									Video Content Visible
								</Button>
								<Button 
									variant="outline" 
									className="w-full"
									onClick={() => triggerEvent('key_section_reached')}
								>
									Key Section Reached
								</Button>
							</CardContent>
						</Card>

						{/* Visibility Testing */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Pause className="h-5 w-5" />
									Visibility Testing
								</CardTitle>
								<CardDescription>
									Test page visibility and activity tracking
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="text-sm text-muted-foreground mb-3">
									Try switching to another tab or minimizing the browser to test visibility tracking.
								</div>
								<Button 
									variant="outline" 
									className="w-full"
									onClick={() => triggerEvent('user_returned_to_page')}
								>
									Simulate Page Return
								</Button>
								<Button 
									variant="outline" 
									className="w-full"
									onClick={() => triggerEvent('session_extended')}
								>
									Session Extended
								</Button>
								<Button 
									variant="outline" 
									className="w-full"
									onClick={() => triggerEvent('deep_page_engagement')}
								>
									Deep Engagement
								</Button>
							</CardContent>
						</Card>
					</div>

					{/* Long Content Section for Scroll Tracking */}
					<Card className="mb-8" ref={contentRef}>
						<CardHeader>
							<CardTitle>Content Reading Section</CardTitle>
							<CardDescription>
								This section is being tracked for reading progress. Scroll through to see progress updates.
							</CardDescription>
						</CardHeader>
						<CardContent className="prose prose-sm max-w-none dark:prose-invert">
							<p>
								This is a demonstration of content engagement tracking. As you scroll through this section,
								the reading progress meter above will update to show how much of this content area is visible.
							</p>
							<p>
								ARDA Analytics can track various engagement metrics including:
							</p>
							<ul>
								<li>Time spent on page</li>
								<li>Scroll depth percentage</li>
								<li>Reading progress through content sections</li>
								<li>Page visibility state changes</li>
								<li>User return behavior</li>
								<li>Content interaction patterns</li>
							</ul>
							<p>
								This type of engagement data is invaluable for understanding how users interact with your content
								and can help optimize page layouts, content structure, and user experience.
							</p>
							<p>
								The scroll depth events are triggered at 25%, 50%, 75%, and 100% scroll positions, providing
								insights into how far users typically read through your content.
							</p>
							<p>
								Time-based events are triggered at 10 seconds, 30 seconds, 1 minute, and 5 minutes, helping you
								understand user engagement duration and identify high-value content that keeps users engaged.
							</p>
							<p>
								Page visibility tracking detects when users switch tabs or minimize the browser, allowing you to
								understand attention patterns and measure true engagement time versus total time on page.
							</p>
							<p>
								All of these metrics work together to provide a comprehensive view of user engagement and can be
								used to optimize content strategy, improve user experience, and increase conversion rates.
							</p>
						</CardContent>
					</Card>

					{/* Code Example */}
					<CodeDisplayCard
						title="Implementation Example"
						description="How to implement page view and engagement tracking"
						code={`// Page View and Engagement Tracking
import ARDAAnalytics from '@arda-analytics/plugin';

function PageTracker() {
  const analytics = new ARDAAnalytics();
  
  useEffect(() => {
    // Initial page view
    analytics.pushEvent('page_view_loaded');
    
    // Time-based tracking
    const timeEvents = [
      setTimeout(() => analytics.pushEvent('time_on_page_10_seconds'), 10000),
      setTimeout(() => analytics.pushEvent('time_on_page_30_seconds'), 30000),
      setTimeout(() => analytics.pushEvent('time_on_page_60_seconds'), 60000),
    ];
    
    // Scroll depth tracking
    const handleScroll = () => {
      const scrollPercent = Math.round(
        (window.pageYOffset / (document.body.offsetHeight - window.innerHeight)) * 100
      );
      
      if (scrollPercent >= 25) analytics.pushEvent('scroll_depth_25_percent');
      if (scrollPercent >= 50) analytics.pushEvent('scroll_depth_50_percent');
      if (scrollPercent >= 75) analytics.pushEvent('scroll_depth_75_percent');
      if (scrollPercent >= 100) analytics.pushEvent('scroll_depth_100_percent');
    };
    
    // Page visibility tracking
    const handleVisibilityChange = () => {
      if (document.hidden) {
        analytics.pushEvent('page_visibility_hidden');
      } else {
        analytics.pushEvent('page_visibility_visible');
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      timeEvents.forEach(timer => clearTimeout(timer));
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
  
  return <div>Your page content</div>;
}`}
						className="mb-8"
					/>

					{/* Event Naming Guide */}
					<Card>
						<CardHeader>
							<CardTitle className="font-mono">Page View Event Naming Convention</CardTitle>
							<CardDescription>
								Recommended patterns for naming page view and engagement events
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div>
									<h4 className="font-medium mb-3">Page View Events</h4>
									<div className="space-y-2">
										<Badge variant="outline" className="block w-fit font-mono text-xs">page_view_loaded</Badge>
										<Badge variant="outline" className="block w-fit font-mono text-xs">page_view_home</Badge>
										<Badge variant="outline" className="block w-fit font-mono text-xs">page_view_product_detail</Badge>
									</div>
								</div>
								<div>
									<h4 className="font-medium mb-3">Time-based Events</h4>
									<div className="space-y-2">
										<Badge variant="outline" className="block w-fit font-mono text-xs">time_on_page_10_seconds</Badge>
										<Badge variant="outline" className="block w-fit font-mono text-xs">time_on_page_30_seconds</Badge>
										<Badge variant="outline" className="block w-fit font-mono text-xs">time_on_page_60_seconds</Badge>
									</div>
								</div>
								<div>
									<h4 className="font-medium mb-3">Scroll Depth Events</h4>
									<div className="space-y-2">
										<Badge variant="outline" className="block w-fit font-mono text-xs">scroll_depth_25_percent</Badge>
										<Badge variant="outline" className="block w-fit font-mono text-xs">scroll_depth_50_percent</Badge>
										<Badge variant="outline" className="block w-fit font-mono text-xs">scroll_depth_100_percent</Badge>
									</div>
								</div>
								<div>
									<h4 className="font-medium mb-3">Engagement Events</h4>
									<div className="space-y-2">
										<Badge variant="outline" className="block w-fit font-mono text-xs">page_visibility_hidden</Badge>
										<Badge variant="outline" className="block w-fit font-mono text-xs">content_section_viewed</Badge>
										<Badge variant="outline" className="block w-fit font-mono text-xs">high_engagement_detected</Badge>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
			
			{/* Floating Live Event Viewer */}
			<LiveEventViewer />
		</>
	)
}