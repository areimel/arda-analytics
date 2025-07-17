import { CTAContent } from './CTAContent'

export function CTASection({ brandInfo, siteData }) {
	return (
		<section className="bg-muted/50">
			<div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
				<CTAContent brandInfo={brandInfo} siteData={siteData} />
			</div>
		</section>
	)
}