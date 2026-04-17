import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, Truck, User, LogOut, ChevronDown, Heart, Package, Search, X, ArrowRight, Star, Utensils } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useState } from 'react';
import { CartItem } from '../types';

interface NavbarProps {
  cartCount: number;
  cartItems: CartItem[];
  onCartClick: () => void;
  onOrderHistoryClick: () => void;
  onProfileClick: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function Navbar({ cartCount, cartItems, onCartClick, onOrderHistoryClick, onProfileClick, searchQuery, onSearchChange }: NavbarProps) {
  const { user, logout, setIsAuthOpen } = useUser();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCartPreviewOpen, setIsCartPreviewOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-[60] bg-white/70 backdrop-blur-xl border-b border-brand-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 gap-4">
              <div className="flex items-center gap-3 shrink-0 group cursor-pointer">
                <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center shadow-lg shadow-brand-200 group-hover:rotate-12 transition-transform duration-500">
                  <Utensils className="w-6 h-6 text-white" />
                </div>
                <span className="text-lg sm:text-2xl font-bold font-serif tracking-tight text-brand-900">The Food Planet</span>
              </div>
          
          {/* Search Bar - Responsive */}
          <div className={`hidden md:flex flex-1 max-w-md relative group transition-all duration-300 ${isSearchFocused ? 'scale-105' : ''}`}>
            <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-300 ${isSearchFocused ? 'text-brand-600' : 'text-slate-400'}`}>
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              placeholder="Search dishes..."
              className={`w-full pl-11 pr-10 py-2.5 bg-slate-100/50 border-2 rounded-2xl text-sm font-medium transition-all duration-300 focus:outline-none focus:bg-white focus:ring-4 focus:ring-brand-100 ${
                isSearchFocused ? 'border-brand-600' : 'border-transparent hover:bg-slate-100'
              }`}
            />
            {searchQuery && (
              <button 
                onClick={() => onSearchChange('')}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-brand-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1 sm:gap-6 shrink-0">
            <button 
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-brand-600 transition-all"
            >
              <Search className="w-6 h-6" />
            </button>

            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-3 p-1.5 pr-4 rounded-full hover:bg-slate-50 border border-transparent hover:border-brand-100 transition-all"
                >
                  <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full shadow-sm" />
                  <div className="hidden sm:block text-left">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Welcome back</p>
                    <p className="text-sm font-bold text-slate-700 leading-none">{user.name.split(' ')[0]}</p>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-[-1]" onClick={() => setIsUserMenuOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 15, scale: 0.95 }}
                        className="absolute right-0 mt-3 w-64 bg-white rounded-3xl shadow-2xl border border-brand-100 py-3 overflow-hidden"
                      >
                        <div className="px-5 py-4 border-b border-slate-50 mb-2 bg-slate-50/50">
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Account</p>
                          <p className="text-sm font-bold text-slate-900 truncate">{user.email}</p>
                          {user.address?.street && (
                            <p className="text-[11px] text-slate-500 truncate mt-1 flex items-center gap-1">
                              <Truck className="w-3 h-3" />
                              {user.address.street}, {user.address.city}
                            </p>
                          )}
                        </div>
                        
                        <div className="px-2 space-y-1">
                          <button 
                            onClick={() => {
                              onProfileClick();
                              setIsUserMenuOpen(false);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-brand-50 hover:text-brand-600 rounded-2xl transition-all"
                          >
                            <User className="w-4 h-4" />
                            My Profile
                          </button>
                          <button className="w-full flex items-center justify-between px-4 py-3 text-sm font-bold text-slate-600 hover:bg-brand-50 hover:text-brand-600 rounded-2xl transition-all">
                            <div className="flex items-center gap-3">
                              <Heart className="w-4 h-4" />
                              My Wishlist
                            </div>
                            {user.wishlist.length > 0 && (
                              <span className="bg-brand-100 text-brand-700 text-[10px] px-2 py-0.5 rounded-full">
                                {user.wishlist.length}
                              </span>
                            )}
                          </button>
                          <button 
                            onClick={() => {
                              onOrderHistoryClick();
                              setIsUserMenuOpen(false);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-brand-50 hover:text-brand-600 rounded-2xl transition-all"
                          >
                            <Package className="w-4 h-4" />
                            Order History
                          </button>
                        </div>

                        <button 
                          onClick={() => {
                            logout();
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-6 py-4 text-sm font-bold text-red-600 hover:bg-red-50 transition-all border-t border-slate-50 mt-2"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button 
                onClick={() => setIsAuthOpen(true)}
                className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-brand-600 hover:bg-brand-50 rounded-2xl transition-all border border-brand-100"
              >
                <User className="w-4 h-4" />
                Sign In
              </button>
            )}

            <div className="w-px h-8 bg-slate-200 hidden sm:block" />

            <div 
              className="relative"
              onMouseEnter={() => setIsCartPreviewOpen(true)}
              onMouseLeave={() => setIsCartPreviewOpen(false)}
            >
              <button 
                onClick={onCartClick}
                className="relative p-2.5 text-slate-600 hover:text-brand-600 transition-all group"
              >
                <ShoppingCart className="w-7 h-7 group-hover:scale-110 transition-transform" />
                {cartCount > 0 && (
                  <motion.span 
                    key={cartCount}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute top-0 right-0 bg-brand-600 text-white text-[10px] font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow-lg"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </button>

              <AnimatePresence>
                {isCartPreviewOpen && cartCount > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 15, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-80 bg-white rounded-3xl shadow-2xl border border-brand-100 overflow-hidden z-[70]"
                  >
                    <div className="p-5 border-b border-slate-50 bg-slate-50/50">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Quick Preview</p>
                      <p className="text-sm font-bold text-slate-900">{cartCount} items in basket</p>
                    </div>
                    
                    <div className="max-h-64 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                      {cartItems.slice(0, 3).map((item) => (
                        <div key={item.id} className="flex gap-3">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-12 h-12 rounded-xl object-cover shadow-sm"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-900 truncate">{item.name}</p>
                            <p className="text-[10px] text-slate-500">{item.quantity} x ${item.price}</p>
                          </div>
                        </div>
                      ))}
                      {cartItems.length > 3 && (
                        <p className="text-[10px] text-center text-slate-400 font-medium">
                          + {cartItems.length - 3} more items
                        </p>
                      )}
                    </div>

                    <div className="p-4 bg-slate-50 border-t border-slate-100">
                      <button 
                        onClick={onCartClick}
                        className="w-full py-3 bg-brand-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-brand-700 transition-all shadow-lg shadow-brand-100"
                      >
                        View Full Basket
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      <AnimatePresence>
        {isMobileSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-20 left-0 right-0 bg-white p-4 border-b border-brand-100 shadow-xl z-50"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search dishes..."
                className="w-full pl-11 pr-10 py-3 bg-slate-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-600"
              />
              <button 
                onClick={() => setIsMobileSearchOpen(false)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden bg-brand-50/30">
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-brand-200/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-brand-300/10 rounded-full blur-3xl animate-pulse delay-1000" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-100 text-brand-700 rounded-full text-xs font-bold uppercase tracking-widest mb-8"
            >
              <span className="w-2 h-2 bg-brand-600 rounded-full animate-ping" />
              New Collection 2026
            </motion.div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-serif font-bold text-slate-900 leading-tight mb-6">
              The Perfect <span className="text-brand-600 italic">Flavor</span> <br className="hidden lg:block" /> for Every Craving.
            </h1>
            <p className="text-base sm:text-lg text-slate-600 mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              From spicy biryanis to decadent desserts, discover our curated collection of 50 artisanal dishes crafted by master chefs.
            </p>
            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
              <motion.a 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="#products"
                className="px-10 py-5 bg-brand-600 text-white rounded-2xl font-bold hover:bg-brand-700 transition-all shadow-xl shadow-brand-200 flex items-center gap-3 group"
              >
                Explore Menu
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.a>
              <motion.button
                whileHover={{ backgroundColor: "rgba(255,255,255,1)" }}
                className="px-10 py-5 bg-white/50 backdrop-blur-sm border-2 border-brand-100 text-slate-700 rounded-2xl font-bold transition-all"
              >
                Our Story
              </motion.button>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-brand-400 rounded-[3rem] rotate-6 scale-105 opacity-20 blur-3xl animate-pulse" />
            <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white">
              <img 
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1200"
                alt="Gourmet Food Collection"
                className="w-full aspect-[4/3] object-cover hover:scale-110 transition-transform duration-1000"
                referrerPolicy="no-referrer"
              />
              
              {/* Floating Stats Card */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="absolute bottom-8 -left-8 bg-white p-6 rounded-3xl shadow-2xl border border-brand-100 hidden sm:block"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-brand-100 rounded-2xl flex items-center justify-center">
                    <Star className="w-6 h-6 text-brand-600 fill-current" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">4.9/5</p>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Customer Rating</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
