import React from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { formatPrice } from '../lib/utils';
import { StarRating } from '../components/ui/StarRating';

export const Home = () => {
  const { products } = useProducts();

  // Group products for display
  const tools = products.filter(p => p.category === 'tools').slice(0, 4);
  const electrical = products.filter(p => p.category === 'electrical').slice(0, 4);
  const lighting = products.filter(p => p.category === 'lighting').slice(0, 4);

  return (
    <div className="bg-gray-100 min-h-screen pb-12">
      {/* Hero Carousel (Static for now) */}
      <div className="relative w-full h-[250px] md:h-[400px] bg-gray-800 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-100 to-transparent z-10 h-full w-full pointer-events-none" />
        <img 
          src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1600" 
          alt="Hero" 
          className="w-full h-full object-cover object-center opacity-80"
        />
        <div className="absolute top-10 md:top-20 left-4 md:left-20 z-20 max-w-xl">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 drop-shadow-md">
            Heavy Duty <br />
            <span className="text-[#febd69]">Electricals & Hardware</span>
          </h1>
          <p className="text-white text-lg mb-6 drop-shadow-md">Professional grade tools, wiring, and plumbing essentials for your projects.</p>
          <Link to="/products" className="inline-block bg-[#febd69] hover:bg-[#f3a847] text-gray-900 font-bold py-2 px-6 rounded-md shadow-md transition-transform hover:scale-105">
            Explore Catalog
          </Link>
        </div>
      </div>

      <div className="max-w-[1500px] mx-auto px-4 -mt-20 md:-mt-40 relative z-30">
        {/* Category Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { title: 'Electrical Supplies', img: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&q=80&w=400', link: '/products?category=electrical' },
            { title: 'Power Tools', img: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=400', link: '/products?category=tools' },
            { title: 'Plumbing & Pipes', img: 'https://images.unsplash.com/photo-1605634357366-dc95e8c179d6?auto=format&fit=crop&q=80&w=400', link: '/products?category=plumbing' },
            { title: 'LED Lighting', img: 'https://images.unsplash.com/photo-1534224039826-c7a0eda0e6b3?auto=format&fit=crop&q=80&w=400', link: '/products?category=lighting' },
          ].map((card, idx) => (
            <div key={idx} className="bg-white p-5 z-30 shadow-sm cursor-pointer flex flex-col h-[420px]">
              <h2 className="text-xl font-bold mb-4 text-gray-900">{card.title}</h2>
              <div className="flex-1 mb-4 overflow-hidden">
                <img src={card.img} alt={card.title} className="w-full h-full object-cover" />
              </div>
              <Link to={card.link} className="text-blue-600 hover:text-red-500 hover:underline text-sm font-medium">See more</Link>
            </div>
          ))}
        </div>

        {/* Horizontal Product Scroll - Power Tools */}
        <div className="bg-white p-6 mb-8 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Best Sellers in Power Tools</h2>
            <Link to="/products?category=tools" className="text-blue-600 hover:text-red-500 hover:underline text-sm">See more</Link>
          </div>
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
            {tools.map((product) => (
              <Link to={`/product/${product.id}`} key={product.id} className="min-w-[200px] max-w-[200px] flex-shrink-0 group">
                <div className="bg-gray-50 p-4 mb-2 h-[200px] flex items-center justify-center">
                  <img src={product.image} alt={product.name} className="max-h-full max-w-full object-contain mix-blend-multiply" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-blue-600 group-hover:text-red-500 group-hover:underline line-clamp-2 h-10 leading-tight">
                    {product.name}
                  </p>
                  <StarRating rating={product.rating} count={product.reviewCount} size={3} />
                  <p className="text-lg font-medium text-gray-900">{formatPrice(product.price)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Banner Ad */}
        <div className="w-full h-32 bg-white mb-8 flex items-center justify-center border border-gray-200 shadow-sm overflow-hidden bg-gradient-to-r from-gray-900 to-gray-800">
           <div className="text-center">
              <span className="text-[#febd69] text-xs tracking-widest uppercase font-bold">RaviMart Business</span>
              <h3 className="text-2xl font-bold text-white">Bulk Procurement for Contractors</h3>
              <p className="text-gray-300">GST Invoices • Bulk Discounts • Fast Delivery</p>
           </div>
        </div>

        {/* Horizontal Product Scroll - Electrical */}
        <div className="bg-white p-6 mb-8 shadow-sm">
           <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Electrical Essentials</h2>
            <Link to="/products?category=electrical" className="text-blue-600 hover:text-red-500 hover:underline text-sm">See more</Link>
          </div>
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
            {electrical.map((product) => (
              <Link to={`/product/${product.id}`} key={product.id} className="min-w-[200px] max-w-[200px] flex-shrink-0 group">
                <div className="bg-gray-50 p-4 mb-2 h-[200px] flex items-center justify-center">
                  <img src={product.image} alt={product.name} className="max-h-full max-w-full object-contain mix-blend-multiply" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-blue-600 group-hover:text-red-500 group-hover:underline line-clamp-2 h-10 leading-tight">
                    {product.name}
                  </p>
                  <StarRating rating={product.rating} count={product.reviewCount} size={3} />
                  <p className="text-lg font-medium text-gray-900">{formatPrice(product.price)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Horizontal Product Scroll - Lighting */}
        <div className="bg-white p-6 mb-8 shadow-sm">
           <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Industrial & Home Lighting</h2>
            <Link to="/products?category=lighting" className="text-blue-600 hover:text-red-500 hover:underline text-sm">See more</Link>
          </div>
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
            {lighting.map((product) => (
              <Link to={`/product/${product.id}`} key={product.id} className="min-w-[200px] max-w-[200px] flex-shrink-0 group">
                <div className="bg-gray-50 p-4 mb-2 h-[200px] flex items-center justify-center">
                  <img src={product.image} alt={product.name} className="max-h-full max-w-full object-contain mix-blend-multiply" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-blue-600 group-hover:text-red-500 group-hover:underline line-clamp-2 h-10 leading-tight">
                    {product.name}
                  </p>
                  <StarRating rating={product.rating} count={product.reviewCount} size={3} />
                  <p className="text-lg font-medium text-gray-900">{formatPrice(product.price)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
