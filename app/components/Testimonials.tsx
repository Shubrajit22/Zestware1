// components/Testimonials.tsx
'use client';

import Image from 'next/image';
import { useState } from 'react';

const testimonials = [
  {
    name: 'Hamza Faizi',
    text: 'Don’t waste time, just order! This is the best website to purchase school uniforms.',
    image: '/hamza.jpg', // Replace with actual image paths
    rating: 4,
  },
  {
    name: 'Hafiz Huzaifa',
    text: 'I’ve been purchasing uniforms of Zestwear India for a long time. All the products are good quality.',
    image: '/hafiz.jpg',
    rating: 5,
  },
  // Add more testimonials if needed
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div className="text-center py-12">
      <p className="text-blue-600 font-medium underline">
        Here are some of the best clients.
      </p>
      <h2 className="text-2xl font-bold mt-2 mb-8">What People Say About Us</h2>

      <div className="flex flex-col items-center md:flex-row justify-center gap-8 transition-all">
        {testimonials.slice(currentIndex, currentIndex + 2).map((t, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-md p-4 w-[320px] md:w-[400px] text-left"
          >
            <div className="flex gap-4 items-center">
              <Image
                src={t.image}
                alt={t.name}
                width={80}
                height={80}
                className="rounded-lg object-cover"
              />
              <div>
                <h4 className="font-bold">{t.name}</h4>
                <p className="text-sm text-gray-600 mt-1">{t.text}</p>
                <div className="text-yellow-500 mt-2">
                  {'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination dots */}
      <div className="flex justify-center mt-6 gap-3">
        {testimonials.map((_, idx) => (
          <span
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-3 h-3 rounded-full cursor-pointer ${
              currentIndex === idx ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
