import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { Button } from '../components/ui/Button';
import { formatPrice } from '../lib/utils';
import { StarRating } from '../components/ui/StarRating';
import { MapPin, ShieldCheck, Truck, Lock } from 'lucide-react';

export const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { products } = useProducts();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(products.find(p => p.id === id));

  useEffect(() => {
    setProduct(products.find(p => p.id === id));
    window.scrollTo(0, 0);
  }, [id, products]);

  if (!product) return <div className="p-8">Product not found</div>;

  return (
    <div className="bg-white min-h-screen pb-12">
      {/* Breadcrumb */}
      <div className="bg-gray-100 py-2 px-4 text-xs text-gray-500 mb-4">
        <div className="max-w-[1500px] mx-auto">
          <Link to="/" className="hover:underline">Home</Link> › 
          <Link to="/products" className="hover:underline capitalize ml-1">{product.category}</Link> › 
          <span className="ml-1 text-gray-700 font-bold">{product.name}</span>
        </div>
      </div>

      <div className="max-w-[1500px] mx-auto px-4 grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Image Section */}
        <div className="md:col-span-5 lg:col-span-4 sticky top-24 self-start">
          <div className="border border-gray-200 rounded-lg p-4 flex items-center justify-center bg-white h-[400px] md:h-[500px]">
            <img 
              src={product.image} 
              alt={product.name} 
              className="max-h-full max-w-full object-contain"
            />
          </div>
        </div>

        {/* Details Section */}
        <div className="md:col-span-4 lg:col-span-5 space-y-4">
          <h1 className="text-2xl md:text-3xl font-medium text-gray-900 leading-tight">
            {product.name}
          </h1>
          
          <div className="border-b border-gray-200 pb-4">
            <div className="flex items-center gap-2 mb-2">
              <StarRating rating={product.rating} count={product.reviewCount} />
            </div>
            <p className="text-sm text-blue-600">Brand: {product.brand}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="text-red-600 text-xl font-light">-12%</span>
              <span className="text-3xl font-medium text-gray-900">₹{product.price.toLocaleString()}</span>
            </div>
            <p className="text-gray-500 text-sm">M.R.P.: <span className="line-through">₹{(product.price * 1.12).toFixed(0)}</span></p>
            <p className="text-sm text-gray-900">Inclusive of all taxes</p>
          </div>

          <div className="border-t border-gray-200 pt-4 space-y-4">
            <div className="flex gap-4 text-sm">
               <div className="flex flex-col items-center w-20 text-center">
                  <div className="bg-gray-100 p-3 rounded-full mb-2"><Truck className="w-5 h-5 text-gray-600" /></div>
                  <span className="text-cyan-700 text-xs">Free Delivery</span>
               </div>
               <div className="flex flex-col items-center w-20 text-center">
                  <div className="bg-gray-100 p-3 rounded-full mb-2"><ShieldCheck className="w-5 h-5 text-gray-600" /></div>
                  <span className="text-cyan-700 text-xs">1 Year Warranty</span>
               </div>
               <div className="flex flex-col items-center w-20 text-center">
                  <div className="bg-gray-100 p-3 rounded-full mb-2"><Lock className="w-5 h-5 text-gray-600" /></div>
                  <span className="text-cyan-700 text-xs">Secure Transaction</span>
               </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <h3 className="font-bold text-lg mb-2">About this item</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
              {product.features?.map((feature, idx) => (
                <li key={idx}>{feature}</li>
              )) || <li>{product.description}</li>}
            </ul>
          </div>
        </div>

        {/* Buy Box */}
        <div className="md:col-span-3 lg:col-span-3">
          <div className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm sticky top-24">
            <div className="text-2xl font-medium text-gray-900 mb-2">₹{product.price.toLocaleString()}</div>
            
            <div className="text-sm space-y-2 mb-4">
              <p className="text-gray-600">
                FREE delivery <span className="font-bold text-gray-900">Monday, 24 Jan</span>.
              </p>
              <div className="flex items-center text-blue-600 text-xs">
                <MapPin className="w-3 h-3 mr-1" />
                <span>Deliver to India</span>
              </div>
              <p className="text-green-600 font-medium text-lg mt-2">In Stock</p>
              <p className="text-sm text-gray-600">Sold by <span className="text-blue-600">RaviMart Retail</span></p>
            </div>

            <div className="space-y-3">
              <Button 
                className="w-full bg-[#ffd814] hover:bg-[#f7ca00] text-black border border-[#fcd200] rounded-full shadow-sm"
                onClick={() => addToCart(product)}
              >
                Add to Cart
              </Button>
              <Button 
                className="w-full bg-[#fa8900] hover:bg-[#e37b00] text-black border border-[#ca6e00] rounded-full shadow-sm"
              >
                Buy Now
              </Button>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500 flex items-center gap-2">
              <Lock className="w-3 h-3" />
              Secure transaction
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
