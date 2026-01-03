
import { GoogleGenAI } from "@google/genai";

// --- Product Data ---
const PRODUCTS = [
  { id: '1', name: 'Portugal World Cup 2026 Home', price: 1100, category: 'Football', image: 'https://i.ibb.co.com/rGLkYbBM/1.webp', isNew: true },
  { id: '2', name: 'Germany World Cup 2026 Home', price: 1100, category: 'Football', image: 'https://i.ibb.co.com/KjBphY94/2.webp', isNew: true },
  { id: '3', name: 'Argentina World Cup 2026 Home', price: 1100, category: 'Football', image: 'https://i.ibb.co.com/d4DhfF3D/3.webp', isPopular: true },
  { id: '4', name: 'Barcelona Away Black 25/26', price: 1100, category: 'Football', image: 'https://i.ibb.co.com/6hdXLZn/4.webp', isPopular: true },
  { id: '5', name: 'Man City 3rd Kit 25/26', price: 1100, category: 'Football', image: 'https://i.ibb.co.com/WWpfgSvR/5.webp' },
  { id: '6', name: 'Manchester United 3rd Kit 25/26', price: 1100, category: 'Football', image: 'https://i.ibb.co.com/fGxN3nYR/6.webp' },
  { id: '7', name: 'Liverpool Away Kit 25/26', price: 1100, category: 'Football', image: 'https://i.ibb.co.com/tPk5Vr8d/7.jpg' },
  { id: '8', name: 'Barcelona Third Jersey 25/26', price: 1100, category: 'Football', image: 'https://i.ibb.co.com/DHnDMqKs/8.jpg' },
  { id: '9', name: 'Al Nassr Third Kit 25/26', price: 1100, category: 'Football', image: 'https://i.ibb.co.com/nqNfC98j/9.webp' },
  { id: '10', name: 'Man United Home Jersey 25/26', price: 1100, category: 'Football', image: 'https://i.ibb.co.com/DDZChjXS/10.webp' },
  { id: '11', name: 'AC Milan Home Kit 25/26', price: 1100, category: 'Football', image: 'https://i.ibb.co.com/YBfD3qpR/11.jpg' },
  { id: '12', name: 'AC Milan Away Kit 25/26', price: 1100, category: 'Football', image: 'https://i.ibb.co.com/QFN9T1Nx/12.jpg' },
  { id: '13', name: 'Barca 125th Anniversary', price: 1100, category: 'Football', image: 'https://i.ibb.co.com/PGfMyfyq/13.webp', isPopular: true },
  { id: '14', name: 'Real Madrid Third Kit 25/26', price: 1100, category: 'Football', image: 'https://i.ibb.co.com/KxNZK7rk/14.webp' },
  { id: '15', name: 'Barcelona Away Jersey 25/26', price: 1100, category: 'Football', image: 'https://i.ibb.co.com/Cs2FhmTG/15.webp' },
  { id: '16', name: 'Inter Miami Third Kit 25/26', price: 1100, category: 'Football', image: 'https://i.ibb.co.com/Swvx74nY/16.webp' },
  { id: '17', name: 'Chelsea Away Jersey 25/26', price: 1100, category: 'Football', image: 'https://i.ibb.co.com/Wv4jK7KQ/17.webp' },
  { id: '18', name: 'Bayern Munich Home 25/26', price: 1100, category: 'Football', image: 'https://i.ibb.co.com/rR54nX51/18.jpg' },
  { id: '19', name: 'Man Utd Away Kit 25/26', price: 1100, category: 'Football', image: 'https://i.ibb.co.com/HLRbZjFG/19.webp' },
  { id: '20', name: 'Real Madrid Away 25/26', price: 1100, category: 'Football', image: 'https://i.ibb.co.com/0jLkL22c/20.jpg' }
];

// --- Application State ---
let state: any = {
  view: 'home',
  selectedProduct: null,
  category: 'All',
  searchQuery: '',
  stylistOpen: false,
  stylistMessages: [],
  isStylistLoading: false,
  isOrderSuccess: false
};

// --- API Helpers ---
// Fix: Use process.env.API_KEY directly as per guidelines
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- View Handlers ---
// Fix: Use type assertion for window to allow 'app' property (Error on line 43)
(window as any).app = {
  navigate: (view: string, productId: string | null = null) => {
    state.view = view;
    state.selectedProduct = productId ? PRODUCTS.find(p => p.id === productId) : null;
    state.isOrderSuccess = false;
    window.scrollTo(0, 0);
    render();
  },
  setCategory: (cat: string) => {
    state.category = cat;
    state.view = 'home';
    render();
  },
  handleSearch: (e: any) => {
    state.searchQuery = e.target.value;
    if (state.view !== 'home') state.view = 'home';
    render();
  },
  toggleStylist: () => {
    state.stylistOpen = !state.stylistOpen;
    render();
  },
  sendMessage: async () => {
    // Fix: Cast to HTMLInputElement to access .value property (Error on lines 67 and 72)
    const input = document.getElementById('stylist-input') as HTMLInputElement;
    if (!input) return;
    const text = input.value.trim();
    if (!text || state.isStylistLoading) return;

    state.stylistMessages.push({ role: 'user', text });
    state.isStylistLoading = true;
    input.value = '';
    render();

    try {
      const ai = getAI();
      const productList = PRODUCTS.slice(0, 10).map(p => p.name).join(', ');
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Persona: Urban sports stylist. Advice on jerseys from: ${productList}. User: ${text}. Max 2 sentences.`
      });
      state.stylistMessages.push({ role: 'ai', text: response.text });
    } catch (err) {
      state.stylistMessages.push({ role: 'ai', text: "Service temporarily down. Try our new Barca drop!" });
    } finally {
      state.isStylistLoading = false;
      render();
      const box = document.getElementById('chat-box');
      if (box) box.scrollTop = box.scrollHeight;
    }
  },
  confirmOrder: (e: any) => {
    e.preventDefault();
    state.isOrderSuccess = true;
    render();
    setTimeout(() => {
      state.view = 'home';
      state.isOrderSuccess = false;
      state.selectedProduct = null;
      render();
    }, 4000);
  }
};

// --- Templates ---
const HeaderTemplate = () => `
  <header class="sticky top-0 z-50 glass border-b border-white/5 h-20 flex items-center">
    <div class="max-w-7xl mx-auto px-4 w-full flex justify-between items-center">
      <div onclick="app.navigate('home')" class="cursor-pointer active:scale-95 transition-transform">
        <h1 class="text-2xl font-black italic tracking-tighter uppercase">HADI<span class="text-blue-600">KIT</span></h1>
      </div>
      <div class="hidden md:flex flex-1 max-w-lg mx-8">
        <input type="text" placeholder="Search your favorite kit..." oninput="app.handleSearch(event)" value="${state.searchQuery}"
          class="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-2.5 text-sm outline-none focus:border-blue-500/50 transition-all">
      </div>
      <button class="bg-white text-black px-6 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-widest hover:scale-105 transition-all active:scale-95">Account</button>
    </div>
  </header>
  <div class="bg-blue-600/10 border-b border-blue-500/20 overflow-hidden py-2">
    <div class="whitespace-nowrap flex animate-marquee">
      <span class="text-[10px] font-black uppercase tracking-widest text-blue-400 px-4">২০০০ টাকার বেশি অর্ডারে ফ্রি ডেলিভারি! — FREE DELIVERY ON ALL ELITE KITS — ২০০০ টাকার বেশি অর্ডারে ফ্রি ডেলিভারি!</span>
      <span class="text-[10px] font-black uppercase tracking-widest text-blue-400 px-4">২০০০ টাকার বেশি অর্ডারে ফ্রি ডেলিভারি! — FREE DELIVERY ON ALL ELITE KITS — ২০০০ টাকার বেশি অর্ডারে ফ্রি ডেলিভারি!</span>
    </div>
  </div>
`;

const HomeTemplate = () => {
  const cats = ['All', 'Football', 'Basketball', 'Baseball', 'Classic'];
  const filtered = PRODUCTS.filter(p => {
    const matchCat = state.category === 'All' || p.category === state.category;
    const matchSearch = p.name.toLowerCase().includes(state.searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return `
    <div class="max-w-7xl mx-auto px-4 py-12 fade-in">
      <div class="flex flex-col sm:flex-row justify-between items-center gap-6 mb-12">
        <div class="flex gap-2 overflow-x-auto hide-scrollbar w-full sm:w-auto">
          ${cats.map(c => `
            <button onclick="app.setCategory('${c}')" class="px-6 py-2 rounded-2xl text-xs font-black uppercase transition-all ${
              state.category === c ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-white/5 text-gray-400 hover:text-white border border-white/5'
            }">${c}</button>
          `).join('')}
        </div>
        <div class="text-[10px] font-black text-gray-500 uppercase tracking-widest">${filtered.length} Results Found</div>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8">
        ${filtered.map(p => `
          <div onclick="app.navigate('product', '${p.id}')" class="group cursor-pointer">
            <div class="relative bg-[#0d0d0d] rounded-[2rem] overflow-hidden border border-white/5 transition-all duration-500 group-hover:translate-y-[-8px] group-hover:border-blue-500/30 group-hover:shadow-2xl">
              <div class="absolute top-4 left-4 z-10 flex flex-col gap-1">
                ${p.isNew ? '<span class="bg-blue-600 text-[8px] font-black px-2 py-1 rounded-full uppercase">New</span>' : ''}
                ${p.isPopular ? '<span class="bg-white text-black text-[8px] font-black px-2 py-1 rounded-full uppercase">Hot</span>' : ''}
              </div>
              <div class="aspect-[3/4] overflow-hidden bg-[#151515]">
                <img src="${p.image}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
              </div>
              <div class="p-4 sm:p-6">
                <div class="flex justify-between items-center mb-1">
                  <span class="text-[8px] font-black text-gray-500 uppercase">${p.category}</span>
                  <span class="text-sm font-black">TK.${p.price}</span>
                </div>
                <h3 class="text-xs sm:text-sm font-bold truncate group-hover:text-blue-500 transition-colors">${p.name}</h3>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
};

const ProductTemplate = () => {
  const p = state.selectedProduct;
  if (!p) return '';
  return `
    <div class="max-w-7xl mx-auto px-4 py-12 fade-in">
      <button onclick="app.navigate('home')" class="flex items-center gap-2 text-gray-500 hover:text-white text-[10px] font-black uppercase tracking-widest mb-10 transition-colors">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
        Back to Hub
      </button>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div class="rounded-[3rem] overflow-hidden bg-[#0d0d0d] border border-white/10 p-2">
          <img src="${p.image}" class="w-full aspect-[4/5] object-cover rounded-[2.5rem]">
        </div>
        <div class="py-6 space-y-8">
          <div>
            <span class="text-blue-500 text-xs font-black uppercase tracking-widest">${p.category} Elite Gear</span>
            <h1 class="text-4xl sm:text-6xl font-black mt-2 mb-4 tracking-tighter uppercase italic">${p.name}</h1>
            <p class="text-3xl font-black text-white">TK.${p.price}.00</p>
          </div>
          <div class="space-y-4">
            <h4 class="text-[10px] font-black text-gray-500 uppercase tracking-widest">Select Size</h4>
            <div class="flex gap-3">
              ${['S', 'M', 'L', 'XL', 'XXL'].map(s => `
                <button class="w-14 h-14 rounded-2xl bg-[#111] border border-white/5 text-sm font-bold hover:border-blue-500 transition-all active:scale-90">${s}</button>
              `).join('')}
            </div>
          </div>
          <p class="text-gray-400 text-lg leading-relaxed max-w-xl">Experience the peak of athletic performance with our 2026 Season Authentic collection. Moisture-wicking technology meets precision-cut aesthetics.</p>
          <button onclick="app.navigate('checkout', '${p.id}')" class="w-full sm:w-auto px-12 py-5 bg-blue-600 rounded-[2rem] font-black uppercase tracking-widest hover:bg-blue-500 shadow-xl shadow-blue-500/20 active:scale-95 transition-all">Buy Now</button>
        </div>
      </div>
    </div>
  `;
};

const CheckoutTemplate = () => {
  const p = state.selectedProduct;
  if (!p) return '';
  if (state.isOrderSuccess) {
    return `
      <div class="fixed inset-0 z-[100] bg-black flex items-center justify-center p-6 fade-in">
        <div class="text-center space-y-8">
          <div class="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-blue-500/40 animate-bounce">
            <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M5 13l4 4L19 7"/></svg>
          </div>
          <h2 class="text-4xl font-black italic tracking-tighter uppercase">অর্ডার সফল হয়েছে!</h2>
          <p class="text-gray-500 uppercase tracking-widest text-xs font-black">আপনার কিট শীঘ্রই পাঠানো হবে</p>
        </div>
      </div>
    `;
  }
  return `
    <div class="max-w-4xl mx-auto px-4 py-12 fade-in">
      <h2 class="text-3xl font-black italic mb-10 tracking-tighter uppercase italic">চেকআউট</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
        <form onsubmit="app.confirmOrder(event)" class="space-y-6">
          <div class="space-y-2">
            <label class="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">আপনার নাম</label>
            <input required type="text" class="w-full bg-[#0d0d0d] border border-white/5 rounded-2xl p-4 text-sm outline-none focus:border-blue-500/40">
          </div>
          <div class="space-y-2">
            <label class="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">মোবাইল নাম্বার</label>
            <input required type="tel" class="w-full bg-[#0d0d0d] border border-white/5 rounded-2xl p-4 text-sm outline-none focus:border-blue-500/40">
          </div>
          <div class="space-y-2">
            <label class="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">ঠিকানা</label>
            <textarea required rows="3" class="w-full bg-[#0d0d0d] border border-white/5 rounded-2xl p-4 text-sm outline-none focus:border-blue-500/40"></textarea>
          </div>
          <button type="submit" class="w-full bg-blue-600 py-5 rounded-[2rem] font-black uppercase tracking-widest hover:bg-blue-500 transition-all active:scale-95 shadow-xl shadow-blue-500/20">অর্ডার নিশ্চিত করুন</button>
        </form>
        <div class="bg-[#0d0d0d] rounded-[2.5rem] p-8 border border-white/5 h-fit space-y-6">
          <h3 class="text-sm font-black uppercase tracking-tighter border-b border-white/5 pb-4">অর্ডার সামারি</h3>
          <div class="flex gap-4">
            <img src="${p.image}" class="w-20 h-24 object-cover rounded-xl border border-white/5">
            <div>
              <p class="text-xs font-bold">${p.name}</p>
              <p class="text-[10px] text-gray-500 mt-1">Price: TK.${p.price}</p>
              <p class="text-[10px] text-gray-500">Delivery: TK.110</p>
            </div>
          </div>
          <div class="pt-4 border-t border-white/10 flex justify-between items-center">
            <span class="text-xs font-black uppercase tracking-widest">টোটাল</span>
            <span class="text-2xl font-black text-blue-500">TK.${p.price + 110}</span>
          </div>
        </div>
      </div>
    </div>
  `;
};

const StylistTemplate = () => `
  <div class="fixed bottom-10 right-10 z-[100] flex flex-col items-end">
    ${state.stylistOpen ? `
      <div class="w-[340px] h-[500px] bg-[#0d0d0d]/95 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 flex flex-col shadow-2xl overflow-hidden mb-6 fade-in">
        <div class="bg-blue-600 p-6 text-white flex items-center gap-3">
          <div class="bg-white/10 p-2 rounded-xl">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          </div>
          <div>
            <h3 class="text-xs font-black italic tracking-widest uppercase">GEMINI STYLIST</h3>
            <p class="text-[8px] opacity-60 uppercase font-black tracking-widest">Active Neural Link</p>
          </div>
        </div>
        <div id="chat-box" class="flex-grow p-4 overflow-y-auto space-y-4 hide-scrollbar">
          ${state.stylistMessages.map((m: any) => `
            <div class="flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}">
              <div class="max-w-[80%] p-3 rounded-[1.5rem] text-[11px] font-medium leading-relaxed ${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-[#1a1a1a] border border-white/5 text-gray-200'}">
                ${m.text}
              </div>
            </div>
          `).join('')}
          ${state.isStylistLoading ? '<div class="text-[10px] text-gray-500 animate-pulse ml-2">Thinking...</div>' : ''}
        </div>
        <div class="p-4 bg-black/40 border-t border-white/5 flex gap-2">
          <input id="stylist-input" type="text" placeholder="Need advice?" class="flex-grow bg-[#151515] rounded-full px-4 py-3 text-[11px] outline-none border border-white/5">
          <button onclick="app.sendMessage()" class="bg-blue-600 p-3 rounded-full hover:bg-blue-500 transition-all active:scale-90"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg></button>
        </div>
      </div>
    ` : ''}
    <button onclick="app.toggleStylist()" class="w-16 h-16 bg-blue-600 rounded-[1.5rem] flex items-center justify-center shadow-xl hover:scale-110 active:scale-90 transition-all">
      <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
    </button>
  </div>
`;

const FooterTemplate = () => `
  <footer class="bg-[#080808] border-t border-white/5 py-16 mt-auto">
    <div class="max-w-7xl mx-auto px-4 text-center">
      <h2 class="text-3xl font-black italic tracking-tighter uppercase mb-4">HADI<span class="text-blue-600">KIT</span></h2>
      <p class="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-10">&copy; 2024 HADIKIT.V3 — BEYOND AUTHENTIC</p>
      <div class="flex justify-center gap-8 text-[10px] font-black text-gray-600 uppercase tracking-widest">
        <a href="#" class="hover:text-blue-500 transition">Orders</a>
        <a href="#" class="hover:text-blue-500 transition">Support</a>
        <a href="#" class="hover:text-blue-500 transition">Policies</a>
      </div>
    </div>
  </footer>
`;

// --- Rendering Engine ---
function render() {
  const container = document.getElementById('app');
  if (!container) return;

  let mainContent = '';
  switch(state.view) {
    case 'product': mainContent = ProductTemplate(); break;
    case 'checkout': mainContent = CheckoutTemplate(); break;
    default: mainContent = HomeTemplate();
  }

  container.innerHTML = `
    ${HeaderTemplate()}
    <main class="flex-grow">${mainContent}</main>
    ${FooterTemplate()}
    ${StylistTemplate()}
  `;

  // Focus restoration for search
  // Fix: Cast searchInput to HTMLInputElement to fix property access errors on lines 334 and 335
  const searchInput = document.querySelector('header input') as HTMLInputElement;
  if (searchInput && state.searchQuery) {
    searchInput.focus();
    searchInput.setSelectionRange(state.searchQuery.length, state.searchQuery.length);
  }
}

// Initial Render
render();
