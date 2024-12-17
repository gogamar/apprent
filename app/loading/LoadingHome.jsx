import LoadingPropertyCard from "./LoadingPropertyCard";

export default function LoadingHome() {
  return (
    <div className="flex min-h-screen">
      {/* Left Sidebar */}
      <div className="w-1/4 bg-gray-100 border-r border-gray-200 p-4 hidden lg:block">
        <div className="flex flex-col gap-4 p-4 sm:text-sm lg:sticky lg:top-20 max-w-full">
          {/* Skeletons for Select */}
          <div className="h-4 w-full bg-gray-300 rounded-md animate-pulse"></div>
          <div className="h-4 w-full bg-gray-300 rounded-md animate-pulse"></div>

          {/* Radio Buttons Skeleton */}
          <div className="h-5 w-1/4 bg-gray-300 rounded animate-pulse"></div>
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex items-center gap-1">
              {/* Circle Placeholder for Radio Button */}
              <div className="h-4 w-4 bg-gray-300 rounded-full animate-pulse"></div>
              {/* Text Placeholder */}
              <div className="h-4 w-1/2 bg-gray-300 rounded animate-pulse"></div>
            </div>
          ))}

          {/* Checkboxes Skeleton */}
          <div className="h-5 w-1/4 bg-gray-300 rounded animate-pulse"></div>
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex items-center gap-1">
              {/* Square Placeholder for Checkbox */}
              <div className="h-4 w-4 bg-gray-300 rounded animate-pulse"></div>
              {/* Text Placeholder */}
              <div className="h-4 flex-1 bg-gray-300 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Section */}
      <main className="flex-1 p-6">
        <div className="flex-1">
          {/* Adjusted Button Alignment */}
          <div className="flex justify-end mr-4">
            <div className="h-10 w-28 bg-gray-300 rounded-md animate-pulse"></div>
          </div>
          {/* Property Cards Skeleton */}
          <div className="grid grid-cols-1 gap-6 py-6">
            {Array.from({ length: 9 }).map((_, index) => (
              <LoadingPropertyCard key={index} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
