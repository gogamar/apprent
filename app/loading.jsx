export default function Loading() {
  return (
    <main className="p-6 bg-gray-100 min-h-screen">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Skeleton Cards */}
        {Array(6)
          .fill(null)
          .map((_, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-lg p-4 animate-pulse"
            >
              {/* Skeleton for Image */}
              <div className="h-40 bg-gray-300 rounded-md mb-4"></div>
              {/* Skeleton for Title */}
              <div className="h-6 bg-gray-300 rounded-md w-3/4 mb-2"></div>
              {/* Skeleton for Subtitle */}
              <div className="h-4 bg-gray-300 rounded-md w-1/2 mb-4"></div>
              {/* Skeleton for Button */}
              <div className="h-10 bg-gray-300 rounded-md w-full"></div>
            </div>
          ))}
      </div>
    </main>
  );
}
