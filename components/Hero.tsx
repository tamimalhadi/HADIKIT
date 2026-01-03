
import React from 'react';

const Hero: React.FC = () => {
  return (
    <div className="relative h-[650px] overflow-hidden bg-[#050505] flex items-center pt-20">
      {/* Background with 3D feel */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1540747913346-19e3adbb17c3?auto=format&fit=crop&q=80&w=2000" 
          alt="Stadium lights" 
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505]"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/80 to-transparent"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-3xl perspective-1000">
          <div className="transform hover:rotate-y-[-5deg] transition-transform duration-700 ease-out preserve-3d">
            <span className="inline-flex items-center space-x-2 bg-blue-600/10 border border-blue-500/30 text-blue-400 px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase mb-8 shadow-[0_0_30px_rgba(59,130,246,0.1)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span>New Drop: World Cup & 25/26 Kits</span>
            </span>
            <h1 className="text-6xl sm:text-8xl font-black mb-8 leading-[0.9] tracking-tighter">
              BEYOND <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-400">AUTHENTIC.</span>
            </h1>
            <p className="text-xl text-gray-400 mb-10 max-w-xl leading-relaxed">
              Experience the pitch-ready engineering of the world's most elite jerseys. HADI KIT brings you the latest 2025/26 collections.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
              <button className="bg-blue-600 text-white px-10 py-5 rounded-[2rem] font-black text-lg hover:bg-blue-500 hover:scale-105 active:scale-95 transition-all shadow-[0_20px_40px_rgba(37,99,235,0.3)]">
                Explore Kits
              </button>
              <button className="bg-[#111] text-white border-2 border-white/10 px-10 py-5 rounded-[2rem] font-black text-lg hover:bg-[#1a1a1a] transition-all">
                The Lookbook
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative 3D Element */}
      <div className="absolute right-[-10%] top-[20%] w-[50%] h-[60%] hidden lg:block opacity-40 pointer-events-none rotate-[15deg]">
         <div className="w-full h-full bg-gradient-to-br from-blue-600/20 to-purple-600/10 blur-[120px] rounded-full"></div>
      </div>
    </div>
  );
};

export default Hero;
