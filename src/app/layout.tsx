import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MediStore - Trusted Online Medicine Shop",
  description: "Buy authentic medicines online with fast delivery.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* flex-col min-h-screen  */}
      <body className={`${inter.className} flex flex-col min-h-screen bg-gray-50`}>
        
        <Navbar />
        
        <Toaster position="top-center" reverseOrder={false} />
        
        {/* 'container'  */}
        {/* flex-grow  */}
        <main className="flex-grow">
          {children}
        </main>
        
        <Footer />
        
      </body>
    </html>
  );
}