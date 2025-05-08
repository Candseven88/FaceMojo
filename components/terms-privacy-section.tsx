"use client"

export function TermsPrivacySection() {
  return (
    <section id="terms" className="py-20 bg-gray-950 text-white border-t border-purple-800/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl space-y-6 text-sm leading-relaxed">
        <h2 className="text-2xl font-bold text-purple-300 text-center mb-8">Terms & Privacy</h2>

        <p>
          Welcome to FaceMojo! By using our service, you agree to the following terms and policies.
        </p>

        <h3 className="text-lg font-semibold text-purple-200">1. Usage Terms</h3>
        <ul className="list-disc list-inside space-y-2 text-gray-300">
          <li>Each user is allowed one free animation during the trial.</li>
          <li>You must not upload copyrighted content unless you own or have permission to use it.</li>
          <li>This service is for personal, non-commercial use only during the testing phase.</li>
        </ul>

        <h3 className="text-lg font-semibold text-purple-200">2. Data Privacy</h3>
        <ul className="list-disc list-inside space-y-2 text-gray-300">
          <li>Uploaded photos and videos are processed temporarily and not stored permanently.</li>
          <li>We use anonymous IDs to track usage limits, but we do not collect personal information.</li>
          <li>No biometric data or facial recognition is stored or shared.</li>
        </ul>

        <h3 className="text-lg font-semibold text-purple-200">3. Third-Party APIs</h3>
        <p className="text-gray-300">
          We may use third-party APIs (such as AI video generation engines) to process media. Your content may be transmitted to these services only for the purpose of animation generation.
        </p>

        <h3 className="text-lg font-semibold text-purple-200">4. Content Policy</h3>
        <ul className="list-disc list-inside space-y-2 text-gray-300">
          <li>Do not upload explicit, hateful, or illegal content.</li>
          <li>We reserve the right to restrict access for abuse or misuse.</li>
        </ul>

        <h3 className="text-lg font-semibold text-purple-200">5. Contact</h3>
        <p className="text-gray-300">
          For questions about these terms, please contact us at support@facemojo.ai.
        </p>
      </div>
    </section>
  )
}