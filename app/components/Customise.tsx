'use client'
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles } from 'lucide-react'; // You can change this to any icon

const CustomizeCard = () => {
  return (
    <section className="w-full h-[80vh]  border-t border-black flex flex-col md:flex-row items-center justify-between px-6 md:px-16 py-10 md:py-20">
      {/* Left content */}
      <div className="text-center md:text-left max-w-xl">
        <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
          <Sparkles className="text-white w-6 h-6" />
          <h2 className="text-3xl md:text-4xl font-bold text-white">Customize Your Product</h2>
        </div>
        <p className="text-gray-300 text-base md:text-lg mb-6">
          Personalize your order with your own colors, text, and design. Stand out with your own unique creation.
        </p>
        <Link href="/Customise">
          <button className="bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-gray-900 transition">
            Start Customizing
          </button>
        </Link>
      </div>

      {/* Right illustration */}
      <div className="hidden md:block">
        <Image
          src="/customize-illustration.png" // ✅ Replace with your own image path
          alt="Customize illustration"
          width={400}
          height={400}
          className="object-contain"
        />
      </div>
    </section>
  );
};

export default CustomizeCard;
