'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

type SizeOption = {
  id?: string;
  size: string;
  price: number;
};

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  mrpPrice: number;
  discount: number;
  imageUrl: string;
  type: string;
  categoryId: string;
  state?: string;
  district?: string;
  institution?: string;
  color?: string;
  texture?: string;
  neckline?: string;
  sizeOptions: SizeOption[];
  stockImages: { id?: string; imageUrl: string }[];
};

type Category = {
  id: string;
  name: string;
};

export default function EditProductPage() {
  const router = useRouter();
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

useEffect(() => {
  async function fetchData() {
    try {
      if (!id || typeof id !== 'string') return;

      const productRes = await fetch(`/api/admin/products/${id}`);
      if (!productRes.ok) throw new Error('Product not found');
      const productData = await productRes.json();
      setProduct(productData);

      const catRes = await fetch(`/api/admin/categories`);
      const categoryData = await catRes.json();
      setCategories(categoryData);
    } catch (e) {
      console.error(e);
      setError('Failed to load product');
    } finally {
      setLoading(false);
    }
  }

  fetchData();
}, [id]);


  const handleInput = (key: keyof Product, value: any) => {
    if (!product) return;
    setProduct({ ...product, [key]: value });
  };

const handleSizeChange = (
  index: number,
  field: keyof SizeOption,
  value: string | number
) => {
  if (!product) return;
  const updatedSizes = [...product.sizeOptions];

  updatedSizes[index] = {
    ...updatedSizes[index],
    [field]: value,
  };

  setProduct({ ...product, sizeOptions: updatedSizes });
};


  const handleImageChange = (index: number, value: string) => {
    if (!product) return;
    const updatedImages = [...product.stockImages];
    updatedImages[index].imageUrl = value;
    setProduct({ ...product, stockImages: updatedImages });
  };

  const handleSubmit = async () => {
    if (!product) return;

    try {
      const res = await fetch('/api/admin/products', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      });

      if (!res.ok) throw new Error('Update failed');
      alert('Product updated');
      router.push('/admin/products');
    } catch (err) {
      console.error(err);
      alert('Error updating product');
    }
  };

  if (loading) return <p className="text-center">Loading product...</p>;
  if (error || !product) return <p className="text-red-500">{error || 'Product not found'}</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto text-black">
      <h1 className="text-2xl font-bold mb-4">Edit Product</h1>

      <div className="space-y-4">
        {[
          ['Name', 'name'],
          ['Description', 'description'],
          ['Price', 'price'],
          ['MRP Price', 'mrpPrice'],
          ['Discount', 'discount'],
          ['Image URL', 'imageUrl'],
          ['Type', 'type'],
          ['State', 'state'],
          ['District', 'district'],
          ['Institution', 'institution'],
          ['Color', 'color'],
          ['Texture', 'texture'],
          ['Neckline', 'neckline'],
        ].map(([label, key]) => (
          <div key={key}>
            <label className="block font-semibold">{label}</label>
            <input
              className="w-full border p-2 rounded"
              value={(product as any)[key]}
              onChange={(e) => handleInput(key as keyof Product, e.target.value)}
            />
          </div>
        ))}

        <div>
          <label className="block font-semibold">Category</label>
          <select
            className="w-full border p-2 rounded"
            value={product.categoryId}
            onChange={(e) => handleInput('categoryId', e.target.value)}
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <h2 className="font-semibold">Size Options</h2>
          {product.sizeOptions.map((s, index) => (
            <div key={index} className="flex gap-2 my-2">
              <input
                placeholder="Size"
                value={s.size}
                onChange={(e) => handleSizeChange(index, 'size', e.target.value)}
                className="border p-2 rounded w-1/2"
              />
              <input
                placeholder="Price"
                type="number"
                value={s.price}
                onChange={(e) => handleSizeChange(index, 'price', parseFloat(e.target.value))}
                className="border p-2 rounded w-1/2"
              />
            </div>
          ))}
        </div>

        <div>
          <h2 className="font-semibold">Stock Images</h2>
          {product.stockImages.map((img, index) => (
            <input
              key={index}
              placeholder="Image URL"
              value={img.imageUrl}
              onChange={(e) => handleImageChange(index, e.target.value)}
              className="border p-2 rounded w-full mb-2"
            />
          ))}
        </div>

        <button
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          onClick={handleSubmit}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
