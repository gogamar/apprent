import LoadingPropertyCard from "./LoadingPropertyCard";

export default function LoadingIndex() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 animate-pulse">
      {/* Header */}
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <div className="h-6 bg-gray-300 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-2/3"></div>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <div className="h-10 bg-gray-300 rounded w-32"></div>
        </div>
      </div>

      {/* Skeleton Cards */}
      <div className="mt-8 space-y-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <LoadingPropertyCard key={index} />
        ))}
      </div>
    </div>
  );
}
