"use client";

import { useEffect, useState } from "react";
import api from "@/utils/api";
import { useRouter } from "next/navigation";

export default function CustomerDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const res = await api.get("/orders"); // আমাদের বানানো API
        setOrders(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [router]);

  if (loading) return <div className="text-center mt-20">Loading Dashboard...</div>;

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-blue-600">My Order History</h1>

      {orders.length === 0 ? (
        <div className="text-center p-10 bg-gray-50 rounded">
          <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded shadow-md">
            <thead>
              <tr className="bg-blue-50 text-left">
                <th className="py-3 px-4 border-b">Order ID</th>
                <th className="py-3 px-4 border-b">Date</th>
                <th className="py-3 px-4 border-b">Total Amount</th>
                <th className="py-3 px-4 border-b">Status</th>
                <th className="py-3 px-4 border-b">Details</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 border-b text-sm font-mono">{order.id.slice(0, 8)}...</td>
                  <td className="py-3 px-4 border-b">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 border-b font-bold">${order.totalAmount.toFixed(2)}</td>
                  <td className="py-3 px-4 border-b">
                    <span className={`px-2 py-1 rounded text-xs font-bold
                      ${order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' : ''}
                      ${order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' : ''}
                    `}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 border-b text-sm text-gray-500">
                    {order.items.length} Items
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}