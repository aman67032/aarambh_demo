'use client';

import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <div className="relative min-h-screen text-white">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-center bg-cover opacity-100"
        style={{ backgroundImage: "url('/images/about-section/about_back.webp')" }}
      />
      {/* Black filter */}
      <div className="absolute inset-0 bg-black/80" />
      {/* Content */}
      <div className="relative z-10 px-6 md:px-10 lg:px-16 py-16 max-w-4xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold mb-6">Privacy Policy</h1>
      <p className="text-6xl mb-6">🔒</p>
      <p className="mb-4 leading-relaxed">
        We respect and are committed towards protecting your privacy. Publishing, selling or renting any personal data or information to any third party, without your consent, is against our ethics.
      </p>
      <p className="mb-4 leading-relaxed">
        The privacy practices of this statement apply to our services available under the domain and subdomains of the Site. By visiting this Site you agree to be bound by the terms and conditions of this privacy policy. If you do not agree, please do not use or access our site.
      </p>
      <p className="mb-8 leading-relaxed">
        This privacy policy does not apply to sites maintained by other companies or organizations to which we link and we are not responsible for any personal information you submit to third parties via our website. Please ensure that you read the privacy policy of such other companies or organizations before submitting your details.
      </p>

      <h2 className="text-2xl font-semibold mb-3">🛡️ Privacy Guarantee</h2>
      <p className="mb-6 leading-relaxed">
        We agree that we will not sell or rent your personal information to third parties for their marketing purposes without your explicit consent. From time to time, we may reveal general statistical information about our Site and visitors, such as number of visitors, number and type of goods and services purchased, etc. Only those of our employees who need access to your information in order to perform their duties, are allowed such access. Any employee who violates our privacy and/or security policies is subjected to disciplinary action, including possible termination and civil and/or criminal prosecution.
      </p>

      <h2 className="text-2xl font-semibold mb-3">📊 Information We Collect</h2>
      <p className="mb-6 leading-relaxed">
        The Personal Information is used for two general purposes: to verify details, and to provide you with the best possible services. Unless otherwise stated explicitly, this policy applies to personal information as disclosed on any of the media.
      </p>
      <p className="mb-8 leading-relaxed">
        In furtherance of the confidentiality with which we treat Personal Information, we have put in place appropriate physical, electronic, and managerial procedures to safeguard and secure the information we collect online. We use data collection devices such as "cookies" on certain pages of the Site to help and analyze our web page flow, measure promotional effectiveness, and promote trust and safety.
      </p>

      <h2 className="text-2xl font-semibold mb-3">🍪 Cookie Policy</h2>
      <p className="mb-4 leading-relaxed">Aarambh JKLU operates a strict privacy policy and we are committed to being transparent about how we use cookies on our website.</p>
      <h3 className="text-xl font-semibold mb-2">❓ Why are cookies important?</h3>
      <p className="mb-4 leading-relaxed">Cookies help you make your online experience more efficient and relevant to your interests. For instance, they are used to remember your preferences on sites you visit often, to remember your user ID and the contents of your shopping baskets, and to help you navigate between pages efficiently.</p>
      <h3 className="text-xl font-semibold mb-2">ℹ️ What is a Cookie?</h3>
      <p className="mb-6 leading-relaxed">A cookie is a small file, or files on your computer, phone, or other device with a browser to save snippets of text for reference by the website you are visiting. All cookies have expiration dates in them that determine how long they stay in your browser:</p>
      <ul className="list-disc pl-6 space-y-2 mb-6">
        <li>Session cookies - these are temporary cookies that expire (and are automatically erased) whenever you close your browser.</li>
        <li>Persistent cookies - these usually have an expiration date and so stay in your browser until they expire, or until you manually delete them.</li>
      </ul>
      <h3 className="text-xl font-semibold mb-2">🔑 Essential</h3>
      <p className="mb-4 leading-relaxed">These are cookies that are required for the regular operation of our websites.</p>
      <h3 className="text-xl font-semibold mb-2">⚙️ Functional</h3>
      <p className="mb-4 leading-relaxed">These remember your preferences, and are intended to make your experience on our websites better for you.</p>
      <h3 className="text-xl font-semibold mb-2">📈 Analytics</h3>
      <p className="mb-4 leading-relaxed">These cookies are used for performance measurement to understand things including how many people visit our websites, how they navigate our sites, and what content is popular.</p>
      <h3 className="text-xl font-semibold mb-2">📢 Advertising</h3>
      <p className="mb-6 leading-relaxed">These cookies enable us and our advertising partners to serve you with relevant advertisements that we think will interest you.</p>
      <p className="mb-10 leading-relaxed">To ensure compliance with our policies, we restrict the use of third-party cookies to trusted partners.</p>
      </div>
    </div>
  );
}


