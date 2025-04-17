import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET reviews
export async function GET(
  _req: NextRequest,
  context: { params: { productId: string } }
) {
  const { productId } = context.params

  try {
    const reviews = await prisma.review.findMany({
      where: { productId },
      include: { user: true },
    })

    return NextResponse.json(reviews)
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json({ message: 'Failed to fetch reviews' }, { status: 500 })
  }
}

// POST review
export async function POST(
  req: NextRequest,
  context: { params: { productId: string } }
) {
  const { productId } = context.params

  try {
    const { rating, comment, userId } = await req.json()

    if (!rating || !userId) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 })
    }

    const review = await prisma.review.create({
      data: {
        rating,
        comment,
        userId,
        productId,
      },
    })

    return NextResponse.json(review, { status: 201 })
  } catch (error) {
    console.error('Error creating review:', error)
    return NextResponse.json({ message: 'Failed to create review' }, { status: 500 })
  }
}
