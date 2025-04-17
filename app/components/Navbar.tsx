'use client'
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { FaUserAlt } from 'react-icons/fa';
import { MdShoppingCart, MdMoreVert } from 'react-icons/md';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const router = useRouter();
  const { data: session } = useSession();
  const [cartCount, setCartCount] = useState(0);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [loadingCart, setLoadingCart] = useState(true); // Loading state for cart
  const [cartError, setCartError] = useState<string | null>(null); // Error state for cart fetch

  useEffect(() => {
    const fetchCartCount = async () => {
      setLoadingCart(true); // Start loading
      setCartError(null); // Reset error state
      if (session?.user) {
        // Fetch cart for logged-in users
        try {
          const res = await fetch(`/api/cart?userId=${session.user.id}`);
          if (!res.ok) {
            throw new Error('Failed to fetch cart data');
          }
          const data = await res.json();
          setCartCount(data.cartItems.length);
        } catch (error) {
            console.error('Error fetching cart:', error);
            setCartError('Failed to load cart items');
          }
          
          
      } else {
        // For guest users, check cookies or localStorage
        const cartData = JSON.parse(localStorage.getItem('cart') || '[]');
        setCartCount(cartData.length); // Assuming cart is stored as an array in localStorage
      }
      setLoadingCart(false); // Stop loading
    };

    fetchCartCount();
  }, [session]);

  const handleProfileClick = () => {
    setProfileOpen(!isProfileOpen);
  };

  const handleSignInClick = () => {
    router.push('/login');
  };

  const handleLogout = async () => {
    try {
      await signOut();
      window.location.href = '/'; // Redirect to home or a login page
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className=" text-white py-4 px-6 md:px-12 flex items-center justify-between relative">
      {/* Left: Logo */}
      <Link href={'/'}>
      <div className="flex items-center space-x-4">
        <Image src="/home/logo.png" alt="Logo" width={40} height={40} className="rounded-full" />
        <h1 className="text-md md:text-2xl font-bold">Zestware India</h1>
      </div>
      </Link>

      {/* Desktop Search */}
      <div className="hidden md:flex flex-grow max-w-xs sm:max-w-md mx-6 bg-white rounded-full shadow-md p-1">
        <input
          type="text"
          placeholder="Search for Uniforms and More"
          className="flex-grow px-4 text-black rounded-full outline-none"
        />
        <button className="bg-black text-white px-5 py-2 rounded-full hover:bg-gray-800">
          Search
        </button>
      </div>

      {/* Right section */}
      <div className="flex items-center space-x-4">
        <div className="hidden md:flex space-x-6 text-lg flex-grow justify-between">
          <Link href="/" className="hover:text-gray-400">Home</Link>
          <Link href="/contact" className="hover:text-gray-400">Contact</Link>
          <Link href="/about" className="hover:text-gray-400">About</Link>
          <div className="mr-6" />
        </div>

        {/* Avatar / Profile Icon */}
        <div className="relative">
          {session?.user ? (
            session.user.image ? (
              <Image
                src={session.user.image}
                alt="Profile"
                width={32}
                height={32}
                className="rounded-full cursor-pointer border border-white"
                onClick={handleProfileClick}
                unoptimized
              />
            ) : (
              <FaUserAlt
                size={22}
                className="cursor-pointer hover:text-gray-400"
                onClick={handleProfileClick}
              />
            )
          ) : (
            <FaUserAlt
              size={22}
              className="cursor-pointer hover:text-gray-400"
              onClick={handleSignInClick}
            />
          )}

          {/* Profile dropdown */}
          {isProfileOpen && session?.user && (
  <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded-md shadow-lg z-50">
    <button
      className="w-full text-left px-4 py-2 hover:bg-gray-200"
      onClick={() => router.push('/profile')}
    >
      My Profile
    </button>
    <button
      className="w-full text-left px-4 py-2 hover:bg-gray-200"
      onClick={() => router.push('/orders')}
    >
      My Orders
    </button>
    <button
      className="w-full text-left px-4 py-2 hover:bg-gray-200 text-red-500"
      onClick={handleLogout}
    >
      Logout
    </button>
  </div>
)}

        </div>

        {/* Cart */}
        <div className="relative cursor-pointer" onClick={() => router.push('/cart')}>
          <MdShoppingCart size={26} className="hover:text-gray-400" />
          {loadingCart ? (
            <span className="absolute -top-2 -right-2 text-xs bg-red-600 text-white rounded-full px-1">
              ...
            </span>
          ) : cartCount > 0 ? (
            <span className="absolute -top-2 -right-2 text-xs bg-red-600 text-white rounded-full px-1">
              {cartCount}
            </span>
          ) : cartError ? (
            <span className="absolute -top-2 -right-2 text-xs bg-red-600 text-white rounded-full px-1">
              Error
            </span>
          ) : null}
        </div>

        {/* Mobile Menu Icon */}
        <MdMoreVert
          size={26}
          className="block md:hidden cursor-pointer hover:text-gray-400"
          onClick={() => setMenuOpen(!isMenuOpen)}
        />
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 bg-black text-white p-4 rounded-lg shadow-lg border border-gray-600 w-[90vw] max-w-sm z-50 md:hidden">
          <Link href="#home" className="block py-2 hover:text-gray-400">Home</Link>
          <Link href="#contact" className="block py-2 hover:text-gray-400">Contact</Link>
          <Link href="#about" className="block py-2 hover:text-gray-400">About</Link>

          <div className="mt-4">
            <div className="flex items-center bg-white rounded-full px-2 py-1 shadow-inner">
              <input
                type="text"
                placeholder="Search uniforms..."
                className="flex-grow px-3 py-1 text-black bg-transparent outline-none rounded-full"
              />
              <button className="bg-black text-white px-4 py-1.5 text-sm rounded-full hover:bg-gray-800">
                Search
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
