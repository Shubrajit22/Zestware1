// MostSelling.tsx

import Link from 'next/link';
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  imageUrl: string;
  rating: number | null;
  mrpPrice: number | null;
  price: number;
}

interface MostSellingProps {
  products: Product[];
}

export default function MostSelling({ products }: MostSellingProps) {
  return (
    <div className="bg-white pb-20 pt-4 px-4 sm:px-8">
      <h2 className="text-2xl font-semibold text-center text-slate-900 mb-10">
        Our Most Selling Products
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.length > 0 ? (
          products.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.id}`}
              aria-label={`View ${product.name}`}
              className="group"
              passHref
            >
              <div className="rounded-lg shadow-md hover:shadow-lg flex flex-col items-center cursor-pointer p-4 transition">
                {/* Image */}
                <div className="w-48 h-48 rounded-lg overflow-hidden mb-4">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    width={500}
                    height={500}
                    className="object-cover w-full h-full"
                    priority={false}
                  />
                </div>

                {/* Name */}
                <h3 className="text-base font-semibold text-center mb-1 text-black line-clamp-2">
                  {product.name}
                </h3>

                {/* Rating */}
                <div className="flex flex-row space-x-1 mb-2">
                  {[...Array(5)].map((_, index) => (
                    <span
                      key={index}
                      className={`text-sm ${
                        product.rating && product.rating > index
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }`}
                      aria-hidden="true"
                    >
                      ★
                    </span>
                  ))}
                </div>

                {/* Price */}
                <div className="flex justify-center items-center gap-3">
                  {product.mrpPrice && (
                    <p className="line-through text-gray-400 text-sm">₹{product.mrpPrice}</p>
                  )}
                  <p className="text-lg font-bold text-black">₹{product.price}</p>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p className="col-span-full text-center text-base text-black">
            No products available.
          </p>
        )}
      </div>
    </div>
  );
}
