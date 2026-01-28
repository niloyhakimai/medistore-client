"use client";

import { useEffect, useState } from "react";
import api from "@/utils/api";
import MedicineCard from "@/components/MedicineCard";
import { Search, PackageOpen } from "lucide-react"; // Icon

export default function ShopPage() {
  const [medicines, setMedicines] = useState<any[]>([]);
  const [filteredMedicines, setFilteredMedicines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // 1. Fetch Medicines
  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const res = await api.get("/medicines");
        setMedicines(res.data.data);
        setFilteredMedicines(res.data.data); 
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicines();
  }, []);

  // 2. Search Logic (Real-time filtering)
  useEffect(() => {
    const filtered = medicines.filter((med) =>
      med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.category?.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredMedicines(filtered);
  }, [searchQuery, medicines]);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              All Medicines
            </h1>
            <p className="text-gray-500">
              Browse our collection of {medicines.length} authentic healthcare products.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="text-gray-400" size={20} />
            </div>
            <input
              type="text"
              placeholder="Search medicine or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              // 👇 নিচে text-gray-900 যোগ করা হয়েছে
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          //  Loading Skeleton
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-white rounded-2xl h-80 p-4 border border-gray-100 animate-pulse">
                <div className="bg-gray-200 h-40 rounded-xl mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-10 bg-gray-200 rounded-full mt-auto"></div>
              </div>
            ))}
          </div>
        ) : filteredMedicines.length === 0 ? (
          //  Empty State 
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
              <PackageOpen size={40} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Medicines Found</h3>
            <p className="text-gray-500">
              Try adjusting your search terms or browse other categories.
            </p>
          </div>
        ) : (
          //  Medicine Grid 
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredMedicines.map((med: any) => (
              <MedicineCard key={med.id} medicine={med} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}