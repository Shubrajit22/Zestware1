'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import SearchBarWithResults from './search';
import dynamic from 'next/dynamic';

// Dynamically import the 3D viewer to avoid SSR issues
const Uniform3D = dynamic(() => import('./ImageGallery'), {
  ssr: false,
});

const supportsWebGL = (): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    return !!(
      typeof WebGLRenderingContext !== 'undefined' &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
};


const HeroSection = () => {
  const [hasMounted, setHasMounted] = useState(false);
  const [webglOk, setWebglOk] = useState(true);

  useEffect(() => {
    setHasMounted(true);
    setWebglOk(supportsWebGL());
  }, []);

  return (
    <section
      className="relative w-full text-white overflow-hidden pt-[88px] py-10"
      style={{ minHeight: 'calc(100vh - 88px)' }}
    >
      <div className="max-w-[90%] md:max-w-[80%] mx-auto grid grid-cols-1 md:grid-cols-2 items-start gap-12 md:gap-20 px-4 md:px-12 relative z-0">
        {/* LEFT SIDE */}
        <div className="space-y-6 text-center md:text-left">
          <motion.h1
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-snug sm:leading-tight"
          >
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Discover Your Perfect Fit
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-gray-300 text-base sm:text-lg md:text-xl max-w-lg mx-auto md:mx-0"
          >
            Find the best, reliable, and high quality uniforms here. We focus on
            product quality. Uniforms for almost all schools—so why wait?&nbsp;Order
            now!
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="max-w-md mx-auto md:mx-0"
          >
            <SearchBarWithResults />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <button
              className="px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg rounded-full bg-white text-black hover:bg-yellow-300 transition font-semibold shadow-lg"
              onClick={() => {
                document
                  .getElementById('product-categories')
                  ?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Shop Now
            </button>
          </motion.div>
        </div>

        {/* RIGHT SIDE - GLB model only */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: hasMounted ? 1 : 0, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative flex justify-center md:justify-end"
        >
          <div className="w-[260px] sm:w-[320px] md:w-[400px] lg:w-[480px]">
            {hasMounted && webglOk ? (
              <Uniform3D />
            ) : hasMounted && !webglOk ? (
              <div className="rounded-lg bg-gray-900/80 p-6 flex items-center justify-center h-[400px]">
                <p className="text-center text-sm sm:text-base text-gray-300">
                  3D view not supported on this device. Please use a modern browser
                  with WebGL enabled.
                </p>
              </div>
            ) : (
              <div className="rounded-lg bg-gray-800 animate-pulse h-[400px]" />
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
