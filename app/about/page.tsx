// app/about/page.tsx or pages/about.tsx (depending on your setup)

import Image from 'next/image';

export default function About() {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen px-6 py-10 bg-white gap-40">
      {/* Left Text Section */}
      <div className="max-w-2xl p-6">
        <h1 className="text-4xl font-bold  pb-2 mb-4 text-slate-900">About</h1>
        <p className="text-gray-700 leading-relaxed pt-4">
          Zestwear is Assam’s first revolutionary online uniform startup, dedicated to transforming how to shop for uniforms, customized t-shirts, jerseys, and sports items. With our seamless online platform, you can book and customize your products effortlessly, ensuring quick and reliable home delivery. Our commitment to innovation and excellence drives us to provide top-quality services and products, promising to contribute to building a new India with our innovative spirit and outstanding performance. Experience convenience, quality, and style all in one place with Zestwear!
        </p>
      </div>

      {/* Right Image Section */}
      <div className="flex-shrink-0">
        <Image
          src="/home/logo1.jpeg" // Replace with your actual logo path
          alt="Zestwear Logo"
          width={600}
          height={600}
          className="object-contain"
        />
      </div>
    </div>
  );
}
