'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const testimonials = [
  {
    name: 'Himadri Das',
    text: 'This is the best place to get premium quality school uniforms.',
    image: '/images/user4.jpg',
    rating: 5,
  },
  {
    name: 'Tanmay Biswas',
    text: 'Fast delivery and good quality products. Highly recommended for everyone.',
    image: '/images/user1.jpg',
    rating: 4,
  },
  {
    name: 'Rupomi Dutta',
    text: 'The uniforms fit perfectly and the fabric quality is excellent. Thank you Zestwear!',
    image: '/images/user5.jpg',
    rating: 5,
  },
  {
    name: 'Pritam Baruah',
    text: 'Amazing designs and affordable prices. Will definitely order again.',
    image: '/images/user3.png',
    rating: 4,
  },
  {
    name: 'Soumya Chakraborty',
    text: 'Great customer service and reliable delivery. Loved the experience!',
    image: '/images/user2.png',
    rating: 5,
  },
  {
    name: 'Aditi Sharma',
    text: 'Uniforms are durable and look very neat. Perfect for our school.',
    image: '/images/user6.jpg',
    rating: 5,
  },
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 2) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-center py-12 overflow-hidden">
      <p className="text-slate-100 font-bold text-4xl mb-10">
        Here are some of our happiest clients
      </p>
      <div className="relative flex justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row items-center justify-center gap-8"
          >
            {testimonials.slice(currentIndex, currentIndex + 2).map((t, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-md p-4 w-[320px] md:w-[400px] text-left"
              >
                <div className="flex gap-4 items-center">
                  <Image
                    src={t.image}
                    alt={t.name}
                    width={70}
                    height={70}
                    className="w-[70px] h-[70px] rounded-full object-cover"
                  />

                  <div>
                    <h4 className="font-bold text-gray-800">{t.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{t.text}</p>
                    <div className="text-yellow-500 mt-2">
                      {'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Testimonials;
