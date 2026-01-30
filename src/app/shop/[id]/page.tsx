"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/utils/api";
import toast from "react-hot-toast";
import { 
  ArrowLeft, ShoppingCart, Package, Clock, 
  Factory, ShieldCheck, Tag, Loader2 
} from "lucide-react";
import Link from "next/link";

export default function MedicineDetailsPage() {
  const { id } = useParams(); 
  const router = useRouter();
  const [medicine, setMedicine] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMedicine = async () => {
      try {
        const res = await api.get(`/medicines/${id}`);
        setMedicine(res.data.data);
      } catch (err) {
        toast.error("Failed to load medicine details");
        router.push("/shop");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchMedicine();
  }, [id, router]);

  const addToCart = () => {
    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItem = existingCart.find((item: any) => item.medicineId === medicine.id);

    if (existingItem) {
      existingItem.quantity += 1;
      toast.success("Added more to cart!");
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
    window.dispatchEvent(new Event("storage")); // Navbar Update
  };

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
        <p className="text-gray-500">Loading medicine details...</p>
      </div>
    );
  }

  if (!medicine) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6">
      <div className="container mx-auto max-w-5xl">
        
        {/* Back Button */}
        <Link 
          href="/shop" 
          className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 transition mb-8 font-medium"
        >
          <ArrowLeft size={20} /> Back to Shop
        </Link>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 flex flex-col md:flex-row">
          
          {/* Left: Image / Visual */}
          <div className="md:w-1/2 bg-gradient-to-br from-blue-50 to-cyan-50 p-12 flex items-center justify-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-grid-slate-100 opacity-50"></div>
            <div className="relative z-10 text-blue-600 drop-shadow-2xl transform hover:scale-105 transition duration-500">
               <Package size={180} strokeWidth={1} />
            </div>
            <div className="absolute bottom-6 left-6 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-bold text-blue-800 shadow-sm flex items-center gap-2">
              <Tag size={16} /> {medicine.category?.name}
            </div>
          </div>

          {/* Right: Details */}
          <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {medicine.name}
            </h1>
            
            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-bold text-blue-600">
                ৳{medicine.price}
              </span>
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold border border-green-200">
                In Stock: {medicine.stock}
              </span>
            </div>

            <p className="text-gray-600 leading-relaxed mb-8 text-lg">
              {medicine.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <Factory className="text-gray-400" size={24} />
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase">Manufacturer</p>
                  <p className="text-gray-800 font-medium">{medicine.manufacturer}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <Clock className="text-gray-400" size={24} />
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase">Expiry Date</p>
                  <p className="text-gray-800 font-medium">
                    {new Date(medicine.expiryDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={addToCart}
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-xl transition-all flex items-center justify-center gap-3 active:scale-95"
            >
              <ShoppingCart size={24} /> Add to Cart
            </button>
            
            <p className="mt-6 text-center text-sm text-gray-400 flex items-center justify-center gap-2">
              <ShieldCheck size={16} /> 100% Authentic Product Guarantee
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}