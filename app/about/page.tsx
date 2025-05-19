'use client';

import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="relative overflow-hidden">
      {/* Background blobs */}
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      
      {/* Header - reusing the same header style */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-slate-900/80 border-b border-slate-800/50 shadow-lg">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500 font-space-grotesk">FaceMojo</Link>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/#upload" className="text-slate-300 hover:text-white transition-colors text-sm">Try Now</Link>
            <Link href="/#how-it-works" className="text-slate-300 hover:text-white transition-colors text-sm">How It Works</Link>
            <Link href="/#features" className="text-slate-300 hover:text-white transition-colors text-sm">Features</Link>
            <Link href="/#pricing" className="text-slate-300 hover:text-white transition-colors text-sm">Pricing</Link>
            <Link href="/#faq" className="text-slate-300 hover:text-white transition-colors text-sm">FAQ</Link>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="glass-card border border-slate-700/50 p-8">
            <h1 className="text-3xl font-bold mb-8 text-center font-space-grotesk bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">About FaceMojo</h1>
            
            <div className="space-y-6 text-slate-300">
              <p>
                FaceMojo is a fun and creative AI-powered platform that turns your photo into a living, talking animation. 
                Whether you want to revive an old memory, surprise a friend, or go viral on social media — we've got you covered.
              </p>
              
              <p>
                This project is built and maintained by an indie developer passionate about generative AI and web creativity. 
                We are constantly improving and welcome your feedback!
              </p>
              
              <div className="mt-12 pt-8 border-t border-slate-700/50 flex items-center justify-between">
                <span className="text-slate-400">Contact us at:</span>
                <a href="mailto:support@facemojo.ai" className="text-blue-400 hover:text-blue-300 transition-colors">
                  support@facemojo.ai
                </a>
              </div>
              
              <div className="text-center mt-8">
                <Link href="/" className="btn-secondary inline-block hover:scale-105 transition-transform duration-300">
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
