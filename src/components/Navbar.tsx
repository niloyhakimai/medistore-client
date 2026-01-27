"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, ShoppingCart, User, LogOut, Pill } from "lucide-react"; // আইকন ইমপোর্ট

export default function Navbar() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState("CUSTOMER");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // 1. চেক করি ইউজার লগিন আছে কিনা এবং কার্ট আপডেট
  useEffect(() => {
    // Auth Check
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setIsLoggedIn(!!token);
    if (user?.role) setUserRole(user.role);

    // Cart Count Check (Optional: For UI feel)
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartCount(cart.length);

    // Listen for storage events (add to cart updates)
    const handleStorageChange = () => {
      const updatedCart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartCount(updatedCart.length);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    router.push("/login");
    setIsMobileMenuOpen(false);
  };

  // ড্যাশবোর্ড লিংক ঠিক করা (Role অনুযায়ী)
  const getDashboardLink = () => {
    if (userRole === "ADMIN") return "/dashboard/admin";
    if (userRole === "SELLER") return "/dashboard/seller";
    return "/dashboard/customer";
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          
          {/* ✅ Logo Section */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-blue-600 text-white p-2 rounded-lg group-hover:bg-blue-700 transition">
              <Pill size={24} />
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-cyan-500">
              MediStore
            </span>
          </Link>

          {/* ✅ Desktop Menu (Hidden on Mobile) */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-600 hover:text-blue-600 font-medium transition">Home</Link>
            <Link href="/shop" className="text-gray-600 hover:text-blue-600 font-medium transition">Shop</Link>
            
            {/* Cart Icon */}
            <Link href="/cart" className="relative text-gray-600 hover:text-blue-600 transition">
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full animate-bounce">
                  {cartCount}
                </span>
              )}
            </Link>

            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                <Link 
                  href={getDashboardLink()} 
                  className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium"
                >
                  <User size={20} /> Dashboard
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-full hover:bg-red-600 hover:text-white transition-all duration-300 font-medium border border-red-100"
                >
                  <LogOut size={18} /> Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/login" className="text-gray-600 hover:text-blue-600 font-medium">Login</Link>
                <Link 
                  href="/register" 
                  className="bg-blue-600 text-white px-6 py-2.5 rounded-full font-bold shadow-lg hover:shadow-blue-500/30 hover:bg-blue-700 transition-all transform hover:-translate-y-0.5"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* ✅ Mobile Menu Button (Hamburger) */}
          <div className="md:hidden flex items-center gap-4">
             <Link href="/cart" className="relative text-gray-600 hover:text-blue-600 transition mr-2">
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-blue-600 transition"
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* ✅ Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4 border-t pt-4 animate-in slide-in-from-top-5 fade-in duration-300">
            <Link 
              href="/" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-gray-700 hover:text-blue-600 font-medium p-2 rounded hover:bg-gray-50"
            >
              Home
            </Link>
            <Link 
              href="/shop" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-gray-700 hover:text-blue-600 font-medium p-2 rounded hover:bg-gray-50"
            >
              Shop
            </Link>

            {isLoggedIn ? (
              <>
                <Link 
                  href={getDashboardLink()} 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-gray-700 hover:text-blue-600 font-medium p-2 rounded hover:bg-gray-50"
                >
                  Dashboard
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="w-full text-left text-red-600 font-medium p-2 rounded hover:bg-red-50 flex items-center gap-2"
                >
                  <LogOut size={18} /> Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-3 mt-4">
                <Link 
                  href="/login" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-center text-gray-700 border border-gray-200 py-2 rounded-lg font-medium hover:bg-gray-50"
                >
                  Login
                </Link>
                <Link 
                  href="/register" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-center bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700"
                >
                  Register Now
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}