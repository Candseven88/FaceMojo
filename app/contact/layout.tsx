import type { Metadata } from 'next'
import '../globals.css'
import { Header } from '@/components/header'

export const metadata: Metadata = {
  title: 'Contact - FaceMojo',
  description: 'Get in touch with the FaceMojo team.',
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 text-white">
        <Header />
        <main>{children}</main>
      </body>
    </html>
  )
}