import React from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';

const TermsAndPrivacyPage: React.FC = () => {
  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col font-sans">
        <Header />
      <main className="flex-grow container mx-auto px-6 py-12 md:px-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400 mb-2">
            Terms of Service & Privacy Policy
          </h1>
          <p className="text-sm text-gray-500 mb-10">Last Updated: July 14, 2025</p>

          <p className="text-gray-300 mb-12">
            Welcome to Silex Chat. By using our services, you agree to these terms. Please read them carefully.
          </p>

          {/* Terms of Service */}
          <section id="terms">
            <h2 className="text-3xl font-bold text-gray-100 border-b-2 border-emerald-500 pb-2 mb-6">
              Terms of Service
            </h2>

            <h3 className="text-2xl font-semibold text-gray-200 mt-8 mb-4">1. Prohibited Activities</h3>
            <p className="text-gray-400 mb-4">When using the Silex Chat platform, you agree not to:</p>
            <ul className="list-disc list-inside space-y-3 text-gray-400 pl-4">
              <li>
                <strong>Engage in malicious activities:</strong> You are strictly prohibited from using the platform or its API with malicious intent. This includes, but is not limited to, attempting to compromise the API, reverse-engineering the platform, stealing user data, or disrupting the service for other users.
              </li>
              <li>
                <strong>Use for illegal purposes:</strong> You may not use Silex Chat for any illegal or unauthorized purpose. You must comply with all applicable laws regarding online conduct and acceptable content.
              </li>
              <li>
                <strong>Use our brand without permission:</strong> You may not use the Silex Chat name, logo, or other brand assets without prior written authorization from the platform's maintainers.
              </li>
            </ul>
            <p className="text-gray-400 mt-4">Violation of these terms may result in immediate termination of your access to the service.</p>

            <h3 className="text-2xl font-semibold text-gray-200 mt-8 mb-4">2. Disclaimer</h3>
            <p className="text-gray-400">The Silex Chat service is provided "as is" and "as available" without any warranties of any kind, either express or implied.</p>
          </section>

          {/* Privacy Policy */}
          <section id="privacy" className="mt-16">
            <h2 className="text-3xl font-bold text-gray-100 border-b-2 border-emerald-500 pb-2 mb-6">
              Privacy Policy
            </h2>
            <p className="text-gray-300 mb-4">Your privacy is critically important to us. This policy outlines how we collect, use, and protect your information.</p>
            
            <h3 className="text-2xl font-semibold text-gray-200 mt-8 mb-4">1. Information We Collect</h3>
            <p className="text-gray-400 mb-4">We collect certain information to provide and improve our service:</p>
            <ul className="list-disc list-inside space-y-3 text-gray-400 pl-4">
              <li>
                <strong>Information you provide:</strong> When you register for an account, we may collect personal information you provide, such as your <strong>email address</strong>.
              </li>
              <li>
                <strong>Information collected automatically:</strong> We automatically collect certain information when you use our service, including your <strong>IP address</strong>.
              </li>
              <li>
                <strong>Anonymous usage data:</strong> To understand service usage and improve our platform, we collect anonymous, aggregated data, such as the number of daily active users. This data is not linked to any personal information and is used solely for statistical purposes.
              </li>
            </ul>

            <h3 className="text-2xl font-semibold text-gray-200 mt-8 mb-4">2. How We Use Your Information</h3>
            <p className="text-gray-400 mb-4">We use the information we collect to:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-400 pl-4">
              <li>Operate and maintain the Silex Chat service.</li>
              <li>Protect the security of our platform and users.</li>
              <li>Analyze usage trends to improve the user experience.</li>
            </ul>
            <p className="text-gray-400 mt-4">We do not sell your personal information to third parties.</p>
          </section>

          {/* Self-Hosting Policy */}
          <section id="self-hosting" className="mt-16">
            <h2 className="text-3xl font-bold text-gray-100 border-b-2 border-emerald-500 pb-2 mb-6">
              Self-Hosting Policy
            </h2>
            <p className="text-gray-300 mb-4">Silex Chat is an open-source project, allowing users to host their own instances of the server.</p>

            <h3 className="text-2xl font-semibold text-gray-200 mt-8 mb-4">1. Scope of Terms</h3>
            <p className="text-gray-400">The Terms of Service and Privacy Policy described above apply specifically to the official Silex Chat platform hosted by us.</p>

            <h3 className="text-2xl font-semibold text-gray-200 mt-8 mb-4">2. Independent Servers</h3>
            <p className="text-gray-400">If you are using a self-hosted or third-party instance of a Silex Chat server, these terms do not apply. Each independent server is governed by its own set of rules and policies, as defined by its administrator. The Silex Chat open-source project and its maintainers have no relationship with and hold no responsibility for independent, self-hosted servers.</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsAndPrivacyPage;