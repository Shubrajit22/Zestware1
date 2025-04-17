import HeroSection from "./components/HeroSection";
import ImageGallery from "./components/ImageGallery";
import MostSelling from "./components/MostSelling";
import { CategoryGrid } from './components/CategoryGrid';
import Testimonials from "./components/Testimonials";



export default async function Home() {
  let mostSellingProducts;
  try {
    mostSellingProducts = await prisma.product.findMany({
      orderBy: {
        salesCount: 'desc', // Assuming `salesCount` is a field that tracks sales
      },
      take: 6, // Limit the number of products displayed
    });
  } catch (error) {
    console.error("Error fetching most selling products:", error);
    mostSellingProducts = []; // Default to empty array in case of error
  }

  return (
    <>
      <main className=" text-white">
        <div className="px-6 md:px-20 py-2 min-h-screen">
          

          <div className="flex flex-col md:flex-row justify-between items-center gap-12 mt-24">
            <HeroSection />
            <ImageGallery />
          </div>
        </div>
      </main>

      {/* Full-width white background section */}
      <section className="w-full bg-white text-black py-12 px-4 md:px-20">
        <h1 className="text-center text-4xl font-bold mb-8">Product Categories</h1>
        <CategoryGrid />
      </section>
      <section>
      <MostSelling products={mostSellingProducts} />
      </section>
      <section>
        <Testimonials/>
      </section>

    </>
  );
}
