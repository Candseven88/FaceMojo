import type { Metadata } from 'next'
import './globals.css'
import { Header } from '@/components/header' // ✅ 加上 header

export const metadata: Metadata = {
  title: 'FaceMojo',
  description: 'Turn your photo into lifelike animation with a single click.',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <meta property="og:title" content="FaceMojo - Animate Your Portrait with AI" />
        <meta property="og:description" content="Turn your photo into lifelike animation with a single click." />
        <meta property="og:image" content="/social-preview.jpg" />
        <meta property="og:url" content="https://facemojo.ai" />
        <meta name="twitter:card" content="summary_large_image" />
      </head>
      <body className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 text-white">
        <Header /> {/* ✅ 添加头部导航 */}
        <main>{children}</main>
      </body>
    </html>
  )
}