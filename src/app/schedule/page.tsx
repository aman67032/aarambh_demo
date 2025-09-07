'use client';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, MapPin, ChevronRight, ChevronDown, Home, Info, Star, Users, HelpCircle, Handshake, Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useNavigation } from '../../../components/NavigationContext';
import Logo from '../../../components/Logo';

interface TimelineEvent {
	time: string;
	event: string;
	description: string;
	location: string;
	category?: string;
}

interface TimelineData {
	[key: number]: TimelineEvent[];
}

export default function SchedulePage() {
	const router = useRouter();
	const { navigate } = useNavigation();
	const [activeDay, setActiveDay] = useState<number>(1);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [isMobile, setIsMobile] = useState(false);
	const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
	const [scrollX, setScrollX] = useState(0);
	const timelineContainerRef = useRef<HTMLDivElement>(null);
	const scrollContainerRef = useRef<HTMLDivElement>(null);

	// Per-day timeline design (path shape, colors, stroke width, duration)
	const getDayDesign = (day: number) => {
		switch (day) {
			case 1:
				return {
					stops: { start: '#8b5cf6', mid1: '#ec4899', mid2: '#6366f1', end: '#8b5cf6' },
					pathD: 'M 100,400 Q 300,300 500,400 T 900,300 T 1300,400 T 1700,300 T 2100,400 T 2300,300',
					strokeWidth: 15,
					duration: 5
				};
			case 2:
				return {
					stops: { start: '#06b6d4', mid1: '#10b981', mid2: '#84cc16', end: '#06b6d4' },
					pathD: 'M 100,420 Q 300,340 500,380 T 900,320 T 1300,420 T 1700,360 T 2100,400 T 2300,340',
					strokeWidth: 18,
					duration: 4.5
				};
			case 3:
				return {
					stops: { start: '#f59e0b', mid1: '#f97316', mid2: '#ef4444', end: '#f59e0b' },
					pathD: 'M 100,380 Q 300,460 500,380 T 900,460 T 1300,380 T 1700,460 T 2100,380 T 2300,460',
					strokeWidth: 16,
					duration: 5.5
				};
			default:
				return {
					stops: { start: '#8b5cf6', mid1: '#ec4899', mid2: '#6366f1', end: '#8b5cf6' },
					pathD: 'M 100,400 Q 300,300 500,400 T 900,300 T 1300,400 T 1700,300 T 2100,400 T 2300,300',
					strokeWidth: 15,
					duration: 5
				};
		}
	};

	const mobileNavItems: { title: string; href: string; icon: React.ReactNode }[] = [
		{ title: 'Home', href: '/?skipLoading=true', icon: <Home className="w-5 h-5" /> },
		{ title: 'About', href: '/About', icon: <Info className="w-5 h-5" /> },
		{ title: 'Events', href: '/Events', icon: <Star className="w-5 h-5" /> },
		{ title: 'Highlights', href: '/Gallery', icon: <Star className="w-5 h-5" /> },
		{ title: 'Schedule', href: '/schedule/progress', icon: <Clock className="w-5 h-5" /> },
		{ title: 'Team', href: '/Team', icon: <Users className="w-5 h-5" /> },
		{ title: 'FAQ', href: '/FAQ', icon: <HelpCircle className="w-5 h-5" /> },
		{ title: 'Why Sponsor Us', href: '/why-sponsor-us', icon: <Handshake className="w-5 h-5" /> },
		{ title: 'Contact', href: '/Contact', icon: <Mail className="w-5 h-5" /> },
	];

	const timelineData: TimelineData = {
		1: [
			{ time: "9:00 AM", event: "Opening Ceremony", description: "Welcome to Sabrang 2025", location: "Main Auditorium", category: "Ceremony" },
			{ time: "10:30 AM", event: "Tech Workshop", description: "AI & Machine Learning", location: "Lab 101", category: "Workshop" },
			{ time: "12:00 PM", event: "Lunch Break", description: "Networking & Refreshments", location: "Food Court", category: "Break" },
			{ time: "2:00 PM", event: "Cultural Performance", description: "Traditional Dance Show", location: "Open Air Theater", category: "Cultural" },
			{ time: "4:00 PM", event: "Sports Event", description: "Inter-College Cricket", location: "Sports Ground", category: "Sports" },
			{ time: "6:00 PM", event: "Evening Concert", description: "Live Music & DJ", location: "Amphitheater", category: "Entertainment" },
		],
		2: [
			{ time: "9:00 AM", event: "Academic Seminar", description: "Future of Technology", location: "Conference Hall", category: "Academic" },
			{ time: "11:00 AM", event: "Art Exhibition", description: "Student Artwork Display", location: "Art Gallery", category: "Art" },
			{ time: "1:00 PM", event: "Lunch Break", description: "Cultural Food Festival", location: "Food Court", category: "Break" },
			{ time: "3:00 PM", event: "Drama Competition", description: "One Act Plays", location: "Auditorium", category: "Cultural" },
			{ time: "5:00 PM", event: "Science Fair", description: "Innovation Projects", location: "Science Block", category: "Science" },
			{ time: "7:00 PM", event: "Night Carnival", description: "Games & Entertainment", location: "Campus Ground", category: "Entertainment" },
		],
		3: [
			{ time: "9:00 AM", event: "Final Competitions", description: "Championship Rounds", location: "Various Venues", category: "Competition" },
			{ time: "11:00 AM", event: "Award Ceremony", description: "Recognition & Prizes", location: "Main Auditorium", category: "Ceremony" },
			{ time: "1:00 PM", event: "Farewell Lunch", description: "Closing Celebration", location: "Food Court", category: "Break" },
			{ time: "3:00 PM", event: "Cultural Parade", description: "Grand Finale March", location: "Campus Route", category: "Cultural" },
			{ time: "5:00 PM", event: "Closing Ceremony", description: "Vote of Thanks", location: "Open Air Theater", category: "Ceremony" },
			{ time: "6:00 PM", event: "Fireworks", description: "Spectacular Display", location: "Sports Ground", category: "Entertainment" },
		]
	};

	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 1024);
		};
		
		checkMobile();
		window.addEventListener('resize', checkMobile);
		
		return () => window.removeEventListener('resize', checkMobile);
	}, []);

	// Horizontal scroll effect for desktop
	useEffect(() => {
		if (isMobile) return;

		const handleScroll = (e: WheelEvent) => {
			// Only handle horizontal scrolling for the timeline section
			if (!timelineContainerRef.current?.contains(e.target as Node)) return;
			
			e.preventDefault();
			
			const container = scrollContainerRef.current;
			if (!container) return;

			const maxScrollLeft = container.scrollWidth - container.clientWidth;
			const scrollSpeed = 2; // Adjust this value to control scroll sensitivity
			
			setScrollX(prevScrollX => {
				const newScrollX = Math.max(0, Math.min(maxScrollLeft, prevScrollX + e.deltaY * scrollSpeed));
				container.scrollLeft = newScrollX;
				return newScrollX;
			});
		};

		// Add scroll listener to timeline container
		const timelineContainer = timelineContainerRef.current;
		if (timelineContainer) {
			timelineContainer.addEventListener('wheel', handleScroll, { passive: false });
			
			return () => {
				timelineContainer.removeEventListener('wheel', handleScroll);
			};
		}
	}, [isMobile]);

	// Handle touch/drag scrolling for desktop
	useEffect(() => {
		if (isMobile) return;

		let isMouseDown = false;
		let startX = 0;
		let scrollLeft = 0;

		const handleMouseDown = (e: MouseEvent) => {
			if (!scrollContainerRef.current?.contains(e.target as Node)) return;
			isMouseDown = true;
			startX = e.pageX - (scrollContainerRef.current?.offsetLeft || 0);
			scrollLeft = scrollContainerRef.current?.scrollLeft || 0;
			if (scrollContainerRef.current) {
				scrollContainerRef.current.style.cursor = 'grabbing';
			}
		};

		const handleMouseLeave = () => {
			isMouseDown = false;
			if (scrollContainerRef.current) {
				scrollContainerRef.current.style.cursor = 'grab';
			}
		};

		const handleMouseUp = () => {
			isMouseDown = false;
			if (scrollContainerRef.current) {
				scrollContainerRef.current.style.cursor = 'grab';
			}
		};

		const handleMouseMove = (e: MouseEvent) => {
			if (!isMouseDown || !scrollContainerRef.current) return;
			e.preventDefault();
			const x = e.pageX - (scrollContainerRef.current.offsetLeft || 0);
			const walk = (x - startX) * 2; // Scroll speed multiplier
			const newScrollLeft = scrollLeft - walk;
			scrollContainerRef.current.scrollLeft = newScrollLeft;
			setScrollX(newScrollLeft);
		};

		const container = scrollContainerRef.current;
		if (container) {
			container.style.cursor = 'grab';
			container.addEventListener('mousedown', handleMouseDown);
			container.addEventListener('mouseleave', handleMouseLeave);
			container.addEventListener('mouseup', handleMouseUp);
			container.addEventListener('mousemove', handleMouseMove);

			return () => {
				container.removeEventListener('mousedown', handleMouseDown);
				container.removeEventListener('mouseleave', handleMouseLeave);
				container.removeEventListener('mouseup', handleMouseUp);
				container.removeEventListener('mousemove', handleMouseMove);
			};
		}
	}, [isMobile]);

	const getCategoryColor = (category: string) => {
		const colors: { [key: string]: string } = {
			'Ceremony': 'from-purple-500 to-pink-500',
			'Workshop': 'from-blue-500 to-cyan-500',
			'Break': 'from-green-500 to-emerald-500',
			'Cultural': 'from-orange-500 to-red-500',
			'Sports': 'from-yellow-500 to-orange-500',
			'Entertainment': 'from-pink-500 to-purple-500',
			'Academic': 'from-indigo-500 to-blue-500',
			'Art': 'from-red-500 to-pink-500',
			'Science': 'from-cyan-500 to-blue-500',
			'Competition': 'from-yellow-500 to-green-500'
		};
		return colors[category] || 'from-gray-500 to-gray-600';
	};

	// Derived UI values for current day
	const design = getDayDesign(activeDay);
	const mobileGradientClass = activeDay === 1
		? 'from-purple-500 via-pink-500 to-indigo-600'
		: activeDay === 2
			? 'from-cyan-500 via-emerald-500 to-lime-500'
			: 'from-amber-500 via-orange-500 to-rose-500';

	return (
		<div className="min-h-screen text-white font-sans relative overflow-hidden flex flex-col">
			{/* Background Image */}
			<div 
				className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
				style={{
					backgroundImage: 'url(/images/Schedule.jpg)'
				}}
			/>
			
			{/* Glass Effect Overlay - Darker for reduced background visibility */}
			<div className="fixed inset-0 -z-10 bg-black/50 backdrop-blur-[2px]" />

			{/* Logo and sidebar */}
			<Logo className="block" />

			{/* Mobile hamburger */}
			<button
				aria-label="Open menu"
				onClick={() => setMobileMenuOpen(true)}
				className="lg:hidden fixed top-4 right-4 z-50 p-3 rounded-xl active:scale-95 transition"
			>
				<span className="block h-0.5 bg-white rounded-full w-8 mb-1" />
				<span className="block h-0.5 bg-white/90 rounded-full w-6 mb-1" />
				<span className="block h-0.5 bg-white/80 rounded-full w-4" />
			</button>

			{/* Mobile menu overlay */}
			{mobileMenuOpen && (
				<div className="lg:hidden fixed inset-0 z-50 bg-black/70 backdrop-blur-xl">
					<div className="absolute top-4 right-4">
						<button
							aria-label="Close menu"
							onClick={() => setMobileMenuOpen(false)}
							className="p-3 rounded-xl bg-white/20 backdrop-blur-md border border-white/35 hover:bg-white/25 transition"
						>
							<Calendar className="w-6 h-6 text-white" />
						</button>
					</div>
					<div className="pt-20 px-6 h-full overflow-y-auto">
						<div className="grid grid-cols-1 gap-3 pb-8">
							{mobileNavItems.map((item) => (
								<button
									key={item.title}
									onClick={() => { setMobileMenuOpen(false); navigate(item.href); }}
									className="flex items-center gap-3 p-4 rounded-xl bg-white/20 backdrop-blur-md border border-white/35 text-white text-base hover:bg-white/25 active:scale-[0.99] transition text-left"
								>
									<span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/25 backdrop-blur-md border border-white/35">
										{item.icon}
									</span>
									<span className="font-medium">{item.title}</span>
								</button>
							))}
						</div>
					</div>
				</div>
			)}

			{/* Infinity transition handled by AppShell */}

			{/* Main Content Container */}
			<div className="relative z-10 pb-16 flex-grow pt-20 lg:pt-0">
				{/* Header */}
				<div className="text-center mb-8 sm:mb-12">
					<motion.div
						initial={{ opacity: 0, y: -50 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
						className="px-4 sm:px-6 pt-10 sm:pt-14 lg:pt-16"
					>
						<h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black mb-4 sm:mb-6">
							<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-600">
								SCHEDULE
							</span>
						</h1>
						<p className="text-lg sm:text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto drop-shadow-lg">
							Experience the magic of Sabrang 2025
						</p>
					</motion.div>
				</div>

				{/* Day Tabs */}
				<div className="px-4 sm:px-6 mb-8">
					<div className="flex justify-center space-x-2 sm:space-x-4">
						{[1, 2, 3].map((day) => (
							<motion.button
								key={day}
								onClick={() => setActiveDay(day)}
								className={`px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-lg transition-all duration-300 backdrop-blur-md ${
									activeDay === day
										? 'bg-gradient-to-r from-purple-500/95 to-pink-500/95 text-white shadow-lg shadow-purple-500/50 border border-purple-400/40'
										: 'bg-gray-800/60 text-gray-200 hover:bg-gray-700/70 hover:text-white border border-gray-600/40'
								}`}
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								Day {day}
							</motion.button>
						))}
					</div>
				</div>

				{/* Scroll Hint for Desktop */}
				{!isMobile && (
					<div className="hidden lg:flex justify-center mb-6">
						<div className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
							<span className="text-sm text-gray-300">Scroll down to navigate timeline</span>
							<motion.div
								animate={{ y: [0, 3, 0] }}
								transition={{ duration: 1.5, repeat: Infinity }}
							>
								<ChevronDown className="w-4 h-4 text-purple-400" />
							</motion.div>
						</div>
					</div>
				)}

				{/* Timeline Content */}
				<div className="px-4 sm:px-6" ref={timelineContainerRef}>
					{/* Desktop: Horizontal Timeline */}
					{!isMobile && (
						<div className="hidden lg:block">
							<div 
								ref={scrollContainerRef}
								className="w-full overflow-x-auto scrollbar-hide"
								style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
							>
								<motion.svg
									viewBox="0 0 2400 800"
									className="w-[2400px] h-[600px] min-w-full select-none"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ duration: 0.8 }}
									style={{ pointerEvents: 'none' }}
								>
									<defs>
										<linearGradient id="timelineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
											<stop offset="0%" stopColor={design.stops.start} />
											<stop offset="25%" stopColor={design.stops.mid1} />
											<stop offset="50%" stopColor={design.stops.mid2} />
											<stop offset="75%" stopColor={design.stops.mid1} />
											<stop offset="100%" stopColor={design.stops.end} />
										</linearGradient>
									</defs>

									{/* Horizontal Timeline Path */}
									<motion.path
										key={activeDay}
										d={design.pathD}
										fill="none"
										stroke="url(#timelineGradient)"
										strokeWidth={design.strokeWidth}
										strokeLinecap="round"
										initial={{ strokeDasharray: 3000, strokeDashoffset: 3000 }}
										animate={{ strokeDashoffset: 0 }}
										transition={{ duration: design.duration, ease: 'easeInOut' }}
									/>

									{/* Timeline Events */}
									{timelineData[activeDay].map((event, index) => {
										const x = 200 + (index * 400);
										const y = 400 + (index % 2 === 0 ? 0 : -100);
										
										return (
											<g
												key={index}
												className="cursor-pointer"
												onMouseEnter={() => setHoveredIndex(index)}
												onMouseLeave={() => setHoveredIndex(null)}
												style={{ pointerEvents: 'all' }}
											>
												<motion.circle
													cx={x}
													cy={y}
													r="25"
													fill="#ffffff"
													className="drop-shadow-[0_0_25px_rgba(139,92,246,0.9)]"
													initial={{ scale: 0, opacity: 0 }}
													animate={{ scale: hoveredIndex === index ? 1.25 : 1, opacity: 1 }}
													transition={{ delay: 0.5 + index * 0.2, type: 'spring', stiffness: 250, damping: 15 }}
												/>
												
												<motion.rect
													x={x - 220}
													y={y + (index % 2 === 0 ? 50 : -250)}
													width="440"
													height="200"
													rx="20"
													fill="rgba(0,0,0,0.75)"
													stroke={hoveredIndex === index ? '#ec4899' : 'url(#timelineGradient)'}
													strokeWidth={hoveredIndex === index ? 5 : 3}
													initial={{ opacity: 0, y: 30 }}
													animate={{ opacity: 1, y: 0 }}
													transition={{ delay: 1 + index * 0.2 }}
												/>
												
												<motion.text
													x={x}
													y={y + (index % 2 === 0 ? 95 : -205)}
													textAnchor="middle"
													className="text-xl font-bold fill-white"
													initial={{ opacity: 0 }}
													animate={{ opacity: 1 }}
													transition={{ delay: 1.2 + index * 0.2 }}
												>
													{event.time}
												</motion.text>
												
												<motion.text
													x={x}
													y={y + (index % 2 === 0 ? 130 : -170)}
													textAnchor="middle"
													className="text-lg font-semibold fill-purple-300"
													initial={{ opacity: 0 }}
													animate={{ opacity: 1 }}
													transition={{ delay: 1.3 + index * 0.2 }}
												>
													{event.event}
												</motion.text>
												
												<motion.text
													x={x}
													y={y + (index % 2 === 0 ? 165 : -135)}
													textAnchor="middle"
													className="text-base fill-gray-300"
													initial={{ opacity: 0 }}
													animate={{ opacity: 1 }}
													transition={{ delay: 1.4 + index * 0.2 }}
												>
													{event.description}
												</motion.text>
												
												<motion.text
													x={x}
													y={y + (index % 2 === 0 ? 200 : -100)}
													textAnchor="middle"
													className="text-base fill-pink-300"
													initial={{ opacity: 0 }}
													animate={{ opacity: 1 }}
													transition={{ delay: 1.5 + index * 0.2 }}
												>
													📍 {event.location}
												</motion.text>
											</g>
										);
									})}
								</motion.svg>
								
								{/* Custom scrollbar styles */}
								<style jsx>{`
									.scrollbar-hide::-webkit-scrollbar {
										display: none;
									}
								`}</style>
							</div>
						</div>
					)}

					{/* Mobile: Vertical Timeline */}
					{isMobile && (
						<div className="lg:hidden">
							<div className="relative">
								{/* Vertical Timeline Line */}
								<div className={`absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b ${mobileGradientClass} rounded-full`}>
									<motion.div
										key={activeDay}
										className={`absolute top-0 left-0 w-full h-full bg-gradient-to-b ${mobileGradientClass} rounded-full origin-top`}
										initial={{ scaleY: 0 }}
										animate={{ scaleY: 1 }}
										transition={{ duration: 2, ease: "easeInOut" }}
									/>
								</div>

								{/* Timeline Events */}
								<motion.div
									key={`mobile-list-${activeDay}`}
									className="space-y-6 ml-16"
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.3 }}
								>
									{timelineData[activeDay].map((event, index) => (
										<motion.div
											key={index}
											initial={{ opacity: 0, y: 24, scale: 0.98 }}
											whileInView={{ opacity: 1, y: 0, scale: 1 }}
											viewport={{ amount: 0.2, once: false }}
											transition={{ type: 'spring', stiffness: 220, damping: 20, delay: index * 0.1 }}
											whileTap={{ scale: 0.985 }}
											className="relative group"
										>
											{/* Event Circle */}
											<div className="absolute -left-12 top-6 w-6 h-6 bg-white rounded-full border-4 border-purple-500 shadow-lg shadow-purple-500/50" />

											{/* Event Card */}
											<div className="bg-gray-900/80 backdrop-blur-md border border-gray-600/50 rounded-2xl p-4 sm:p-6 shadow-xl">
												{/* Category Badge */}
												<div className="flex items-center justify-between mb-3">
													<span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getCategoryColor(event.category || '')} text-white`}>
														{event.category}
													</span>
													<ChevronRight className="w-4 h-4 text-gray-400" />
												</div>

												{/* Event Title */}
												<h3 className="text-lg sm:text-xl font-bold text-white mb-2">
													{event.event}
												</h3>

												{/* Time */}
												<div className="flex items-center space-x-2 mb-2">
													<Clock className="w-4 h-4 text-purple-400" />
													<span className="text-purple-300 font-medium">{event.time}</span>
												</div>

												{/* Description */}
												<p className="text-gray-200 text-sm sm:text-base mb-3 leading-relaxed">
													{event.description}
												</p>

												{/* Location */}
												<div className="flex items-center space-x-2">
													<MapPin className="w-4 h-4 text-pink-400" />
													<span className="text-pink-300 text-sm">{event.location}</span>
												</div>

												{/* Overlay */}
												<div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-2xl pointer-events-none" />
											</div>
										</motion.div>
									))}
								</motion.div>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}