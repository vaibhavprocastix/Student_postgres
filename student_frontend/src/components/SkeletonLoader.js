import React from "react";

const SkeletonLoader = () => {
  return (
    <div className="mx-auto w-full max-w-full max-h-full rounded-md border border-blue-100 p-4 mb-2">
      <div className="flex animate-pulse space-x-4">
        <div className="flex-1 space-y-8 py-4">
          <div className="h-2 rounded bg-gray-200"></div>
          <div className="space-y-1">
            <div className="grid grid-cols-3 gap-4"></div>
            <div className="h-2 rounded bg-gray-200"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonLoader;
