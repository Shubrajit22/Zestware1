"use client";

import { FaFacebookF, FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-screen-xl mx-auto px-6 py-10">
        {/* Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left mb-6">
          {/* About */}
          <div>
            <h3 className="text-gray-800 font-semibold mb-3">About</h3>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li><a href="#" className="hover:text-yellow-500">Our Story</a></li>
              <li><a href="#" className="hover:text-yellow-500">Careers</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-gray-800 font-semibold mb-3">Contact</h3>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li><a href="#" className="hover:text-yellow-500">Help Center</a></li>
              <li><a href="#" className="hover:text-yellow-500">Track Order</a></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-gray-800 font-semibold mb-3">Follow Us</h3>
            <div className="flex justify-center md:justify-start space-x-4">
              <a href="#" className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-yellow-500 hover:text-white transition">
                <FaFacebookF className="text-gray-700 text-lg" />
              </a>
              <a href="#" className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-yellow-500 hover:text-white transition">
                <FaInstagram className="text-gray-700 text-lg" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Brand & Copy */}
        <div className="text-center border-t border-gray-200 pt-4">
          <h2 className="text-xl font-bold text-gray-800">Zestwear <span className="text-yellow-500">India</span></h2>
          <p className="text-xs text-gray-500 mt-1">© {new Date().getFullYear()} Zestwear India. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
