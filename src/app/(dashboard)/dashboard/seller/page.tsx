"use client";

import { useState, useEffect } from "react";
import api from "@/utils/api";
import toast from "react-hot-toast";
import { 
  Plus, Package, DollarSign, Layers, Calendar, 
  Factory, FileText, Loader2, Store, ShoppingBag, 
  Truck, CheckCircle, Clock, XCircle 
} from "lucide-react";

export default function SellerDashboard() {
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState<any[]>([]); // অর্ডার লিস্ট রাখার জন্য
  const [isLoading, setIsLoading] = useState(false);
  
  // Add Medicine Form State
  const [formData, setFormData] = useState({
    name: "", description: "", price: "", stock: "", manufacturer: "", expiryDate: "", categoryId: ""
  });

  // 1. Load Data (Categories + Seller Orders)
  useEffect(() => {
    const fetchData = async () => {
      try {
        // ক্যাটাগরি লোড
        const catRes = await api.get("/categories");
        setCategories(catRes.data.data);

        // সেলারের অর্ডার লোড (যদি ব্যাকএন্ড রেডি থাকে)
        try {
          const orderRes = await api.get("/seller/orders");
          setOrders(orderRes.data.data);
        } catch (error) {
          console.log("Order API not ready yet");
        }
      } catch (err) {
        console.error("Failed to fetch data");
      }
    };
    fetchData();
  }, []);

  // 2. Handle Form Change
  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. Handle Add Medicine Submit
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post("/seller/medicines", formData);
      toast.success("Medicine Added Successfully! 💊");
      setFormData({ name: "", description: "", price: "", stock: "", manufacturer: "", expiryDate: "", categoryId: "" });
    } catch (err) {
      toast.error("Failed to add medicine");
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Handle Order Status Update
  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await api.patch(`/seller/orders/${orderId}`, { status: newStatus });
      toast.success(`Order marked as ${newStatus}`);
      
      // লোকাল স্টেট আপডেট (যাতে পেজ রিফ্রেশ না লাগে)
      setOrders((prev) => prev.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  // Helper: Status Color
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'PLACED': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'PROCESSING': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'SHIPPED': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'DELIVERED': return 'bg-green-100 text-green-800 border-green-200';
      case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
            <Store size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Seller Dashboard</h1>
          <p className="text-gray-500 mt-2">Manage your inventory & customer orders.</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* ================= LEFT SIDE: ADD MEDICINE FORM ================= */}
          <div className="lg:col-span-1 h-fit">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden sticky top-6">
              <div className="bg-blue-600 px-6 py-4">
                <h2 className="text-white font-bold flex items-center gap-2 text-lg">
                  <Plus size={20} className="text-blue-200" /> Add Medicine
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                
                {/* Name */}
                <div className="relative">
                   <Package className="absolute left-3 top-3.5 text-gray-400" size={18} />
                   <input 
                     name="name" placeholder="Medicine Name" 
                     value={formData.name || ""} onChange={handleChange} 
                     className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none" required 
                   />
                </div>

                {/* Description */}
                <div className="relative">
                   <FileText className="absolute left-3 top-3.5 text-gray-400" size={18} />
                   <textarea 
                     name="description" placeholder="Description" rows={2}
                     value={formData.description || ""} onChange={handleChange} 
                     className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none resize-none" required 
                   />
                </div>

                {/* Price & Stock */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3.5 text-gray-400" size={18} />
                    <input 
                      name="price" type="number" placeholder="Price" 
                      value={formData.price || ""} onChange={handleChange} 
                      className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 outline-none" required 
                    />
                  </div>
                  <div className="relative">
                    <Layers className="absolute left-3 top-3.5 text-gray-400" size={18} />
                    <input 
                      name="stock" type="number" placeholder="Stock" 
                      value={formData.stock || ""} onChange={handleChange} 
                      className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 outline-none" required 
                    />
                  </div>
                </div>

                {/* Manufacturer */}
                <div className="relative">
                   <Factory className="absolute left-3 top-3.5 text-gray-400" size={18} />
                   <input 
                     name="manufacturer" placeholder="Manufacturer" 
                     value={formData.manufacturer || ""} onChange={handleChange} 
                     className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 outline-none" required 
                   />
                </div>

                {/* Date */}
                <div className="relative">
                   <Calendar className="absolute left-3 top-3.5 text-gray-400" size={18} />
                   <input 
                     name="expiryDate" type="date" 
                     value={formData.expiryDate || ""} onChange={handleChange} 
                     className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 outline-none" required 
                   />
                </div>

                {/* Category */}
                <select 
                  name="categoryId" value={formData.categoryId || ""} onChange={handleChange} 
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 outline-none" required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat: any) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>

                <button 
                  type="submit" disabled={isLoading}
                  className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2"
                >
                  {isLoading ? <Loader2 className="animate-spin" /> : <><Plus size={20} /> Add Product</>}
                </button>
              </form>
            </div>
          </div>

          {/* ================= RIGHT SIDE: ORDER MANAGEMENT ================= */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gray-900 px-6 py-4 flex justify-between items-center">
                <h2 className="text-white font-bold flex items-center gap-2 text-lg">
                  <ShoppingBag size={20} className="text-blue-400" /> Incoming Orders
                </h2>
                <span className="bg-blue-600 text-white text-xs px-2.5 py-1 rounded-full font-bold">
                  {orders.length} Orders
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold border-b border-gray-100">
                    <tr>
                      <th className="p-4">Order ID</th>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Items</th>
                      <th className="p-4">Total</th>
                      <th className="p-4">Update Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-10 text-center text-gray-400 flex flex-col items-center">
                           <ShoppingBag size={40} className="mb-2 opacity-20" />
                           No orders received yet.
                        </td>
                      </tr>
                    ) : (
                      orders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50 transition">
                          <td className="p-4">
                            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-mono font-bold">
                              #{order.id.slice(0, 6)}
                            </span>
                          </td>
                          <td className="p-4">
                             <p className="font-bold text-gray-800 text-sm">{order.user?.name || "Guest"}</p>
                             <p className="text-xs text-gray-400 truncate max-w-[150px]" title={order.address}>
                               {order.address}
                             </p>
                          </td>
                          <td className="p-4 text-sm text-gray-600">
                             {order.items.map((item: any) => (
                               <div key={item.id} className="flex items-center gap-1 mb-1">
                                 <span className="font-bold text-gray-900">{item.quantity}x</span> 
                                 <span className="truncate max-w-[100px]">{item.medicine?.name}</span>
                               </div>
                             ))}
                          </td>
                          <td className="p-4 font-bold text-gray-800">${order.totalAmount}</td>
                          <td className="p-4">
                            <select 
                              value={order.status}
                              onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                              className={`p-2 rounded-lg text-xs font-bold border outline-none cursor-pointer appearance-none transition-all w-32 text-center
                                ${getStatusColor(order.status)}
                              `}
                            >
                              <option value="PLACED">Placed</option>
                              <option value="PROCESSING">Processing</option>
                              <option value="SHIPPED">Shipped</option>
                              <option value="DELIVERED">Delivered</option>
                              <option value="CANCELLED">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}