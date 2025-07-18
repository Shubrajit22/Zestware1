'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Category = {
  id: string;
  name: string;
};

type SizeOption = {
  size: string;
  price: string;
};

export default function AddProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<Record<string, string>>({
  name: '',
  description: '',
  price: '',
  mrpPrice: '',
  discount: '',
  imageUrl: '',
  categoryId: '',
  type: '',
  state: '',
  district: '',
  institution: '',
  color: '',
  texture: '',
  neckline: '',
});

  const [sizeOptions, setSizeOptions] = useState<SizeOption[]>([]);
  const [stockImages, setStockImages] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/admin/categories');
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        setError('Failed to load categories');
        console.log(err)
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSizeChange = (index: number, key: keyof SizeOption, value: string) => {
    const updated = [...sizeOptions];
    updated[index][key] = value;
    setSizeOptions(updated);
  };

  const addSizeOption = () => setSizeOptions([...sizeOptions, { size: '', price: '' }]);
  const removeSizeOption = (i: number) =>
    setSizeOptions(sizeOptions.filter((_, index) => index !== i));

  const addStockImage = () => setStockImages([...stockImages, '']);
  const updateStockImage = (index: number, value: string) => {
    const updated = [...stockImages];
    updated[index] = value;
    setStockImages(updated);
  };
  const removeStockImage = (i: number) =>
    setStockImages(stockImages.filter((_, index) => index !== i));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          price: parseFloat(form.price),
          mrpPrice: parseFloat(form.mrpPrice),
          discount: parseFloat(form.discount),
          sizeOptions: sizeOptions.map((s) => ({
            size: s.size,
            price: parseFloat(s.price),
          })),
          stockImages,
        }),
      });

      if (!res.ok) throw new Error('Failed to add product');
      setSuccess('Product added successfully');
      router.push('/admin/products');
    } catch (err) {
      setError('Could not submit product');
      console.error(err);
    }
  };

  return (
    <div className="p-6 bg-white text-black max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add Product</h1>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      {success && <p className="text-green-600 mb-2">{success}</p>}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        {/* Basic Fields */}
        {['name', 'description', 'price', 'mrpPrice', 'discount', 'imageUrl', 'state', 'district', 'institution', 'color', 'texture', 'neckline'].map((field) => (
          <input
            key={field}
            name={field}
            value={form[field]}

            onChange={handleChange}
            placeholder={field}
            required={['name', 'price', 'mrpPrice', 'discount'].includes(field)}
            className="p-2 border rounded"
          />
        ))}

        {/* Category */}
        <select name="categoryId" value={form.categoryId} onChange={handleChange} required className="p-2 border rounded">
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>

        {/* Product Type */}
        <select name="type" value={form.type} onChange={handleChange} required className="p-2 border rounded">
          <option value="">Select Type</option>
          {['HOODIE', 'TSHIRT', 'UNIFORM', 'JERSEY', 'SPORTS', 'CASUAL', 'FORMAL'].map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>

        {/* Stock Images */}
        <div>
          <p className="font-semibold">Stock Images:</p>
          {stockImages.map((img, index) => (
            <div key={index} className="flex gap-2 my-1">
              <input
                value={img}
                onChange={(e) => updateStockImage(index, e.target.value)}
                placeholder="Image URL"
                className="p-2 border rounded flex-1"
              />
              <button type="button" onClick={() => removeStockImage(index)} className="text-red-500">✕</button>
            </div>
          ))}
          <button type="button" onClick={addStockImage} className="mt-2 px-2 py-1 bg-blue-500 text-white rounded">+ Add Image</button>
        </div>

        {/* Size Options */}
        <div>
          <p className="font-semibold">Size Options:</p>
          {sizeOptions.map((option, index) => (
            <div key={index} className="flex gap-2 my-1">
              <input
                value={option.size}
                onChange={(e) => handleSizeChange(index, 'size', e.target.value)}
                placeholder="Size"
                className="p-2 border rounded"
              />
              <input
                value={option.price}
                onChange={(e) => handleSizeChange(index, 'price', e.target.value)}
                placeholder="Price"
                className="p-2 border rounded"
              />
              <button type="button" onClick={() => removeSizeOption(index)} className="text-red-500">✕</button>
            </div>
          ))}
          <button type="button" onClick={addSizeOption} className="mt-2 px-2 py-1 bg-blue-500 text-white rounded">+ Add Size</button>
        </div>

        <button type="submit" className="mt-4 p-2 bg-green-600 text-white rounded hover:bg-green-700">Submit Product</button>
      </form>
    </div>
  );
}
