"use client";

import { useEffect, useState } from "react";
import api from "@/utils/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { 
  Package, Calendar, DollarSign, Clock, Truck, 
  CheckCircle, XCircle, ShoppingBag, ArrowRight, Loader2, RefreshCw 
} from "lucide-react";

export default function CustomerDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch Orders
  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }
      const res = await api.get("/orders");
      setOrders(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [router]);

  // Cancel Order Function (Optional Feature)
  const handleCancelOrder = async (orderId: string) => {
    if(!confirm("Are you sure you want to cancel this order?")) return;
    
    try {
      // Backend route must exist for this: router.patch('/orders/:id/cancel', cancelOrder)
      // Assuming you set it up, otherwise this part can be removed
      await api.patch(`/orders/${orderId}/cancel`); 
      toast.success("Order cancelled successfully");
      fetchOrders(); // Refresh list
    } catch (err) {
      toast.error("Failed to cancel order");
    }
  };

  // Helper to get Status Styles
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PLACED":
        return {
          color: "bg-blue-50 text-blue-700 border-blue-200",
          icon: <Clock size={14} />,
          label: "Order Placed"
        };
      case "PROCESSING":
        return {
          color: "bg-amber-50 text-amber-700 border-amber-200",
          icon: <RefreshCw size={14} className="animate-spin-slow" />,
          label: "Processing"
        };
      case "SHIPPED":
        return {
          color: "bg-indigo-50 text-indigo-700 border-indigo-200",
          icon: <Truck size={14} />,
          label: "Shipped"
        };
      case "DELIVERED":
        return {
          color: "bg-emerald-50 text-emerald-700 border-emerald-200",
          icon: <CheckCircle size={14} />,
          label: "Delivered"
        };
      case "CANCELLED":
        return {
          color: "bg-red-50 text-red-700 border-red-200",
          icon: <XCircle size={14} />,
          label: "Cancelled"
        };
      default:
        return {
          color: "bg-gray-50 text-gray-700 border-gray-200",
          icon: <Package size={14} />,
          label: status
        };
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-blue-600" size={48} />
          <p className="text-gray-500 font-medium">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-200">
              <Package size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
              <p className="text-gray-500">Track and manage your recent purchases.</p>
            </div>
          </div>
          <Link href="/shop" className="hidden sm:flex items-center gap-2 text-blue-600 font-semibold hover:underline">
            Browse Medicines <ArrowRight size={18} />
          </Link>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          // Empty State
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
              <ShoppingBag size={48} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Orders Yet</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Your order history is empty. Start shopping to find authentic medicines delivered to your door.
            </p>
            <Link 
              href="/shop" 
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition hover:shadow-lg hover:shadow-blue-500/30"
            >
              Start Shopping <ArrowRight size={20} />
            </Link>
          </div>
        ) : (
          // Order Table
          <div className="bg-white rounded-2xl shadow-lg shadow-gray-100 border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider">
                    <th className="py-5 px-6 font-bold">Order ID</th>
                    <th className="py-5 px-6 font-bold">Date</th>
                    <th className="py-5 px-6 font-bold">Items</th>
                    <th className="py-5 px-6 font-bold">Total</th>
                    <th className="py-5 px-6 font-bold">Status</th>
                    <th className="py-5 px-6 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {orders.map((order) => {
                    const statusStyle = getStatusBadge(order.status);
                    
                    return (
                      <tr key={order.id} className="group hover:bg-blue-50/30 transition duration-200">
                        
                        {/* Order ID */}
                        <td className="py-5 px-6">
                          <span className="font-mono text-sm font-medium text-gray-600 group-hover:text-blue-600 transition">
                            #{order.id.slice(0, 8)}
                          </span>
                        </td>

                        {/* Date */}
                        <td className="py-5 px-6">
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Calendar size={16} />
                            {new Date(order.createdAt).toLocaleDateString()}
                          </div>
                        </td>

                        {/* Items Summary */}
                        <td className="py-5 px-6">
                          <div className="text-sm font-medium text-gray-900">
                            {order.items && order.items.length > 0 ? (
                              <div className="flex flex-col">
                                <span>{order.items[0].medicine?.name}</span>
                                {order.items.length > 1 && (
                                  <span className="text-xs text-gray-400">
                                    + {order.items.length - 1} other items
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-gray-400 italic">No details</span>
                            )}
                          </div>
                        </td>

                        {/* Total Amount */}
                        <td className="py-5 px-6">
                          <div className="flex items-center gap-1 font-bold text-gray-900">
                            <DollarSign size={14} className="text-gray-400" />
                            {order.totalAmount.toFixed(2)}
                          </div>
                        </td>

                        {/* Status Badge */}
                        <td className="py-5 px-6">
                          <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border ${statusStyle.color}`}>
                            {statusStyle.icon}
                            {statusStyle.label}
                          </span>
                        </td>

                        {/* Action (Cancel) */}
                        <td className="py-5 px-6 text-right">
                          {order.status === "PLACED" && (
                            <button 
                              onClick={() => handleCancelOrder(order.id)}
                              className="text-xs font-semibold text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded transition"
                            >
                              Cancel Order
                            </button>
                          )}
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}