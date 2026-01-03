import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { Button } from '../components/ui/Button';
import { formatPrice } from '../lib/utils';
import { StarRating } from '../components/ui/StarRating';
import { X, Filter } from 'lucide-react';

export const Products = () => {
  const { products } = useProducts();
  const { addToCart } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Filter States
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [minRating, setMinRating] = useState(0);

  // Get search term from URL
  const searchTerm = searchParams.get('search') || '';
  const urlCategory = searchParams.get('category');

  // Sync filters with URL
  useEffect(() => {
    if (searchTerm) {
      // If searching, we generally want to search everything, but we can allow filtering if the user clicks them later.
      // For now, let's keep the category filter if it was manually selected, otherwise clear it if it's a fresh search.
      // But to keep it simple and Amazon-like: Search usually resets filters unless refined.
      if (!urlCategory) {
         setCategoryFilter([]);
      }
    } else if (urlCategory) {
      setCategoryFilter([urlCategory]);
    } else {
      setCategoryFilter([]);
    }
  }, [searchTerm, urlCategory]);

  const filteredProducts = products.filter(p => {
    // 1. Category Filter
    const matchesCategory = categoryFilter.length === 0 || categoryFilter.includes(p.category);
    
    // 2. Price Filter
    const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
    
    // 3. Rating Filter
    const matchesRating = p.rating >= minRating;
    
    // 4. Advanced Search Logic (Case Insensitive & Order Independent)
    // Combine all relevant fields into one searchable string
    const productText = `${p.name} ${p.description} ${p.brand} ${p.category} ${p.features?.join(' ')}`.toLowerCase();
    const searchInput = searchTerm.toLowerCase().trim();
    
    // Split search input into individual words (e.g., "bosch drill" -> ["bosch", "drill"])
    const searchWords = searchInput.split(/\s+/);
    
    // Check if EVERY word in the search query exists in the product text
    // This allows "Drill Bosch" to find "Bosch ... Drill"
    const matchesSearch = !searchInput || searchWords.every(word => productText.includes(word));
    
    return matchesCategory && matchesPrice && matchesRating && matchesSearch;
  });

  const toggleCategory = (cat: string) => {
    setCategoryFilter(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const clearSearch = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('search');
    setSearchParams(newParams);
    // Reset filters to default
    setCategoryFilter([]);
    setPriceRange([0, 100000]);
  };

  const categories = ['electrical', 'hardware', 'tools', 'safety', 'plumbing', 'lighting'];

  return (
    <div className="max-w-[1500px] mx-auto px-4 py-6 bg-white min-h-screen">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar Filters */}
        <div className="w-full lg:w-64 flex-shrink-0 space-y-8 border-r border-gray-200 pr-6">
          
          {/* Categories Section (Renamed from Department) */}
          <div>
            <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wider">Categories</h3>
            <div className="space-y-2">
              {categories.map(cat => (
                <div key={cat} className="flex items-center group">
                  <input 
                    type="checkbox" 
                    id={cat}
                    checked={categoryFilter.includes(cat)}
                    onChange={() => toggleCategory(cat)}
                    className="w-4 h-4 text-[#febd69] border-gray-300 rounded focus:ring-[#febd69] cursor-pointer"
                  />
                  <label htmlFor={cat} className="ml-2 text-sm text-gray-700 capitalize cursor-pointer group-hover:text-[#e47911] select-none">
                    {cat}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Rating Filter */}
          <div>
            <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wider">Avg. Customer Review</h3>
            <div className="space-y-1">
              {[4, 3, 2, 1].map(star => (
                <div 
                  key={star} 
                  className={`flex items-center cursor-pointer hover:bg-gray-50 p-1 -ml-1 rounded ${minRating === star ? 'bg-gray-100' : ''}`}
                  onClick={() => setMinRating(star)}
                >
                  <StarRating rating={star} size={4} />
                  <span className="text-sm text-gray-600 ml-2 font-medium">& Up</span>
                </div>
              ))}
            </div>
          </div>

          {/* Price Filter */}
          <div>
            <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wider">Price</h3>
            <div className="space-y-2 text-sm text-gray-700">
               <p className="cursor-pointer hover:text-[#e47911]" onClick={() => setPriceRange([0, 1000])}>Under ₹1,000</p>
               <p className="cursor-pointer hover:text-[#e47911]" onClick={() => setPriceRange([1000, 5000])}>₹1,000 - ₹5,000</p>
               <p className="cursor-pointer hover:text-[#e47911]" onClick={() => setPriceRange([5000, 10000])}>₹5,000 - ₹10,000</p>
               <p className="cursor-pointer hover:text-[#e47911]" onClick={() => setPriceRange([10000, 100000])}>Over ₹10,000</p>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <input 
                type="number" 
                placeholder="Min" 
                className="w-20 px-2 py-1 border rounded text-sm"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
              />
              <span className="text-gray-400">-</span>
              <input 
                type="number" 
                placeholder="Max" 
                className="w-20 px-2 py-1 border rounded text-sm"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
              />
              <button className="px-2 py-1 border rounded text-sm hover:bg-gray-50">Go</button>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-200 pb-4 gap-4">
            <div>
              <h2 className="font-bold text-xl text-gray-900">
                {searchTerm ? `Results for "${searchTerm}"` : 'All Products'}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Showing {filteredProducts.length} items
              </p>
              {searchTerm && (
                <button 
                  onClick={clearSearch}
                  className="text-sm text-blue-600 hover:text-red-500 hover:underline flex items-center gap-1 mt-2 font-medium"
                >
                  <X className="w-4 h-4" /> Clear Search Results
                </button>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select className="border-gray-300 rounded-lg text-sm focus:ring-[#febd69] focus:border-[#febd69] py-1.5 px-3 bg-gray-50 hover:bg-gray-100 cursor-pointer">
                <option>Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Avg. Customer Review</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="border border-gray-200 rounded-lg bg-white hover:shadow-xl transition-all duration-200 flex flex-col overflow-hidden group">
                <div className="relative bg-gray-50 p-6 h-[240px] flex items-center justify-center group-hover:bg-gray-100 transition-colors">
                  <Link to={`/product/${product.id}`} className="w-full h-full flex items-center justify-center">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="max-h-full max-w-full object-contain mix-blend-multiply transform group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                </div>
                
                <div className="p-5 flex-1 flex flex-col">
                  <Link to={`/product/${product.id}`} className="text-base font-medium text-gray-900 hover:text-[#c7511f] line-clamp-2 mb-2 leading-snug">
                    {product.name}
                  </Link>
                  
                  <div className="mb-3">
                    <StarRating rating={product.rating} count={product.reviewCount} size={4} />
                  </div>

                  <div className="mt-auto pt-3 border-t border-gray-50">
                    <div className="flex items-baseline mb-3">
                      <span className="text-xs align-top font-medium">₹</span>
                      <span className="text-2xl font-bold text-gray-900">{product.price.toLocaleString()}</span>
                      <span className="ml-2 text-xs text-gray-500 line-through">₹{(product.price * 1.2).toFixed(0)}</span>
                    </div>
                    
                    <div className="flex items-center gap-1 text-xs text-gray-500 mb-4">
                      <img src="https://i.ibb.co/HLfD5wgf/dualite-favicon.png" className="w-4 h-4 grayscale opacity-50" alt="" />
                      <span>Fulfilled by RaviMart</span>
                    </div>

                    <Button 
                      className="w-full bg-[#ffd814] hover:bg-[#f7ca00] text-black border border-[#fcd200] rounded-full text-sm py-2 font-medium shadow-sm active:scale-95 transition-transform"
                      onClick={() => addToCart(product)}
                    >
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredProducts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
              <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                <Filter className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">No products found</h3>
              <p className="text-gray-500 max-w-md mx-auto mb-6">
                We couldn't find any matches for "{searchTerm}". Try checking your spelling or using more general terms.
              </p>
              <div className="flex gap-4">
                <Button 
                  variant="outline" 
                  onClick={clearSearch}
                  className="bg-white"
                >
                  Clear Search
                </Button>
                <Button 
                  variant="primary"
                  onClick={() => {
                    setCategoryFilter([]);
                    setPriceRange([0, 100000]);
                    setMinRating(0);
                    clearSearch();
                  }}
                >
                  Reset All Filters
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
