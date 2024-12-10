export default function LoadingPropertyCard() {
  return (
    <div className="relative isolate flex flex-col gap-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md lg:flex-row animate-pulse">
      {/* Image Section */}
      <div className="relative aspect-video sm:aspect-[2/1] lg:aspect-square lg:w-64 lg:shrink-0">
        <div className="absolute inset-0 bg-gray-300 rounded-lg"></div>
      </div>

      {/* Details Section */}
      <div className="flex flex-1 flex-col justify-between">
        <div>
          {/* Title */}
          <div className="h-6 bg-gray-300 rounded w-1/3 mb-2"></div>
          {/* Highlights */}
          <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-1/4"></div>

          {/* Address */}
          <div className="mt-2 h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>

          {/* Highlights List */}
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-1">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-4 bg-gray-300 rounded col-span-1"></div>
            ))}
          </div>
        </div>
        {/* Actions */}
        <div className="mt-4 h-10 bg-gray-300 rounded w-24"></div>
      </div>
    </div>
  );
}
