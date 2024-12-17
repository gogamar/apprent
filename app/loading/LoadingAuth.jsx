import React from "react";

export default function LoadingAuth() {
  return (
    <div className="flex min-h-full flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-sm space-y-10">
        {/* Title */}
        <div>
          <div className="h-6 bg-gray-300 rounded-md animate-pulse w-3/4 mx-auto"></div>
        </div>

        {/* Input Skeleton */}
        <div className="space-y-4">
          <div className="h-10 bg-gray-300 rounded-md animate-pulse"></div>
          <div className="h-10 bg-gray-300 rounded-md animate-pulse"></div>
        </div>

        {/* Checkbox and Forgot Password */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-4 w-4 bg-gray-300 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-300 rounded-md animate-pulse w-20 ml-3"></div>
          </div>
          <div className="h-4 bg-gray-300 rounded-md animate-pulse w-24"></div>
        </div>

        {/* Button Skeleton */}
        <div>
          <div className="h-10 bg-gray-300 rounded-md animate-pulse"></div>
        </div>

        {/* Signup Link */}
        <div className="h-4 bg-gray-300 rounded-md animate-pulse w-3/4 mx-auto"></div>
      </div>
    </div>
  );
}
