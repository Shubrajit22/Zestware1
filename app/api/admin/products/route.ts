import { prisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';
import { ProductType } from '@prisma/client';


// Reusable interfaces for input validation
interface SizeOptionInput {
  size: string;
  price: number;
}

interface StockImageInput {
  imageUrl: string;
}

interface ProductRequestBody {
  id?: string;
  name: string;
  description: string;
  price: number;
  mrpPrice: number;
  discount: number;
  imageUrl: string;
  categoryId: string;
  type: string;
  state?: string;
  district?: string;
  institution?: string;
  color?: string;
  texture?: string;
  neckline?: string;
  sizeOptions?: SizeOptionInput[];
  stockImages?: StockImageInput[];
}

// ✅ GET: Fetch all products
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

// ✅ POST: Add a new product
export async function POST(req: NextRequest) {
  try {
    const body: ProductRequestBody = await req.json();

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
      sizeOptions = [],
      stockImages = [],
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
        type: type as ProductType,
        state,
        district,
        institution,
        color,
        texture,
        neckline,
        sizeOptions: {
          create: sizeOptions
            .filter((s) => s.size && s.price)
            .map((s) => ({
              size: s.size,
              price: s.price,
            })),
        },
        stockImages: {
          create: stockImages
            .filter((img) => img.imageUrl?.trim())
            .map((img) => ({
              imageUrl: img.imageUrl,
            })),
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

// ✅ PUT: Update product
export async function PUT(req: Request) {
  try {
    const body: ProductRequestBody = await req.json();

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
    } = body;

    if (!id) {
      return new Response(JSON.stringify({ error: 'Product ID is required' }), { status: 400 });
    }

    const categoryExists = await prisma.productCategory.findUnique({
      where: { id: categoryId },
    });

    if (!categoryExists) {
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
        type: type as ProductType,
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

// ✅ DELETE: Delete product and related data
export async function DELETE(req: Request) {
  try {
    const body: { id: string } = await req.json();
    const { id } = body;

    if (!id) {
      return new Response(JSON.stringify({ error: 'Product ID is required' }), { status: 400 });
    }

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

    await prisma.sizeOption.deleteMany({
      where: { productId: id },
    });

    await prisma.stockImage.deleteMany({
      where: { productId: id },
    });

    await prisma.product.delete({
      where: { id },
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting product:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
