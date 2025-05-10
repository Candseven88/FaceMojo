'use client'
import { SiteFooter } from '@/components/site-footer'

export default function ContactPage() {
  return (
    <>
      <section className="py-20 bg-gray-950 text-white border-t border-purple-800/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
          <h1 className="text-3xl font-bold text-purple-300 text-center mb-8">Contact Us</h1>
          <p className="text-gray-300 mb-8 text-center">
            Have questions, feedback, or partnership ideas? We'd love to hear from you!
          </p>

          <form
            action="mailto:support@facemojo.ai"
            method="POST"
            encType="text/plain"
            className="space-y-6 bg-black/40 p-6 rounded-xl border border-purple-500/30 shadow-md"
          >
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-white">Your Name</label>
              <input
                type="text"
                name="name"
                id="name"
                required
                className="mt-1 block w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white">Your Email</label>
              <input
                type="email"
                name="email"
                id="email"
                required
                className="mt-1 block w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-white">Message</label>
              <textarea
                name="message"
                id="message"
                rows={4}
                required
                className="mt-1 block w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
              ></textarea>
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-2 px-6 rounded-md hover:scale-105 transition-transform"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </section>
      <SiteFooter />
    </>
  )
}