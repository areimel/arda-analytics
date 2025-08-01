import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { PageHead } from '@/components/seo/page-head'
import { LiveEventViewer } from '@/components/demo/LiveEventViewer'
import { BackButton } from '@/components/shared/BackButton'
import { IconPageHeader } from '@/components/shared/IconPageHeader'
import { StatusCard } from '@/components/shared/StatusCard'
import { CodeDisplayCard } from '@/components/shared/CodeDisplayCard'
import { FileText, Send, User, AlertCircle } from 'lucide-react'
import { useState, useEffect } from 'react'
import ARDAAnalytics from '@plugin/index.ts'

export function FormEventsPage() {
	const [pluginLoaded, setPluginLoaded] = useState(false)
	const [analytics, setAnalytics] = useState(null)
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		company: '',
		message: '',
		interest: '',
		newsletter: false
	})
	const [currentStep, setCurrentStep] = useState(1)

	// Initialize ARDA Analytics plugin
	useEffect(() => {
		const initPlugin = async () => {
			if (typeof window !== 'undefined') {
				// Initialize the actual ARDA Analytics plugin
				const analyticsInstance = new ARDAAnalytics({
					debug: true,
					enableUTMTracking: true,
					enableFormTracking: true,
					enableJourneyTracking: true
				})

				// Store the instance for use in the component
				setAnalytics(analyticsInstance)
				
				// Also expose it globally for the demo
				window.ARDAAnalytics = analyticsInstance
				
				console.log('ARDA Analytics Plugin Initialized (Real Plugin)')
				setPluginLoaded(true)
			}
		}

		initPlugin()
	}, [])

	const triggerEvent = (eventName) => {
		if (analytics) {
			analytics.pushEvent(eventName)
		}
	}

	const handleInputFocus = (fieldName) => {
		triggerEvent(`form_field_focus_${fieldName}`)
	}

	const handleInputChange = (fieldName, value) => {
		setFormData(prev => ({ ...prev, [fieldName]: value }))
		triggerEvent(`form_field_change_${fieldName}`)
	}

	const handleSubmit = (e) => {
		e.preventDefault()
		triggerEvent('contact_form_submit')
		// Simulate form validation
		setTimeout(() => {
			triggerEvent('form_validation_success')
		}, 500)
	}

	const handleMultiStepNext = () => {
		triggerEvent(`form_step_${currentStep}_completed`)
		setCurrentStep(prev => prev + 1)
	}

	const handleMultiStepPrev = () => {
		triggerEvent(`form_step_${currentStep}_back`)
		setCurrentStep(prev => prev - 1)
	}

	return (
		<>
			<PageHead page="form-events-demo" />
			<div className="min-h-screen bg-background">
				<div className="container mx-auto px-4 py-8 max-w-6xl">
					{/* Back Navigation */}
					<BackButton to="/demo" label="Back to Demos" variant="ghost" />

					{/* Header */}
					<IconPageHeader
						icon={<FileText className="h-8 w-8" />}
						title="Form Events Demo"
						description="Interactive demonstration of form event tracking. Interact with the forms below to see events triggered for field focus, changes, validation, and submission."
						showIconBackground={true}
					/>

					{/* Plugin Status */}
					<div className="mb-8">
						<StatusCard
							status={pluginLoaded ? 'ready' : 'loading'}
							message={pluginLoaded ? 'ARDA Analytics Plugin Ready - Full Analytics Suite Active' : 'Loading plugin...'}
						/>
					</div>

					{/* Interactive Demo Section */}
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
						{/* Contact Form */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Send className="h-5 w-5" />
									Contact Form
								</CardTitle>
								<CardDescription>
									Basic contact form with field tracking and validation events
								</CardDescription>
							</CardHeader>
							<CardContent>
								<form onSubmit={handleSubmit} className="space-y-4">
									<div>
										<Label htmlFor="name">Name</Label>
										<Input
											id="name"
											value={formData.name}
											onFocus={() => handleInputFocus('name')}
											onChange={(e) => handleInputChange('name', e.target.value)}
											placeholder="Enter your name"
										/>
									</div>
									<div>
										<Label htmlFor="email">Email</Label>
										<Input
											id="email"
											type="email"
											value={formData.email}
											onFocus={() => handleInputFocus('email')}
											onChange={(e) => handleInputChange('email', e.target.value)}
											placeholder="Enter your email"
										/>
									</div>
									<div>
										<Label htmlFor="company">Company</Label>
										<Input
											id="company"
											value={formData.company}
											onFocus={() => handleInputFocus('company')}
											onChange={(e) => handleInputChange('company', e.target.value)}
											placeholder="Enter your company"
										/>
									</div>
									<div>
										<Label htmlFor="message">Message</Label>
										<Textarea
											id="message"
											value={formData.message}
											onFocus={() => handleInputFocus('message')}
											onChange={(e) => handleInputChange('message', e.target.value)}
											placeholder="Enter your message"
											rows={4}
										/>
									</div>
									<div className="flex items-center space-x-2">
										<Checkbox 
											id="newsletter"
											checked={formData.newsletter}
											onCheckedChange={(checked) => {
												handleInputChange('newsletter', checked)
												triggerEvent('newsletter_opt_in_toggle')
											}}
										/>
										<Label htmlFor="newsletter">Subscribe to newsletter</Label>
									</div>
									<Button type="submit" className="w-full">
										Send Message
									</Button>
								</form>
							</CardContent>
						</Card>

						{/* Multi-step Form */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<User className="h-5 w-5" />
									Multi-step Form
								</CardTitle>
								<CardDescription>
									Step-by-step form with progress tracking
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="mb-4">
									<div className="flex items-center space-x-2 mb-2">
										<span className="text-sm font-medium">Step {currentStep} of 3</span>
									</div>
									<div className="w-full bg-muted rounded-full h-2">
										<div 
											className="bg-primary h-2 rounded-full transition-all duration-300" 
											style={{ width: `${(currentStep / 3) * 100}%` }}
										></div>
									</div>
								</div>

								{currentStep === 1 && (
									<div className="space-y-4">
										<h3 className="font-medium">Basic Information</h3>
										<div>
											<Label>Full Name</Label>
											<Input 
												onFocus={() => handleInputFocus('step1_name')}
												onChange={(e) => handleInputChange('step1_name', e.target.value)}
												placeholder="Enter full name" 
											/>
										</div>
										<div>
											<Label>Phone Number</Label>
											<Input 
												onFocus={() => handleInputFocus('step1_phone')}
												onChange={(e) => handleInputChange('step1_phone', e.target.value)}
												placeholder="Enter phone number" 
											/>
										</div>
										<Button onClick={handleMultiStepNext} className="w-full">
											Next Step
										</Button>
									</div>
								)}

								{currentStep === 2 && (
									<div className="space-y-4">
										<h3 className="font-medium">Business Details</h3>
										<div>
											<Label>Company Size</Label>
											<Select onValueChange={(value) => handleInputChange('company_size', value)}>
												<SelectTrigger>
													<SelectValue placeholder="Select company size" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="1-10">1-10 employees</SelectItem>
													<SelectItem value="11-50">11-50 employees</SelectItem>
													<SelectItem value="51-200">51-200 employees</SelectItem>
													<SelectItem value="200+">200+ employees</SelectItem>
												</SelectContent>
											</Select>
										</div>
										<div>
											<Label>Industry</Label>
											<Select onValueChange={(value) => handleInputChange('industry', value)}>
												<SelectTrigger>
													<SelectValue placeholder="Select industry" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="technology">Technology</SelectItem>
													<SelectItem value="healthcare">Healthcare</SelectItem>
													<SelectItem value="finance">Finance</SelectItem>
													<SelectItem value="education">Education</SelectItem>
													<SelectItem value="other">Other</SelectItem>
												</SelectContent>
											</Select>
										</div>
										<div className="flex space-x-2">
											<Button variant="outline" onClick={handleMultiStepPrev} className="flex-1">
												Previous
											</Button>
											<Button onClick={handleMultiStepNext} className="flex-1">
												Next Step
											</Button>
										</div>
									</div>
								)}

								{currentStep === 3 && (
									<div className="space-y-4">
										<h3 className="font-medium">Preferences</h3>
										<div>
											<Label>Budget Range</Label>
											<Select onValueChange={(value) => handleInputChange('budget', value)}>
												<SelectTrigger>
													<SelectValue placeholder="Select budget range" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="under-1k">Under $1,000</SelectItem>
													<SelectItem value="1k-5k">$1,000 - $5,000</SelectItem>
													<SelectItem value="5k-10k">$5,000 - $10,000</SelectItem>
													<SelectItem value="over-10k">Over $10,000</SelectItem>
												</SelectContent>
											</Select>
										</div>
										<div className="flex space-x-2">
											<Button variant="outline" onClick={handleMultiStepPrev} className="flex-1">
												Previous
											</Button>
											<Button 
												onClick={() => {
													triggerEvent('multistep_form_completed')
													alert('Form completed!')
												}} 
												className="flex-1"
											>
												Complete
											</Button>
										</div>
									</div>
								)}
							</CardContent>
						</Card>
					</div>

					{/* Form Validation Demo */}
					<Card className="mb-8">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<AlertCircle className="h-5 w-5" />
								Form Validation Events
							</CardTitle>
							<CardDescription>
								Demonstration of validation event tracking
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<Button 
									variant="outline"
									onClick={() => triggerEvent('form_validation_error')}
								>
									Trigger Validation Error
								</Button>
								<Button 
									variant="outline"
									onClick={() => triggerEvent('form_field_validation_success')}
								>
									Field Validation Success
								</Button>
								<Button 
									variant="outline"
									onClick={() => triggerEvent('form_auto_save')}
								>
									Auto-save Event
								</Button>
							</div>
						</CardContent>
					</Card>

					{/* Advanced Analytics Features */}
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
						{/* UTM Tracking Demo */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Badge variant="secondary">NEW</Badge>
									UTM Parameter Tracking
								</CardTitle>
								<CardDescription>
									View current UTM parameters and test tracking
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									<Button 
										variant="outline" 
										onClick={() => {
											if (analytics) {
												const utmData = analytics.getUTMParameters();
												console.log('Current UTM Data:', utmData);
												triggerEvent('utm_parameters_checked');
											}
										}}
										className="w-full"
									>
										Check UTM Parameters
									</Button>
									<Button 
										variant="outline" 
										onClick={() => {
											if (analytics) {
												const summary = analytics.getAnalyticsSummary();
												console.log('Analytics Summary:', summary);
												triggerEvent('analytics_summary_generated');
											}
										}}
										className="w-full"
									>
										Get Analytics Summary
									</Button>
								</div>
							</CardContent>
						</Card>

						{/* Journey Tracking Demo */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Badge variant="secondary">NEW</Badge>
									User Journey Tracking
								</CardTitle>
								<CardDescription>
									View recent events and create journey triggers
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									<Button 
										variant="outline" 
										onClick={() => {
											if (analytics) {
												const recentEvents = analytics.getRecentEvents(10);
												console.log('Recent Events:', recentEvents);
												triggerEvent('recent_events_checked');
											}
										}}
										className="w-full"
									>
										View Recent Events
									</Button>
									<Button 
										variant="outline" 
										onClick={() => {
											if (analytics) {
												analytics.createJourneyTrigger(
													['contact_form_submit', 'form_validation_success'],
													() => {
														console.log('🎯 Journey trigger activated: Form success flow!');
														triggerEvent('journey_trigger_form_success');
													},
													{ triggerId: 'demo_form_success', onceOnly: false }
												);
												triggerEvent('journey_trigger_created');
											}
										}}
										className="w-full"
									>
										Create Journey Trigger
									</Button>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Code Example */}
					<CodeDisplayCard
						title="Implementation Example"
						description="How to implement form event tracking in your application"
						code={`// Form Event Tracking Implementation
import ARDAAnalytics from '@plugin/index.ts';

function ContactForm() {
  const analytics = new ARDAAnalytics();

  const handleFieldFocus = (fieldName) => {
    analytics.pushEvent(\`form_field_focus_\${fieldName}\`);
  };

  const handleFieldChange = (fieldName) => {
    analytics.pushEvent(\`form_field_change_\${fieldName}\`);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    analytics.pushEvent('contact_form_submit');
    
    // Validation logic
    if (isValid) {
      analytics.pushEvent('form_validation_success');
    } else {
      analytics.pushEvent('form_validation_error');
    }
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <input
        type="email"
        onFocus={() => handleFieldFocus('email')}
        onChange={() => handleFieldChange('email')}
        placeholder="Email"
      />
      <button type="submit">Submit</button>
    </form>
  );
}

// Multi-step Form Tracking
const handleStepComplete = (stepNumber) => {
  analytics.pushEvent(\`form_step_\${stepNumber}_completed\`);
};

const handleFormComplete = () => {
  analytics.pushEvent('multistep_form_completed');
};`}
						className="mb-8"
					/>

					{/* Event Naming Guide */}
					<CodeDisplayCard
						title="Form Event Naming Convention"
						description="Recommended patterns for naming form events"
						code={`// Form Interactions
form_field_focus_email
form_field_change_name
contact_form_submit

// Validation Events
form_validation_error
form_validation_success
form_auto_save

// Multi-step Forms
form_step_1_completed
form_step_2_back
multistep_form_completed

// Special Events
newsletter_opt_in_toggle
form_abandoned
form_error_recovered`}
						showCopy={false}
					/>
				</div>
			</div>
			
			{/* Floating Live Event Viewer */}
			<LiveEventViewer />
		</>
	)
}