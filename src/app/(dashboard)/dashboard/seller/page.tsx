"use client";

import { useState, useEffect } from "react";
import api from "@/utils/api";
import toast from "react-hot-toast";
import { 
  Plus, Package, DollarSign, Layers, Calendar, 
  Factory, FileText, Loader2, Store 
} from "lucide-react";

export default function SellerDashboard() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    manufacturer: "",
    expiryDate: "",
    categoryId: ""
  });

  // Load Categories
  useEffect(() => {
    api.get("/categories").then((res) => setCategories(res.data.data));
  }, []);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post("/medicines", formData);
      toast.success("Medicine Added Successfully! 💊");
      // Reset form
      setFormData({ name: "", description: "", price: "", stock: "", manufacturer: "", expiryDate: "", categoryId: "" });
    } catch (err) {
      toast.error("Failed to add medicine");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
            <Store size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Seller Dashboard</h1>
          <p className="text-gray-500 mt-2">Manage your inventory and add new medicines.</p>
        </div>
        
        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-blue-600 px-8 py-4">
            <h2 className="text-white font-bold flex items-center gap-2 text-lg">
              <Plus size={20} className="text-blue-200" /> Add New Medicine
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            
            {/* 1. Basic Info */}
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-700">Medicine Details</label>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Package className="text-gray-400" size={18} />
                </div>
                <input 
                  name="name" 
                  placeholder="Medicine Name (e.g. Napa Extra)" 
                  value={formData.name || ""} 
                  onChange={handleChange} 
                  className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:bg-white transition outline-none font-medium" 
                  required 
                />
              </div>

              <div className="relative">
                <div className="absolute top-3 left-3 pointer-events-none">
                  <FileText className="text-gray-400" size={18} />
                </div>
                <textarea 
                  name="description" 
                  placeholder="Detailed description of the medicine..." 
                  value={formData.description || ""} 
                  onChange={handleChange} 
                  rows={3}
                  className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:bg-white transition outline-none resize-none font-medium" 
                  required 
                />
              </div>
            </div>

            {/* 2. Price & Stock Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Price</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="text-gray-400" size={18} />
                  </div>
                  <input 
                    name="price" 
                    type="number" 
                    placeholder="0.00" 
                    value={formData.price || ""} 
                    onChange={handleChange} 
                    className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:bg-white transition outline-none font-medium" 
                    required 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Stock Quantity</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Layers className="text-gray-400" size={18} />
                  </div>
                  <input 
                    name="stock" 
                    type="number" 
                    placeholder="Available Units" 
                    value={formData.stock || ""} 
                    onChange={handleChange} 
                    className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:bg-white transition outline-none font-medium" 
                    required 
                  />
                </div>
              </div>
            </div>

            {/* 3. Manufacturer & Date Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Manufacturer</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Factory className="text-gray-400" size={18} />
                  </div>
                  <input 
                    name="manufacturer" 
                    placeholder="Company Name" 
                    value={formData.manufacturer || ""} 
                    onChange={handleChange} 
                    className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:bg-white transition outline-none font-medium" 
                    required 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Expiry Date</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="text-gray-400" size={18} />
                  </div>
                  <input 
                    name="expiryDate" 
                    type="date" 
                    value={formData.expiryDate || ""} 
                    onChange={handleChange} 
                    className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500 focus:bg-white transition outline-none font-medium" 
                    required 
                  />
                </div>
              </div>
            </div>

            {/* 4. Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
              <select 
                name="categoryId" 
                value={formData.categoryId || ""} 
                onChange={handleChange} 
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500 focus:bg-white transition outline-none font-medium" 
                required
              >
                <option value="">Select a Category</option>
                {categories.map((cat: any) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-4 rounded-xl hover:shadow-lg hover:scale-[1.01] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={20} /> Adding Medicine...
                </>
              ) : (
                <>
                  <Plus size={20} /> Add to Inventory
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}