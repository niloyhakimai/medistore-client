"use client";

import { useEffect, useState } from "react";
import api from "@/utils/api";
import toast from "react-hot-toast";
import { 
  Users, ShoppingBag, DollarSign, Activity, 
  Settings, TrendingUp, Package, Truck, CheckCircle, XCircle, Clock, Loader2 
} from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalUsers: 0,
    recentOrders: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/admin/stats");
        setStats(res.data.data);
      } catch (err) {
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Helper function for Status Colors in Dark Mode
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "PLACED":
        return { 
          style: "bg-blue-500/10 text-blue-400 border-blue-500/20", 
          icon: <Clock size={14} /> 
        };
      case "PROCESSING":
        return { 
          style: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20", 
          icon: <Activity size={14} /> 
        };
      case "SHIPPED":
        return { 
          style: "bg-purple-500/10 text-purple-400 border-purple-500/20", 
          icon: <Truck size={14} /> 
        };
      case "DELIVERED":
        return { 
          style: "bg-green-500/10 text-green-400 border-green-500/20", 
          icon: <CheckCircle size={14} /> 
        };
      case "CANCELLED":
        return { 
          style: "bg-red-500/10 text-red-400 border-red-500/20", 
          icon: <XCircle size={14} /> 
        };
      default:
        return { 
          style: "bg-gray-500/10 text-gray-400 border-gray-500/20", 
          icon: <Package size={14} /> 
        };
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-blue-500" size={48} />
          <p className="text-gray-400 font-medium">Loading Admin Analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="container mx-auto max-w-6xl">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <span className="bg-blue-600/20 text-blue-500 p-2 rounded-lg">🛡️</span> Admin Overview
            </h1>
            <p className="text-gray-400 mt-1">Welcome back, Administrator.</p>
          </div>
          <div className="flex gap-3">
            <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition border border-gray-700">
              <Settings size={18} /> Settings
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition font-medium shadow-lg shadow-blue-900/50">
              <Activity size={18} /> View Reports
            </button>
          </div>
        </div>

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Total Sales */}
          <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-lg relative overflow-hidden group hover:border-blue-500/30 transition duration-300">
            <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
              <DollarSign size={100} />
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-green-500/10 text-green-500 rounded-xl">
                <DollarSign size={24} />
              </div>
              <h3 className="text-gray-400 font-medium">Total Revenue</h3>
            </div>
            <p className="text-4xl font-bold text-white mb-2">
              ${stats.totalSales.toFixed(2)}
            </p>
            <p className="text-green-500 text-sm flex items-center gap-1">
              <TrendingUp size={14} /> +12.5% from last month
            </p>
          </div>

          {/* Total Orders */}
          <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-lg relative overflow-hidden group hover:border-blue-500/30 transition duration-300">
            <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
              <ShoppingBag size={100} />
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl">
                <ShoppingBag size={24} />
              </div>
              <h3 className="text-gray-400 font-medium">Total Orders</h3>
            </div>
            <p className="text-4xl font-bold text-white mb-2">
              {stats.totalOrders}
            </p>
            <p className="text-blue-400 text-sm flex items-center gap-1">
              <Package size={14} /> New orders arriving
            </p>
          </div>

          {/* Total Users */}
          <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-lg relative overflow-hidden group hover:border-blue-500/30 transition duration-300">
            <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
              <Users size={100} />
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-purple-500/10 text-purple-500 rounded-xl">
                <Users size={24} />
              </div>
              <h3 className="text-gray-400 font-medium">Active Users</h3>
            </div>
            <p className="text-4xl font-bold text-white mb-2">
              {stats.totalUsers}
            </p>
            <p className="text-purple-400 text-sm flex items-center gap-1">
              <Activity size={14} /> Growing community
            </p>
          </div>
        </div>

        {/* Recent Orders Table */}
        <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden shadow-xl">
          <div className="p-6 border-b border-gray-700 flex justify-between items-center bg-gray-800/50">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Package size={20} className="text-blue-500" /> Recent Orders
            </h2>
            <button className="text-sm text-blue-400 hover:text-blue-300 transition hover:underline">View All Orders</button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-900/50 text-gray-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="p-4 font-semibold">Order ID</th>
                  <th className="p-4 font-semibold">Customer</th>
                  <th className="p-4 font-semibold">Amount</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {stats.recentOrders.length > 0 ? (
                  stats.recentOrders.map((order: any) => {
                    const statusConfig = getStatusStyle(order.status);
                    
                    return (
                      <tr key={order.id} className="hover:bg-gray-700/30 transition duration-150">
                        <td className="p-4 text-sm font-mono text-gray-300">
                          #{order.id.slice(0, 8)}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-xs font-bold shadow-md">
                              {order.user?.name?.charAt(0).toUpperCase() || "U"}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-medium text-gray-200">{order.user?.name || "Guest"}</span>
                              <span className="text-xs text-gray-500">{order.user?.email}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 font-bold text-white">
                          ${order.totalAmount.toFixed(2)}
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusConfig.style}`}>
                            {statusConfig.icon}
                            {order.status}
                          </span>
                        </td>
                        <td className="p-4 text-gray-400 text-sm">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-gray-500 flex flex-col items-center gap-3">
                      <Package size={40} className="text-gray-600" />
                      No recent orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}