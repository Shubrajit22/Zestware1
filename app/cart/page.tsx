'use client'
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface CartItem {
  id: string;
  product: {
    name: string;
    price: number;
    imageUrl: string;
    description: string;
    sizeOptions: {
      size: string;
      price: number;
    }[];  // Ensure size options are populated
  };
  quantity: number;
  selectedSize: string; // Store selected size here
}

const CartPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  // Fetch cart items from the API
  useEffect(() => {
    const fetchCartItems = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/cart');
        const data = await response.json();
        if (response.ok && Array.isArray(data.cartItems)) {
          setCartItems(data.cartItems);
        } else {
          toast.error(data.message || 'Error fetching cart items');
        }
      } catch (error) {
        console.error('Error fetching cart items:', error);
        toast.error('An error occurred while fetching cart items');
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  // Handle quantity update
  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    setLoading(true);
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    ); // Optimistic UI update

    try {
      const response = await fetch('/api/cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId, newQuantity }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success('Cart updated successfully');
      } else {
        toast.error(data.message || 'Error updating cart');
      }
    } catch (error) {
      console.error('Error updating cart:', error);
      toast.error('An error occurred while updating cart');
    } finally {
      setLoading(false);
    }
  };

  // Handle item removal
  const handleRemoveItem = async (itemId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/cart?cartItemId=${itemId}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (response.ok) {
        setCartItems((prev) => prev.filter((item) => item.id !== itemId));
        toast.success('Item removed from cart');
      } else {
        toast.error(data.message || 'Error removing item');
      }
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('An error occurred while removing item');
    } finally {
      setLoading(false);
    }
  };

  // Calculate the total price
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  // Handle Proceed to Checkout
  const handleProceedToCheckout = () => {
    router.push('/checkout');
  };

  return (
    <div className="bg-white-gradient min-h-screen container mx-auto p-6 flex flex-col">
      <h1 className="text-4xl font-semibold text-center text-slate-100 mb-6">Your Cart</h1>
      {loading ? (
        <div className="text-center text-xl">Loading...</div>
      ) : (
        <div className="space-y-8">
          {cartItems.length === 0 ? (
            <p className="text-center text-lg text-gray-600">Your cart is empty.</p>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center bg-white-gradient p-6 rounded-lg shadow-md space-x-6">
                <div className="flex-shrink-0 w-1/12">
                  <Image
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    width={100}
                    height={100}
                    className="w-full h-auto object-cover rounded-lg border-2 border-gray-300"
                  />
                </div>

                <div className="flex-1 space-y-4">
                  <h2 className="text-2xl font-semibold text-gray-800">{item.product.name}</h2>
                  <p className="text-sm text-gray-500">{item.product.description}</p>
                  <p className="text-lg text-gray-700">Size: {item.selectedSize}</p> {/* Display selected size */}

                  {/* Check if size options exist and display them */}
                  {item.product.sizeOptions && item.product.sizeOptions.length > 0 ? (
                    <select
                    value={item.selectedSize}
                    onChange={(e) => {
                      const newSize = e.target.value;
                      const selectedOption = item.product.sizeOptions.find(option => option.size === newSize);
                      const newPrice = selectedOption ? selectedOption.price : item.product.price;
                  
                      setCartItems((prevItems) =>
                        prevItems.map((cartItem) =>
                          cartItem.id === item.id 
                            ? { ...cartItem, selectedSize: newSize, product: { ...cartItem.product, price: newPrice } } 
                            : cartItem
                        )
                      );
                    }}
                    className="mt-2 p-2 border rounded w-40 text-gray-900"
                  >
                    {item.product.sizeOptions.map((sizeOption) => (
                      <option key={sizeOption.size} value={sizeOption.size}>
                        {sizeOption.size} - ₹{sizeOption.price.toFixed(2)}
                      </option>
                    ))}
                  </select>
                  
                  ) : (
                    <p className="text-sm text-gray-600">No size options available</p>
                  )}

                  <p className="text-lg font-semibold text-gray-900">Price: ₹{(item.product.price).toFixed(2)}</p>
                </div>

                <div className="flex flex-col items-end space-y-4 w-1/4">
                  <div className="flex items-center space-x-6">
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="px-6 py-2 bg-black text-white rounded-lg disabled:opacity-50 transition cursor-pointer"
                    >
                      -
                    </button>
                    <span className="text-xl text-black font-medium">{item.quantity}</span>
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                      className="px-6 py-2 bg-black text-white rounded-lg transition cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-slate-100 font-medium transition cursor-pointer"
                  >
                    <Image
                      src={'/images/remove.png'}
                      alt="remove"
                      width={30}
                      height={30}
                    />
                  </button>
                </div>
              </div>
            ))
          )}

          {cartItems.length > 0 && (
            <div className="mt-6 flex justify-between items-center text-2xl font-bold text-slate-900">
              <h3 className="ml-auto">Total:</h3>
              <div className="text-right text-xl font-semibold text-slate-900 pl-4">₹{calculateTotal().toFixed(2)}</div>
            </div>
          )}

          {cartItems.length > 0 && (
            <div className="mt-6 flex justify-end items-center w-full">
              <button
                onClick={handleProceedToCheckout}
                className="py-3 bg-black text-white rounded-lg transition-all cursor-pointer w-1/4"
              >
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CartPage;
