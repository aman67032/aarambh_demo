"use client";

type EventItem = {
  title: string;
  image: string;
  description?: string;
  date?: string;
  prize?: string;
  registration?: string;
  video?: string;
};

const nonFlagshipEvents: EventItem[] = [
  {
    title: "Tech Quiz",
    image: "/events/techquiz.jpg",
    description: "Test your knowledge in technology and science.",
    date: "March 16, 2025",
    prize: "₹50,000",
    registration: "Team of 2",
    video: "/video/2018959-hd_1920_1080_30fps.mp4",
  },
  {
    title: "Case Study",
    image: "/events/casestudy.jpg",
    description: "Analyze and solve real business case studies.",
    date: "March 16, 2025",
    prize: "₹45,000",
    registration: "Team of 2-3",
    video: "/video/854569-hd_1920_1080_25fps.mp4",
  },
  {
    title: "Group Dance",
    image: "/events/groupdance.jpg",
    description: "Synchronized group dance performance.",
    date: "March 22, 2025",
    prize: "₹20,000",
    registration: "Team of 6-12",
    video: "/video/854569-hd_1920_1080_25fps.mp4",
  },
];

export default function NonFlagshipEventsPage() {
  return (
    <div className="min-h-screen text-white px-4 py-10 md:px-8 lg:px-16">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">Events</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {nonFlagshipEvents.map((event) => (
          <div key={event.title} className="flex flex-col gap-4">
            <div className="flex justify-center">
              <img
                src={event.image}
                alt={event.title}
                className="rounded-2xl shadow-2xl border border-white/10 w-full h-auto max-w-sm"
              />
            </div>
            <div className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-black/30">
              <video
                src={event.video}
                controls
                className="w-full h-full max-h-[280px] object-cover"
                poster={event.image}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


