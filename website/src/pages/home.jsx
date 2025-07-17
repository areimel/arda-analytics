import { PageHead } from '@/components/seo/page-head'
import { getBrandInfo, getFeatures, getSiteMetadata, getProductInfo } from '@/lib/content'
import { HeroSection, HeroTitle, HeroDescription, HeroActions, HeroStats } from '@/components/home/hero'
import { InstallationSection } from '@/components/home/installation'
import { FeaturesSection } from '@/components/home/features'
import { MetricsSection } from '@/components/home/metrics'
import { CTASection } from '@/components/home/cta'

export function HomePage() {
	// Get content from JSON
	const brandInfo = getBrandInfo()
	const features = getFeatures()
	const siteData = getSiteMetadata()
	const productInfo = getProductInfo()

	return (
		<>
			<PageHead page="home" />
			<div className="flex flex-col">
				<HeroSection>
					<HeroTitle tagline={brandInfo.tagline} />
					<HeroDescription description={siteData.description} />
					<HeroActions />
					<HeroStats bundleSize={productInfo.bundleSize} />
				</HeroSection>

				<InstallationSection />

				<FeaturesSection brandInfo={brandInfo} features={features} />

				<MetricsSection highlights={features.highlights} />

				<CTASection brandInfo={brandInfo} siteData={siteData} />
			</div>
		</>
	)
} 