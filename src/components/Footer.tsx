"use client";

import Link from "next/link";
import { Pill, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 mt-auto border-t border-slate-800">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* 1. Brand Section */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <div className="bg-blue-600 text-white p-1.5 rounded-lg group-hover:bg-blue-500 transition">
                <Pill size={20} />
              </div>
              <span className="text-2xl font-bold text-white">MediStore</span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              Your trusted partner for authentic medicines and healthcare products. 
              Delivering health and happiness to your doorstep 24/7.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="bg-slate-800 p-2 rounded-full hover:bg-blue-600 hover:text-white transition-all duration-300">
                <Facebook size={18} />
              </Link>
              <Link href="#" className="bg-slate-800 p-2 rounded-full hover:bg-sky-500 hover:text-white transition-all duration-300">
                <Twitter size={18} />
              </Link>
              <Link href="#" className="bg-slate-800 p-2 rounded-full hover:bg-pink-600 hover:text-white transition-all duration-300">
                <Instagram size={18} />
              </Link>
              <Link href="#" className="bg-slate-800 p-2 rounded-full hover:bg-blue-700 hover:text-white transition-all duration-300">
                <Linkedin size={18} />
              </Link>
            </div>
          </div>

          {/* 2. Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/" className="hover:text-blue-400 transition-colors flex items-center gap-2">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-blue-400 transition-colors flex items-center gap-2">
                  All Medicines
                </Link>
              </li>
              <li>
                <Link href="/dashboard/customer" className="hover:text-blue-400 transition-colors flex items-center gap-2">
                  My Orders
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-blue-400 transition-colors flex items-center gap-2">
                  Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* 3. Customer Support */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6">Support</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="#" className="hover:text-blue-400 transition-colors">Help Center</Link></li>
              <li><Link href="#" className="hover:text-blue-400 transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-blue-400 transition-colors">Return Policy</Link></li>
              <li><Link href="#" className="hover:text-blue-400 transition-colors">FAQs</Link></li>
            </ul>
          </div>

          {/* 4. Contact Info */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-slate-400">
                <MapPin className="text-blue-500 mt-0.5 shrink-0" size={18} />
                <span>123 Health Street, Dhanmondi,<br />Dhaka-1209, Bangladesh</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-400">
                <Phone className="text-blue-500 shrink-0" size={18} />
                <span>+880 1234 567 890</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-400">
                <Mail className="text-blue-500 shrink-0" size={18} />
                <span>support@medistore.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} MediStore. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms</Link>
            <Link href="#" className="hover:text-white transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}