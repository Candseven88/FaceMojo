'use client'
import { SiteFooter } from '@/components/site-footer'

export default function AboutPage() {
  return (
    <>
      <section className="py-20 bg-gray-950 text-white border-t border-purple-800/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl space-y-6">
          <h1 className="text-3xl font-bold text-purple-300 text-center mb-8">About FaceMojo</h1>
          <p className="text-gray-300">
            FaceMojo is a fun and creative AI-powered platform that turns your photo into a living, talking animation.
            Whether you want to revive an old memory, surprise a friend, or go viral on social media — we’ve got you covered.
          </p>
          <p className="text-gray-300">
            This project is built and maintained by an indie developer passionate about generative AI and web creativity.
            We are constantly improving and welcome your feedback!
          </p>
          <p className="text-gray-300">
            Contact us at <a href="mailto:support@facemojo.ai" className="text-cyan-400 hover:underline">support@facemojo.ai</a>
          </p>
        </div>
      </section>
      <SiteFooter />
    </>
  )
}