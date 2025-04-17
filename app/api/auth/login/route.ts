import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { email, password, mobile } = await req.json();

    // Ensure either email or mobile is provided, and password is required
    if (!email && !mobile) {
      return NextResponse.json({ message: 'Email or mobile is required' }, { status: 400 });
    }

    if (!password) {
      return NextResponse.json({ message: 'Password is required' }, { status: 400 });
    }

    // Look up user by email or mobile
    const user = await prisma.user.findUnique({
      where: {
        OR: [
          { email },
          { mobile }, // Check by mobile if email is not provided
        ],
      },
    });

    if (!user) {
      return NextResponse.json({ message: 'No user found with this email or mobile' }, { status: 400 });
    }

    // Check if the password is correct
    const isValid = await bcrypt.compare(password, user.password || '');
    if (!isValid) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    // Create a session object with user details
    const session = {
      id: user.id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,  // Include mobile in session
      image: user.image,
    };

    return NextResponse.json({ message: 'Login successful', user: session });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export function GET() {
  return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
}
