import { Header } from "@/components/header"
import { PricingSection } from "@/components/pricing-section"
import { SiteFooter } from "@/components/site-footer"

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 text-white">
      <Header />
      <div className="pt-20">
        <PricingSection />
      </div>
      <SiteFooter />
    </div>
  )
}
