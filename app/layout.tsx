import type { Metadata } from 'next'
import './globals.css'


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
      <body>
        {children}
      </body>
    </html>
  )
}