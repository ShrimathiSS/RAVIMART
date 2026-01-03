import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ShoppingCart, LogOut, Search, Menu, MapPin, User as UserIcon, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Initialize with URL param if it exists, otherwise empty
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

  // Sync local state with URL changes (e.g. if user goes back/forward)
  useEffect(() => {
    setSearchTerm(searchParams.get('search') || '');
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Trim whitespace to avoid empty searches
    const term = searchTerm.trim();
    if (term) {
      navigate(`/products?search=${encodeURIComponent(term)}`);
    } else {
      navigate('/products');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Specific categories for Electrical & Hardware
  const navCategories = [
    'Electricals', 'Tools', 'Hardware', 'Lighting', 'Plumbing', 'Safety Gear', 'Switches', 'Wires & Cables'
  ];

  return (
    <div className="flex flex-col w-full">
      {/* Main Navbar - Amazon Style Dark Blue */}
      <nav className="bg-[#131921] text-white sticky top-0 z-50">
        <div className="max-w-[1500px] mx-auto px-4 py-2">
          <div className="flex items-center gap-4 h-14">
            {/* Logo */}
            <Link to="/" className="flex items-center pt-2 hover:outline outline-1 outline-white rounded-sm p-1">
              <span className="text-2xl font-bold tracking-tight">Ravi<span className="text-[#febd69]">Mart</span></span>
              <span className="mb-4 text-[#febd69] text-xs">.in</span>
            </Link>

            {/* Location (Hidden on mobile) */}
            <div className="hidden md:flex flex-col text-xs leading-none ml-2 p-2 hover:outline outline-1 outline-white rounded-sm cursor-pointer">
              <span className="text-gray-300 ml-4">Deliver to</span>
              <div className="flex items-center font-bold">
                <MapPin className="w-4 h-4 mr-1" />
                <span>India</span>
              </div>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 flex h-10 rounded-md overflow-hidden focus-within:ring-3 focus-within:ring-[#febd69]">
              <div className="bg-gray-100 text-gray-600 px-3 flex items-center text-xs border-r border-gray-300 cursor-pointer hover:bg-gray-200">
                All
              </div>
              <input 
                type="text"
                placeholder="Search RaviMart..."
                className="flex-1 px-4 text-black outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit" className="bg-[#febd69] hover:bg-[#f3a847] px-4 flex items-center justify-center text-gray-900">
                <Search className="w-5 h-5" />
              </button>
            </form>

            {/* Right Side Actions */}
            <div className="flex items-center gap-4">
              {/* Account & Lists */}
              <Link to={user ? (user.role === 'admin' ? '/admin' : '/dashboard') : '/login'} className="hidden md:block leading-none p-2 hover:outline outline-1 outline-white rounded-sm">
                <div className="text-xs text-gray-300 flex items-center gap-1">
                  Hello, {user ? user.name.split(' ')[0] : 'Sign in'}
                  {user?.role === 'admin' && <Shield className="w-3 h-3 text-[#febd69]" />}
                </div>
                <div className="font-bold text-sm flex items-center">
                  {user ? (user.role === 'admin' ? 'Admin Dashboard' : 'Account & Lists') : 'Account & Lists'}
                </div>
              </Link>

              {/* Orders */}
              {user?.role !== 'admin' && (
                <Link to="/dashboard" className="hidden md:block leading-none p-2 hover:outline outline-1 outline-white rounded-sm">
                  <div className="text-xs text-gray-300">Returns</div>
                  <div className="font-bold text-sm">& Orders</div>
                </Link>
              )}

              {/* Cart */}
              <Link to="/cart" className="flex items-end p-2 hover:outline outline-1 outline-white rounded-sm relative">
                <div className="relative">
                  <ShoppingCart className="w-8 h-8" />
                  <span className="absolute -top-1 -right-1 bg-[#febd69] text-[#131921] font-bold text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cart.length}
                  </span>
                </div>
                <span className="font-bold text-sm mb-1 ml-1 hidden md:block">Cart</span>
              </Link>

              {user && (
                <button onClick={handleLogout} className="text-sm font-bold hover:text-[#febd69] flex items-center gap-1">
                  <LogOut className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Secondary Navbar */}
      <div className="bg-[#232f3e] text-white text-sm py-1.5 px-4 overflow-x-auto">
        <div className="max-w-[1500px] mx-auto flex items-center gap-6 whitespace-nowrap">
          <button className="flex items-center font-bold gap-1 hover:outline outline-1 outline-white p-1 rounded-sm">
            <Menu className="w-5 h-5" /> All
          </button>
          {navCategories.map((item) => (
            <Link key={item} to={`/products?category=${item.toLowerCase().split(' ')[0]}`} className="hover:outline outline-1 outline-white p-1 rounded-sm">
              {item}
            </Link>
          ))}
          <Link to="/products" className="hover:outline outline-1 outline-white p-1 rounded-sm ml-auto font-bold text-[#febd69]">
            Bulk Orders
          </Link>
        </div>
      </div>
    </div>
  );
};
