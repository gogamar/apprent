export default function DestinationsPlaceholder() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-4xl mx-4 p-6 bg-white shadow-lg rounded-lg">
        {/* Title Placeholder */}
        <div className="h-8 w-1/3 mb-6">Placeholder for destinations</div>

        {/* Quiz Question Placeholder */}
        <div className="h-6 w-2/3 bg-gray-300 rounded mb-4"></div>

        {/* Options Placeholder */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-5 w-5 bg-gray-300 rounded-full"></div>
            <div className="h-5 w-3/4 bg-gray-300 rounded"></div>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-5 w-5 bg-gray-300 rounded-full"></div>
            <div className="h-5 w-3/4 bg-gray-300 rounded"></div>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-5 w-5 bg-gray-300 rounded-full"></div>
            <div className="h-5 w-3/4 bg-gray-300 rounded"></div>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-5 w-5 bg-gray-300 rounded-full"></div>
            <div className="h-5 w-3/4 bg-gray-300 rounded"></div>
          </div>
        </div>

        {/* Button Placeholder */}
        <div className="mt-8">
          <div className="h-10 w-1/4 bg-gray-300 rounded"></div>
        </div>
      </div>
    </div>
  );
}
