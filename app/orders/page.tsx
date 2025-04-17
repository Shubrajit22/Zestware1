import { getUserOrders } from "@/lib/actions/getUserOrders";
import { authOptions } from "@/lib/auth"; // Your NextAuth options
import { getServerSession } from "next-auth";
import React from "react";
import Image from "next/image"; // Import Image from next/image

// ✅ Define types for type safety
type Product = {
  name: string;
  imageUrl: string;
};

type OrderItem = {
  id: string;
  quantity: number;
  size?: string;
  price: number;
  product: Product;
};

type Order = {
  id: string;
  status: string;
  paymentStatus: string;
  shippingStatus: string;
  totalAmount: number;
  createdAt: string;
  orderItems: OrderItem[];
};

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow p-4 text-red-500">
          Please login to view your orders.
        </main>
      </div>
    );
  }

  const orders: Order[] = await getUserOrders(userId);

  return (
    <div className="flex flex-col min-h-screen items-center">
      <main className="flex-grow p-4">
        <h1 className="text-2xl font-bold mb-6">Your Orders</h1>
        {orders.length === 0 ? (
          <p className="text-gray-600">No orders found.</p>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="border p-4 rounded shadow">
                <h2 className="text-lg font-semibold">Order ID: {order.id}</h2>
                <p>Status: <span className="font-medium">{order.status}</span></p>
                <p>Payment: {order.paymentStatus}</p>
                <p>Shipping: {order.shippingStatus}</p>
                <p>Total: ₹{order.totalAmount}</p>
                <p className="text-sm text-gray-600">
                  Date: {new Date(order.createdAt).toLocaleDateString()}
                </p>

                <div className="mt-4 space-y-3">
                  {order.orderItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <Image
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        width={64} // Adjust the width and height to your desired size
                        height={64} // Adjust the width and height to your desired size
                        className="rounded"
                      />
                      <div>
                        <p className="font-medium">{item.product.name}</p>
                        <p>Quantity: {item.quantity}</p>
                        <p>Size: {item.size || "N/A"}</p>
                        <p>Price: ₹{item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
