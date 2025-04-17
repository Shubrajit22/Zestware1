'use client'

import { useSession, signOut } from 'next-auth/react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import Image from 'next/image'
import { OrderItem } from '@prisma/client'

interface Address {
  id: string
  address: string
}

interface Order {
  id: string
  status: string
  totalAmount: number
  shippingAddress: string
  orderItems: OrderItem[] // Assuming order items are of type OrderItem
}

interface User {
  id: string
  name: string
  email: string
  mobile: string
  addresses: Address[]
  orders?: Order[] // Update here
}


export default function ProfilePage() {
  const { data: session, status } = useSession()
  const [user, setUser] = useState<User | null>(null)
  const [newAddress, setNewAddress] = useState('')
  const [selectedSection, setSelectedSection] = useState<'orders' | 'profile' | 'addresses'>('profile')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status !== 'authenticated' || !session?.user?.email) return

    const fetchUserData = async () => {
      setLoading(true) // Add loading state
      try {
        const res = await axios.get(`/api/profile?email=${session.user.email}`)
        setUser(res.data)
      }  catch (error) {
        toast.error('Failed to fetch profile')
        console.error(error) // Log the error if you want to debug it
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [status, session])

  // Handle logout functionality
  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: '/' }) // Redirect to homepage after sign out
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  // Add address
  const handleAddAddress = async () => {
    if (!user || !newAddress.trim()) return

    try {
      const res = await axios.post('/api/profile', {
        userId: user.id,
        address: newAddress,
      })
      setUser((prev) =>
        prev ? { ...prev, addresses: [...prev.addresses, res.data] } : prev
      )
      toast.success('Address added')
      setNewAddress('')
    } catch (error) {
      toast.error('Failed to add address')
      console.log(error)
    }
  }

  // Delete address
  const handleDeleteAddress = async (id: string) => {
    if (!user) return
    try {
      await axios.delete(`/api/profile?addressId=${id}`)
      setUser((prev) =>
        prev ? { ...prev, addresses: prev.addresses.filter(a => a.id !== id) } : prev
      )
      toast.success('Address deleted')
    } catch (error) {
      toast.error('Failed to delete address')
      console.log(error)
    }
  }

  // Render loading screen
  if (status === 'loading' || loading) return <div className="p-4">Loading...</div>
  if (!session || !user) return <div className="p-4">You are not logged in.</div>

  const renderContent = () => {
    switch (selectedSection) {
      case 'orders':
        return (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h1 className="text-2xl font-semibold mb-4">Your Orders</h1>
            {user.orders && user.orders.length > 0 ? (
  <div>
    <ul className="space-y-4">
      {user.orders.map((order) => (
        <li
          key={order.id}
          className="p-4 bg-gray-50 rounded-lg shadow-sm transition-all duration-300 hover:bg-gray-100"
        >
          <div className="flex justify-between">
            <span className="text-gray-800 font-medium">Order ID:</span>
            <span>{order.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-800 font-medium">Status:</span>
            <span>{order.status || 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-800 font-medium">Total Amount:</span>
            <span>${order.totalAmount ? order.totalAmount.toFixed(2) : 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-800 font-medium">Shipping Address:</span>
            <span>{order.shippingAddress || 'N/A'}</span>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Order Items:</h3>
            <ul className="space-y-2">
              {order.orderItems?.map((item: OrderItem) => (
                <li key={item.id} className="flex justify-between">
                  {/* Assuming productId exists in orderItem */}
                  <div className="flex gap-2">
                  <Image
  src={`/api/products/${item.productId}/image`} 
  alt={item.productId} // Or a more meaningful alt text
  width={48} // Adjust width
  height={48} // Adjust height
  className="rounded" // Styling as before
/>

                    <div>
                      <div className="font-medium">{item.productId}</div> {/* You need to fetch actual product name */}
                      <div className="text-sm">Size: {item.size || 'N/A'}</div>
                      <div className="text-sm">Price: ${item.price.toFixed(2)}</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">Quantity: {item.quantity}</div>
                </li>
              ))}
            </ul>
          </div>
        </li>
      ))}
    </ul>
  </div>
) : (
  <div className="text-gray-600">No orders found yet. Stay tuned!</div>
)}
          </div>
        )
      case 'profile':
        return (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h1 className="text-2xl font-semibold mb-6">Profile Information</h1>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-gray-700 font-medium">Name</p>
                <p className="text-gray-900">{user.name}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-gray-700 font-medium">Email</p>
                <p className="text-gray-900">{user.email}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-gray-700 font-medium">Mobile</p>
                <p className="text-gray-900">{user.mobile}</p>
              </div>
            </div>
          </div>
        )
      case 'addresses':
        return (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h1 className="text-2xl font-semibold mb-4">Manage Addresses</h1>
            <ul className="space-y-4">
              {user.addresses.map((addr) => (
                <li
                  key={addr.id}
                  className="flex justify-between items-center p-4 bg-gray-50 rounded-lg shadow-sm transition-all duration-300 hover:bg-gray-100"
                >
                  <span className="text-gray-800">{addr.address}</span>
                  <button
                    className="text-red-500 text-sm font-medium hover:text-red-700"
                    onClick={() => handleDeleteAddress(addr.id)}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-4">
              <input
                type="text"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                placeholder="Enter new address"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none w-full sm:w-2/3"
              />
              <button
                onClick={handleAddAddress}
                className="bg-blue-600 text-white py-2 px-6 rounded-lg shadow-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 transition duration-300"
              >
                Add
              </button>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen flex p-4 text-black">
      {/* Sidebar */}
      <aside className="w-full max-w-xs bg-white p-4 rounded-lg shadow-md">
        {/* User Greeting */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="bg-gray-300 p-3 rounded-full">
            {session.user.image ? (
              <Image
                src={session.user.image}
                alt="User profile"
                width={40}
                height={40}
                className="rounded-full"
              />
            ) : (
              <span className="text-2xl">👤</span>
            )}
          </div>
          <div>
            <p className="text-sm text-gray-500">Hello,</p>
            <p className="font-semibold text-gray-800">{session.user.name || 'Zestwear Customer'}</p>
          </div>
        </div>

        {/* Menu */}
        <nav className="space-y-4">
          <div
            className={`flex justify-between items-center px-4 py-2 rounded-lg cursor-pointer transition-all duration-200 ${selectedSection === 'profile' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
            onClick={() => setSelectedSection('profile')}
          >
            <span>Profile</span>
          </div>
          <div
            className={`flex justify-between items-center px-4 py-2 rounded-lg cursor-pointer transition-all duration-200 ${selectedSection === 'orders' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
            onClick={() => setSelectedSection('orders')}
          >
            <span>Orders</span>
          </div>
          <div
            className={`flex justify-between items-center px-4 py-2 rounded-lg cursor-pointer transition-all duration-200 ${selectedSection === 'addresses' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
            onClick={() => setSelectedSection('addresses')}
          >
            <span>Addresses</span>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 bg-white text-red-600 border rounded hover:bg-gray-100 cursor-pointer hover:bg-red-600 hover:text-white"
          >
            <span className="mr-2">⏻</span> LOG OUT
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 mx-6">{renderContent()}</main>
    </div>
  )
}
