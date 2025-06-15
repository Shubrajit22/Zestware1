"use client"
import React, { useState } from 'react';
import { Upload, ShoppingCart, Plus, Minus } from 'lucide-react';

const TShirtOrderingSystem = () => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [orderItems, setOrderItems] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');

  const sizes = [
    { size: 'XS', price: 499 },
    { size: 'S', price: 499 },
    { size: 'M', price: 599 },
    { size: 'L', price: 599 },
    { size: 'XL', price: 699 },
    { size: 'XXL', price: 799 }
  ];

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const addToOrder = () => {
    if (!uploadedImage) {
      alert('Please upload a design first!');
      return;
    }

    const selectedSizeObj = sizes.find(s => s.size === selectedSize);
    const newItem = {
      id: Date.now(),
      image: uploadedImage,
      size: selectedSize,
      quantity: quantity,
      price: selectedSizeObj.price,
      total: selectedSizeObj.price * quantity
    };

    setOrderItems([...orderItems, newItem]);
    alert(`Added ${quantity} ${selectedSize} t-shirt(s) to order!`);
  };

  const removeFromOrder = (id) => {
    setOrderItems(orderItems.filter(item => item.id !== id));
  };

  const getTotalAmount = () => {
    return orderItems.reduce((total, item) => total + item.total, 0).toFixed(0);
  };

  const CheckoutPage = () => (
    <div className="max-w-4xl mx-auto p-6 bg-white">
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
                <div key={item.id} className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-sm">
                  <img 
                    src={item.image} 
                    alt="Design" 
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-black">Custom T-Shirt - Size {item.size}</p>
                    <p className="text-black">Quantity: {item.quantity}</p>
                    <p className="text-green-600 font-semibold">₹{(item.total).toFixed(0)}</p>
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

        {/* Checkout Form */}
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-4 text-black">Shipping Information</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="text" 
                  placeholder="First Name" 
                  className="w-full p-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input 
                  type="text" 
                  placeholder="Last Name" 
                  className="w-full p-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <input 
                type="email" 
                placeholder="Email Address" 
                className="w-full p-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input 
                type="text" 
                placeholder="Street Address" 
                className="w-full p-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="grid grid-cols-3 gap-4">
                <input 
                  type="text" 
                  placeholder="City" 
                  className="w-full p-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input 
                  type="text" 
                  placeholder="State" 
                  className="w-full p-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input 
                  type="text" 
                  placeholder="ZIP Code" 
                  className="w-full p-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4 text-black">Payment Method</h3>
            
            {/* Payment Method Selection */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              <button
                onClick={() => setPaymentMethod('card')}
                className={`p-4 border-2 rounded-lg text-center transition-all ${
                  paymentMethod === 'card'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="text-2xl mb-1">💳</div>
                <div className="text-xs font-medium text-black">Credit/Debit Card</div>
              </button>
              
              <button
                onClick={() => setPaymentMethod('upi')}
                className={`p-4 border-2 rounded-lg text-center transition-all ${
                  paymentMethod === 'upi'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="text-2xl mb-1">📱</div>
                <div className="text-xs font-medium text-black">UPI</div>
              </button>
              
              <button
                onClick={() => setPaymentMethod('netbanking')}
                className={`p-4 border-2 rounded-lg text-center transition-all ${
                  paymentMethod === 'netbanking'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="text-2xl mb-1">🏦</div>
                <div className="text-xs font-medium text-black">Net Banking</div>
              </button>
              
              <button
                onClick={() => setPaymentMethod('cod')}
                className={`p-4 border-2 rounded-lg text-center transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="text-2xl mb-1">💵</div>
                <div className="text-xs font-medium text-black">Cash on Delivery</div>
              </button>
            </div>

            {/* Payment Method Forms */}
            {paymentMethod === 'card' && (
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-black">Card Details</h4>
                <input 
                  type="text" 
                  placeholder="Card Number (1234 5678 9012 3456)" 
                  className="w-full p-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    placeholder="MM/YY" 
                    className="w-full p-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input 
                    type="text" 
                    placeholder="CVV" 
                    className="w-full p-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <input 
                  type="text" 
                  placeholder="Cardholder Name" 
                  className="w-full p-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}

            {paymentMethod === 'upi' && (
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-black">UPI Payment</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Enter UPI ID</label>
                    <input 
                      type="text" 
                      placeholder="yourname@paytm / yourname@gpay" 
                      className="w-full p-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Or scan QR Code</label>
                    <div className="w-24 h-24 bg-white border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                      <span className="text-xs text-gray-500">QR Code</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="text-sm text-black">Popular UPI Apps:</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">Google Pay</span>
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">PhonePe</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Paytm</span>
                  <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">Amazon Pay</span>
                </div>
              </div>
            )}

            {paymentMethod === 'netbanking' && (
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-black">Net Banking</h4>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Select Your Bank</label>
                  <select className="w-full p-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">Choose your bank</option>
                    <option value="sbi">State Bank of India</option>
                    <option value="hdfc">HDFC Bank</option>
                    <option value="icici">ICICI Bank</option>
                    <option value="axis">Axis Bank</option>
                    <option value="kotak">Kotak Mahindra Bank</option>
                    <option value="pnb">Punjab National Bank</option>
                    <option value="bob">Bank of Baroda</option>
                    <option value="canara">Canara Bank</option>
                    <option value="other">Other Banks</option>
                  </select>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> You will be redirected to your bank's secure login page to complete the payment.
                  </p>
                </div>
              </div>
            )}

            {paymentMethod === 'cod' && (
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-700">Cash on Delivery</h4>
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <div className="text-yellow-600 text-xl">ℹ️</div>
                    <div>
                      <h5 className="font-medium text-yellow-800 mb-2">COD Information</h5>
                      <ul className="text-sm text-yellow-700 space-y-1">
                        <li>• Pay ₹{getTotalAmount()} when your order is delivered</li>
                        <li>• Additional ₹50 COD charges may apply</li>
                        <li>• Please keep exact change ready</li>
                        <li>• Available in selected cities only</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="cod-terms" className="rounded border-gray-300" />
                  <label htmlFor="cod-terms" className="text-sm text-gray-700">
                    I understand that COD charges may apply and I have verified my address is serviceable for COD
                  </label>
                </div>
              </div>
            )}
          </div>

          <button 
            className="w-full bg-green-600 text-white py-4 px-6 rounded-lg hover:bg-green-700 transition-colors font-semibold text-lg"
            onClick={() => {
              const paymentMessages = {
                card: 'Processing card payment...',
                upi: 'Redirecting to UPI app...',
                netbanking: 'Redirecting to bank login...',
                cod: 'Order confirmed! Pay on delivery.'
              };
              alert(`${paymentMessages[paymentMethod]} Total: ₹${getTotalAmount()} (This is a demo)`);
            }}
          >
            {paymentMethod === 'cod' ? 'Confirm Order' : `Pay Now`} - ₹{getTotalAmount()}
          </button>
        </div>
      </div>
    </div>
  );

  if (showCheckout) {
    return <CheckoutPage />;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
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
                  <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-32 h-32 rounded-lg overflow-hidden shadow-lg">
                    <img 
                      src={uploadedImage} 
                      alt="Uploaded design" 
                      className="w-full h-full object-cover"
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
                ₹{(sizes.find(s => s.size === selectedSize)?.price * quantity).toFixed(0)}
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