"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { ShoppingCart, Check, Pill, Tag } from "lucide-react";
import Link from "next/link"; 

interface MedicineProps {
  id: string;
  name: string;
  price: number;
  manufacturer: string;
  category: { name: string };
  stock?: number; // Optional: For stock management
}

export default function MedicineCard({ medicine }: { medicine: MedicineProps }) {
  const [isAdded, setIsAdded] = useState(false);

  // Add to Cart Function
  const addToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevents navigating to the details page when clicking the button
    e.stopPropagation();

    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItem = existingCart.find((item: any) => item.medicineId === medicine.id);

    if (existingItem) {
      existingItem.quantity += 1;
      toast.success("Quantity updated!");
    } else {
      existingCart.push({
        medicineId: medicine.id,
        name: medicine.name,
        price: medicine.price,
        quantity: 1
      });
      toast.success("Added to Cart!");
    }

    localStorage.setItem("cart", JSON.stringify(existingCart));
    window.dispatchEvent(new Event("storage")); // Trigger storage event for Navbar update

    // Button Animation Logic
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000); // Revert state after 2 seconds
  };

  return (
    <Link 
      href={`/shop/${medicine.id}`} 
      className="group relative bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col h-full block"
    >
      
      {/* 1. Image / Icon Placeholder Area */}
      <div className="relative h-40 bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center overflow-hidden">
        {/* Decorative Circle */}
        <div className="absolute w-32 h-32 bg-white/30 rounded-full blur-2xl -top-10 -right-10"></div>
        
        {/* Main Icon */}
        <div className="text-blue-500 group-hover:scale-110 transition-transform duration-300">
           <Pill size={64} strokeWidth={1.5} />
        </div>

        {/* Category Badge */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-xs font-bold px-2 py-1 rounded-full text-blue-600 shadow-sm flex items-center gap-1">
          <Tag size={12} />
          {medicine.category?.name}
        </div>
      </div>

      {/* 2. Content Area */}
      <div className="p-5 flex flex-col flex-grow justify-between">
        <div>
          <div className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">
            {medicine.manufacturer}
          </div>
          <h3 className="text-lg font-bold text-gray-800 leading-tight mb-2 group-hover:text-blue-600 transition-colors">
            {medicine.name}
          </h3>
        </div>

        {/* Price & Action */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400">Price</span>
            <span className="text-xl font-bold text-gray-900">
              ${medicine.price.toFixed(2)}
            </span>
          </div>

          <button
            onClick={addToCart}
            className={`
              flex items-center gap-2 px-4 py-2.5 rounded-full font-bold transition-all duration-300 shadow-md z-10
              ${isAdded 
                ? "bg-green-500 text-white hover:bg-green-600" 
                : "bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:shadow-blue-500/30 active:scale-95"
              }
            `}
          >
            {isAdded ? (
              <>
                <Check size={18} /> <span className="text-sm">Added</span>
              </>
            ) : (
              <>
                <ShoppingCart size={18} /> <span className="text-sm">Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </Link>
  );
}