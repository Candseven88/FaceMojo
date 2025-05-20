import './globals.css';
import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk' });

export const metadata: Metadata = {
  title: 'FaceMojo - Turn Any Photo into a Talking Avatar with AI',
  description: 'Upload a portrait and animate it instantly with state-of-the-art motion transfer. No training required.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
    {/* Google Analytics - Global Site Tag (gtag.js) */}
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-9R6KHMKVNP"></script>
    <script
      dangerouslySetInnerHTML={{
        __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-9R6KHMKVNP');
        `,
      }}
    />
  </head>
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans min-h-screen`}>
        {children}
      </body>
    </html>
  )
} 
