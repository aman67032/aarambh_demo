'use client';

import React from 'react';

export default function TermsPage() {
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
      <h1 className="text-3xl md:text-4xl font-bold mb-6">Terms & Conditions</h1>
      <p className="mb-6 leading-relaxed">
        Thank you for accessing/shopping at aarambh.jklu.edu.in. This site is owned JK Lakshmipat University. By accessing, shopping on this site, you indicate your unconditional acceptance of these terms & conditions. We reserve this right, in our sole discretion, to update or revise these terms & conditions. Continued use of the site following the posting of any changes to the 'terms & conditions', constitutes your acceptance of those changes.
      </p>
      <p className="mb-6 leading-relaxed">
        At "aarambh.jklu.edu.in", we try our best to create a space where you can explore and shop for all your favorite things in a safe and secure environment. All services and information displayed on "aarambh.jklu.edu.in" constitutes an "invitation to offer". "aarambh.jklu.edu.in" reserves the right to accept or reject your offer. Your order for purchase, constitutes your "offer" which shall be subject to the terms and conditions listed below.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">👤 1. Eligibility to use our site</h2>
      <p className="mb-4 leading-relaxed">
        Use of the Site is available only to persons who can legally enter into contracts under applicable laws. Persons who are "incompetent to contract", within the meaning of the Indian Contract Act, 1872 including un-discharged insolvents etc. are not eligible to use the Site. "aarambh.jklu.edu.in" reserves the right to terminate your access to the Site if it discovers that you are under the age of 18 years or suffers from any other disability, as recognized under Indian Contract Act, 1872.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">👥 2. Membership</h2>
      <p className="mb-4 leading-relaxed">
        It's essential to have an account to shop with "aarambh.jklu.edu.in". As a member, you agree to provide true, accurate, current, and complete information about yourself as prompted by the site's registration form. Registration where prohibited under any law shall be void. "aarambh.jklu.edu.in" reserves the right to revoke or terminate your registration for any reason at any time, without notice.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">📧 3. Electronic Communications</h2>
      <p className="mb-4 leading-relaxed">
        When you use the site or send emails or other data, information or communicate to us, you agree and understand that you are communicating with us electronically and give your consent to receive communications electronically from us periodically, when required.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">💬 4. Reviews, Feedback, Submissions</h2>
      <p className="mb-4 leading-relaxed">
        All reviews, comments, feedback, postcards, suggestions, ideas, and other submissions disclosed, submitted or offered to "aarambh.jklu.edu.in" directly or otherwise disclosed, submitted or offered in connection with your use of this Site (collectively referred to "Comments") will remain "aarambh.jklu.edu.in" property. Such disclosure, submission or offer of any comments shall constitute an assignment to "aarambh.jklu.edu.in" of all worldwide rights, titles and interests in all copyrights and other intellectual properties in the comments, thus, it exclusively owns all such rights, titles and interests and shall not be limited in any way in its use, commercial or otherwise.
      </p>
      <p className="mb-4 leading-relaxed">
        "aarambh.jklu.edu.in" will be entitled to use, reproduce, disclose, modify, adapt, create derivative works from, publish, display and distribute any comments you submit for any purpose whatsoever, without restriction and without compensating you in any way. "aarambh.jklu.edu.in" is and shall be under no obligation:
      </p>
      <ul className="list-disc pl-6 space-y-2 mb-6">
        <li>to maintain any Comments in confidence;</li>
        <li>to pay you any compensation for any Comments;</li>
        <li>to respond to any Comments.</li>
      </ul>
      <p className="mb-6 leading-relaxed">
        You agree that any comments submitted by you to the Site will not violate this policy or any right of any third party, including copyright, trademark, privacy or other personal or proprietary right(s), and will not cause injury to any person or entity. You further agree that no comments submitted by you to the site will be libelous or otherwise unlawful, threatening, abusive or obscene material, or contain software viruses, political campaigning, commercial solicitation, chain letters, mass mailings or any form of "spam".
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">✅ 5. Accuracy of Content/ Information of Products on the Web Site</h2>
      <p className="mb-6 leading-relaxed">
        While aarambh.jklu.edu.in strives to provide accurate service and pricing information, typographical errors may occur. In the event that a service is listed at an incorrect price or with incorrect information due to an error in pricing or product information, "aarambh.jklu.edu.in" shall have the right, on our sole discretion, to modify the price of the products, or information of the products or to refuse or cancel any orders placed for that product.
      </p>
      </div>
    </div>
  );
}


