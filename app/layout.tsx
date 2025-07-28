// app/layout.tsx
import "./globals.css";
import { Poppins } from "next/font/google";
import SessionWrapper from "./components/sessionwrapper";
import Navbar from "./components/Navbar";
import { CartContextProvider } from "./components/CartContextProvider";
import Footer from "./components/Footer";
import { Toaster } from 'react-hot-toast';

const poppins = Poppins({
  variable: "--font-poppins", // Custom variable for Poppins font
  subsets: ["latin"],
  weight: ["400", "500", "700"], // Specify font weights
});

export const metadata = {
  title: "Zestware",
  description: "Assam's Uniform Startup",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const backgroundClass = "bg-white-gradient";

  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased ${backgroundClass}`}>
        <SessionWrapper>
          <CartContextProvider>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-grow">
                {children}
                <Toaster position="top-center" reverseOrder={false} />
              </main>
              <Footer />
            </div>
          </CartContextProvider>
        </SessionWrapper>
      </body>
    </html>
  );
}
