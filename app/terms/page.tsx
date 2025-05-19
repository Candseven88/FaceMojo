'use client';

import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="relative overflow-hidden">
      {/* Background blobs */}
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      
      {/* Header */}
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
            <h1 className="text-3xl font-bold mb-8 text-center font-space-grotesk bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">Terms & Privacy</h1>
            
            <div className="text-slate-300 space-y-8">
              <p className="text-lg">Welcome to FaceMojo! By using our service, you agree to the following terms and policies.</p>
              
              <section>
                <h2 className="text-xl font-bold mb-3 font-space-grotesk">1. Usage Terms</h2>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Each user is allowed one free animation during the trial.</li>
                  <li>You must not upload copyrighted content unless you own or have permission to use it.</li>
                  <li>This service is for personal, non-commercial use only during the testing phase.</li>
                </ul>
              </section>
              
              <section>
                <h2 className="text-xl font-bold mb-3 font-space-grotesk">2. Data Privacy</h2>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Uploaded photos and videos are processed temporarily and not stored permanently.</li>
                  <li>We use anonymous IDs to track usage limits, but we do not collect personal information.</li>
                  <li>No biometric data or facial recognition is stored or shared.</li>
                </ul>
              </section>
              
              <section>
                <h2 className="text-xl font-bold mb-3 font-space-grotesk">3. Third-Party APIs</h2>
                <p>We may use third-party APIs (such as AI video generation engines) to process media. Your content may be transmitted to these services only for the purpose of animation generation.</p>
              </section>
              
              <section>
                <h2 className="text-xl font-bold mb-3 font-space-grotesk">4. Content Policy</h2>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Do not upload explicit, hateful, or illegal content.</li>
                  <li>We reserve the right to restrict access for abuse or misuse.</li>
                </ul>
              </section>
              
              <section>
                <h2 className="text-xl font-bold mb-3 font-space-grotesk">5. Contact</h2>
                <p>For questions about these terms, please contact us at <a href="mailto:support@facemojo.ai" className="text-blue-400 hover:text-blue-300 transition-colors">support@facemojo.ai</a>.</p>
              </section>
              
              <div className="text-center mt-12">
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
