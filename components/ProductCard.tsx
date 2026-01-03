
import React, { useState } from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="perspective-1000 group relative z-10 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelect(product)}
    >
      <div 
        className={`relative bg-[#0d0d0d] rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden border border-white/5 transition-all duration-500 ease-out transform-gpu ${
          isHovered 
            ? 'translate-y-[-5px] sm:translate-y-[-10px] rotate-x-[4deg] shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(59,130,246,0.15)] border-blue-500/20' 
            : 'shadow-2xl'
        }`}
      >
        {/* Badges */}
        <div className="absolute top-3 left-3 sm:top-5 sm:left-5 z-20 flex flex-col space-y-1.5 sm:space-y-2">
          {product.isNew && (
            <span className="bg-blue-600 text-white text-[7px] sm:text-[9px] font-black px-2 sm:px-3 py-1 sm:py-1.5 rounded-full uppercase tracking-tighter shadow-lg">New</span>
          )}
          {product.isPopular && (
            <span className="bg-white text-black text-[7px] sm:text-[9px] font-black px-2 sm:px-3 py-1 sm:py-1.5 rounded-full uppercase tracking-tighter shadow-lg">Hot</span>
          )}
        </div>

        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-[#151515]">
          <img 
            src={product.image} 
            alt={product.name}
            className={`w-full h-full object-cover transition-all duration-1000 ${isHovered ? 'scale-110 opacity-70' : 'scale-100'}`}
          />
          
          <div className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}></div>
          <div className="absolute bottom-4 left-0 w-full text-center opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
            <span className="text-[10px] font-black uppercase tracking-widest text-white bg-blue-600 px-4 py-1.5 rounded-full">View Details</span>
          </div>
        </div>

        {/* Info */}
        <div className="p-4 sm:p-6">
          <div className="flex justify-between items-start mb-1 sm:mb-2">
            <span className="text-[8px] sm:text-[10px] font-bold text-gray-500 uppercase tracking-widest">{product.category}</span>
            <span className="font-black text-sm sm:text-lg text-white">TK.{product.price}</span>
          </div>
          <h3 className="text-xs sm:text-base font-bold text-white group-hover:text-blue-500 transition-colors line-clamp-1 leading-tight">
            {product.name}
          </h3>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
