'use client';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useCart } from '../../components/CartContextProvider'; // Ensure correct import
import Image from 'next/image';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  price: number;
  stockImages: { imageUrl: string }[]; 
  imageUrl: string;
  sizeOptions: { size: string; price: number }[]; 
  category: string;
  mrpPrice?: number;
  description: string;
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  userId: string;
  user: {
    name: string;
    image: string;
  };
}

export default function ProductPageContent({
  product,
  relatedProducts,
  reviews: initialReviews,
}: {
  product: Product;
  relatedProducts: Product[];
  reviews: Review[];
}) {
  const { addToCart } = useCart();
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<Review[]>(initialReviews || []); 
  const [isLoadingReviews, setIsLoadingReviews] = useState<boolean>(false);
  const [errorFetchingReviews, setErrorFetchingReviews] = useState<string>('');
  const [newReview, setNewReview] = useState<string>('');
  const [newRating, setNewRating] = useState<number>(0);
  const fallbackImage = '/images/fallback-image.jpg';

  // Product image handling
  const getValidImage = (src: unknown) => typeof src === 'string' && src.trim() !== '' ? src : fallbackImage;
  const allImages = product.stockImages.length > 0 ? product.stockImages.map((img) => getValidImage(img.imageUrl)) : [getValidImage(product.imageUrl)];

  const [mainImage, setMainImage] = useState<string>(getValidImage(product.imageUrl));
  const [stockImages, setStockImages] = useState<string[]>(allImages.filter((img) => img !== getValidImage(product.imageUrl)));

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const selectedSizeOption = product.sizeOptions?.find((opt) => opt.size === selectedSize);
  const displayedPrice = selectedSizeOption?.price ?? product.price;

  const handleImageChange = (clickedImage: string) => {
    setMainImage(clickedImage);
    setStockImages((prev) => [mainImage, ...prev.filter((img) => img !== clickedImage)]);
  };

  const handleAddToCart = async () => {
    if (!selectedSize) {
      alert('Please select a size!');
      return;
    }

    const productToAdd = { id: product.id, name: product.name, price: displayedPrice, imageUrl: mainImage, quantity: 1, size: selectedSize };

    addToCart(productToAdd);

    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, quantity: 1, size: selectedSize }),
      });
      const data = await res.json();
      if (!res.ok) {
        console.error('Error adding to cart:', data.message);
        alert(data.message || 'Failed to add to cart');
      }
    } catch (error) {
      console.error('Error sending cart data:', error);
      alert('An error occurred while adding the item to the cart');
    }
  };

  const relatedCategoryProducts = relatedProducts.filter(
    (relatedProduct) => relatedProduct.category?.toLowerCase() === product.category?.toLowerCase()
  );

  useEffect(() => {
    if (initialReviews && initialReviews.length > 0) {
      setReviews(initialReviews);
      return;
    }

    const fetchReviews = async () => {
      setIsLoadingReviews(true);
      try {
        const response = await fetch(`/api/products/${product.id}/reviews`);
        const data = await response.json();
        setReviews(data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setErrorFetchingReviews('Failed to fetch reviews.');
      } finally {
        setIsLoadingReviews(false);
      }
    };
    fetchReviews();
  }, [product.id, initialReviews]);

  const handleReviewSubmit = async () => {
    if (!newReview || newRating === 0) {
      alert('Please provide a comment and rating.');
      return;
    }

    if (!session?.user?.id) {
      alert('You must be logged in to leave a review');
      return;
    }

    try {
      const res = await fetch(`/api/products/${product.id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment: newReview, rating: newRating, userId: session.user.id }),
      });
      const data = await res.json();
      if (res.ok) {
        setReviews((prevReviews) => [data, ...prevReviews]); // Add new review to the start of the list
        setNewReview('');
        setNewRating(0);
      } else {
        alert('Error submitting review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('An error occurred while submitting your review');
    }
  };

  return (
    <div className="bg-white-gradient min-h-screen flex flex-col items-center justify-center gap-x-24 pt-16 px-10 pb-10 text-black">
      {/* Product Section */}
      <div className="flex w-full gap-8">
        {/* Left: Image */}
        <div className="w-[60%] flex flex-col items-center gap-4">
          <div className="w-[400px] h-[400px] border-2 border-black p-2 rounded-md flex items-center justify-center">
            <Image src={mainImage || fallbackImage} alt={product.name || 'Product Image'} width={400} height={400} className="rounded object-cover w-full h-full" />
          </div>

          {/* Thumbnails */}
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {stockImages.map((thumb, index) => (
              <button key={index} onClick={() => handleImageChange(thumb)}>
                <div className="w-[80px] h-[80px] border rounded-md overflow-hidden">
                  <Image src={thumb || fallbackImage} alt={`Thumbnail ${index + 1}`} width={80} height={80} className={`object-cover w-full h-full transition ${mainImage === thumb ? 'ring-2 ring-black' : 'border border-gray-300'}`} />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Product Info */}
        <div className="w-[60%] flex flex-col gap-6">
          <h1 className="text-4xl font-bold">{product.name}</h1>
          <p className="text-gray-700 text-lg">{product.description}</p>

          {/* Price */}
          <div className="flex items-center gap-4">
            <p className="text-xl font-semibold line-through text-gray-500">₹ {product.mrpPrice}</p>
            <p className="text-2xl font-semibold">₹ {displayedPrice}</p>
          </div>
          {/* Discount */}
          <div className="text-lg text-green-600">
            {product.mrpPrice && displayedPrice && product.mrpPrice > displayedPrice ? (
              <p>
                Save {Math.round(((product.mrpPrice - displayedPrice) / product.mrpPrice) * 100)}% off
              </p>
            ) : (
              <p></p>
            )}
          </div>

          {/* Size selection */}
          <div className="space-y-2">
            <label className="font-semibold block text-lg">Size:</label>
            <div className="flex flex-wrap gap-3">
              {product.sizeOptions.length > 0 ? (
                product.sizeOptions.map((opt) => (
                  <button
                    key={opt.size}
                    onClick={() => setSelectedSize(opt.size)}
                    className={`cursor-pointer px-4 py-2 border rounded-md hover:bg-black hover:text-white ${selectedSize === opt.size ? 'bg-black text-white' : ''}`}
                  >
                    {opt.size}
                  </button>
                ))
              ) : (
                <p>No sizes available</p>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-6 mt-6">
            <button
              onClick={handleAddToCart}
              className={`cursor-pointer px-8 py-3 border rounded-md text-lg ${!selectedSize ? 'bg-slate-100' : 'bg-black text-white'}`}
              disabled={!selectedSize}
            >
              Add to cart
            </button>
            <button className="cursor-pointer border px-8 py-3 bg-white text-black rounded-md text-lg">Buy Now</button>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      <div className="w-full py-8 px-10 bg-gray-100 mt-10">
        <h2 className="text-3xl font-bold text-center mb-6">Related Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {relatedCategoryProducts.length > 0 ? (
            relatedCategoryProducts.map((relatedProduct) => (
              <Link key={relatedProduct.id} href={`/product/${relatedProduct.id}`} className="w-full h-auto bg-white rounded-md shadow-lg p-4">
                <Image src={getValidImage(relatedProduct.imageUrl)} alt={relatedProduct.name} width={250} height={250} className="object-cover w-full h-64 rounded-md" />
                <h3 className="font-semibold text-lg mt-2">{relatedProduct.name}</h3>
                <p className="text-gray-600 text-sm mt-1">₹ {relatedProduct.price}</p>
              </Link>
            ))
          ) : (
            <p className="text-center col-span-4">No related products found.</p>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="w-full py-8 mt-10">
        <h2 className="text-3xl font-bold text-center mb-6">Customer Reviews</h2>
        {isLoadingReviews ? (
          <div className="text-center text-xl">Loading reviews...</div>
        ) : errorFetchingReviews ? (
          <div className="text-center text-xl text-red-600">{errorFetchingReviews}</div>
        ) : reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="border p-4 rounded-lg">
                <div className="flex items-center gap-4">
                  <Image src={review.user?.image||'/images/fallback-user.png'} alt={review.user.name} width={40} height={40} className="rounded-full" />
                  <div>
                    <p className="font-semibold">{review.user.name}</p>
                    <div className="flex">
                      {Array(5)
                        .fill(0)
                        .map((_, idx) => (
                          <span key={idx} className={review.rating > idx ? 'text-yellow-500' : 'text-gray-300'}>
                            ★
                          </span>
                        ))}
                    </div>
                  </div>
                </div>
                <p className="mt-2">{review.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-xl">No reviews yet. Be the first to review!</div>
        )}

        {/* Review Form */}
{session?.user ? (
  <div className="mt-8 p-6 border-t border-gray-200 rounded-lg bg-white shadow-md">
    <h3 className="text-2xl font-semibold text-gray-800">Leave a Review</h3>
    <div className="mt-6">
      <textarea
        value={newReview}
        onChange={(e) => setNewReview(e.target.value)}
        className="w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
        placeholder="Write your review here..."
        rows={4}
      />
    </div>
    <div className="mt-4 flex items-center gap-4">
      <div className="flex">
        {Array(5)
          .fill(0)
          .map((_, idx) => (
            <span
              key={idx}
              onClick={() => setNewRating(idx + 1)}
              className={`text-xl cursor-pointer ${
                newRating > idx ? 'text-yellow-500' : 'text-gray-300'
              }`}
            >
              ★
            </span>
          ))}
      </div>
      <button
        onClick={handleReviewSubmit}
        className="bg-black text-white py-2 px-6 rounded-md shadow-md hover:bg-gray-800 transition duration-200"
      >
        Submit Review
      </button>
    </div>
  </div>
) : (
  <div className="mt-8 text-center text-lg text-gray-600">
    <p>You must be logged in to submit a review</p>
  </div>
)}

      </div>
    </div>
  );
}
