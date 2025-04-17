import { prisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';  // Removed NextResponse import
import { writeFile } from 'fs/promises';
import path from 'path';
import { mkdirSync, existsSync } from 'fs';

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

// POST: Create new product with local image upload
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const imageFile = formData.get('image') as File;

    let imageUrl = '';

    if (imageFile) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const filename = `${Date.now()}-${imageFile.name}`;
      const uploadDir = path.join(process.cwd(), 'public/uploads');

      if (!existsSync(uploadDir)) {
        mkdirSync(uploadDir, { recursive: true });
      }

      const filePath = path.join(uploadDir, filename);
      await writeFile(filePath, buffer);

      imageUrl = `/uploads/${filename}`;
    }

    const categoryId = formData.get('categoryId') as string;

    const category = await prisma.productCategory.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return new Response(JSON.stringify({ error: 'Category not found' }), { status: 400 });
    }

    const newProduct = await prisma.product.create({
      data: {
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        price: Number(formData.get('price')),
        mrpPrice: Number(formData.get('mrpPrice')),
        discount: Number(formData.get('discount')),
        imageUrl,
        categoryId,
        type: formData.get('type') as string,
        state: formData.get('state') as string,
        district: formData.get('district') as string,
        institution: formData.get('institution') as string,
        color: formData.get('color') as string,
        texture: formData.get('texture') as string,
        neckline: formData.get('neckline') as string,
      },
    });

    return new Response(JSON.stringify(newProduct), { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}

// PUT: Update product (can keep this as-is for now unless you want to support image update)
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

// DELETE: Remove product
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return new Response(JSON.stringify({ error: 'Product not found' }), { status: 404 });
    }

    await prisma.product.delete({
      where: { id },
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting product:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
