import { prisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';

// GET: Fetch all products
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        stockImages: true,
        sizeOptions: true,
        category: true,
        reviews: true,
      },
    });
    return new Response(JSON.stringify(products), { status: 200 });
  } catch (error) {
    console.error('Error fetching products:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}

// POST: Add a new product
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      name,
      description,
      price,
      mrpPrice,
      discount,
      imageUrl,
      categoryId,
      type,
      state,
      district,
      institution,
      color,
      texture,
      neckline,
      sizeOptions,
      stockImages,
    } = body;

    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        price,
        mrpPrice,
        discount,
        imageUrl,
        categoryId,
        type,
        state,
        district,
        institution,
        color,
        texture,
        neckline,
        sizeOptions: {
          create: sizeOptions?.map((s: any) => ({
            size: s.size,
            price: s.price,
          })) || [],
        },
        stockImages: {
          create: stockImages?.map((img: any) => ({
            imageUrl: img.imageUrl,
          })) || [],
        },
      },
      include: {
        sizeOptions: true,
        stockImages: true,
      },
    });

    return new Response(JSON.stringify(newProduct), { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}

// PUT: Update product
export async function PUT(req: Request) {
  try {
    const {
      id,
      name,
      description,
      price,
      mrpPrice,
      discount,
      imageUrl,
      categoryId,
      type,
      state,
      district,
      institution,
      color,
      texture,
      neckline,
    } = await req.json();

    const category = await prisma.productCategory.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return new Response(JSON.stringify({ error: 'Category not found' }), { status: 400 });
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        price,
        mrpPrice,
        discount,
        imageUrl,
        categoryId,
        type,
        state,
        district,
        institution,
        color,
        texture,
        neckline,
      },
    });

    return new Response(JSON.stringify(updatedProduct), { status: 200 });
  } catch (error) {
    console.error('Error updating product:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        sizeOptions: true,
        stockImages: true,
      },
    });

    if (!product) {
      return new Response(JSON.stringify({ error: 'Product not found' }), { status: 404 });
    }

    // Delete associated sizeOptions
    await prisma.sizeOption.deleteMany({
      where: { productId: id },
    });

    // Delete associated stockImages
    await prisma.stockImage.deleteMany({
      where: { productId: id },
    });

    // Now delete the product
    await prisma.product.delete({
      where: { id },
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting product:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
