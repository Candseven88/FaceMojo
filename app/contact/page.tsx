'use client';

import Link from 'next/link';
import { useState, FormEvent } from 'react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
    }, 1000);
  };

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
            <Link href="/#features" className="text-slate-300 hover:text-white transition-colors text-sm">Features</Link>
            <Link href="/#pricing" className="text-slate-300 hover:text-white transition-colors text-sm">Pricing</Link>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="glass-card border border-slate-700/50 p-8">
            <h1 className="text-3xl font-bold mb-8 text-center font-space-grotesk bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">Contact Us</h1>
            
            {submitted ? (
              <div className="text-center">
                <div className="p-6 bg-green-500/20 border border-green-500/50 rounded-lg mb-8">
                  <p className="text-slate-300">Thank you for your message! We'll get back to you soon.</p>
                </div>
                <button 
                  onClick={() => setSubmitted(false)} 
                  className="btn-secondary"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">Name</label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-slate-800/70 border border-slate-700 text-white"
                    placeholder="Your name"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-slate-800/70 border border-slate-700 text-white"
                    placeholder="you@example.com"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-1">Message</label>
                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg bg-slate-800/70 border border-slate-700 text-white"
                    placeholder="Your message..."
                    required
                  ></textarea>
                </div>
                
                <div className="text-center">
                  <button 
                    type="submit" 
                    className="btn" 
                    disabled={loading}
                  >
                    {loading ? 'Sending...' : 'Send Message'}
                  </button>
                </div>
              </form>
            )}
            
            <div className="mt-10 pt-6 border-t border-slate-700/50 text-center">
              <p className="text-slate-300 mb-6">
                You can also reach us directly at: <a href="mailto:support@facemojo.ai" className="text-blue-400 hover:text-blue-300">support@facemojo.ai</a>
              </p>
              
              <Link href="/" className="btn-secondary">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
