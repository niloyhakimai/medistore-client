"use client";

import { useState, useEffect } from "react";
import api from "@/utils/api";
import toast from "react-hot-toast";
import { 
  Plus, Package, DollarSign, Layers, Calendar, 
  Factory, FileText, Loader2, Store, ShoppingBag, Trash2, Pencil, X 
} from "lucide-react";

export default function SellerDashboard() {
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState<any[]>([]); 
  const [medicines, setMedicines] = useState<any[]>([]); 
  const [isLoading, setIsLoading] = useState(false);
  
  // Edit Mode State
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState("");

  const initialFormState = {
    name: "", description: "", price: "", stock: "", manufacturer: "", expiryDate: "", categoryId: ""
  };
  const [formData, setFormData] = useState(initialFormState);

  // 1. Load Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const catRes = await api.get("/categories");
        setCategories(catRes.data.data);

        try {
          const orderRes = await api.get("/seller/orders");
          const sortedOrders = orderRes.data.data.sort((a: any, b: any) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          setOrders(sortedOrders);
        } catch (error) { console.log("No orders found"); }

        try {
          const medRes = await api.get("/seller/medicines");
          setMedicines(medRes.data.data);
        } catch (error) { console.log("No medicines found"); }

      } catch (err) { console.error("Failed to fetch initial data"); }
    };
    fetchData();
  }, []);

  // 2. Handle Form Change
  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. Edit Click
  const handleEditClick = (med: any) => {
    setIsEditing(true);
    setEditId(med.id);
    const formattedDate = new Date(med.expiryDate).toISOString().split('T')[0];
    setFormData({
      name: med.name,
      description: med.description,
      price: med.price,
      stock: med.stock,
      manufacturer: med.manufacturer,
      expiryDate: formattedDate,
      categoryId: med.categoryId
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 4. Cancel Edit
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditId("");
    setFormData(initialFormState);
  };

  // 5. Submit (Add/Update)
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isEditing) {
        const res = await api.put(`/seller/medicines/${editId}`, formData);
        setMedicines((prev) => prev.map(m => m.id === editId ? res.data.data : m));
        toast.success("Medicine Updated Successfully! 🔄");
        handleCancelEdit();
      } else {
        const res = await api.post("/seller/medicines", formData);
        toast.success("Medicine Added Successfully! 💊");
        setMedicines([res.data.data, ...medicines]);
        setFormData(initialFormState);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Operation failed");
    } finally {
      setIsLoading(false);
    }
  };

  // 6. Delete
  const handleDeleteMedicine = async (id: string) => {
    if(!confirm("Are you sure?")) return;
    try {
      await api.delete(`/seller/medicines/${id}`);
      setMedicines(medicines.filter((m) => m.id !== id));
      toast.success("Deleted successfully");
    } catch (err) { toast.error("Failed to delete"); }
  };

  // 7. Status Update
  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await api.patch(`/seller/orders/${orderId}`, { status: newStatus });
      setOrders((prev) => prev.map(order => order.id === orderId ? { ...order, status: newStatus } : order));
      toast.success(`Order marked as ${newStatus}`);
    } catch (err) { toast.error("Failed to update status"); }
  };

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
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600 shadow-sm">
            <Store size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Seller Dashboard</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* ================= LEFT: FORM ================= */}
          <div className="lg:col-span-1 h-fit">
            <div className={`bg-white rounded-2xl shadow-xl border overflow-hidden sticky top-6 transition-colors ${isEditing ? 'border-amber-200' : 'border-gray-100'}`}>
              <div className={`px-6 py-4 flex justify-between items-center ${isEditing ? 'bg-amber-500' : 'bg-blue-600'}`}>
                <h2 className="text-white font-bold flex items-center gap-2 text-lg">
                  {isEditing ? <><Pencil size={20} /> Update Medicine</> : <><Plus size={20} /> Add Medicine</>}
                </h2>
                {isEditing && (
                  <button onClick={handleCancelEdit} className="text-white hover:bg-amber-600 p-1 rounded-full transition">
                    <X size={20} />
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="relative">
                   <Package className="absolute left-3 top-3.5 text-gray-400" size={18} />
                   <input name="name" placeholder="Medicine Name" value={formData.name} onChange={handleChange} className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none" required />
                </div>
                <div className="relative">
                   <FileText className="absolute left-3 top-3.5 text-gray-400" size={18} />
                   <textarea name="description" placeholder="Description" rows={2} value={formData.description} onChange={handleChange} className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none resize-none" required />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3.5 text-gray-400" size={18} />
                    <input name="price" type="number" placeholder="Price" value={formData.price} onChange={handleChange} className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 outline-none" required />
                  </div>
                  <div className="relative">
                    <Layers className="absolute left-3 top-3.5 text-gray-400" size={18} />
                    <input name="stock" type="number" placeholder="Stock" value={formData.stock} onChange={handleChange} className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 outline-none" required />
                  </div>
                </div>
                <div className="relative">
                   <Factory className="absolute left-3 top-3.5 text-gray-400" size={18} />
                   <input name="manufacturer" placeholder="Manufacturer" value={formData.manufacturer} onChange={handleChange} className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 outline-none" required />
                </div>
                <div className="relative">
                   <Calendar className="absolute left-3 top-3.5 text-gray-400" size={18} />
                   <input name="expiryDate" type="date" value={formData.expiryDate} onChange={handleChange} className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 outline-none" required />
                </div>
                <select name="categoryId" value={formData.categoryId} onChange={handleChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 outline-none cursor-pointer" required>
                  <option value="">Select Category</option>
                  {categories.map((cat: any) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
                <button type="submit" disabled={isLoading} className={`w-full text-white py-3 rounded-xl font-bold transition flex items-center justify-center gap-2 shadow-lg transform hover:-translate-y-0.5 ${isEditing ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/30' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/30'}`}>
                  {isLoading ? <Loader2 className="animate-spin" /> : isEditing ? "Update Product" : "Add Product"}
                </button>
              </form>
            </div>
          </div>

          {/* ================= RIGHT: TABLES ================= */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* 📦 Incoming Orders (Fixed Visibility) */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
               <div className="bg-gray-900 px-6 py-4 flex justify-between items-center">
                  <h2 className="text-white font-bold flex items-center gap-2 text-lg">
                    <ShoppingBag size={20} className="text-blue-400" /> Incoming Orders
                  </h2>
                  <span className="bg-blue-600 text-white text-xs px-2.5 py-1 rounded-full font-bold">{orders.length} Orders</span>
               </div>
               <div className="overflow-x-auto max-h-[300px] overflow-y-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold border-b border-gray-100 sticky top-0 z-10">
                      <tr>
                        <th className="p-4">Order ID</th>
                        <th className="p-4">Items</th>
                        <th className="p-4">Total</th>
                        <th className="p-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {orders.length === 0 ? (
                        <tr><td colSpan={4} className="p-10 text-center text-gray-400">No orders yet.</td></tr>
                      ) : (
                        orders.map((order) => (
                          <tr key={order.id} className="hover:bg-gray-50">
                            {/* ✅ Fixed: Text Colors */}
                            <td className="p-4">
                              <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-bold font-mono">#{order.id.slice(0, 6)}</span>
                            </td>
                            <td className="p-4 text-sm text-gray-700 font-medium">
                              {order.items.map((i: any) => i.medicine?.name).join(", ")}
                            </td>
                            <td className="p-4 font-bold text-gray-900">৳{order.totalAmount}</td>
                            <td className="p-4">
                              <select value={order.status} onChange={(e) => handleStatusUpdate(order.id, e.target.value)} className={`px-2 py-1 rounded text-xs font-bold border ${getStatusColor(order.status)}`}>
                                <option value="PLACED">Placed</option><option value="PROCESSING">Processing</option><option value="SHIPPED">Shipped</option><option value="DELIVERED">Delivered</option><option value="CANCELLED">Cancelled</option>
                              </select>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
               </div>
            </div>

            {/* 💊 My Products (Fixed Visibility + Edit Icon) */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-blue-600 px-6 py-4 flex justify-between items-center">
                <h2 className="text-white font-bold flex items-center gap-2 text-lg"><Layers size={20} /> My Products</h2>
                <span className="bg-white/20 text-white text-xs px-2.5 py-1 rounded-full font-bold">{medicines.length} Items</span>
              </div>
              <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-gray-600 text-xs uppercase font-bold border-b border-gray-200 sticky top-0 z-10">
                    <tr>
                      <th className="p-4">Name</th><th className="p-4">Price</th><th className="p-4">Stock</th><th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {medicines.length === 0 ? (
                      <tr><td colSpan={4} className="p-10 text-center text-gray-400">No products added yet.</td></tr>
                    ) : (
                      medicines.map((med) => (
                        <tr key={med.id} className="hover:bg-gray-50 transition group">
                          {/* ✅ Fixed: Text Colors */}
                          <td className="p-4 font-bold text-gray-800">{med.name}</td>
                          <td className="p-4 font-bold text-gray-600">৳{med.price}</td>
                          <td className="p-4"><span className={`px-2 py-1 rounded-full text-xs font-bold ${med.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{med.stock}</span></td>
                          <td className="p-4 text-right flex justify-end gap-2">
                            {/* Edit Button */}
                            <button onClick={() => handleEditClick(med)} className="text-amber-500 hover:bg-amber-50 p-2 rounded-lg transition" title="Edit">
                              <Pencil size={18} />
                            </button>
                            {/* Delete Button */}
                            <button onClick={() => handleDeleteMedicine(med.id)} className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition" title="Delete">
                              <Trash2 size={18} />
                            </button>
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