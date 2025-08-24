import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Image Placeholder */}
      <div className="w-full h-48 bg-gray-300 animate-pulse"></div>
      <div className="p-4">
        {/* Title Placeholder */}
        <div className="h-6 bg-gray-300 rounded w-3/4 mb-2 animate-pulse"></div>
        {/* Price Placeholder */}
        <div className="h-4 bg-gray-300 rounded w-1/2 animate-pulse"></div>
        {/* Button Placeholder */}
        <div className="mt-4 h-10 bg-gray-300 rounded-lg w-full animate-pulse"></div>
      </div>
    </div>
  );
};

export default SkeletonCard;