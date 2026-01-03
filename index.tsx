
import { GoogleGenAI } from "@google/genai";
import { PRODUCTS } from "./constants";
import { Product } from "./types";

// --- App State ---
interface AppState {
    view: 'home' | 'product' | 'checkout';
    selectedProduct: Product | null;
    selectedCategory: string;
    searchQuery: string;
    stylistOpen: boolean;
    stylistMessages: { role: 'user' | 'ai'; text: string }[];
    isStylistLoading: boolean;
}

let state: AppState = {
    view: 'home',
    selectedProduct: null,
    selectedCategory: 'All',
    searchQuery: '',
    stylistOpen: false,
    stylistMessages: [],
    isStylistLoading: false
};

// --- Helper Functions ---
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

// --- View Actions ---
const actions = {
    setCategory: (cat: string) => {
        state.selectedCategory = cat;
        state.view = 'home';
        render();
    },
    selectProduct: (id: string) => {
        state.selectedProduct = PRODUCTS.find(p => p.id === id) || null;
        state.view = 'product';
        window.scrollTo(0, 0);
        render();
    },
    goHome: () => {
        state.view = 'home';
        state.selectedProduct = null;
        window.scrollTo(0, 0);
        render();
    },
    goCheckout: () => {
        state.view = 'checkout';
        window.scrollTo(0, 0);
        render();
    },
    toggleStylist: () => {
        state.stylistOpen = !state.stylistOpen;
        render();
    },
    handleSearch: (query: string) => {
        state.searchQuery = query;
        if (state.view !== 'home') state.view = 'home';
        render();
    },
    sendMessage: async () => {
        const input = document.getElementById('stylist-input') as HTMLInputElement;
        const text = input?.value.trim();
        if (!text || state.isStylistLoading) return;

        state.stylistMessages.push({ role: 'user', text });
        state.isStylistLoading = true;
        render();

        try {
            const ai = getAI();
            const productNames = PRODUCTS.map(p => p.name).join(', ');
            const response = await ai.models.generateContent({
                model: "gemini-3-flash-preview",
                contents: `Stylist persona: Suggest 1-2 jerseys from: ${productNames}. User said: "${text}". Be concise and stylish.`,
            });
            state.stylistMessages.push({ role: 'ai', text: response.text || "Check our new Portugal drop!" });
        } catch (e) {
            state.stylistMessages.push({ role: 'ai', text: "Signal lost. Browse our collection manually!" });
        } finally {
            state.isStylistLoading = false;
            render();
            const box = document.getElementById('stylist-messages');
            if (box) box.scrollTop = box.scrollHeight;
        }
    }
};

// Attach to window for HTML onclick handlers
(window as any).app = actions;

// --- Template Components ---

const Header = () => `
    <header class="sticky top-0 z-50 w-full bg-[#050505]/80 backdrop-blur-2xl border-b border-white/5">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-20">
                <div onclick="app.goHome()" class="flex-shrink-0 flex items-center cursor-pointer transition-transform active:scale-95">
                    <h1 class="text-2xl sm:text-3xl font-black tracking-tighter text-white uppercase italic leading-none">
                        HADI<span class="text-blue-600">KIT</span>
                    </h1>
                </div>
                <div class="hidden md:flex flex-grow max-w-xl mx-12">
                    <div class="relative w-full group">
                        <input id="main-search" type="text" value="${state.searchQuery}" placeholder="Find your favorite kit..."
                            oninput="app.handleSearch(this.value)"
                            class="w-full bg-[#111] border border-white/5 rounded-2xl py-3 px-6 pl-12 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/30 transition-all text-sm text-white placeholder-gray-600 outline-none">
                        <svg class="absolute left-4 top-3.5 h-4 w-4 text-gray-600 group-focus-within:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>
                <div class="flex items-center space-x-4">
                    <button class="bg-white text-black px-6 py-3 rounded-2xl text-sm font-bold hover:scale-105 active:scale-95 transition-all">Account</button>
                </div>
            </div>
        </div>
    </header>
    <div class="bg-blue-600/10 border-b border-blue-500/20 overflow-hidden py-2.5">
        <div class="whitespace-nowrap flex animate-marquee">
            <span class="text-[10px] sm:text-xs font-bold uppercase tracking-[0.15em] text-blue-400 px-4">
                ২০০০ টাকার বেশি অর্ডারে ফ্রি ডেলিভারি! — FREE DELIVERY ON ORDERS OVER 2000 TK! — ২০০০০ টাকার বেশি অর্ডারে ফ্রি ডেলিভারি!
            </span>
            <span class="text-[10px] sm:text-xs font-bold uppercase tracking-[0.15em] text-blue-400 px-4">
                ২০০০ টাকার বেশি অর্ডারে ফ্রি ডেলিভারি! — FREE DELIVERY ON ORDERS OVER 2000 TK! — ২০০০০ টাকার বেশি অর্ডারে ফ্রি ডেলিভারি!
            </span>
        </div>
    </div>
`;

const ProductCard = (p: Product) => `
    <div onclick="app.selectProduct('${p.id}')" class="perspective-1000 group cursor-pointer fade-in">
        <div class="relative bg-[#0d0d0d] rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden border border-white/5 transition-all duration-500 hover:translate-y-[-8px] hover:border-blue-500/30 hover:shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
            <div class="absolute top-3 left-3 z-20 flex flex-col space-y-1">
                ${p.isNew ? '<span class="bg-blue-600 text-white text-[8px] font-black px-2 py-1 rounded-full uppercase">New</span>' : ''}
            </div>
            <div class="aspect-[3/4] overflow-hidden bg-[#151515]">
                <img src="${p.image}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
            </div>
            <div class="p-4 sm:p-6">
                <div class="flex justify-between items-center mb-1">
                    <span class="text-[9px] font-bold text-gray-500 uppercase">${p.category}</span>
                    <span class="font-black text-sm text-white">TK.${p.price}</span>
                </div>
                <h3 class="text-xs sm:text-sm font-bold text-white group-hover:text-blue-500 transition-colors line-clamp-1">${p.name}</h3>
            </div>
        </div>
    </div>
`;

const HomeView = () => {
    const categories = ['All', 'Football', 'Basketball', 'Baseball', 'Classic'];
    const filtered = PRODUCTS.filter(p => {
        const catMatch = state.selectedCategory === 'All' || p.category === state.selectedCategory;
        const searchMatch = p.name.toLowerCase().includes(state.searchQuery.toLowerCase());
        return catMatch && searchMatch;
    });

    return `
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 fade-in">
            <div class="flex flex-col sm:flex-row items-center justify-between gap-6 mb-12">
                <div class="flex space-x-3 overflow-x-auto pb-2 hide-scrollbar w-full sm:w-auto">
                    ${categories.map(cat => `
                        <button onclick="app.setCategory('${cat}')" class="px-6 py-2.5 rounded-2xl text-xs font-bold transition-all border-2 ${
                            state.selectedCategory === cat ? 'bg-blue-600 border-blue-500 text-white' : 'bg-[#111] border-[#222] text-gray-400 hover:text-white'
                        }">${cat}</button>
                    `).join('')}
                </div>
                <div class="text-gray-500 text-[10px] font-medium tracking-widest uppercase">
                    ${filtered.length} Premium Kits Available
                </div>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8">
                ${filtered.map(p => ProductCard(p)).join('')}
            </div>
            ${filtered.length === 0 ? '<div class="py-20 text-center text-gray-600 font-bold">No gear found matching your search.</div>' : ''}
        </div>
    `;
};

const ProductView = () => {
    const p = state.selectedProduct;
    if (!p) return '';
    return `
        <div class="max-w-7xl mx-auto px-4 py-12 fade-in">
            <button onclick="app.goHome()" class="mb-10 text-gray-400 hover:text-white flex items-center space-x-2 font-bold uppercase text-xs">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
                <span>Back to Hub</span>
            </button>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div class="bg-[#0d0d0d] rounded-[3rem] overflow-hidden border border-white/5 shadow-2xl">
                    <img src="${p.image}" class="w-full aspect-[4/5] object-cover">
                </div>
                <div class="space-y-8">
                    <div>
                        <span class="text-blue-500 text-xs font-black uppercase tracking-widest">${p.category} Elite</span>
                        <h1 class="text-4xl sm:text-6xl font-black text-white mt-2 mb-4 tracking-tighter">${p.name}</h1>
                        <p class="text-3xl font-black text-white">TK.${p.price}.00</p>
                    </div>
                    <p class="text-gray-400 text-lg leading-relaxed">${p.description}</p>
                    <div class="space-y-4">
                        <p class="text-xs font-black text-gray-500 uppercase tracking-widest">Select Size</p>
                        <div class="flex gap-3">
                            ${p.sizes.map(s => `<button class="w-14 h-14 rounded-xl bg-[#111] border border-white/5 text-sm font-bold hover:border-blue-500 transition-colors">${s}</button>`).join('')}
                        </div>
                    </div>
                    <button onclick="app.goCheckout()" class="w-full py-5 bg-blue-600 text-white rounded-[2rem] font-black uppercase tracking-widest hover:bg-blue-500 transition-all shadow-xl">Buy Now</button>
                </div>
            </div>
        </div>
    `;
};

const CheckoutView = () => {
    const p = state.selectedProduct;
    if (!p) return '';
    return `
        <div class="max-w-2xl mx-auto px-4 py-12 fade-in">
            <h2 class="text-3xl font-black italic mb-8 tracking-tighter uppercase">চেকআউট</h2>
            <div class="bg-[#0d0d0d] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
                <form onsubmit="event.preventDefault(); alert('Order Placed!'); app.goHome();" class="space-y-6">
                    <div class="space-y-2">
                        <label class="text-[10px] font-black text-gray-500 uppercase ml-1">আপনার নাম</label>
                        <input required type="text" class="w-full bg-[#151515] border border-white/5 rounded-2xl py-4 px-6 text-sm outline-none focus:border-blue-500/40">
                    </div>
                    <div class="space-y-2">
                        <label class="text-[10px] font-black text-gray-500 uppercase ml-1">মোবাইল নাম্বার</label>
                        <input required type="tel" class="w-full bg-[#151515] border border-white/5 rounded-2xl py-4 px-6 text-sm outline-none focus:border-blue-500/40">
                    </div>
                    <div class="space-y-2">
                        <label class="text-[10px] font-black text-gray-500 uppercase ml-1">ঠিকানা</label>
                        <textarea required rows="2" class="w-full bg-[#151515] border border-white/5 rounded-2xl py-4 px-6 text-sm outline-none focus:border-blue-500/40"></textarea>
                    </div>
                    <div class="pt-4 border-t border-white/5 flex justify-between items-center">
                        <span class="text-lg font-black uppercase">টোটাল পেমেন্ট</span>
                        <span class="text-2xl font-black text-blue-500">TK.${p.price + 110}</span>
                    </div>
                    <button type="submit" class="w-full bg-blue-600 py-5 rounded-[2rem] font-black uppercase tracking-widest">অর্ডার নিশ্চিত করুন</button>
                </form>
            </div>
        </div>
    `;
};

const Footer = () => `
    <footer class="bg-[#080808] border-t border-white/5 py-16 mt-auto">
        <div class="max-w-7xl mx-auto px-4 text-center">
            <h2 class="text-3xl font-black mb-4 tracking-tighter italic text-white uppercase">HADI<span class="text-blue-600">KIT</span></h2>
            <p class="text-gray-600 mb-10 text-xs uppercase tracking-widest font-black">&copy; 2024 HADIKIT.V3 — Premium Quality Kits</p>
            <div class="flex justify-center gap-8 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                <a href="#" class="hover:text-blue-500">Facebook</a>
                <a href="#" class="hover:text-blue-500">WhatsApp</a>
                <a href="#" class="hover:text-blue-500">Policy</a>
            </div>
        </div>
    </footer>
`;

const Stylist = () => `
    <div class="fixed bottom-10 right-10 z-[100]">
        ${state.stylistOpen ? `
            <div class="absolute bottom-24 right-0 w-[340px] h-[500px] bg-[#0d0d0d]/95 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 flex flex-col overflow-hidden shadow-2xl fade-in">
                <div class="bg-blue-600 p-6 text-white font-black italic text-lg">GEMINI STYLIST</div>
                <div id="stylist-messages" class="flex-grow p-4 overflow-y-auto space-y-4 hide-scrollbar">
                    ${state.stylistMessages.map(m => `
                        <div class="flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}">
                            <div class="max-w-[80%] p-3 rounded-2xl text-xs font-medium ${m.role === 'user' ? 'bg-blue-600' : 'bg-[#1a1a1a] border border-white/5'}">${m.text}</div>
                        </div>
                    `).join('')}
                    ${state.isStylistLoading ? '<div class="text-[10px] text-gray-500 animate-pulse">Thinking...</div>' : ''}
                </div>
                <div class="p-4 bg-[#0a0a0a] border-t border-white/5 flex gap-2">
                    <input id="stylist-input" type="text" placeholder="Need a suggestion?" class="flex-grow bg-[#151515] rounded-full py-3 px-4 text-xs outline-none">
                    <button onclick="app.sendMessage()" class="bg-blue-600 p-3 rounded-full"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg></button>
                </div>
            </div>
        ` : ''}
        <button onclick="app.toggleStylist()" class="w-16 h-16 bg-blue-600 rounded-[1.5rem] flex items-center justify-center shadow-xl hover:scale-110 transition-transform">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
        </button>
    </div>
`;

// --- Rendering Engine ---
function render() {
    const root = document.getElementById('root');
    if (!root) return;

    let mainContent = '';
    if (state.view === 'home') mainContent = HomeView();
    else if (state.view === 'product') mainContent = ProductView();
    else if (state.view === 'checkout') mainContent = CheckoutView();

    root.innerHTML = `
        ${Header()}
        <main id="app-content" class="flex-grow">
            ${mainContent}
        </main>
        ${Footer()}
        ${Stylist()}
    `;

    // Re-bind search input focus if it was active
    const search = document.getElementById('main-search') as HTMLInputElement;
    if (search && state.searchQuery) {
        search.focus();
        search.setSelectionRange(state.searchQuery.length, state.searchQuery.length);
    }
}

// Start app
document.addEventListener('DOMContentLoaded', render);
render(); // Direct call in case DOMContentLoaded already fired
