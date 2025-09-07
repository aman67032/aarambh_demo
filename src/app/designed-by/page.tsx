"use client";

import Link from 'next/link';

type Member = { name: string; role: string; tag: string; initials: string };

const members: Member[] = [
	{ name: 'Suryansh Sharma', role: 'Creative Direction', tag: 'Brand & Vision', initials: 'SS' },
	{ name: 'Devam Gupta', role: 'Interface Engineer', tag: 'Build & Perf', initials: 'DG' },
	{ name: 'Aman Pratap Singh', role: 'Motion & UX', tag: 'Flow & Timing', initials: 'APS' },
	{ name: 'Yash Mishra', role: 'Systems & Design', tag: 'Tokens & DS', initials: 'YM' },
	{ name: 'Ayush Sharma', role: 'Visual Design', tag: 'Type & Color', initials: 'AS' },
	{ name: 'Atharv Mehrotra', role: 'Prototyping', tag: 'Concept to UI', initials: 'AM' },
];

function Avatar({ initials, hue = 260 }: { initials: string; hue?: number }) {
	return (
		<div className="relative overflow-hidden rounded-2xl aspect-[4/3]">
			<div
				className="absolute inset-0"
				style={{
					background: `conic-gradient(from 180deg at 50% 50%, hsl(${hue} 95% 55% / .85), hsl(${hue + 60} 95% 55% / .85), hsl(${hue + 120} 95% 55% / .85), hsl(${hue} 95% 55% / .85))`,
				}}
			/>
			<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,.2),transparent_60%)]" />
			<div className="absolute inset-0 flex items-center justify-center">
				<span className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white drop-shadow-[0_4px_24px_rgba(0,0,0,.45)]">{initials}</span>
			</div>
		</div>
	);
}

export default function DesignedByPage() {
	return (
		<div className="relative min-h-screen overflow-hidden text-white">
			{/* Background */}
			<div className="fixed inset-0 -z-10">
				<div className="absolute inset-0 bg-gradient-to-tr from-black via-[#0b0b1a] to-black" />
				<div className="absolute -top-1/3 left-1/2 -translate-x-1/2 w-[140vw] h-[140vw] rounded-full blur-3xl opacity-25"
					style={{ background: 'radial-gradient(closest-side, rgba(99,102,241,0.28), rgba(236,72,153,0.14), transparent)' }} />
			</div>

			{/* Header */}
			<section className="px-4 pt-20 sm:pt-24">
				<div className="max-w-7xl mx-auto text-center">
					<h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight">
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300">THE DESIGN CREW</span>
					</h1>
					<p className="mt-5 text-gray-300 max-w-3xl mx-auto text-lg">
						We craft clear, fast interfaces—equal parts engineering and design. Here’s the tiny team behind the polish.
					</p>
					<div className="mt-8 flex items-center justify-center">
						<div className="h-px w-28 bg-gradient-to-r from-transparent via-purple-400/70 to-transparent" />
					</div>
				</div>
			</section>

			{/* Mosaic Deck */}
			<section className="px-4 py-16">
				<div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6">
					{/* Left feature card */}
					<div className="md:col-span-4 relative rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-lg">
						<Avatar initials={members[0].initials} hue={250} />
						<div className="p-6 sm:p-7">
							<p className="text-xs text-purple-200/90">{members[0].tag}</p>
							<h3 className="mt-1 text-2xl font-bold">{members[0].name}</h3>
							<p className="text-sm text-gray-300">{members[0].role}</p>
						</div>
						<div className="absolute inset-0 pointer-events-none bg-[radial-gradient(80%_50%_at_10%_90%,rgba(255,255,255,.15),transparent)]" />
					</div>

					{/* Middle stacked cards */}
					<div className="md:col-span-4 grid grid-cols-1 gap-6">
						<div className="relative rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-lg">
							<Avatar initials={members[1].initials} hue={300} />
							<div className="p-6">
								<p className="text-xs text-purple-200/90">{members[1].tag}</p>
								<h3 className="mt-1 text-xl font-bold">{members[1].name}</h3>
								<p className="text-sm text-gray-300">{members[1].role}</p>
							</div>
							<div className="absolute inset-0 pointer-events-none bg-[linear-gradient(120deg,rgba(255,255,255,.07),transparent_30%)]" />
						</div>
						<div className="relative rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-lg">
							<Avatar initials={members[2].initials} hue={200} />
							<div className="p-6">
								<p className="text-xs text-purple-200/90">{members[2].tag}</p>
								<h3 className="mt-1 text-xl font-bold">{members[2].name}</h3>
								<p className="text-sm text-gray-300">{members[2].role}</p>
							</div>
							<div className="absolute inset-0 pointer-events-none bg-[linear-gradient(300deg,rgba(255,255,255,.07),transparent_30%)]" />
						</div>
					</div>

					{/* Right tall card */}
					<div className="md:col-span-4 relative rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-lg">
						<Avatar initials={members[3].initials} hue={160} />
						<div className="p-6 sm:p-7">
							<p className="text-xs text-purple-200/90">{members[3].tag}</p>
							<h3 className="mt-1 text-2xl font-bold">{members[3].name}</h3>
							<p className="text-sm text-gray-300">{members[3].role}</p>
						</div>
						<div className="absolute inset-0 pointer-events-none bg-[radial-gradient(80%_50%_at_90%_90%,rgba(255,255,255,.15),transparent)]" />
					</div>

					{/* Full width experiential card */}
					<div className="md:col-span-8 relative rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-lg">
						<div className="grid grid-cols-1 md:grid-cols-2">
							<div className="p-6 sm:p-8">
								<h3 className="text-2xl font-bold">{members[4].name}</h3>
								<p className="text-purple-200/90">{members[4].role} · {members[4].tag}</p>
								<p className="mt-3 text-gray-300">Rapid iterations from sketches to working UI. Pragmatic, fast, and tidy.</p>
								<div className="mt-5 flex flex-wrap gap-2">
									<span className="rounded-md border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-300">Prototypes</span>
									<span className="rounded-md border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-300">Figma</span>
									<span className="rounded-md border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-300">Code</span>
								</div>
							</div>
							<div className="p-6 sm:p-8">
								<Avatar initials={members[4].initials} hue={120} />
							</div>
						</div>
						<div className="absolute inset-0 pointer-events-none bg-[radial-gradient(100%_60%_at_75%_0%,rgba(255,255,255,.08),transparent)]" />
					</div>

					{/* New card for the 6th member */}
					<div className="md:col-span-4 relative rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-lg">
						<Avatar initials={members[5].initials} hue={80} />
						<div className="p-6">
							<p className="text-xs text-purple-200/90">{members[5].tag}</p>
							<h3 className="mt-1 text-xl font-bold">{members[5].name}</h3>
							<p className="text-sm text-gray-300">{members[5].role}</p>
						</div>
						<div className="absolute inset-0 pointer-events-none bg-[linear-gradient(120deg,rgba(255,255,255,.07),transparent_30%)]" />
					</div>
				</div>
			</section>

			
		</div>
	);
}
