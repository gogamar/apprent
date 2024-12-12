"use client";

export default function LoadingMap() {
  return (
    <div className="flex h-screen">
      <div className="w-1/4 bg-gray-200 p-4 hidden lg:block">
        <div className="space-y-4">
          <div className="h-6 w-3/4 bg-gray-300 rounded animate-pulse"></div>

          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="flex items-center space-x-4 animate-pulse"
            >
              <div className="h-5 w-5 bg-gray-300 rounded"></div>
              <div className="h-4 w-1/2 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 bg-gray-300 relative animate-pulse">
        <div className="absolute top-4 right-4 space-y-2">
          <div className="h-8 w-8 bg-gray-400 rounded-full animate-pulse"></div>
          <div className="h-8 w-8 bg-gray-400 rounded-full animate-pulse"></div>
        </div>

        {[...Array(8)].map((_, index) => (
          <div
            key={index}
            className={`absolute w-5 h-5 bg-gray-400 rounded-full animate-pulse`}
            style={{
              top: `${Math.random() * 80 + 10}%`,
              left: `${Math.random() * 80 + 10}%`,
            }}
          ></div>
        ))}
      </div>
    </div>
  );
}
