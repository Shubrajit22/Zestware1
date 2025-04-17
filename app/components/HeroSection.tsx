// components/HeroSection.tsx
import React from "react";

const HeroSection = () => {
  return (
    <div className="w-full max-w-2xl space-y-6 px-4 sm:px-6 md:px-0 text-center md:text-left mx-auto">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
        Discover <br /> Your Perfect Fit
      </h1>
      <p className="text-gray-300 text-base sm:text-lg">
        Find the best, reliable, and high quality uniforms here. We focus on
        product quality. Here you can find uniforms of almost all schools. So
        why you are waiting? Just order now!
      </p>

      {/* Search Bar */}
      <div className="w-full">
        <div className="flex items-center bg-white rounded-full p-1 shadow-md h-12 overflow-hidden">
          <input
            type="text"
            placeholder="Search for Uniforms and More"
            className="flex-grow min-w-0 px-4 text-black rounded-full outline-none"
          />
          <button className="flex-shrink-0 bg-black text-white px-5 py-2 rounded-full hover:bg-gray-800">
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
