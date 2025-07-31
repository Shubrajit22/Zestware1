"use client";

import React from "react";
import { motion } from "framer-motion";
import SearchBarWithResults from "./search";
import Uniform3D from "./ImageGallery";

const HeroSection = () => {
  return (
    <section className="relative w-full text-white overflow-hidden py-10">
      <div className="max-w-[90%] md:max-w-[80%] mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-12 md:gap-20 px-4 md:px-12 relative z-10">
        
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
            Find the best, reliable, and high quality uniforms here.
            We focus on product quality. Uniforms for almost all schools—
            so why wait? Order now!
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
                document.getElementById('product-categories')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Shop Now
            </button>
          </motion.div>
        </div>

        {/* RIGHT SIDE */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative flex justify-center md:justify-end"
        >
          <div className="w-[260px] sm:w-[320px] md:w-[400px] lg:w-[480px]">
            <Uniform3D />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
