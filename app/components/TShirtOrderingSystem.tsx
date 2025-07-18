"use client";
import React, { useState, ChangeEvent } from "react";
import { Upload, ShoppingCart, Plus, Minus } from "lucide-react";
import Image from 'next/image';
interface OrderItem {
  id: number;
  image: string;
  size: string;
  quantity: number;
  price: number;
  total: number;
}

interface SizeOption {
  size: string;
  price: number;
}

const TShirtOrderingSystem: React.FC = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>("M");
  const [quantity, setQuantity] = useState<number>(1);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [showCheckout, setShowCheckout] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<string>("card");

  const sizes: SizeOption[] = [
    { size: "XS", price: 499 },
    { size: "S", price: 499 },
    { size: "M", price: 599 },
    { size: "L", price: 599 },
    { size: "XL", price: 699 },
    { size: "XXL", price: 799 },
  ];

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addToOrder = () => {
    if (!uploadedImage) {
      alert("Please upload a design first!");
      return;
    }

    const selectedSizeObj = sizes.find((s) => s.size === selectedSize);
    if (!selectedSizeObj) return;

    const newItem: OrderItem = {
      id: Date.now(),
      image: uploadedImage,
      size: selectedSize,
      quantity,
      price: selectedSizeObj.price,
      total: selectedSizeObj.price * quantity,
    };

    setOrderItems([...orderItems, newItem]);
    alert(`Added ${quantity} ${selectedSize} t-shirt(s) to order!`);
  };

  const removeFromOrder = (id: number) => {
    setOrderItems(orderItems.filter((item) => item.id !== id));
  };

  const getTotalAmount = (): string => {
    return orderItems.reduce((total, item) => total + item.total, 0).toFixed(0);
  };

  const CheckoutPage: React.FC = () => (
    <div className="h-screen mx-auto p-6 bg-white">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-black">Checkout</h2>
        <button
          onClick={() => setShowCheckout(false)}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Back to Design
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Order Summary */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4 text-black">Order Summary</h3>
          {orderItems.length === 0 ? (
            <p className="text-black">No items in order</p>
          ) : (
            <div className="space-y-4">
              {orderItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-sm"
                >
                  <Image
  src={item.image}
  alt="Design"
  width={64}
  height={64}
  className="object-cover rounded"
/>
                  <div className="flex-1">
                    <p className="font-medium text-black">
                      Custom T-Shirt - Size {item.size}
                    </p>
                    <p className="text-black">Quantity: {item.quantity}</p>
                    <p className="text-green-600 font-semibold">₹{item.total.toFixed(0)}</p>
                  </div>
                  <button
                    onClick={() => removeFromOrder(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-xl font-bold text-black">
                  <span>Total: ₹{getTotalAmount()}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Shipping + Payment Form */}
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-4 text-black">Shipping Information</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="First Name" className="form-input" />
                <input type="text" placeholder="Last Name" className="form-input" />
              </div>
              <input type="email" placeholder="Email Address" className="form-input" />
              <input type="text" placeholder="Street Address" className="form-input" />
              <div className="grid grid-cols-3 gap-4">
                <input type="text" placeholder="City" className="form-input" />
                <input type="text" placeholder="State" className="form-input" />
                <input type="text" placeholder="ZIP Code" className="form-input" />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4 text-black">Payment Method</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {[
                { key: "card", icon: "💳", label: "Credit/Debit Card" },
                { key: "upi", icon: "📱", label: "UPI" },
                { key: "netbanking", icon: "🏦", label: "Net Banking" },
                { key: "cod", icon: "💵", label: "Cash on Delivery" },
              ].map((method) => (
                <button
                  key={method.key}
                  onClick={() => setPaymentMethod(method.key)}
                  className={`p-4 border-2 rounded-lg text-center ${
                    paymentMethod === method.key
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <div className="text-2xl mb-1">{method.icon}</div>
                  <div className="text-xs font-medium text-black">{method.label}</div>
                </button>
              ))}
            </div>

            {/* Dynamic Payment Section */}
            {paymentMethod === "card" && (
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                <input type="text" placeholder="Card Number" className="form-input" />
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="MM/YY" className="form-input" />
                  <input type="text" placeholder="CVV" className="form-input" />
                </div>
                <input type="text" placeholder="Cardholder Name" className="form-input" />
              </div>
            )}
            {paymentMethod === "upi" && (
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                <input type="text" placeholder="UPI ID" className="form-input" />
                <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded flex items-center justify-center">
                  QR Code
                </div>
              </div>
            )}
            {paymentMethod === "netbanking" && (
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                <select className="form-input">
                  <option>Choose your bank</option>
                  <option value="sbi">SBI</option>
                  <option value="hdfc">HDFC</option>
                </select>
              </div>
            )}
            {paymentMethod === "cod" && (
              <div className="space-y-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700 text-sm">
                <p>Pay ₹{getTotalAmount()} on delivery</p>
                <p>Extra ₹50 COD charges may apply</p>
              </div>
            )}
          </div>

          <button
            className="w-full bg-green-600 text-white py-4 px-6 rounded-lg hover:bg-green-700 transition-colors font-semibold text-lg"
            onClick={() => {
              const paymentMessages: Record<string, string> = {
                card: "Processing card payment...",
                upi: "Redirecting to UPI app...",
                netbanking: "Redirecting to bank login...",
                cod: "Order confirmed! Pay on delivery.",
              };
              alert(
                `${paymentMessages[paymentMethod]} Total: ₹${getTotalAmount()} (This is a demo)`
              );
            }}
          >
            {paymentMethod === "cod" ? "Confirm Order" : `Pay Now`} - ₹{getTotalAmount()}
          </button>
        </div>
      </div>
    </div>
  );

  if (showCheckout) return <CheckoutPage />;

return (
    <div className="h-100vh mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-black mb-2">Custom T-Shirt Designer</h1>
        <p className="text-black">Upload your design and create your custom t-shirt</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Side - Design Upload & Preview */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-black">Design Upload</h2>
          
          {/* Upload Area */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-black mb-2">
              Upload Your Design
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="imageUpload"
              />
              <label htmlFor="imageUpload" className="cursor-pointer">
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-black">Click to upload or drag and drop</p>
                <p className="text-sm text-black mt-1">PNG, JPG, GIF up to 10MB</p>
              </label>
            </div>
          </div>

          {/* T-Shirt Preview */}
          <div className="bg-gray-100 rounded-lg p-8 relative">
            <h3 className="text-lg font-medium mb-4 text-center text-black">Preview</h3>
            <div className="relative mx-auto w-64 h-80 bg-white rounded-lg shadow-md overflow-hidden">
              {/* T-Shirt Base */}
              <div className="absolute inset-0 bg-gradient-to-b from-gray-100 to-gray-200"></div>
              
              {/* T-Shirt Shape */}
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-48 h-64 bg-white rounded-t-3xl shadow-inner">
                {/* Neck */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-8 bg-gray-200 rounded-b-xl"></div>
                
                {/* Sleeves */}
                <div className="absolute -left-4 top-8 w-8 h-20 bg-white rounded-l-xl shadow-inner"></div>
                <div className="absolute -right-4 top-8 w-8 h-20 bg-white rounded-r-xl shadow-inner"></div>
                
                {/* Design Overlay */}
                {uploadedImage && (
  <div className="relative w-full h-full">
    <Image
      src={uploadedImage}
      alt="Uploaded design"
      layout="fill"
      objectFit="cover"
      className="rounded" // optional
    />
  </div>
)}
                
                {!uploadedImage && (
                  <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                    <span className="text-gray-400 text-sm">Your Design</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Size Selection & Ordering */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-black">Select Size & Order</h2>
          
          {/* Size Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-black mb-3">
              Choose Size
            </label>
            <div className="grid grid-cols-3 gap-3">
              {sizes.map((sizeObj) => (
                <button
                  key={sizeObj.size}
                  onClick={() => setSelectedSize(sizeObj.size)}
                  className={`p-3 border-2 rounded-lg text-center transition-all ${
                    selectedSize === sizeObj.size
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="font-semibold text-black">{sizeObj.size}</div>
                  <div className="text-sm text-black">₹{sizeObj.price}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-black mb-3">
              Quantity
            </label>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="text-xl font-semibold w-12 text-center text-black">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Price Calculation */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-lg text-black">Total Price:</span>
              <span className="text-2xl font-bold text-green-600">
  ₹{((sizes.find(s => s.size === selectedSize)?.price || 0) * quantity).toFixed(0)}
</span>

            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={addToOrder}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center space-x-2"
            >
              <ShoppingCart className="h-5 w-5" />
              <span>Add to Order</span>
            </button>
            
            {orderItems.length > 0 && (
              <button
                onClick={() => setShowCheckout(true)}
                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-semibold"
              >
                Proceed to Checkout ({orderItems.length} item{orderItems.length !== 1 ? 's' : ''})
              </button>
            )}
          </div>

          {/* Current Order Summary */}
          {orderItems.length > 0 && (
            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-black mb-2">Items in Order:</h3>
              {orderItems.map((item) => (
                <div key={item.id} className="text-sm text-black flex justify-between">
                  <span>{item.quantity}x Size {item.size}</span>
                  <span>₹{(item.total).toFixed(0)}</span>
                </div>
              ))}
              <div className="border-t border-green-200 mt-2 pt-2 font-semibold text-black flex justify-between">
                <span>Total:</span>
                <span>₹{getTotalAmount()}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TShirtOrderingSystem;