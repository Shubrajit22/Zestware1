// MostSelling.tsx

import Link from 'next/link';
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  imageUrl: string;
  rating: number;
  mrpPrice: number | null;
  price: number;
}

interface MostSellingProps {
  products: Product[];
}

export default function MostSelling({ products }: MostSellingProps) {
  return (
    <div className=" bg-white pb-20 pt-4 p-20">
      <h2 className="text-2xl font-semibold text-center text-slate-900">
      Our Most Selling Products
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pt-10">
        {products.length > 0 ? (
          products.map((product) => (
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
                <h3 className="text-lg font-semibold text-center mb-1 text-black">{product.name}</h3>

                {/* Rating */}
                <div className="flex justify-center mb-2">
                  {[...Array(5)].map((_, index) => (
                    <span
                      key={index}
                      className={`text-yellow-500 ${product.rating > index ? 'text-yellow-400' : 'text-gray-300'}`}
                    >
                      ★
                    </span>
                  ))}
                </div>

                {/* MRP and Price in the same line */}
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
          <p className="text-center text-xl text-black">No products available.</p>
        )}
      </div>
    </div>
  );
}
