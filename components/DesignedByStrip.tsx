import Link from 'next/link';

export default function DesignedByStrip() {
	return (
		<div className="fixed bottom-4 right-4 z-50">
			<Link href="/designed-by" className="flex items-center gap-3 text-white/80 hover:text-white transition-colors group">
				{/* Animated Ball Container - centered with text */}
				<div className="relative w-8 h-8 flex items-center justify-center">
					{/* Large background ball with low opacity */}
					<div className="absolute w-8 h-8 bg-blue-500/20 rounded-full animate-pulse" style={{ animationDuration: '3s' }}></div>
					
					{/* Medium ball with medium opacity */}
					<div className="absolute w-6 h-6 bg-blue-500/40 rounded-full animate-bounce" style={{ 
						animationDuration: '2s',
						animationDelay: '0.5s'
					}}></div>
					
					{/* Small ball with full opacity */}
					<div className="absolute w-4 h-4 bg-blue-500 rounded-full animate-ping" style={{ 
						animationDuration: '1.5s',
						animationDelay: '1s'
					}}></div>
					
					{/* Floating particle - top right */}
					<div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-cyan-400/60 rounded-full animate-pulse" style={{ 
						animationDuration: '2.5s',
						animationDelay: '0.3s'
					}}></div>
					
					{/* Bottom particle - bottom left */}
					<div className="absolute -bottom-0.5 -left-0.5 w-1.5 h-1.5 bg-purple-400/50 rounded-full animate-bounce" style={{ 
						animationDuration: '1.8s',
						animationDelay: '0.8s'
					}}></div>
				</div>

				<span className="text-xs font-medium leading-none">designed and coded by Tech_crew</span>
			</Link>
		</div>
	);
}
