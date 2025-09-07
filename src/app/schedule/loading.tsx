export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500 mx-auto mb-8"></div>
        <h2 className="text-2xl font-bold text-white mb-2">Loading Schedule</h2>
        <p className="text-gray-400">Preparing your festival experience...</p>
      </div>
    </div>
  );
}
