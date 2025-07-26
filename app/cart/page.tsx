'use client';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface CartItem {
  id: string;
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    description: string;
    sizeOptions: {
      id: string;
      size: string;
      price: number;
    }[];
  };
  quantity: number;
  size: string;
  sizeId?: string | null;
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature?: string;
}

const CartPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<{ name: string; email: string; mobile: string } | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<string>('');

  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/me');
        const data = await res.json();
        if (res.ok && data.user) {
          setUser(data.user);
        } else {
          toast.error('User not logged in');
        }
      } catch {
        toast.error('Could not get user info');
      }
    };
    fetchUser();
  }, []);

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
      } catch {
        toast.error('An error occurred while fetching cart items');
      } finally {
        setLoading(false);
      }
    };
    fetchCartItems();
  }, []);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    setLoading(true);
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
    try {
      const response = await fetch('/api/cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId, newQuantity }),
      });
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.message || 'Error updating cart');
      } else {
        toast.success('Cart updated successfully');
      }
    } catch {
      toast.error('An error occurred while updating cart');
    } finally {
      setLoading(false);
    }
  };

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
    } catch {
      toast.error('An error occurred while removing item');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  const handlePaymentSuccess = async (response: RazorpayResponse) => {
    try {
      if (!selectedAddress) {
        toast.error('Please select a shipping address.');
        return;
      }

      const orderPayload = {
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_order_id: response.razorpay_order_id,
        email: user?.email,
        name: user?.name,
        amount: calculateTotal(),
        address: selectedAddress,
        items: cartItems.map((item) => ({
          name: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
          size: item.size,
          productId: item.product.id,
          sizeId: item.sizeId || null,
        })),
      };

      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('✅ Order placed successfully!');
        router.push('/orders');
      } else {
        toast.error(data.message || '❌ Order failed.');
      }
    } catch {
      toast.error('Something went wrong.');
    }
  };

  const handleRazorpayPayment = async () => {
    const res = await fetch('/api/razorpay', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount: calculateTotal() }),
    });

    const data = await res.json();

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
      amount: data.amount,
      currency: 'INR',
      name: 'ZESTWARE',
      description: 'Order Payment',
      image: '/logo.png',
      order_id: data.id,
      handler: function (response: RazorpayResponse) {
        handlePaymentSuccess(response);
      },
      prefill: {
        name: user?.name || 'Customer',
        email: user?.email || '',
        contact: user?.mobile || '',
      },
      theme: {
        color: '#000',
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="bg-white-gradient min-h-screen container mx-auto p-6 flex flex-col">
      <h1 className="text-4xl font-semibold text-center text-slate-900 mb-6">Your Cart</h1>
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
                  <p className="text-lg text-gray-700">Size: {item.size}</p>
                  <p className="text-lg font-semibold text-gray-900">
                    Price: ₹{item.product.price.toFixed(2)}
                  </p>
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
                    <Image src="/images/remove.png" alt="remove" width={30} height={30} />
                  </button>
                </div>
              </div>
            ))
          )}

          {cartItems.length > 0 && (
            <div className="mt-6 flex justify-between items-center text-2xl font-bold text-slate-900">
              <h3 className="ml-auto">Total:</h3>
              <div className="text-right text-xl font-semibold text-slate-900 pl-4">
                ₹{calculateTotal().toFixed(2)}
              </div>
            </div>
          )}

          {cartItems.length > 0 && (
            <div className="mt-10">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">Proceed to Payment</h2>
              <div className="mb-6">
                <label className="block text-gray-700 text-lg font-medium mb-2">
                  Shipping Address
                </label>
                <textarea
                  className="w-full p-3 border rounded text-gray-800"
                  rows={3}
                  placeholder="Enter your shipping address here"
                  value={selectedAddress}
                  onChange={(e) => setSelectedAddress(e.target.value)}
                />
              </div>
              <button
                onClick={handleRazorpayPayment}
                className="py-3 bg-black text-white rounded-lg transition-all cursor-pointer w-1/3"
              >
                Pay with Razorpay – ₹{calculateTotal().toFixed(2)}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CartPage;
