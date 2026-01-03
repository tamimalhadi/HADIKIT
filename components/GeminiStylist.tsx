
import React, { useState, useRef, useEffect } from 'react';
import { getStylistAdvice } from '../services/geminiService';

interface GeminiStylistProps {
  products: string[];
}

const GeminiStylist: React.FC<GeminiStylistProps> = ({ products }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsLoading(true);

    const advice = await getStylistAdvice(userMsg, products);
    setMessages(prev => [...prev, { role: 'ai', text: advice }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-10 right-10 z-[100] perspective-1000">
      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-24 right-0 w-[380px] sm:w-[420px] h-[550px] bg-[#0d0d0d]/95 backdrop-blur-2xl rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.8),0_0_40px_rgba(59,130,246,0.1)] border border-white/10 flex flex-col overflow-hidden animate-slideUp">
          {/* Header */}
          <div className="bg-gradient-to-br from-blue-700 to-indigo-900 p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
               <svg className="w-24 h-24" fill="white" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            </div>
            <div className="flex items-center space-x-4 relative z-10">
              <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-md border border-white/20">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="font-black text-xl tracking-tighter italic">GEMINI_STYLIST</h3>
                <p className="text-[10px] opacity-60 uppercase font-black tracking-widest flex items-center">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1.5 animate-pulse"></span>
                  Active Neural Link
                </p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div 
            ref={scrollRef}
            className="flex-grow overflow-y-auto p-6 space-y-6 bg-transparent scrollbar-hide"
          >
            {messages.length === 0 && (
              <div className="text-center py-8">
                <div className="bg-[#151515] p-6 rounded-[2rem] border border-white/5 mb-6 text-left">
                  <p className="text-sm text-gray-400 leading-relaxed font-medium">
                    "Welcome to the hub. I can analyze your style preferences and recommend the perfect kit for any occasion. What are you looking for today?"
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {["Recommend a Retro Classic", "Best Pitch-to-Street Kit", "New Season Football Kits"].map((q) => (
                    <button 
                      key={q}
                      onClick={() => {setInput(q); handleSend();}}
                      className="text-xs bg-[#1a1a1a] border border-white/5 text-gray-300 py-3 rounded-2xl hover:bg-blue-600 hover:text-white transition-all font-bold"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
                <div className={`max-w-[85%] px-5 py-4 rounded-[1.8rem] text-sm font-medium leading-relaxed shadow-lg ${
                  m.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-[#1a1a1a] border border-white/10 text-gray-200 rounded-tl-none'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-[#1a1a1a] border border-white/10 px-4 py-3 rounded-2xl flex space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-6 bg-[#0a0a0a] border-t border-white/5">
            <div className="flex items-center space-x-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Message stylist..."
                className="flex-grow bg-[#151515] border border-white/5 rounded-full py-4 px-6 text-sm text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all placeholder-gray-700"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="bg-blue-600 text-white p-4 rounded-full hover:bg-blue-500 transition-all shadow-xl disabled:opacity-50 disabled:grayscale active:scale-90"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bubble Trigger */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`group w-20 h-20 rounded-[2.5rem] flex items-center justify-center shadow-[0_20px_40px_rgba(0,0,0,0.6),0_0_30px_rgba(37,99,235,0.2)] transition-all duration-500 active:scale-90 ${
          isOpen ? 'bg-white rotate-90' : 'bg-blue-600 hover:scale-110 hover:rotate-[-5deg]'
        }`}
      >
        {isOpen ? (
          <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <div className="relative">
             <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
             </svg>
             <span className="absolute -top-1 -right-1 flex h-4 w-4">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-300 opacity-75"></span>
               <span className="relative inline-flex rounded-full h-4 w-4 bg-white"></span>
             </span>
          </div>
        )}
      </button>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px) scale(0.9) rotateX(10deg); }
          to { opacity: 1; transform: translateY(0) scale(1) rotateX(0); }
        }
        .animate-slideUp {
          animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default GeminiStylist;
