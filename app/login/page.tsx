'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const Login = () => {
  const router = useRouter();

  const [emailOrMobile, setEmailOrMobile] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Regular expression to check if the input is a valid email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    // Regular expression to check if the input is a valid mobile number (e.g., 10 digits)
    const mobileRegex = /^[0-9]{10}$/;

    let identifier = '';

    if (emailRegex.test(emailOrMobile)) {
      identifier = 'email';
    } else if (mobileRegex.test(emailOrMobile)) {
      identifier = 'mobile';
    } else {
      setError('Please enter a valid email or mobile number.');
      setIsLoading(false);
      return;
    }

    const res = await signIn('credentials', {
      redirect: false,
      [identifier]: emailOrMobile,
      password,
    });

    if (res?.error) {
      setError(res.error);
    } else {
      router.push('/');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-black to-gray-800">
      <div className="max-w-lg w-full p-6 bg-black text-white rounded-md shadow-lg">
        {/* Google and Apple Sign-In Buttons */}
        <div className="flex flex-col gap-4 mb-6">
          <button
            className="w-full py-2 bg-red-600 text-white rounded-full"
            disabled={isLoading}
            onClick={() => signIn('google')}
          >
            Login with Google
          </button>

          <button
            className="w-full py-2 bg-gray-900 text-white rounded-full"
            disabled={isLoading}
            onClick={() => signIn('apple')}
          >
            Login with Apple
          </button>
        </div>

        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        <form onSubmit={handleLogin}>
          {/* Email or Mobile */}
          <div className="mb-4">
            <label htmlFor="emailOrMobile" className="block text-sm font-medium">
              Email or Mobile
            </label>
            <input
              id="emailOrMobile"
              type="text"
              className="w-full px-4 py-2 mt-1 border border-gray-600 rounded-md bg-black text-white"
              value={emailOrMobile}
              onChange={(e) => setEmailOrMobile(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium">Password</label>
            <input
              id="password"
              type="password"
              className="w-full px-4 py-2 mt-1 border border-gray-600 rounded-md bg-black text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-2 bg-white text-black rounded-full mt-4"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-4 text-center">
          <p className="text-sm">
            Don&apos;t have an account?{' '}
            <a href="/signup" className="text-blue-400 hover:underline">Sign Up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
