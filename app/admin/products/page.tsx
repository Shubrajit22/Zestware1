'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

type Product = {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  type?: string;
  category?: {
    id: string;
    name: string;
  };
};

type Category = {
  id: string;
  name: string;
};

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [error, setError] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const fetchProductsAndCategories = async () => {
      setLoading(true);
      setError('');
      try {
        // Fetching products
        const res = await fetch('/api/admin/products');
        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();
        setProducts(data);

        // Fetching categories from the API you defined
        const categoriesRes = await fetch('/api/admin/categories');
        if (!categoriesRes.ok) throw new Error('Failed to fetch categories');
        const categoriesData = await categoriesRes.json();
        setCategories(categoriesData);
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error('Error:', err.message);
          setError(err.message || 'An error occurred');
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProductsAndCategories();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const res = await fetch('/api/admin/products', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) throw new Error('Delete failed');

      setProducts((prev) => prev.filter((product) => product.id !== id));
    } catch (err) {
      console.error('Delete error:', err);
      setError('Failed to delete product');
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value || null); // Handle null value for "All Categories"
  };

  // Filter products if a category is selected
  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category?.id === selectedCategory)
    : products;

  if (loading) return <p className="text-center">Loading products and categories...</p>;

  return (
    <div className="p-4 bg-white text-black">
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Manage Products</h1>
        <button
          onClick={() => router.push('/admin/products/add')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Product
        </button>
      </div>

      <div className="mb-4">
        <label htmlFor="category" className="mr-2">Filter by Category:</label>
        <select
          id="category"
          value={selectedCategory || ''}
          onChange={handleCategoryChange}
          className="border rounded p-2"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name} {/* Only display the category name */}
            </option>
          ))}
        </select>
      </div>

      {filteredProducts.length === 0 ? (
        <p>No products found in this category.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="border rounded p-4 flex gap-4 items-center"
            >
              {product.imageUrl && (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  width={96} // Set the width you need
                  height={96} // Set the height you need
                  className="object-cover rounded"
                />
              )}
              <div className="flex-1">
                <h2 className="text-lg font-semibold">{product.name}</h2>
                <p className="text-sm text-gray-600">
                  ₹{product.price} • {product.type}
                </p>
                {product.category?.name && (
                  <p className="text-xs text-gray-500">Category: {product.category.name}</p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => router.push(`/admin/products/edit/${product.id}`)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
