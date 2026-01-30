"use client";

import { useEffect, useState } from "react";
import api from "@/utils/api";
import toast from "react-hot-toast";
import { 
  Users, ShoppingBag, DollarSign, Activity, 
  Settings, TrendingUp, Package, Truck, CheckCircle, XCircle, Clock, Loader2, Ban, ShieldCheck 
} from "lucide-react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview"); // 'overview' or 'users'
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalUsers: 0,
    recentOrders: []
  });
  const [users, setUsers] = useState<any[]>([]); // Users List
  const [loading, setLoading] = useState(true);

  // 1. Fetch Stats & Users
  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await api.get("/admin/stats");
        setStats(statsRes.data.data);

        const usersRes = await api.get("/admin/users");
        setUsers(usersRes.data.data);
      } catch (err) {
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 2. Handle Ban/Unban User
  const toggleBan = async (userId: string, currentStatus: boolean) => {
    try {
      const res = await api.patch(`/admin/users/${userId}`, { isBanned: !currentStatus });
      toast.success(res.data.message);
      
      // Update Local State
      setUsers((prev) => prev.map(user => 
        user.id === userId ? { ...user, isBanned: !currentStatus } : user
      ));
    } catch (err) {
      toast.error("Failed to update user status");
    }
  };

  // Helper function for Status Colors
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "PLACED": return { style: "bg-blue-500/10 text-blue-400 border-blue-500/20", icon: <Clock size={14} /> };
      case "PROCESSING": return { style: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20", icon: <Activity size={14} /> };
      case "SHIPPED": return { style: "bg-purple-500/10 text-purple-400 border-purple-500/20", icon: <Truck size={14} /> };
      case "DELIVERED": return { style: "bg-green-500/10 text-green-400 border-green-500/20", icon: <CheckCircle size={14} /> };
      case "CANCELLED": return { style: "bg-red-500/10 text-red-400 border-red-500/20", icon: <XCircle size={14} /> };
      default: return { style: "bg-gray-500/10 text-gray-400 border-gray-500/20", icon: <Package size={14} /> };
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-blue-500" size={48} />
          <p className="text-gray-400 font-medium">Loading Admin Panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="container mx-auto max-w-6xl">
        
        {/* Header & Tabs */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <span className="bg-blue-600/20 text-blue-500 p-2 rounded-lg">🛡️</span> Admin Panel
            </h1>
            <p className="text-gray-400 mt-1">Manage system overview and users.</p>
          </div>
          
          <div className="flex gap-2 bg-gray-800 p-1 rounded-lg">
            <button 
              onClick={() => setActiveTab("overview")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${activeTab === 'overview' ? 'bg-blue-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
            >
              Overview
            </button>
            <button 
              onClick={() => setActiveTab("users")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${activeTab === 'users' ? 'bg-blue-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
            >
              User Management
            </button>
          </div>
        </div>

        {/* ==================== TAB 1: OVERVIEW ==================== */}
        {activeTab === "overview" && (
          <div className="animate-in fade-in slide-in-from-bottom-5 duration-500">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-lg relative overflow-hidden group hover:border-blue-500/30 transition">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-green-500/10 text-green-500 rounded-xl"><DollarSign size={24} /></div>
                  <h3 className="text-gray-400 font-medium">Total Revenue</h3>
                </div>
                <p className="text-4xl font-bold text-white mb-2">৳{stats.totalSales.toFixed(2)}</p>
                <p className="text-green-500 text-sm flex items-center gap-1"><TrendingUp size={14} /> +12.5% from last month</p>
              </div>

              <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-lg relative overflow-hidden group hover:border-blue-500/30 transition">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl"><ShoppingBag size={24} /></div>
                  <h3 className="text-gray-400 font-medium">Total Orders</h3>
                </div>
                <p className="text-4xl font-bold text-white mb-2">{stats.totalOrders}</p>
                <p className="text-blue-400 text-sm flex items-center gap-1"><Package size={14} /> New orders arriving</p>
              </div>

              <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-lg relative overflow-hidden group hover:border-blue-500/30 transition">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-purple-500/10 text-purple-500 rounded-xl"><Users size={24} /></div>
                  <h3 className="text-gray-400 font-medium">Active Users</h3>
                </div>
                <p className="text-4xl font-bold text-white mb-2">{stats.totalUsers}</p>
                <p className="text-purple-400 text-sm flex items-center gap-1"><Activity size={14} /> Growing community</p>
              </div>
            </div>

            {/* Recent Orders Table */}
            <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden shadow-xl">
              <div className="p-6 border-b border-gray-700 flex justify-between items-center bg-gray-800/50">
                <h2 className="text-xl font-bold text-white flex items-center gap-2"><Package size={20} className="text-blue-500" /> Recent Orders</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-900/50 text-gray-400 text-xs uppercase tracking-wider">
                    <tr><th className="p-4">Order ID</th><th className="p-4">Customer</th><th className="p-4">Amount</th><th className="p-4">Status</th><th className="p-4">Date</th></tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {stats.recentOrders.length > 0 ? (
                      stats.recentOrders.map((order: any) => {
                        const statusConfig = getStatusStyle(order.status);
                        return (
                          <tr key={order.id} className="hover:bg-gray-700/30 transition">
                            <td className="p-4 text-sm font-mono text-gray-300">#{order.id.slice(0, 8)}</td>
                            <td className="p-4"><span className="font-medium text-gray-200">{order.user?.name || "Guest"}</span></td>
                            <td className="p-4 font-bold text-white">৳{order.totalAmount.toFixed(2)}</td>
                            <td className="p-4"><span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusConfig.style}`}>{statusConfig.icon} {order.status}</span></td>
                            <td className="p-4 text-gray-400 text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr><td colSpan={5} className="p-12 text-center text-gray-500">No recent orders found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 2: USER MANAGEMENT ==================== */}
        {activeTab === "users" && (
          <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden shadow-xl animate-in fade-in slide-in-from-bottom-5 duration-500">
            <div className="p-6 border-b border-gray-700 flex justify-between items-center bg-gray-800/50">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Users size={20} className="text-purple-500" /> User Management
              </h2>
              <span className="bg-gray-700 text-white text-xs px-2 py-1 rounded-full">{users.length} Users</span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-900/50 text-gray-400 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-700/30 transition">
                      <td className="p-4 font-bold text-white">{user.name}</td>
                      <td className="p-4 text-gray-300">{user.email}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${user.role === 'ADMIN' ? 'bg-red-500/20 text-red-400' : user.role === 'SELLER' ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-600/20 text-gray-300'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="p-4">
                        {user.isBanned ? (
                          <span className="flex items-center gap-1 text-red-400 text-sm"><Ban size={14} /> Banned</span>
                        ) : (
                          <span className="flex items-center gap-1 text-green-400 text-sm"><CheckCircle size={14} /> Active</span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        {user.role !== "ADMIN" && (
                          <button 
                            onClick={() => toggleBan(user.id, user.isBanned)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ml-auto
                              ${user.isBanned 
                                ? "bg-green-600 hover:bg-green-700 text-white" 
                                : "bg-red-600 hover:bg-red-700 text-white"
                              }
                            `}
                          >
                            {user.isBanned ? <><ShieldCheck size={14} /> Unban User</> : <><Ban size={14} /> Ban User</>}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}