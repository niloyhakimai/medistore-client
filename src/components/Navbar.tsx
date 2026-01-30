"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, ShoppingCart, User, LogOut, Pill } from "lucide-react"; 

export default function Navbar() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState("CUSTOMER");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // 1. Sync State (Auth + Cart)
  const syncState = () => {
    // A. Check Auth
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setIsLoggedIn(!!token);
    if (user?.role) setUserRole(user.role);

    // B. Check Cart Count (Sum of Quantities)
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const totalQty = savedCart.reduce((sum: number, item: any) => sum + item.quantity, 0);
    setCartCount(totalQty);
  };

  useEffect(() => {
    syncState(); // Initial Load

    // Listen for global storage events (Login, Logout, Add to Cart)
    window.addEventListener("storage", syncState);
    
    return () => {
      window.removeEventListener("storage", syncState);
    };
  }, []);

  // 2. Handle Logout (Reset Everything)
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("cart"); 

    setIsLoggedIn(false);
    setCartCount(0);
    setUserRole("CUSTOMER");
    
    router.push("/login");
    setIsMobileMenuOpen(false);
    
    // Notify other components
    window.dispatchEvent(new Event("storage"));
  };

  // 3. Dynamic Dashboard Link
  const getDashboardLink = () => {
    if (userRole === "ADMIN") return "/dashboard/admin";
    if (userRole === "SELLER") return "/dashboard/seller";
    return "/dashboard/customer";
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all duration-300 shadow-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-blue-600 text-white p-2 rounded-lg group-hover:bg-blue-700 transition shadow-lg shadow-blue-200">
              <Pill size={24} />
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-cyan-500">
              MediStore
            </span>
          </Link>

          {/*  Desktop Menu (Hidden on Mobile) */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-600 hover:text-blue-600 font-medium transition hover:-translate-y-0.5 transform duration-200">Home</Link>
            <Link href="/shop" className="text-gray-600 hover:text-blue-600 font-medium transition hover:-translate-y-0.5 transform duration-200">Shop</Link>
            
            {/* Cart Icon */}
            <Link href="/cart" className="relative text-gray-600 hover:text-blue-600 transition group">
              <ShoppingCart size={24} className="group-hover:scale-110 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full animate-bounce shadow-md">
                  {cartCount}
                </span>
              )}
            </Link>

            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                <Link 
                  href={getDashboardLink()} 
                  className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium transition"
                >
                  <User size={20} /> Dashboard
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-full hover:bg-red-600 hover:text-white transition-all duration-300 font-medium border border-red-100 hover:shadow-md"
                >
                  <LogOut size={18} /> Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/login" className="text-gray-600 hover:text-blue-600 font-medium transition">Login</Link>
                <Link 
                  href="/register" 
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-2.5 rounded-full font-bold shadow-lg hover:shadow-blue-500/30 hover:scale-105 transition-all duration-300"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/*  Mobile Menu Button (Hamburger) */}
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
              className="text-gray-700 hover:text-blue-600 transition p-1"
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/*  Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4 border-t pt-4 animate-in slide-in-from-top-5 fade-in duration-300">
            <Link 
              href="/" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-gray-700 hover:text-blue-600 font-medium p-3 rounded-xl hover:bg-gray-50 transition"
            >
              Home
            </Link>
            <Link 
              href="/shop" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-gray-700 hover:text-blue-600 font-medium p-3 rounded-xl hover:bg-gray-50 transition"
            >
              Shop
            </Link>

            {isLoggedIn ? (
              <>
                <Link 
                  href={getDashboardLink()} 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-gray-700 hover:text-blue-600 font-medium p-3 rounded-xl hover:bg-gray-50 transition"
                >
                  Dashboard
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="w-full text-left text-red-600 font-medium p-3 rounded-xl hover:bg-red-50 flex items-center gap-2 transition"
                >
                  <LogOut size={18} /> Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-3 mt-4">
                <Link 
                  href="/login" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-center text-gray-700 border border-gray-200 py-3 rounded-xl font-medium hover:bg-gray-50 transition"
                >
                  Login
                </Link>
                <Link 
                  href="/register" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-center bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 shadow-md transition"
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