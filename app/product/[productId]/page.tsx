import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ProductPageContent from './ProductPageContent';

export const dynamic = 'force-dynamic'; // Ensure the page is always re-rendered

interface ProductPageProps {
  params: { productId: string };
}

export default async function ProductPage({ params }: ProductPageProps) {
  // Ensure productId exists
  if (!params?.productId) return notFound();

  // Fetch the product details from the database
  let product;
  try {
    product = await prisma.product.findUnique({
      where: { id: params.productId },
      include: {
        stockImages: true,
        sizeOptions: true, // Include sizeOptions here
      },
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    return notFound(); // Handle any errors while fetching product
  }

  // If the product is not found, return a 404
  if (!product) return notFound();

  // Fetch related products (e.g., based on category)
  let relatedProducts;
  try {
    relatedProducts = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId, // Use categoryId from the fetched product
        NOT: { id: product.id }, // Exclude the current product
      },
      take: 4, // Limit the number of related products
    });
  } catch (error) {
    console.error("Error fetching related products:", error);
    relatedProducts = []; // Default to an empty array in case of error
  }

  // Fetch reviews for the product
  let reviews;
  try {
    reviews = await prisma.review.findMany({
      where: {
        productId: product.id, // Filter reviews by productId
      },
      orderBy: {
        createdAt: 'desc', // Optionally order by date or rating
      },
      include: {
        user: {
          select: {
            name: true,
            image: true, // If you also want to include the user's image
          },
        },
        product: {
          select: {
            name: true, // If you want the product name as well
          },
        },
      },
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    reviews = []; // Default to an empty array in case of error
  }

  // Pass product, related products, and reviews to the ProductPageContent component
  return <ProductPageContent product={product} relatedProducts={relatedProducts} reviews={reviews} />;
}
