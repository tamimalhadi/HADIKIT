
import React, { useState } from 'react';
import { Product } from '../types';

interface CheckoutPageProps {
  product: Product;
  onBack: () => void;
  onSuccess: () => void;
}

const BANGLADESH_DISTRICTS = [
  "ঢাকা", "ফরিদপুর", "গাজীপুর", "গোপালগঞ্জ", "কিশোরগঞ্জ", "মাদারীপুর", "মানিকগঞ্জ", "মুন্সীগঞ্জ", "নারায়ণগঞ্জ", "নরসিংদী", "রাজবাড়ী", "শরীয়তপুর", "টাঙ্গাইল",
  "বাগেরহাট", "চুয়াডাঙ্গা", "যশোর", "ঝিনাইদহ", "খুলনা", "কুষ্টিয়া", "মাগুরা", "মেহেরপুর", "নড়াইল", "সাতক্ষীরা",
  "জামালপুর", "ময়মনসিংহ", "নেত্রকোণা", "শেরপুর",
  "বগুড়া", "জয়পুরহাট", "নওগাঁ", "নাটোর", "চাঁপাইনবাবগঞ্জ", "পাবনা", "রাজশাহী", "সিরাজগঞ্জ",
  "দিনাজপুর", "গাইবান্ধা", "কুড়িগ্রাম", "লালমনিরহাট", "নীলফামারী", "পঞ্চগড়", "রংপুর", "ঠাকুরগাঁও",
  "হবিগঞ্জ", "মৌলভীবাজার", "সুনামগঞ্জ", "সিলেট",
  "বরগুনা", "বরিশাল", "ভোলা", "ঝালকাঠি", "পটুয়াখালী", "পিরোজপুর",
  "বান্দরবান", "ব্রাহ্মণবাড়িয়া", "চাঁদপুর", "চট্টগ্রাম", "কুমিল্লা", "কক্সবাজার", "ফেনী", "খাগড়াছড়ি", "লক্ষ্মীপুর", "নোয়াখালী", "রাঙ্গামাটি"
].sort();

const CheckoutPage: React.FC<CheckoutPageProps> = ({ product, onBack, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    district: '',
    address: ''
  });

  const deliveryCharge = 110;
  const subtotal = product.price;
  const total = subtotal + deliveryCharge;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.district) return;
    setLoading(true);
    // Mock API call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 3000);
    }, 1500);
  };

  if (success) {
    return (
      <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center p-6 animate-fadeIn">
        <div className="text-center space-y-8 max-w-md">
          <div className="w-24 h-24 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(34,197,94,0.4)] animate-bounce">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-4xl font-black tracking-tighter italic uppercase">অর্ডার সফল হয়েছে!</h2>
          <p className="text-gray-500 font-medium">আপনার <span className="text-white font-bold">{product.name}</span> কিটটি শীঘ্রই আপনার ঠিকানায় পাঠানো হবে।</p>
          <div className="pt-4">
             <div className="w-full h-1.5 bg-[#111] rounded-full overflow-hidden">
               <div className="h-full bg-blue-600 animate-loadingBar"></div>
             </div>
          </div>
        </div>
        <style>{`
          @keyframes loadingBar { from { width: 0%; } to { width: 100%; } }
          .animate-loadingBar { animation: loadingBar 3s linear forwards; }
        `}</style>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 sm:mb-12">
        <button 
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors group"
        >
          <div className="p-2 bg-[#111] rounded-xl group-hover:bg-[#222]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </div>
          <span className="text-sm font-bold uppercase tracking-widest">ফিরে যান</span>
        </button>
        <h2 className="text-xl sm:text-2xl font-black italic tracking-tighter uppercase">চেকআউট</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Form */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSubmit} className="space-y-6 bg-[#0d0d0d] p-6 sm:p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-400 ml-1">আপনার নাম লিখুন *</label>
              <input 
                required
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="সম্পূর্ণ নামটি লিখুন"
                className="w-full bg-[#151515] border border-white/5 rounded-2xl py-4 px-6 text-sm text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/30 transition-all outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-400 ml-1">আপনার মোবাইল নাম্বারটি লিখুন *</label>
              <input 
                required
                type="tel"
                maxLength={11}
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="১১ ডিজিটের মোবাইল নাম্বারটি লিখুন"
                className="w-full bg-[#151515] border border-white/5 rounded-2xl py-4 px-6 text-sm text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/30 transition-all outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-400 ml-1">জেলা সিলেক্ট করুন *</label>
              <div className="relative">
                <select 
                  required
                  value={formData.district}
                  onChange={(e) => setFormData({...formData, district: e.target.value})}
                  className="w-full bg-[#151515] border border-white/5 rounded-2xl py-4 px-6 text-sm text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/30 transition-all outline-none appearance-none cursor-pointer"
                >
                  <option value="" disabled>জেলা সিলেক্ট করুন</option>
                  {BANGLADESH_DISTRICTS.map((district) => (
                    <option key={district} value={district} className="bg-[#0d0d0d]">
                      {district}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-6 text-gray-500">
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-400 ml-1">সম্পূর্ণ ঠিকানা *</label>
              <textarea 
                required
                rows={3}
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                placeholder="রোড নাম/নাম্বার, বাড়ি নাম/নামার, ফ্লাট নাম্বার"
                className="w-full bg-[#151515] border border-white/5 rounded-2xl py-4 px-6 text-sm text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/30 transition-all outline-none resize-none"
              ></textarea>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-5 rounded-[2rem] font-black text-lg uppercase tracking-widest transition-all shadow-[0_20px_40px_rgba(37,99,235,0.2)] active:scale-95 flex items-center justify-center space-x-3 disabled:opacity-50"
            >
              {loading ? (
                <svg className="animate-spin h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <span>অর্ডার কনফার্ম করুন</span>
              )}
            </button>
          </form>
        </div>

        {/* Right: Summary */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#0d0d0d] rounded-[2.5rem] p-8 border border-white/5 space-y-8 shadow-2xl">
            <h3 className="text-xl font-black uppercase tracking-tighter border-b border-white/10 pb-4">প্রোডাক্ট ডিটেইল</h3>
            
            <div className="space-y-4">
               <div className="flex justify-between items-center text-xs text-gray-500 font-black uppercase tracking-widest">
                  <span>প্রোডাক্ট নাম</span>
                  <span>বিক্রয় মূল্য</span>
               </div>
               
               <div className="flex items-center space-x-4">
                  <div className="w-16 h-20 bg-[#151515] rounded-xl overflow-hidden flex-shrink-0">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-grow">
                    <p className="text-sm font-bold text-white line-clamp-1">{product.name}</p>
                    <p className="text-xs text-gray-500 mt-1">Size: M | 1 Qty</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-white">TK.{product.price}</p>
                  </div>
               </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-white/5">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">সাব-টোটাল</span>
                <span className="text-sm font-bold">TK.{subtotal}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-sm text-gray-400 flex flex-col">
                  <span>ডেলিভারি চার্জ</span>
                  <span className="text-[10px] opacity-60">(For deliveries outside Dhaka city.)</span>
                </span>
                <span className="text-sm font-bold">TK.{deliveryCharge}</span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-white/10">
                <span className="text-lg font-black uppercase tracking-tighter">টোটাল</span>
                <span className="text-2xl font-black text-blue-500">TK.{total}</span>
              </div>
            </div>

            <div className="bg-white/5 rounded-2xl p-4 flex items-center space-x-4 border border-white/5">
              <div className="bg-green-500/20 text-green-500 p-2 rounded-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-white uppercase tracking-widest">Cash On Delivery</p>
                <p className="text-[10px] text-gray-500 mt-1 uppercase">পণ্য হাতে পেয়ে পেমেন্ট করুন</p>
              </div>
            </div>

            <div className="pt-4">
              <p className="text-[11px] text-gray-500 leading-relaxed bg-[#111] p-4 rounded-xl border border-white/5">
                ৩ - ৭ কর্মদিবসের মধ্যেই ডেলিভার করা হবে ইন’শা-আল্লাহ, এর মধ্যে কল দেওয়া হবে না।
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
