import React from 'react';
import { Navbar } from './Navbar';
import { Outlet } from 'react-router-dom';
import { MapPin, Phone, Mail } from 'lucide-react';

export const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-grow">
        <Outlet />
      </main>
      
      <footer className="bg-[#232F3E] text-white mt-auto">
        <div className="max-w-[1500px] mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Ravi<span className="text-[#febd69]">Mart</span></h3>
              <p className="text-gray-300 text-sm leading-relaxed mb-4">
                Your one-stop destination for high-quality electrical, hardware, and industrial tools. 
                Serving Erode with pride.
              </p>
              <div className="text-sm text-gray-400">
                <p>GSTIN: 33ANNPR9745D1ZL</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Contact Us</h3>
              <div className="space-y-3 text-sm text-gray-300">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#febd69] flex-shrink-0" />
                  <p>
                    117, Myladi Main Road, APT Complex,<br />
                    M. Anumanpalli, Erode-638 101
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-[#febd69] flex-shrink-0" />
                  <div>
                    <p>Cell: 98427 39425, 98429 78995</p>
                    <p>Shop: 04294 – 239425</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="/products" className="hover:text-[#febd69] hover:underline">All Products</a></li>
                <li><a href="/dashboard" className="hover:text-[#febd69] hover:underline">Your Account</a></li>
                <li><a href="/cart" className="hover:text-[#febd69] hover:underline">Shopping Cart</a></li>
                <li><a href="#" className="hover:text-[#febd69] hover:underline">Returns Policy</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="bg-[#131A22] py-4 text-center text-xs text-gray-400">
          © 2025 RaviMart. All rights reserved.
        </div>
      </footer>
    </div>
  );
};
