'use client';

import React from 'react';

export default function RefundPolicyPage() {
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
      <h1 className="text-3xl md:text-4xl font-bold mb-6">Refund & Cancellation Policy</h1>

      <h2 className="text-2xl font-semibold mb-3">💰 Refund Policy</h2>
      <p className="mb-6 leading-relaxed">We don't have any refund policy.</p>

      <h2 className="text-2xl font-semibold mb-3">⚠️ Refund and Cancellation for Service Provider Company</h2>
      <p className="mb-6 leading-relaxed">Due to service providers in nature "NO REFUND", "NO CANCELLATION" will be entertained once the Payment has been made.</p>

      <h2 className="text-2xl font-semibold mb-3">🚫 Cancellation Policy</h2>
      <p className="mb-6 leading-relaxed">We don't offer any cancellation policy.</p>

      <h2 className="text-2xl font-semibold mb-3">📦 Shipping & Delivery Policies</h2>
      <p className="mb-6 leading-relaxed">JK Lakshmipat University provides products and services on campus.</p>

      <h2 className="text-2xl font-semibold mb-3">📞 Contact Us</h2>
      <p className="mb-2">🏛️ JK Lakshmipat University</p>
      <p className="mb-2">📍 Address: JK Lakshmipat University, Mahapura Rd, near Mahindra SEZ, Mahapura, Rajasthan 302026</p>
      <p className="mb-2">🗺️ Location: View on Google Maps</p>
      <p className="mb-2">📱 Phone: +91 141 7107500</p>
      <p className="mb-2">✉️ Email: info@jklu.edu.in</p>
      </div>
    </div>
  );
}


