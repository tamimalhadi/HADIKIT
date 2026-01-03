
import React, { useState } from 'react';
import { Product } from '../types';

interface ProductPageProps {
  product: Product;
  onBack: () => void;
  onBuyNow: () => void;
}

const ProductPage: React.FC<ProductPageProps> = ({ product, onBack, onBuyNow }) => {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fadeIn">
      {/* Back Button */}
      <button 
        onClick={onBack}
        className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors mb-12 group"
      >
        <div className="p-2 bg-[#111] rounded-xl group-hover:bg-[#222]">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </div>
        <span className="text-sm font-bold uppercase tracking-widest">Back to Collection</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* Product Image Section */}
        <div className="perspective-1000">
          <div className="relative bg-[#0d0d0d] rounded-[3rem] overflow-hidden border border-white/5 shadow-2xl p-2 transform hover:rotate-y-[-5deg] transition-transform duration-700">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full aspect-[4/5] object-cover rounded-[2.5rem]" 
            />
            {/* 3D Decorative Layers */}
            <div className="absolute inset-0 border-[12px] border-white/5 rounded-[3rem] pointer-events-none"></div>
          </div>
        </div>

        {/* Details Section */}
        <div className="space-y-10 py-4">
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <span className="px-4 py-1.5 bg-blue-600/10 border border-blue-500/30 text-blue-500 rounded-full text-xs font-black uppercase tracking-widest">
                {product.category} Gear
              </span>
              {product.isNew && <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">New Season</span>}
            </div>
            <h1 className="text-5xl sm:text-6xl font-black text-white tracking-tighter mb-4 leading-tight">
              {product.name}
            </h1>
            <p className="text-3xl font-black text-blue-500">TK.{product.price}.00</p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest">Description</h3>
            <p className="text-gray-400 text-lg leading-relaxed max-w-xl">
              {product.description} Experience elite performance technology. This kit is engineered with moisture-wicking fabrics and precision-stitched details for a lightweight, professional feel on and off the pitch.
            </p>
          </div>

          <div className="space-y-6">
            <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest">Select Your Size</h3>
            <div className="flex flex-wrap gap-4">
              {product.sizes.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`min-w-[70px] h-16 text-sm font-black rounded-2xl border-2 transition-all duration-300 ${
                    selectedSize === size 
                      ? 'bg-white text-black border-white shadow-[0_0_30px_rgba(255,255,255,0.2)]' 
                      : 'bg-[#111] text-gray-400 border-white/5 hover:border-white/20'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-8">
            <button 
              onClick={onBuyNow}
              className="w-full sm:w-auto px-16 py-6 bg-blue-600 hover:bg-blue-500 text-white rounded-[2rem] font-black text-xl uppercase tracking-widest transition-all shadow-[0_20px_40px_rgba(37,99,235,0.3)] active:scale-95 flex items-center justify-center space-x-4"
            >
              <span>Buy Now</span>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
            <p className="mt-6 text-xs text-gray-600 font-medium">Free express delivery on all authentic kits.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
