"use client";

import {
  FaFacebookF,
  FaLinkedinIn,
  FaYoutube,
  FaInstagram,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-white text-gray-700 mt-auto">
      <hr className="border-t-2 border-gray-300" />
      <div className="max-w-screen-xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand and Social */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Zestwear India</h2>
          <p className="text-sm text-gray-500">
            Elevate your style with our premium fashion wear.
          </p>
          <div className="flex space-x-4 text-gray-500">
            <FaFacebookF className="hover:text-gray-900 cursor-pointer" />
            <FaLinkedinIn className="hover:text-gray-900 cursor-pointer" />
            <FaYoutube className="hover:text-gray-900 cursor-pointer" />
            <FaInstagram className="hover:text-gray-900 cursor-pointer" />
          </div>
        </div>

        {/* Company */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-900">Company</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><a href="#">About Us</a></li>
            <li><a href="#">Careers</a></li>
            <li><a href="#">Blog</a></li>
          </ul>
        </div>

        {/* Support */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-900">Support</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><a href="#">Help Center</a></li>
            <li><a href="#">Returns</a></li>
            <li><a href="#">Track Order</a></li>
          </ul>
        </div>

        {/* Explore */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-900">Explore</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><a href="#">New Arrivals</a></li>
            <li><a href="#">Gift Cards</a></li>
            <li><a href="#">Size Guide</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
