'use client'
import { useEffect, useState } from 'react';
import { useSession,signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaBox, FaUsers, FaShoppingCart, FaDollarSign, FaChartLine, FaSignOutAlt } from 'react-icons/fa';

const AdminDashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalSales: 0,
  });

  useEffect(() => {
    if (status === 'loading') return;
    if (!session || !session.user.isAdmin) {
      router.push('/login');
    } else {
      setIsAdmin(true);
    }
  }, [session, status, router]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/stats');
        if (!res.ok) {
          throw new Error('Failed to fetch stats');
        }

        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
        // Optionally, show a user-friendly message in the UI
        alert('Failed to load stats');
      }
    };

    fetchStats();
  }, []);

  const handleSignOut = () => {
    // Call the sign-out function provided by next-auth
    signOut({ callbackUrl: '/' });
  };

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (!isAdmin) {
    return <p>Redirecting...</p>;
  }

  return (
    <div className="bg-white-gradient p-8 ">
      <div className="flex justify-between items-center mb-8">
        <h1 className=" text-3xl font-bold text-black">Admin Dashboard</h1>

        {session?.user && (
          <div className="flex items-center space-x-4">
            <span className="text-black font-semibold">Hello, {session.user.name}</span>
            <button
              onClick={handleSignOut}
              className="bg-red-600 text-white px-4 py-2 rounded-md flex items-center space-x-2"
            >
              <FaSignOutAlt />
              <span>Sign Out</span>
            </button>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="flex flex-col items-center bg-black text-white p-6 rounded-lg">
          <FaBox className="text-3xl mb-4" />
          <h2 className="text-xl font-semibold">Products</h2>
          <p className="text-lg">{stats.totalProducts}</p>
        </div>
        <div className="flex flex-col items-center bg-black text-white p-6 rounded-lg">
          <FaUsers className="text-3xl mb-4" />
          <h2 className="text-xl font-semibold">Users</h2>
          <p className="text-lg">{stats.totalUsers}</p>
        </div>
        <div className="flex flex-col items-center bg-black text-white p-6 rounded-lg">
          <FaShoppingCart className="text-3xl mb-4" />
          <h2 className="text-xl font-semibold">Orders</h2>
          <p className="text-lg">{stats.totalOrders}</p>
        </div>
        <div className="flex flex-col items-center bg-black text-white p-6 rounded-lg">
          <FaDollarSign className="text-3xl mb-4" />
          <h2 className="text-xl font-semibold">Sales</h2>
          <p className="text-lg">₹{stats.totalSales.toFixed(2)}</p>
        </div>
      </div>

      <h2 className="text-black text-2xl font-bold mb-6">Manage Your Content</h2>
      <nav>
        <ul className="space-y-4">
          <li>
            <Link href="/admin/products" className="text-black flex items-center space-x-2">
              <FaChartLine className="text-xl" />
              <span>Manage Products</span>
            </Link>
          </li>
          <li>
            <Link href="/admin/orders" className="text-black flex items-center space-x-2">
              <FaChartLine className="text-xl" />
              <span>Manage Orders</span>
            </Link>
          </li>
          <li>
            <Link href="/admin/users" className="text-black flex items-center space-x-2">
              <FaChartLine className="text-xl" />
              <span>Manage Users</span>
            </Link>
          </li>
          <li>
            <Link href="/admin/reviews" className="text-black flex items-center space-x-2">
              <FaChartLine className="text-xl" />
              <span>Manage Reviews</span>
            </Link>
          </li>
          <li>
            <Link href="/admin/categories" className="text-black flex items-center space-x-2">
              <FaChartLine className="text-xl" />
              <span>Manage Categories</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default AdminDashboard;
