// app/terms/layout.tsx
import { Header } from "@/components/header"
import { SiteFooter } from "@/components/site-footer"
import type { Metadata } from 'next'
import '../globals.css'  // 确保全局样式生效

export const metadata: Metadata = {
  title: 'FaceMojo - Terms & Privacy',
  description: 'Read the terms and privacy policy for FaceMojo.',
}

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 text-white">
        <Header />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  )
}