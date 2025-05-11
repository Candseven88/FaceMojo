"use client"
import { useEffect, useRef, useState } from "react"
import { signInAnonymouslyIfNeeded } from "@/lib/firebase"
import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { UploadFlow } from "@/components/upload-flow"
import { HowItWorks } from "@/components/how-it-works"
import { DemoPlaceholder } from "@/components/demo-placeholder"
import { UseCases } from "@/components/use-cases"
import { UserTips } from "@/components/user-tips"
import { SiteFooter } from "@/components/site-footer"
import { FAQSection } from "@/components/faq-section"
import { TechSpecs } from "@/components/tech-specs"
import { LivePortraitEmbed } from "@/components/LivePortraitEmbed"

export default function Home() {
  const [showFAQ, setShowFAQ] = useState(false)
  const [showTerms, setShowTerms] = useState(false)
  const faqRef = useRef<HTMLDivElement>(null)
  const termsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    signInAnonymouslyIfNeeded()

    const handleHash = () => {
      const hash = window.location.hash

      if (hash === "#faq") {
        setShowFAQ(prev => {
          const next = !prev
          if (next) setTimeout(() => faqRef.current?.scrollIntoView({ behavior: "smooth" }), 100)
          return next
        })
        setShowTerms(false)
      } else if (hash === "#terms") {
        setShowTerms(prev => {
          const next = !prev
          if (next) setTimeout(() => termsRef.current?.scrollIntoView({ behavior: "smooth" }), 100)
          return next
        })
        setShowFAQ(false)
      }
    }

    handleHash()
    window.addEventListener("hashchange", handleHash)
    return () => window.removeEventListener("hashchange", handleHash)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 text-white">
      <Header />
      <main>
        <HeroSection />
        <UploadFlow />
        <HowItWorks />
        <DemoPlaceholder />
        {/* 嵌入 Hugging Face LivePortrait 模块 */}
        <LivePortraitEmbed src="https://han-123-liveportrait.hf.space" />
        <UseCases />
        <TechSpecs />
        <UserTips />

        {showFAQ && (
          <div ref={faqRef}>
            <FAQSection />
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  )
}