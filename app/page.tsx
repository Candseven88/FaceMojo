import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { UploadFlow } from "@/components/upload-flow"
import { HowItWorks } from "@/components/how-it-works"
import { DemoPlaceholder } from "@/components/demo-placeholder"
import { UseCases } from "@/components/use-cases"
import { UserTips } from "@/components/user-tips"
import { SiteFooter } from "@/components/site-footer"
import { TechSpecs } from "@/components/tech-specs"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 text-white">
      <Header />
      <main>
        <HeroSection />
        <UploadFlow />
        <HowItWorks />
        <DemoPlaceholder />
        <TechSpecs />
        <UseCases />
        <UserTips />
      </main>
      <SiteFooter />
    </div>
  )
}
