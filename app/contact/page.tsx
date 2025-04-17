'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Add actual submission logic here
  };

  return (
    <div className="min-h-screen bg-white px-6 py-10 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl space-y-6 "
      >
        <h2 className="text-2xl font-semibold text-black">Contact us</h2>

        {/* Name Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First name</label>
            <input
              type="text"
              name="firstName"
              placeholder="Jane"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last name</label>
            <input
              type="text"
              name="lastName"
              placeholder="Smitherton"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
          <input
            type="email"
            name="email"
            placeholder="email@janesfakedomain.net"
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        {/* Mobile Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mobile number</label>
          <input
            type="tel"
            name="mobile"
            placeholder="+91 9876543210"
            value={formData.mobile}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Your message</label>
          <textarea
            name="message"
            placeholder="Enter your question or message"
            value={formData.message}
            onChange={handleChange}
            rows={5}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded-md hover:opacity-90 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
