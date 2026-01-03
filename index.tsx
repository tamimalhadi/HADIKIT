
import { GoogleGenAI } from "@google/genai";
import { PRODUCTS } from "./constants";
import { Product } from "./types";

// --- State Management ---
interface AppState {
    view: string;
    selectedProduct: Product | null;
    selectedCategory: string;
    searchQuery: string;
    stylistOpen: boolean;
    stylistMessages: { role: string; text: string | undefined }[];
    isStylistLoading: boolean;
}

let state: AppState = {
    view: 'home', // 'home', 'product', 'checkout'
    selectedProduct: null,
    selectedCategory: 'All',
    searchQuery: '',
    stylistOpen: false,
    stylistMessages: [],
    isStylistLoading: false
};

// Always use const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- Routing / Events ---

// Local routing functions defined and then attached to window for string-based HTML handlers
const updateCategory = (cat: string) => {
    state.selectedCategory = cat;
    state.view = 'home';
    updateUI();
};
(window as any).updateCategory = updateCategory;

const navigateToProduct = (id: string) => {
    state.selectedProduct = PRODUCTS.find(p => p.id === id) || null;
    state.view = 'product';
    window.scrollTo(0, 0);
    updateUI();
};
(window as any).navigateToProduct = navigateToProduct;

const navigateToHome = () => {
    state.view = 'home';
    state.selectedProduct = null;
    window.scrollTo(0, 0);
    updateUI();
};
(window as any).navigateToHome = navigateToHome;

const navigateToCheckout = () => {
    state.view = 'checkout';
    window.scrollTo(0, 0);
    updateUI();
};
(window as any).navigateToCheckout = navigateToCheckout;

const toggleStylist = () => {
    state.stylistOpen = !state.stylistOpen;
    updateUI();
};
(window as any).toggleStylist = toggleStylist;

// --- UI Components / Rendering ---

function renderHome() {
    const categories = ['All', 'Football', 'Basketball', 'Baseball', 'Classic'];
    const filteredProducts = PRODUCTS.filter(p => {
        const matchesCategory = state.selectedCategory === 'All' || p.category === state.selectedCategory;
        const matchesSearch = p.name.toLowerCase().includes(state.searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return `
        <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-10 sm:py-16 fade-in">
            <!-- Categories Filter -->
            <div class="flex flex-col sm:flex-row items-center justify-between gap-6 mb-12">
                <div class="flex space-x-3 overflow-x-auto pb-4 sm:pb-0 hide-scrollbar px-1 w-full sm:w-auto">
                    ${categories.map(cat => `
                        <button onclick="updateCategory('${cat}')" class="px-6 sm:px-8 py-2.5 sm:py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-300 transform active:scale-95 whitespace-nowrap border-2 ${
                            state.selectedCategory === cat 
                                ? 'bg-blue-600 border-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] translate-y-[-2px]' 
                                : 'bg-[#111] border-[#222] text-gray-400 hover:border-gray-600 hover:text-white'
                        }">
                            ${cat}
                        </button>
                    `).join('')}
                </div>
                <div class="text-gray-500 text-[10px] sm:text-sm font-medium tracking-wider uppercase">
                    ${filteredProducts.length} Premium Kits Available
                </div>
            </div>

            <!-- Product Grid -->
            ${filteredProducts.length > 0 ? `
                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-10">
                    ${filteredProducts.map(product => renderProductCard(product)).join('')}
                </div>
            ` : `
                <div class="text-center py-24 sm:py-32 bg-[#0a0a0a] rounded-[2rem] sm:rounded-[3rem] border border-[#1a1a1a]">
                    <h3 class="text-xl sm:text-2xl font-bold text-white">No Gear Found</h3>
                    <p class="text-gray-500 mt-2 text-sm">Adjust your filters to see more kits.</p>
                </div>
            `}
        </div>
    `;
}

function renderProductCard(product: Product) {
    return `
        <div onclick="navigateToProduct('${product.id}')" class="perspective-1000 group relative z-10 cursor-pointer">
            <div class="relative bg-[#0d0d0d] rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden border border-white/5 transition-all duration-500 ease-out transform-gpu hover:translate-y-[-5px] hover:rotate-x-[4deg] hover:shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(59,130,246,0.15)] hover:border-blue-500/20 shadow-2xl">
                <div class="absolute top-3 left-3 sm:top-5 sm:left-5 z-20 flex flex-col space-y-1.5">
                    ${product.isNew ? '<span class="bg-blue-600 text-white text-[7px] sm:text-[9px] font-black px-2 sm:px-3 py-1 rounded-full uppercase">New</span>' : ''}
                    ${product.isPopular ? '<span class="bg-white text-black text-[7px] sm:text-[9px] font-black px-2 sm:px-3 py-1 rounded-full uppercase">Hot</span>' : ''}
                </div>
                <div class="relative aspect-[3/4] overflow-hidden bg-[#151515]">
                    <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 group-hover:opacity-70">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div class="absolute bottom-4 left-0 w-full text-center opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                        <span class="text-[10px] font-black uppercase tracking-widest text-white bg-blue-600 px-4 py-1.5 rounded-full">View Details</span>
                    </div>
                </div>
                <div class="p-4 sm:p-6">
                    <div class="flex justify-between items-start mb-1">
                        <span class="text-[8px] sm:text-[10px] font-bold text-gray-500 uppercase tracking-widest">${product.category}</span>
                        <span class="font-black text-sm sm:text-lg text-white">TK.${product.price}</span>
                    </div>
                    <h3 class="text-xs sm:text-base font-bold text-white group-hover:text-blue-500 transition-colors line-clamp-1">${product.name}</h3>
                </div>
            </div>
        </div>
    `;
}

function renderProductPage(product: Product) {
    return `
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 fade-in">
            <button onclick="navigateToHome()" class="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors mb-12 group">
                <div class="p-2 bg-[#111] rounded-xl group-hover:bg-[#222]">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                </div>
                <span class="text-sm font-bold uppercase tracking-widest">Back to Collection</span>
            </button>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                <div class="perspective-1000">
                    <div class="relative bg-[#0d0d0d] rounded-[3rem] overflow-hidden border border-white/5 shadow-2xl p-2">
                        <img src="${product.image}" class="w-full aspect-[4/5] object-cover rounded-[2.5rem]">
                    </div>
                </div>
                <div class="space-y-10 py-4">
                    <div>
                        <div class="flex items-center space-x-3 mb-6">
                            <span class="px-4 py-1.5 bg-blue-600/10 border border-blue-500/30 text-blue-500 rounded-full text-xs font-black uppercase tracking-widest">${product.category} Gear</span>
                        </div>
                        <h1 class="text-4xl sm:text-6xl font-black text-white tracking-tighter mb-4 leading-tight">${product.name}</h1>
                        <p class="text-3xl font-black text-blue-500">TK.${product.price}.00</p>
                    </div>
                    <div class="space-y-4">
                        <h3 class="text-xs font-black text-gray-500 uppercase tracking-widest">Description</h3>
                        <p class="text-gray-400 text-lg leading-relaxed max-w-xl">${product.description}</p>
                    </div>
                    <div class="space-y-6">
                        <h3 class="text-xs font-black text-gray-500 uppercase tracking-widest">Select Your Size</h3>
                        <div class="flex flex-wrap gap-4">
                            ${product.sizes.map(size => `<button class="min-w-[70px] h-16 text-sm font-black rounded-2xl border-2 transition-all bg-[#111] text-gray-400 border-white/5 hover:border-white/20">${size}</button>`).join('')}
                        </div>
                    </div>
                    <button onclick="navigateToCheckout()" class="w-full sm:w-auto px-16 py-6 bg-blue-600 hover:bg-blue-500 text-white rounded-[2rem] font-black text-xl uppercase tracking-widest transition-all shadow-xl active:scale-95">Buy Now</button>
                </div>
            </div>
        </div>
    `;
}

function renderCheckoutPage(product: Product) {
    const districts = ["ঢাকা", "চট্টগ্রাম", "সিলেট", "রাজশাহী", "খুলনা", "বরিশাল", "রংপুর", "ময়মনসিংহ"].sort();
    return `
        <div class="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 fade-in">
            <div class="flex items-center justify-between mb-8 sm:mb-12">
                <button onclick="navigateToHome()" class="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                    <span class="text-sm font-bold uppercase tracking-widest">ফিরে যান</span>
                </button>
                <h2 class="text-xl sm:text-2xl font-black italic tracking-tighter uppercase">চেকআউট</h2>
            </div>
            <div class="bg-[#0d0d0d] p-6 sm:p-10 rounded-[2.5rem] border border-white/5 shadow-2xl">
                <form id="checkout-form" class="space-y-8">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div class="space-y-4">
                            <div>
                                <label class="text-sm font-bold text-gray-400 ml-1">আপনার নাম *</label>
                                <input required type="text" placeholder="সম্পূর্ণ নাম" class="w-full bg-[#151515] border border-white/5 rounded-2xl py-4 px-6 text-sm text-white outline-none focus:border-blue-500/30">
                            </div>
                            <div>
                                <label class="text-sm font-bold text-gray-400 ml-1">মোবাইল নাম্বার *</label>
                                <input required type="tel" placeholder="১১ ডিজিটের মোবাইল নাম্বার" class="w-full bg-[#151515] border border-white/5 rounded-2xl py-4 px-6 text-sm text-white outline-none focus:border-blue-500/30">
                            </div>
                        </div>
                        <div class="space-y-4">
                            <div>
                                <label class="text-sm font-bold text-gray-400 ml-1">জেলা *</label>
                                <select required class="w-full bg-[#151515] border border-white/5 rounded-2xl py-4 px-6 text-sm text-white outline-none appearance-none">
                                    <option value="" disabled selected>জেলা সিলেক্ট করুন</option>
                                    ${districts.map(d => `<option value="${d}">${d}</option>`).join('')}
                                </select>
                            </div>
                            <div>
                                <label class="text-sm font-bold text-gray-400 ml-1">ঠিকানা *</label>
                                <textarea required rows="1" placeholder="রোড/বাড়ি নাম্বার" class="w-full bg-[#151515] border border-white/5 rounded-2xl py-4 px-6 text-sm text-white outline-none"></textarea>
                            </div>
                        </div>
                    </div>
                    <div class="border-t border-white/5 pt-8">
                        <div class="flex justify-between items-center mb-6">
                            <span class="text-lg font-black uppercase">টোটাল পেমেন্ট</span>
                            <span class="text-3xl font-black text-blue-500">TK.${product.price + 110}</span>
                        </div>
                        <button type="submit" class="w-full bg-blue-600 hover:bg-blue-500 text-white py-6 rounded-[2rem] font-black text-xl uppercase tracking-widest shadow-xl transition-all active:scale-95">অর্ডার কনফার্ম করুন</button>
                    </div>
                </form>
            </div>
        </div>
    `;
}

function renderStylist() {
    return `
        <div class="fixed bottom-10 right-10 z-[100] perspective-1000">
            ${state.stylistOpen ? `
                <div class="absolute bottom-24 right-0 w-[350px] sm:w-[420px] h-[550px] bg-[#0d0d0d]/95 backdrop-blur-2xl rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.8),0_0_40px_rgba(59,130,246,0.1)] border border-white/10 flex flex-col overflow-hidden fade-in">
                    <div class="bg-gradient-to-br from-blue-700 to-indigo-900 p-8 text-white relative">
                        <div class="flex items-center space-x-4">
                            <div class="bg-white/10 p-3 rounded-2xl backdrop-blur-md">
                                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            </div>
                            <div>
                                <h3 class="font-black text-xl tracking-tighter italic">GEMINI_STYLIST</h3>
                                <p class="text-[10px] opacity-60 uppercase font-black tracking-widest flex items-center">
                                    <span class="w-1.5 h-1.5 bg-green-400 rounded-full mr-1.5 animate-pulse"></span>Active Neural Link
                                </p>
                            </div>
                        </div>
                    </div>
                    <div id="stylist-messages" class="flex-grow overflow-y-auto p-6 space-y-6 hide-scrollbar">
                        ${state.stylistMessages.length === 0 ? `
                            <div class="text-center py-8">
                                <p class="text-sm text-gray-400 leading-relaxed font-medium bg-[#151515] p-6 rounded-[2rem] border border-white/5 mb-6">"What kind of jersey are you looking for? Retro, modern, or a specific team?"</p>
                            </div>
                        ` : state.stylistMessages.map(m => `
                            <div class="flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}">
                                <div class="max-w-[85%] px-5 py-4 rounded-[1.8rem] text-sm font-medium leading-relaxed shadow-lg ${
                                    m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-[#1a1a1a] border border-white/10 text-gray-200'
                                }">${m.text}</div>
                            </div>
                        `).join('')}
                    </div>
                    <div class="p-6 bg-[#0a0a0a] border-t border-white/5">
                        <div class="flex items-center space-x-3">
                            <input id="stylist-input" type="text" placeholder="Message stylist..." class="flex-grow bg-[#151515] border border-white/5 rounded-full py-4 px-6 text-sm text-white outline-none">
                            <button id="stylist-send" class="bg-blue-600 text-white p-4 rounded-full shadow-xl active:scale-90"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg></button>
                        </div>
                    </div>
                </div>
            ` : ''}
            <button onclick="toggleStylist()" class="group w-20 h-20 rounded-[2.5rem] flex items-center justify-center shadow-2xl transition-all duration-500 active:scale-90 ${state.stylistOpen ? 'bg-white rotate-90' : 'bg-blue-600 hover:scale-110'}">
                ${state.stylistOpen ? '<svg class="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>' : '<svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>'}
            </button>
        </div>
    `;
}

// --- Logic ---

function updateUI() {
    const container = document.getElementById('app-content');
    const stylistContainer = document.getElementById('stylist-container');

    if (!container || !stylistContainer) return;

    if (state.view === 'home') {
        container.innerHTML = renderHome();
    } else if (state.view === 'product' && state.selectedProduct) {
        container.innerHTML = renderProductPage(state.selectedProduct);
    } else if (state.view === 'checkout' && state.selectedProduct) {
        container.innerHTML = renderCheckoutPage(state.selectedProduct);
        const form = document.getElementById('checkout-form');
        if (form) {
            form.onsubmit = (e) => {
                e.preventDefault();
                alert('অর্ডার সফল হয়েছে!');
                navigateToHome(); // Fixed: now in scope
            };
        }
    }

    stylistContainer.innerHTML = renderStylist();
    
    // Re-bind events for stylist
    if (state.stylistOpen) {
        const sendBtn = document.getElementById('stylist-send');
        const inputField = document.getElementById('stylist-input') as HTMLInputElement;
        if (sendBtn) sendBtn.onclick = handleStylistMessage;
        if (inputField) {
            inputField.onkeypress = (e) => {
                if (e.key === 'Enter') handleStylistMessage();
            };
        }
    }
}

async function handleStylistMessage() {
    // Fixed: casting result of document.getElementById to HTMLInputElement
    const input = document.getElementById('stylist-input') as HTMLInputElement;
    if (!input) return;
    const text = input.value.trim();
    if (!text || state.isStylistLoading) return;

    state.stylistMessages.push({ role: 'user', text });
    state.isStylistLoading = true;
    updateUI();

    try {
        const productNames = PRODUCTS.map(p => p.name).join(', ');
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `Stylist persona: Suggest 1-2 jerseys from: ${productNames}. User said: "${text}". Concise and friendly.`,
        });
        state.stylistMessages.push({ role: 'ai', text: response.text });
    } catch (e) {
        state.stylistMessages.push({ role: 'ai', text: "Service temporarily offline. Check our latest drops!" });
    } finally {
        state.isStylistLoading = false;
        updateUI();
        const msgContainer = document.getElementById('stylist-messages');
        if (msgContainer) msgContainer.scrollTop = msgContainer.scrollHeight;
    }
}

// --- Initialization ---

const logo = document.getElementById('logo');
if (logo) logo.onclick = navigateToHome; // Fixed: now using locally scoped function

const searchInput = document.getElementById('search-input');
if (searchInput) {
    searchInput.oninput = (e) => {
        // Fixed: casting e.target to HTMLInputElement
        state.searchQuery = (e.target as HTMLInputElement).value;
        if (state.view !== 'home') state.view = 'home';
        updateUI();
    };
}

// Initial Render
updateUI();
