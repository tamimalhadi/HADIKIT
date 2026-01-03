
import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import ProductPage from './components/ProductPage';
import CheckoutPage from './components/CheckoutPage';
import GeminiStylist from './components/GeminiStylist';
import { PRODUCTS } from './constants';
import { Product } from './types';

const App: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Football', 'Basketball', 'Baseball', 'Classic'];

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(p => {
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const navigateToProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsCheckingOut(false);
    window.scrollTo(0, 0);
  };

  const navigateToCheckout = () => {
    setIsCheckingOut(true);
    window.scrollTo(0, 0);
  };

  const goHome = () => {
    setSelectedProduct(null);
    setIsCheckingOut(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050505] text-white selection:bg-blue-500/30">
      <Header 
        onSearch={setSearchQuery} 
        onLogoClick={goHome}
      />
      
      {/* Sliding Announcement Bar - Speed increased to 8s */}
      <div className="bg-blue-600/10 border-b border-blue-500/20 overflow-hidden py-2.5">
        <div className="whitespace-nowrap flex animate-marquee">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.15em] text-blue-400 px-4">
            ২০০০ টাকার বেশি অর্ডারে ফ্রি ডেলিভারি! — FREE DELIVERY ON ORDERS OVER 2000 TK! — ২০০০ টাকার বেশি অর্ডারে ফ্রি ডেলিভারি! — FREE DELIVERY ON ORDERS OVER 2000 TK!
          </span>
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.15em] text-blue-400 px-4">
            ২০০০ টাকার বেশি অর্ডারে ফ্রি ডেলিভারি! — FREE DELIVERY ON ORDERS OVER 2000 TK! — ২০০০ টাকার বেশি অর্ডারে ফ্রি ডেলিভারি! — FREE DELIVERY ON ORDERS OVER 2000 TK!
          </span>
        </div>
      </div>
      
      <main className="flex-grow">
        {isCheckingOut && selectedProduct ? (
          <CheckoutPage 
            product={selectedProduct} 
            onBack={() => setIsCheckingOut(false)} 
            onSuccess={goHome}
          />
        ) : selectedProduct ? (
          <ProductPage 
            product={selectedProduct} 
            onBack={goHome} 
            onBuyNow={navigateToCheckout}
          />
        ) : (
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-10 sm:py-16">
            {/* Categories Filter */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-12">
              <div className="flex space-x-3 overflow-x-auto pb-4 sm:pb-0 scrollbar-hide px-1 w-full sm:w-auto">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-6 sm:px-8 py-2.5 sm:py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-300 transform active:scale-95 whitespace-nowrap border-2 ${
                      selectedCategory === cat 
                        ? 'bg-blue-600 border-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] translate-y-[-2px]' 
                        : 'bg-[#111] border-[#222] text-gray-400 hover:border-gray-600 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <div className="text-gray-500 text-[10px] sm:text-sm font-medium tracking-wider uppercase">
                {filteredProducts.length} Premium Kits Available
              </div>
            </div>

            {/* Product Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-10">
                {filteredProducts.map(product => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onSelect={navigateToProduct}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-24 sm:py-32 bg-[#0a0a0a] rounded-[2rem] sm:rounded-[3rem] border border-[#1a1a1a]">
                <h3 className="text-xl sm:text-2xl font-bold text-white">No Gear Found</h3>
                <p className="text-gray-500 mt-2 text-sm">Adjust your filters to see more kits.</p>
                <button 
                  onClick={() => {setSelectedCategory('All'); setSearchQuery('');}}
                  className="mt-6 px-8 py-3 bg-white text-black rounded-full font-bold hover:bg-gray-200 transition text-sm"
                >
                  Reset Search
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="bg-[#080808] border-t border-white/5 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black mb-4 tracking-tighter italic cursor-pointer" onClick={goHome}>
            HADI<span className="text-blue-600">KIT</span>
          </h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto text-sm">Exclusive athletic gear for those who demand excellence.</p>
          <div className="flex justify-center gap-8 mb-10 text-xs font-semibold text-gray-400">
            <a href="#" className="hover:text-blue-500 transition">Orders</a>
            <a href="#" className="hover:text-blue-500 transition">Support</a>
            <a href="#" className="hover:text-blue-500 transition">Policies</a>
          </div>
          <p className="text-[10px] text-gray-600 font-mono tracking-widest uppercase">&copy; 2024 HADIKIT.v3</p>
        </div>
      </footer>

      <GeminiStylist products={PRODUCTS.map(p => p.name)} />

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 8s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default App;
