'use client'
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link'; // ✅ Add this

type Category = {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
};

export const CategoryGrid = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/products/categories');
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="p-4 text-center">
        <p>Loading categories...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
      {categories.map((cat) => {
        const categorySlug = cat.name.toLowerCase(); // Converts 'Uniform' → 'uniform'
        return (
          <Link key={cat.id} href={`/categories/${categorySlug}`}>
            <div className="cursor-pointer bg-white rounded-xl shadow hover:shadow-lg transition duration-300 overflow-hidden">
              <div className="flex items-center p-4">
                <Image
                  src={cat.imageUrl}
                  alt={cat.name}
                  width={100}
                  height={100}
                  className="w-1/3 h-36 object-cover rounded-md"
                />
                <div className="ml-4">
                  <h2 className="text-xl font-semibold capitalize">{cat.name}</h2>
                  <p className="mt-2 text-sm text-gray-900">{cat.description}</p>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};
