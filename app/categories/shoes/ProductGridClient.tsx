'use client';

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  mrpPrice?: number;
  imageUrl: string;
  type: "SPORTS" | "CASUAL" | "FORMAL";
  rating: number;
};

export default function ProductGridClient({ products }: { products: Product[] }) {
  const [selectedType, setSelectedType] = useState<"SPORTS" | "CASUAL" | "FORMAL" | null>(null);

  const filteredProducts = selectedType
    ? products.filter((product) => product.type === selectedType)
    : products;

  const handleSelection = (type: "SPORTS" | "CASUAL" | "FORMAL") => {
    setSelectedType((prev) => (prev === type ? null : type));
  };

  return (
    <>
      {/* Type selection buttons */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {["SPORTS", "CASUAL", "FORMAL"].map((type) => (
          <div
            key={type}
            className={`cursor-pointer border p-4 rounded-lg shadow-xl text-center ${
              selectedType === type ? "bg-black text-white" : "bg-white text-black"
            }`}
            onClick={() => handleSelection(type as "SPORTS" | "CASUAL" | "FORMAL")}
          >
            <h2 className="text-xl font-semibold">{type.charAt(0) + type.slice(1).toLowerCase()} Shoes</h2>
            <p className="text-sm">Explore {type.toLowerCase()} collection</p>
          </div>
        ))}
      </div>

      {/* Display products */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-center mb-4 text-slate-900">
          {selectedType ? `${selectedType.charAt(0) + selectedType.slice(1).toLowerCase()} Shoes` : "Top Selling Shoes"}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <Link key={product.id} href={`/product/${product.id}`} passHref>
                <div className="rounded-lg shadow-md hover:shadow-lg flex flex-col items-center cursor-pointer">
                  {/* Image */}
                  <div className="w-48 h-48 rounded-lg overflow-hidden mb-4">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      width={500}
                      height={500}
                      className="object-cover w-full h-full"
                    />
                  </div>

                  {/* Name */}
                  <h3 className="text-lg font-semibold text-center mb-1">{product.name}</h3>

                  {/* Rating */}
                  <div className="flex justify-center mb-2">
                    {[...Array(5)].map((_, index) => (
                      <span
                        key={index}
                        className={`text-yellow-500 ${product.rating > index ? "text-yellow-400" : "text-gray-300"}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>

                  {/* Price Info */}
                  <div className="flex justify-center items-center gap-4">
                    {product.mrpPrice && (
                      <p className="line-through text-gray-400 text-sm">₹{product.mrpPrice}</p>
                    )}
                    <p className="text-xl font-bold text-black">₹{product.price}</p>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full flex justify-center items-center min-h-[200px]">
  <p className="text-center text-xl text-black">No shoes found in this category.</p>
</div>

          )}
        </div>
      </div>
    </>
  );
}
