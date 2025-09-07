import React from "react";
import { CardSpotlight } from "../../../components/CardSpotlight";

export const metadata = {
  title: "Credits | Sabrang",
  description: "Acknowledging the developers behind the site",
};

export default function CreditsPage() {
  return (
    <div className="relative z-30 min-h-screen w-full px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
      {/* Page background layers */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {/* Conic gradient wash */}
        <div className="absolute inset-0 opacity-60 bg-[conic-gradient(at_50%_120%,#22d3ee22_0deg,#ec489922_120deg,#a855f722_240deg,#22d3ee22_360deg)]" />

        {/* Glow blobs */}
        <div className="absolute -top-32 -left-28 h-72 w-72 rounded-full bg-cyan-500/25 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-pink-500/25 blur-3xl" />
        <div className="absolute top-1/3 -translate-y-1/2 left-1/2 -translate-x-1/2 h-[28rem] w-[28rem] rounded-full bg-purple-600/20 blur-[100px]" />

        {/* Soft grid with radial mask */}
        <div className="absolute inset-0 opacity-20 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)] bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-pink-300 to-purple-400">
            Credits
          </h1>
          <p className="mt-3 text-sm sm:text-base text-gray-300">
            Recognizing the team that built this experience
          </p>
        </div>

        {/* Core */}
        <section className="mb-12 sm:mb-16">
          <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4 sm:mb-6">
            Core
          </h2>
          <div className="grid grid-cols-1">
            <CardSpotlight className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_10px_40px_rgba(168,85,247,0.25)]">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-white">Core Team</h3>
                  <p className="mt-2 text-gray-300 text-sm sm:text-base">
                    Lead coordination, architecture, and cohesive delivery
                  </p>
                </div>
              </div>
            </CardSpotlight>
          </div>
        </section>

        {/* Backend Developers */}
        <section className="mb-12 sm:mb-16">
          <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4 sm:mb-6">
            Backend Developers
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[0, 1, 2].map((i) => (
              <CardSpotlight
                key={`backend-${i}`}
                className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_10px_40px_rgba(168,85,247,0.25)]"
              >
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-white">
                    Backend Developer {i + 1}
                  </h3>
                  <p className="mt-2 text-gray-300 text-sm">
                    APIs, data, security, and integrations
                  </p>
                </div>
              </CardSpotlight>
            ))}
          </div>
        </section>

        {/* Frontend Developers */}
        <section className="mb-4 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4 sm:mb-6">
            Frontend Developers
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[0, 1, 2].map((i) => (
              <CardSpotlight
                key={`frontend-${i}`}
                className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_10px_40px_rgba(168,85,247,0.25)]"
              >
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-white">
                    Frontend Developer {i + 1}
                  </h3>
                  <p className="mt-2 text-gray-300 text-sm">
                    UI, interactions, accessibility, and performance
                  </p>
                </div>
              </CardSpotlight>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}


