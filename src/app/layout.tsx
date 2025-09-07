import type { Metadata } from "next";
import "./globals.css";
import AppShell from "../../components/AppShell";
import { VideoProvider } from "../../components/VideoContext";
import DesignedByStrip from "../../components/DesignedByStrip";

export const metadata: Metadata = {
  metadataBase: new URL('https://sabrang.jklu.edu.in'),
  title: {
    default: "SABRANG 2025 | Sabrang JKLU | JK Lakshmipat University Fest",
    template: "%s | SABRANG 2025"
  },
  description: "SABRANG 2025 - JK Lakshmipat University's (JKLU) premier annual cultural and technical fest in Jaipur. Experience Sabrang JKLU with pro-shows, competitions, workshops, and star-studded events.",
  keywords: [
    'sabrang', 'sabrang 2025', 'sabrang jklu', 'sabrang jklu 2025', 'jklu 2025',
    'JK Lakshmipat University', 'JKLU', 'Jaipur fest', 'college fest', 
    'cultural fest', 'technical fest', 'proshow', 'concert', 'competitions', 
    'workshops', 'Jaipur events', 'sabrang fest', 'sabrang festival'
  ],
  icons: { icon: '/favicon.ico', apple: '/apple-touch-icon.png' },
  openGraph: {
    type: 'website',
    url: 'https://sabrang.jklu.edu.in/',
    title: "SABRANG 2025 | Sabrang JKLU | JK Lakshmipat University Fest",
    description: "SABRANG 2025 - JK Lakshmipat University's premier annual fest. Experience Sabrang JKLU with star-studded nights and thrilling competitions.",
    siteName: "SABRANG 2025"
  },
  twitter: {
    card: 'summary',
    title: "SABRANG 2025 | Sabrang JKLU | JK Lakshmipat University Fest",
    description: "SABRANG 2025 - JK Lakshmipat University's annual cultural and technical fest."
  },
  alternates: {
    canonical: 'https://sabrang.jklu.edu.in/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
  },
  other: {
    'google-site-verification': 'your-verification-code-here',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Favicon and App Icons */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* Preload custom fonts */}
        <link rel="preload" href="/Font/TAN_Nimbus/TAN-NIMBUS.otf" as="font" type="font/otf" crossOrigin="anonymous" />
        
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />

        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Event",
              "name": "SABRANG 2025",
              "alternateName": ["Sabrang JKLU", "Sabrang 2025", "Sabrang JKLU 2025"],
              "description": "SABRANG 2025 - JK Lakshmipat University's premier annual cultural and technical fest featuring pro-shows, competitions, workshops, and star-studded events.",
              "url": "https://sabrang.jklu.edu.in",
              "startDate": "2025-01-01",
              "endDate": "2025-12-31",
              "eventStatus": "https://schema.org/EventScheduled",
              "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
              "organizer": {
                "@type": "Organization",
                "name": "JK Lakshmipat University",
                "alternateName": "JKLU",
                "url": "https://jklu.edu.in"
              },
              "location": {
                "@type": "Place",
                "name": "JK Lakshmipat University",
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": "Jaipur",
                  "addressRegion": "Rajasthan",
                  "addressCountry": "IN"
                }
              },
              "offers": {
                "@type": "Offer",
                "availability": "https://schema.org/InStock"
              },
              "keywords": "sabrang, sabrang 2025, sabrang jklu, sabrang jklu 2025, jklu 2025, college fest, cultural fest, technical fest"
            })
          }}
        />
      </head>
      <body className="antialiased">
        <VideoProvider>
          <AppShell>{children}</AppShell>
          <DesignedByStrip />
        </VideoProvider>
      </body>
    </html>
  );
}
