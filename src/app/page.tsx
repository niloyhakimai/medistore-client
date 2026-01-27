import Link from "next/link";
import { ArrowRight, Truck, ShieldCheck, PhoneCall, Star, CheckCircle } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50">
      
      {/* 1. Hero Section (Modern Gradient & Layout) */}
      <header className="relative bg-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 opacity-10 blur-3xl"></div>
        <div className="container mx-auto px-6 py-24 md:py-32 relative z-10 text-center">
          <div className="inline-block mb-4 px-4 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold tracking-wide animate-pulse">
            🚀 Fast Delivery in 24 Hours
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 leading-tight">
            Your Health, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
              Our Priority.
            </span>
          </h1>
          <p className="text-lg md:text-xl mb-10 text-gray-600 max-w-2xl mx-auto">
            Get 100% authentic medicines delivered to your doorstep. Trusted by over 10,000+ customers for genuine healthcare products.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <Link
              href="/shop"
              className="flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-blue-500/50 hover:scale-105 transition-all duration-300"
            >
              Order Medicine <ArrowRight size={20} />
            </Link>
            <Link
              href="/register"
              className="flex items-center justify-center gap-2 bg-white text-gray-800 border border-gray-200 font-bold py-4 px-8 rounded-full hover:bg-gray-50 hover:border-blue-300 transition-all duration-300"
            >
              Create Account
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Stats Section (Trust Building) */}
      <section className="border-y border-gray-100 bg-white">
        <div className="container mx-auto px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: "Happy Customers", value: "10k+" },
              { label: "Medicines Available", value: "5000+" },
              { label: "Fast Delivery", value: "24h" },
              { label: "Authentic Products", value: "100%" },
            ].map((stat, index) => (
              <div key={index}>
                <h4 className="text-3xl font-bold text-gray-900">{stat.value}</h4>
                <p className="text-sm text-gray-500 uppercase tracking-wide">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Features Section (Why Choose Us) */}
      <section className="py-20 container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose MediStore?</h2>
          <p className="text-gray-500 max-w-xl mx-auto">We focus on safety, speed, and reliability so you can focus on getting better.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="group bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-blue-200 transition-all duration-300 hover:-translate-y-2">
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Truck size={28} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">Super Fast Delivery</h3>
            <p className="text-gray-500 leading-relaxed">We understand urgency. Get your essential medicines delivered within hours, not days.</p>
          </div>

          {/* Feature 2 */}
          <div className="group bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-green-200 transition-all duration-300 hover:-translate-y-2">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6 group-hover:bg-green-600 group-hover:text-white transition-colors">
              <ShieldCheck size={28} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">100% Authentic</h3>
            <p className="text-gray-500 leading-relaxed">No compromise on health. We source directly from authorized manufacturers.</p>
          </div>

          {/* Feature 3 */}
          <div className="group bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-purple-200 transition-all duration-300 hover:-translate-y-2">
            <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mb-6 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <PhoneCall size={28} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">24/7 Expert Support</h3>
            <p className="text-gray-500 leading-relaxed">Have questions about dosage? Our expert pharmacists are just a call away.</p>
          </div>
        </div>
      </section>

      {/* 4. Popular Categories (Modern Cards) */}
      <section className="bg-gray-50 py-20 relative overflow-hidden">
        {/* Decorative Background Blob */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Shop by Category</h2>
              <p className="text-gray-500">Find what you need quickly</p>
            </div>
            <Link href="/shop" className="text-blue-600 font-semibold hover:underline hidden md:block">
              View All Categories &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Tablet', color: 'bg-blue-50 text-blue-600', icon: '💊' },
              { name: 'Syrup', color: 'bg-amber-50 text-amber-600', icon: '🥤' },
              { name: 'Injection', color: 'bg-rose-50 text-rose-600', icon: '💉' },
              { name: 'Supplements', color: 'bg-emerald-50 text-emerald-600', icon: '🥗' }
            ].map((cat) => (
              <Link 
                href="/shop" 
                key={cat.name} 
                className="group bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-transparent hover:border-gray-200 text-center"
              >
                <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center text-3xl mb-4 ${cat.color} group-hover:scale-110 transition-transform`}>
                  {cat.icon}
                </div>
                <h3 className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors">{cat.name}</h3>
              </Link>
            ))}
          </div>
          
          <div className="mt-8 text-center md:hidden">
             <Link href="/shop" className="text-blue-600 font-semibold hover:underline">
              View All Categories &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Discount CTA (Modern Dark Theme) */}
      <section className="py-24 bg-gray-900 text-white relative overflow-hidden">
        {/* Abstract shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
           <div className="absolute -top-[50%] -left-[10%] w-[500px] h-[500px] rounded-full bg-blue-600 opacity-20 blur-[100px]"></div>
           <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-cyan-500 opacity-20 blur-[100px]"></div>
        </div>

        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-full px-4 py-1 mb-6">
             <Star className="text-yellow-400 w-4 h-4" fill="currentColor" />
             <span className="text-sm font-medium text-gray-300">New User Offer</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Get <span className="text-yellow-400">10% OFF</span> on First Order</h2>
          <p className="text-gray-400 mb-10 text-lg max-w-xl mx-auto">
            Experience the best healthcare service. Use code <span className="bg-gray-800 text-yellow-400 px-2 py-1 rounded font-mono border border-gray-700">WELCOME10</span> at checkout.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold py-4 px-10 rounded-full shadow-lg hover:shadow-cyan-500/30 transition-all duration-300 transform hover:-translate-y-1"
          >
            Create Free Account <CheckCircle size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}