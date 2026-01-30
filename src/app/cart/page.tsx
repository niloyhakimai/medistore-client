"use client";

import { useEffect, useState } from "react";
import api from "@/utils/api";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Trash2, MapPin, ShoppingBag, ArrowRight, Pill, CreditCard, Loader2 } from "lucide-react";

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 1. Load Cart
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(savedCart);
    calculateTotal(savedCart);
  }, []);

  const calculateTotal = (items: any[]) => {
    const t = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
    setTotal(t);
  };

  // 2. Handle Place Order
  const handleOrder = async () => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      toast.error("Please login to place an order!");
      router.push("/login");
      return;
    }

    if (!address.trim()) {
      toast.error("Please enter a shipping address!");
      return;
    }

    setIsLoading(true);

    try {
      const orderData = {
        items: cart.map(item => ({
          medicineId: item.medicineId,
          quantity: item.quantity
        })),
        address: address
      };

      const res = await api.post("/orders", orderData);

      if (res.status === 201) {
        // ✅ Success Message Show
        toast.success("Order Placed Successfully! 🎉 Redirecting...");
        
        // Clear Cart Data
        localStorage.removeItem("cart");
        setCart([]);
        window.dispatchEvent(new Event("storage")); // Update navbar cart count
        
        // ⏳ 2 Seconds Delay before Redirect
        setTimeout(() => {
           router.push("/dashboard/customer");
        }, 2000);
      }
    } catch (err: any) {
      console.log(err);
      toast.error("Failed to place order. Try again.");
      setIsLoading(false); // Stop loading only if error occurs
    } 
    // Note: We removed 'finally' block so loading spinner stays during the 2s delay
  };

  // 3. Remove Item
  const removeItem = (id: string) => {
    const newCart = cart.filter((item) => item.medicineId !== id);
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
    calculateTotal(newCart);
    window.dispatchEvent(new Event("storage")); // Update navbar
    toast.success("Item removed");
  };

  // Empty State
  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-full shadow-sm mb-6">
          <ShoppingBag size={64} className="text-gray-300" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Cart is Empty</h2>
        <p className="text-gray-500 mb-8 text-center max-w-md">Looks like you haven't added any medicines yet.</p>
        <Link 
          href="/shop" 
          className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition flex items-center gap-2 shadow-lg shadow-blue-200"
        >
          Start Shopping <ArrowRight size={20} />
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 sm:px-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
          <ShoppingBag className="text-blue-600" /> Shopping Cart
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Side: Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div key={item.medicineId} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 transition hover:shadow-md">
                
                {/* Item Info */}
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="w-16 h-16 bg-blue-50 rounded-lg flex items-center justify-center text-blue-500 shrink-0">
                    <Pill size={32} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-500 flex items-center gap-2">
                      Unit Price: <span className="font-semibold text-gray-700">৳{item.price}</span>
                    </p>
                  </div>
                </div>

                {/* Quantity & Total */}
                <div className="flex items-center justify-between w-full sm:w-auto gap-6">
                  <div className="bg-gray-100 px-3 py-1 rounded-lg text-sm font-medium text-gray-700">
                    Qty: {item.quantity}
                  </div>
                  <div className="font-bold text-lg text-blue-600 w-24 text-right">
                    ৳{(item.price * item.quantity).toFixed(2)}
                  </div>
                  <button 
                    onClick={() => removeItem(item.medicineId)}
                    className="text-gray-400 hover:text-red-500 transition p-2 hover:bg-red-50 rounded-full"
                    title="Remove Item"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Right Side: Order Summary */}
          <div className="h-fit">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <CreditCard size={20} className="text-gray-500" /> Order Summary
              </h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Total Items</span>
                  <span className="font-medium text-gray-900">{cart.length}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">৳{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Charge</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="border-t border-dashed border-gray-200 pt-3 flex justify-between text-xl font-bold text-gray-900">
                  <span>Total Amount</span>
                  <span>৳{total.toFixed(2)}</span>
                </div>
              </div>

              {/* Address Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                  <MapPin size={16} /> Shipping Address
                </label>
                <textarea
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm resize-none text-gray-900 placeholder-gray-400"
                  rows={3}
                  placeholder="House #123, Road #5, Dhaka..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <button
                onClick={handleOrder}
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg hover:shadow-blue-500/30 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} /> Processing...
                  </>
                ) : (
                  <>
                    Place Order (COD) <ArrowRight size={20} />
                  </>
                )}
              </button>
              
              <p className="text-xs text-center text-gray-400 mt-4">
                100% Secure Checkout • Cash on Delivery Available
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}