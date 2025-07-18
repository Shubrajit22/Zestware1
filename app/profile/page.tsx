'use client'

import { useSession, signOut } from 'next-auth/react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import Image from 'next/image'
import { OrderItem } from '@prisma/client'
import { useRouter } from 'next/navigation'

interface Address {
  id: string
  address: string
}

interface Order {
  id: string
  status: string
  totalAmount: number
  shippingAddress: string
  orderItems: OrderItem[]
}

interface User {
  id: string
  name: string
  email: string
  mobile: string
  addresses: Address[]
  orders?: Order[]
  isAdmin?: boolean
}

interface SessionUser {
  name?: string | null
  email?: string | null
  image?: string | null
}

export default function ProfilePage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [user, setUser] = useState<User | null>(null)
  const [newAddress, setNewAddress] = useState('')
  const [selectedSection, setSelectedSection] = useState<'orders' | 'profile' | 'addresses' | 'admin'>('profile')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status !== 'authenticated' || !session?.user?.email) return

    const fetchUserData = async () => {
      setLoading(true)
      try {
        const res = await axios.get(`/api/profile?email=${session.user.email}`)
        setUser(res.data)
      } catch (error) {
        toast.error('Failed to fetch profile')
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [status, session])

  const isAdmin = user?.isAdmin === true

  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: '/' })
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const handleAddAddress = async () => {
    if (!user || !newAddress.trim()) return

    try {
      const res = await axios.post('/api/profile', { address: newAddress })
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

  if (status === 'loading' || loading) return <div className="p-4">Loading...</div>
  if (!session || !user) return <div className="p-4">You are not logged in.</div>

  const renderContent = () => {
    switch (selectedSection) {
      case 'orders':
        return (
          <div className="bg-white p-6 rounded-lg shadow-lg ">
            <h1 className="text-2xl font-semibold mb-4 text-black">Your Orders</h1>
            {user.orders && user.orders.length > 0 ? (
              <ul className="space-y-4">
                {user.orders.map((order) => (
                  <li key={order.id} className="p-4 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100">
                    <div className="flex justify-between"><span>Order ID:</span><span>{order.id}</span></div>
                    <div className="flex justify-between"><span>Status:</span><span>{order.status}</span></div>
                    <div className="flex justify-between"><span>Total:</span><span>${order.totalAmount.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span>Shipping Address:</span><span>{order.shippingAddress}</span></div>
                    <div className="mt-2">
                      <h3 className="font-semibold">Items:</h3>
                      <ul>
                        {order.orderItems.map(item => (
                          <li key={item.id} className="flex justify-between">
                            <div className="flex items-center gap-2">
                              <Image src={`/api/products/${item.productId}/image`} alt="product" width={48} height={48} />
                              <div>
                                <div>Product ID: {item.productId}</div>
                                <div>Size: {item.size}</div>
                                <div>Price: ${item.price.toFixed(2)}</div>
                              </div>
                            </div>
                            <div>Qty: {item.quantity}</div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div>No orders found.</div>
            )}
          </div>
        )
      case 'profile':
        return (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h1 className="text-2xl font-semibold mb-6">Profile Information</h1>
            <div className="space-y-4">
              <div className="flex justify-between"><span>Name:</span><span>{user.name}</span></div>
              <div className="flex justify-between"><span>Email:</span><span>{user.email}</span></div>
              <div className="flex justify-between"><span>Mobile:</span><span>{user.mobile}</span></div>
              <div className="flex justify-between"><span>Role:</span><span className="text-sm">{user.isAdmin ? 'Admin' : 'User'}</span></div>
            </div>
          </div>
        )
      case 'addresses':
        return (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h1 className="text-2xl font-semibold mb-4">Manage Addresses</h1>
            <ul className="space-y-4">
              {user.addresses.map(addr => (
                <li key={addr.id} className="flex justify-between bg-gray-50 p-3 rounded shadow-sm">
                  <span>{addr.address}</span>
                  <button onClick={() => handleDeleteAddress(addr.id)} className="text-red-500 hover:text-red-700 text-sm">Delete</button>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex gap-2">
              <input
                type="text"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                placeholder="New address"
                className="flex-grow p-2 border rounded"
              />
              <button onClick={handleAddAddress} className="bg-blue-600 text-white px-4 py-2 rounded">Add</button>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  const userData = session.user as SessionUser

  return (
    <div className="min-h-screen flex p-4 text-black">
      {/* Sidebar */}
      <aside className="w-full max-w-xs bg-white p-4 rounded-lg shadow-md">
        <div className="flex items-center space-x-4 mb-6">
          <div className="bg-gray-300 p-3 rounded-full">
            {userData.image ? (
              <Image src={userData.image} alt="User profile" width={40} height={40} className="rounded-full" />
            ) : (
              <span className="text-2xl">👤</span>
            )}
          </div>
          <div>
            <p className="text-sm text-gray-500">Hello,</p>
            <p className="font-semibold text-gray-800">{userData.name || 'Customer'}</p>
          </div>
        </div>

        <nav className="space-y-4">
          <div className={`px-4 py-2 rounded cursor-pointer ${selectedSection === 'profile' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`} onClick={() => setSelectedSection('profile')}>Profile</div>
          <div className={`px-4 py-2 rounded cursor-pointer ${selectedSection === 'orders' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`} onClick={() => setSelectedSection('orders')}>Orders</div>
          <div className={`px-4 py-2 rounded cursor-pointer ${selectedSection === 'addresses' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`} onClick={() => setSelectedSection('addresses')}>Addresses</div>

          {isAdmin && (
            <div className={`px-4 py-2 rounded cursor-pointer ${selectedSection === 'admin' ? 'bg-purple-100 text-purple-700' : 'hover:bg-gray-100'}`} onClick={() => router.push('/admin')}>
              Admin Panel
            </div>
          )}

          <button
            onClick={handleLogout}
            className="w-full mt-6 flex items-center justify-center px-4 py-3 border text-red-600 rounded hover:bg-red-600 hover:text-white"
          >
            ⏻ LOG OUT
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 mx-6">{renderContent()}</main>
    </div>
  )
}
