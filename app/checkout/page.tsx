"use client";
import React from "react";

type PaymentMethod = "card" | "upi" | "netbanking" | "cod";

interface PaymentOptionsProps {
  paymentMethod: PaymentMethod;
  setPaymentMethod: (method: PaymentMethod) => void;
  totalAmount: number;
}

const PaymentOptions: React.FC<PaymentOptionsProps> = ({
  paymentMethod,
  setPaymentMethod,
  totalAmount,
}) => {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4 text-black">Payment Method</h3>

      {/* Selection Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { key: "card", label: "Credit/Debit Card", icon: "💳" },
          { key: "upi", label: "UPI", icon: "📱" },
          { key: "netbanking", label: "Net Banking", icon: "🏦" },
          { key: "cod", label: "Cash on Delivery", icon: "💵" },
        ].map(({ key, label, icon }) => (
          <button
            key={key}
            onClick={() => setPaymentMethod(key as PaymentMethod)}
            className={`p-4 border-2 rounded-lg text-center transition-all ${
              paymentMethod === key
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            <div className="text-2xl mb-1">{icon}</div>
            <div className="text-xs font-medium text-black">{label}</div>
          </button>
        ))}
      </div>

      {/* Conditional Forms */}
      {paymentMethod === "card" && (
        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-black">Card Details</h4>
          <input type="text" placeholder="Card Number" className="input" />
          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="MM/YY" className="input" />
            <input type="text" placeholder="CVV" className="input" />
          </div>
          <input type="text" placeholder="Cardholder Name" className="input" />
        </div>
      )}

      {paymentMethod === "upi" && (
        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-black">UPI Payment</h4>
          <input
            type="text"
            placeholder="yourname@paytm / yourname@gpay"
            className="input"
          />
          <div className="text-xs text-gray-600">Or scan QR Code</div>
          <div className="w-24 h-24 bg-white border border-dashed rounded-lg flex items-center justify-center text-gray-500">
            QR
          </div>
        </div>
      )}

      {paymentMethod === "netbanking" && (
        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-black">Net Banking</h4>
          <select className="input">
            <option>Select Bank</option>
            <option>HDFC</option>
            <option>SBI</option>
            <option>ICICI</option>
          </select>
        </div>
      )}

      {paymentMethod === "cod" && (
        <div className="space-y-4 p-4 bg-yellow-50 rounded-lg text-yellow-800 text-sm">
          <h4 className="font-medium">Cash on Delivery</h4>
          <ul className="list-disc pl-5">
            <li>Pay ₹{totalAmount} on delivery</li>
            <li>₹50 COD charge may apply</li>
            <li>Exact change preferred</li>
          </ul>
          <div className="flex items-center space-x-2">
            <input type="checkbox" className="rounded border-gray-300" />
            <label>I agree to COD terms</label>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentOptions;
