import LoadingPropertyCard from "./LoadingPropertyCard";

export default function LoadingHome() {
  return (
    <div className="flex gap-6 px-6">
      {/* Filters Skeleton */}
      <aside className="hidden lg:block w-64">
        <div className="lg:sticky lg:top-32 flex flex-col gap-6 p-4 sm:text-sm max-w-full">
          <div className="space-y-4">
            {/* Filter Titles */}
            <div className="h-6 bg-gray-300 rounded animate-pulse"></div>
            <div className="h-6 bg-gray-300 rounded animate-pulse"></div>

            {/* Checkboxes */}
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="h-4 w-4 bg-gray-300 rounded animate-pulse"></div>
                <div className="h-4 flex-1 bg-gray-300 rounded animate-pulse"></div>
              </div>
            ))}

            {/* Button */}
            <div className="h-10 w-full bg-gray-300 rounded-md animate-pulse"></div>
          </div>
        </div>
      </aside>

      {/* Property Cards Skeleton */}
      <div className="flex-1">
        <div className="flex justify-end">
          <div className="h-10 w-28 bg-gray-300 rounded-md animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 gap-6 py-6">
          {Array.from({ length: 9 }).map((_, index) => (
            <LoadingPropertyCard key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
