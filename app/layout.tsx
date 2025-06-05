// app/layout.tsx
import "./globals.css";
import { Poppins } from "next/font/google";
import SessionWrapper from "./components/sessionwrapper";
import Navbar from "./components/Navbar";
import { CartContextProvider } from "./components/CartContextProvider";
import Footer from "./components/Footer";
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
  // Define a background class here based on a condition (could be a prop or session state)
  const backgroundClass = "bg-white-gradient"; // Example: use "bg-black-gradient" for dark theme

  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased ${backgroundClass}`}>
        <SessionWrapper>
        <CartContextProvider>
          <div className="min-h-screen py-2">
            <Navbar />
            {children}
            <Footer/>
          </div>
          </CartContextProvider>
        </SessionWrapper>
      </body>
    </html>
  );
}
