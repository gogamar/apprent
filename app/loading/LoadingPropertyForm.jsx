export default function LoadingPropertyForm() {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <div className="grid grid-cols-1 gap-6 animate-pulse">
        {/* Error Placeholder */}
        <div className="h-8 bg-gray-300 rounded-md"></div>

        {/* Title Input Skeleton */}
        <div className="h-6 w-1/4 bg-gray-300 rounded-md"></div>
        <div className="h-10 w-full bg-gray-300 rounded-md"></div>

        {/* Two-Column Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="h-6 w-1/3 bg-gray-300 rounded-md"></div>
          <div className="h-6 w-1/3 bg-gray-300 rounded-md"></div>
          <div className="h-10 w-full bg-gray-300 rounded-md"></div>
          <div className="h-10 w-full bg-gray-300 rounded-md"></div>
        </div>

        {/* Image Upload Section */}
        <div className="flex flex-col lg:flex-row space-y-6 lg:space-x-6">
          {/* Left Column: Image */}
          <div className="w-full h-64 bg-gray-300 rounded-md"></div>
          {/* Right Column: Options */}
          <div className="space-y-4">
            <div className="h-6 w-1/3 bg-gray-300 rounded-md"></div>
            <div className="h-6 w-2/3 bg-gray-300 rounded-md"></div>
          </div>
        </div>

        {/* Property Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index}>
              <div className="h-6 w-1/2 bg-gray-300 rounded-md"></div>
              <div className="h-10 w-full bg-gray-300 rounded-md mt-1"></div>
            </div>
          ))}
        </div>

        {/* Address Section */}
        <div>
          <div className="h-6 w-1/4 bg-gray-300 rounded-md"></div>
          <div className="h-10 w-full bg-gray-300 rounded-md mt-1"></div>
          <div className="h-8 w-32 bg-gray-300 rounded-md mt-2"></div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <div className="h-10 w-28 bg-gray-300 rounded-md"></div>
        </div>
      </div>
    </div>
  );
}
