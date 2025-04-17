// components/ImageGallery.tsx
import Image from "next/image";
import React from "react";

const ImageGallery = () => {
  return (
    <div className="grid grid-cols-2 gap-4 items-center">
      <div className="col-span-2">
        <Image
          src="/home/i1.png"
          alt="Main Uniform"
          width={500}
          height={300}
          className="rounded-xl object-cover w-full"
        />
      </div>
      <Image
        src="/home/i2.png"
        alt="Uniform Kids"
        width={240}
        height={160}
        className="rounded-xl object-cover"
      />
      <Image
        src="/home/i3.png"
        alt="Staff Uniform"
        width={240}
        height={160}
        className="rounded-xl object-cover"
      />
    </div>
  );
};

export default ImageGallery;
