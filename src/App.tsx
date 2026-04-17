/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Navbar, Hero } from './components/Layout';
import ProductCard from './components/ProductCard';
import Cart from './components/Cart';
import OrderHistory from './components/OrderHistory';
import UserProfile from './components/UserProfile';
import { PRODUCTS } from './constants';
import { Product, CartItem } from './types';
import { Truck, Search, Star, ShoppingCart, Heart, Check, ArrowRight, Utensils, X } from 'lucide-react';
import { ProductSkeleton } from './components/Skeleton';

import { UserProvider, useUser } from './context/UserContext';
import AuthModal from './components/AuthModal';

export default function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}

type SortOption = 'newest' | 'price-low' | 'price-high' | 'name-az' | 'name-za';

function AppContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrderHistoryOpen, setIsOrderHistoryOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const { user, addOrder, setIsAuthOpen, toast, showToast } = useUser();

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Initial website loading screen
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Trigger data loading skeleton
      setIsDataLoading(true);
      setTimeout(() => setIsDataLoading(false), 1500);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(PRODUCTS.map(p => p.category));
    return ['All', ...Array.from(cats)];
  }, []);

  const sortedAndFilteredProducts = useMemo(() => {
    let result = [...PRODUCTS];

    // Filter by category
    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.category.toLowerCase().includes(query)
      );
    }

    switch (sortBy) {
      case 'price-low': result.sort((a, b) => a.price - b.price); break;
      case 'price-high': result.sort((a, b) => b.price - a.price); break;
      case 'name-az': result.sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'name-za': result.sort((a, b) => b.name.localeCompare(a.name)); break;
      case 'newest': result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break;
    }
    return result;
  }, [selectedCategory, sortBy]);

  const relatedProducts = selectedProduct 
    ? PRODUCTS.filter(p => p.category === selectedProduct.category && p.id !== selectedProduct.id).slice(0, 3)
    : [];

  const addToCart = (product: Product, quantity: number = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const handleCheckout = () => {
    // Check if user is logged in
    if (!user) {
      setIsAuthOpen(true);
      showToast('Please log in to place an order', 'error');
      return;
    }

    // Check if profile is complete
    const isProfileComplete = user.name && user.phone && user.address?.street && user.address?.city && user.address?.zip;
    if (!isProfileComplete) {
      setIsProfileOpen(true);
      showToast('Please complete your profile to place an order', 'error');
      return;
    }

    const total = cartItems.reduce((sum, item) => sum + (item.discountPrice || item.price) * item.quantity, 0);
    
    const newOrder = {
      id: `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      date: new Date().toISOString(),
      items: [...cartItems],
      total,
      status: 'confirmed' as const,
      trackingSteps: [
        { status: 'confirmed' as const, label: 'Order Confirmed', date: new Date().toISOString(), isCompleted: true },
        { status: 'shipping' as const, label: 'Out for Delivery', date: '', isCompleted: false },
        { status: 'delivered' as const, label: 'Delivery Successful', date: '', isCompleted: false },
      ]
    };

    addOrder(newOrder);
    setIsCartOpen(false);
    setCartItems([]);
    showToast('Order Placed!', 'success', 'Your gourmet meal is on its way.');
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-brand-900 z-100 flex flex-col items-center justify-center text-white">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center gap-6"
        >
          <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-2xl">
            <Utensils className="text-brand-900 w-10 h-10" />
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-serif font-bold mb-2">The Food Planet</h1>
            <p className="text-brand-200 text-sm tracking-[0.2em] uppercase">Premium Food Collection</p>
          </div>
          <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden mt-4">
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="w-full h-full bg-white"
            />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/30 selection:bg-brand-100 selection:text-brand-900">
      <Navbar 
        cartCount={cartCount} 
        cartItems={cartItems}
        onCartClick={() => setIsCartOpen(true)} 
        onOrderHistoryClick={() => setIsOrderHistoryOpen(true)}
        onProfileClick={() => setIsProfileOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      
      <main>
        <Hero />

        {/* Products */}
        <section id="products" className="py-12 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 md:mb-16 gap-6 md:gap-8">
              <div className="max-w-xl text-center lg:text-left">
                <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 mb-4 md:mb-6">Our Food Collection</h2>
                <p className="text-slate-500 text-sm md:text-lg leading-relaxed">
                  Explore our curated selection of 50 premium dishes, from spicy biryanis to sweet desserts.
                </p>
              </div>
              
              <div className="flex flex-wrap justify-center lg:justify-start gap-2 md:gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
                      selectedCategory === cat 
                        ? 'bg-brand-600 text-white shadow-lg shadow-brand-200' 
                        : 'bg-white text-slate-500 hover:bg-brand-50 border border-brand-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
            >
              <AnimatePresence mode="popLayout">
                {isDataLoading ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <ProductSkeleton key={i} />
                  ))
                ) : sortedAndFilteredProducts.length > 0 ? (
                  sortedAndFilteredProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                    >
                      <ProductCard 
                        product={product} 
                        onAddToCart={addToCart} 
                        onSelect={setSelectedProduct}
                        isSelected={selectedProduct?.id === product.id}
                      />
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full py-20 text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-brand-50 rounded-full mb-6">
                      <Search className="w-10 h-10 text-brand-400" />
                    </div>
                    <h3 className="text-2xl font-serif font-bold text-slate-900 mb-2">
                      {searchQuery ? 'No Results Found' : 'Collection Coming Soon'}
                    </h3>
                    <p className="text-slate-500 max-w-sm mx-auto">
                      {searchQuery 
                        ? `We couldn't find anything matching "${searchQuery}". Try a different search term or category.`
                        : "We're currently preparing fresh batches of our gourmet dishes. Check back soon for our latest seasonal flavors!"}
                    </p>
                    {searchQuery && (
                      <button 
                        onClick={() => setSearchQuery('')}
                        className="mt-8 text-brand-600 font-bold hover:text-brand-700 transition-colors underline underline-offset-4"
                      >
                        Clear Search
                      </button>
                    )}
                  </div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </section>

        {/* Selected Product Detail & Reviews */}
        <AnimatePresence>
          {selectedProduct && (
            <motion.section 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="py-16 md:py-24 bg-white border-y border-brand-100"
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-8 md:gap-16 mb-16 md:mb-24">
                  <div className="aspect-4/3 md:aspect-square rounded-4xl md:rounded-[3rem] overflow-hidden shadow-2xl border-4 md:border-8 border-slate-50">
                    <img 
                      src={selectedProduct.image} 
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-1000"
                      alt={selectedProduct.name}
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-6">
                      <span className="px-4 py-1.5 bg-brand-50 text-brand-600 text-[10px] md:text-xs font-bold rounded-full uppercase tracking-widest">
                        {selectedProduct.category}
                      </span>
                      <div className="flex items-center gap-1 text-amber-400">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm font-bold text-slate-700">{selectedProduct.rating}</span>
                        <span className="text-xs text-slate-400 font-medium">({selectedProduct.reviews.length} reviews)</span>
                      </div>
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-slate-900 mb-6 leading-tight">{selectedProduct.name}</h2>
                    <p className="text-lg md:text-xl text-slate-600 mb-8 md:mb-10 leading-relaxed">{selectedProduct.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 md:gap-8 mb-10 md:mb-12">
                      <div className="p-4 md:p-6 bg-slate-50 rounded-2xl md:rounded-3xl border border-slate-100">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 md:mb-3">Net Weight</p>
                        <p className="text-lg md:text-xl font-bold text-slate-900">{selectedProduct.weight}</p>
                      </div>
                      <div className="p-4 md:p-6 bg-brand-50/50 rounded-2xl md:rounded-3xl border border-brand-100">
                        <p className="text-[10px] font-bold text-brand-400 uppercase tracking-widest mb-2 md:mb-3">Price</p>
                        <div className="flex items-baseline gap-2">
                          <p className="text-2xl md:text-3xl font-bold text-brand-700">
                            ${selectedProduct.discountPrice || selectedProduct.price}
                          </p>
                          {selectedProduct.discountPrice && (
                            <p className="text-base md:text-lg text-slate-400 line-through">${selectedProduct.price}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <button 
                        onClick={() => addToCart(selectedProduct)}
                        className="flex-1 bg-brand-600 text-white py-5 md:py-6 rounded-2xl font-bold text-lg md:text-xl hover:bg-brand-700 transition-all shadow-xl shadow-brand-100 flex items-center justify-center gap-3 active:scale-95"
                      >
                        <ShoppingCart className="w-6 h-6" />
                        Add to Basket
                      </button>
                      <button 
                        onClick={() => setSelectedProduct(null)}
                        className="px-8 md:px-10 py-5 md:py-6 border-2 border-slate-100 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-all active:scale-95"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-16">
                  <div className="lg:col-span-2 space-y-16">
                    {/* Ingredients Section */}
                    {selectedProduct.ingredients && (
                      <section>
                        <h3 className="text-2xl font-serif font-bold text-slate-900 mb-8 flex items-center gap-3">
                          <span className="w-8 h-8 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center text-sm">01</span>
                          Ingredients
                        </h3>
                        <div className="flex flex-wrap gap-3">
                          {selectedProduct.ingredients.map((ing, i) => (
                            <span key={i} className="px-5 py-3 bg-slate-50 text-slate-600 text-sm font-medium rounded-2xl border border-slate-100">
                              {ing}
                            </span>
                          ))}
                        </div>
                      </section>
                    )}

                    {/* Reviews Section */}
                    <section>
                      <h3 className="text-2xl font-serif font-bold text-slate-900 mb-8 flex items-center gap-3">
                        <span className="w-8 h-8 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center text-sm">02</span>
                        Customer Reviews
                      </h3>
                      <div className="space-y-4 md:space-y-6">
                        {selectedProduct.reviews.map((review) => (
                          <div key={review.id} className="p-6 md:p-8 bg-slate-50 rounded-2rem md:rounded-[2.5rem] border border-slate-100">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <p className="font-bold text-slate-900">{review.userName}</p>
                                <p className="text-xs text-slate-400">{review.date}</p>
                              </div>
                              <div className="flex gap-0.5 text-amber-400">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-slate-200'}`} />
                                ))}
                              </div>
                            </div>
                            <p className="text-slate-600 leading-relaxed italic">"{review.comment}"</p>
                          </div>
                        ))}
                      </div>
                    </section>
                  </div>

                  {/* Nutrition Sidebar */}
                  <aside>
                    {selectedProduct.nutrition && (
                      <div className="sticky top-32 p-6 md:p-10 bg-slate-900 text-white rounded-[2.5rem] md:rounded-[3rem] shadow-2xl overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-600 rounded-full -mr-16 -mt-16 opacity-20 blur-2xl" />
                        <h3 className="text-xl font-serif font-bold mb-8 relative z-10">Nutritional Facts</h3>
                        <div className="space-y-6 relative z-10">
                          <div className="flex justify-between items-end border-b border-white/10 pb-4">
                            <span className="text-slate-400 text-sm font-medium">Calories</span>
                            <span className="text-2xl font-bold">{selectedProduct.nutrition.calories} kcal</span>
                          </div>
                          <div className="flex justify-between items-end border-b border-white/10 pb-4">
                            <span className="text-slate-400 text-sm font-medium">Protein</span>
                            <span className="text-xl font-bold">{selectedProduct.nutrition.protein}</span>
                          </div>
                          <div className="flex justify-between items-end border-b border-white/10 pb-4">
                            <span className="text-slate-400 text-sm font-medium">Carbs</span>
                            <span className="text-xl font-bold">{selectedProduct.nutrition.carbs}</span>
                          </div>
                          <div className="flex justify-between items-end border-b border-white/10 pb-4">
                            <span className="text-slate-400 text-sm font-medium">Fat</span>
                            <span className="text-xl font-bold">{selectedProduct.nutrition.fat}</span>
                          </div>
                        </div>
                        <p className="mt-8 text-[10px] text-slate-500 italic leading-relaxed">
                          * Values are approximate and based on standard serving sizes.
                        </p>
                      </div>
                    )}
                  </aside>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Related Products Section */}
        <AnimatePresence>
          {selectedProduct && relatedProducts.length > 0 && (
            <motion.section 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="py-24 bg-brand-50/30"
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-16">
                  <div>
                    <h2 className="text-4xl font-serif font-bold text-slate-900 mb-4">
                      More <span className="text-brand-600">{selectedProduct.category}</span> Favorites
                    </h2>
                    <p className="text-slate-500 text-lg">Hand-picked selections based on your interest.</p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {relatedProducts.map((product) => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      onAddToCart={addToCart} 
                      onSelect={setSelectedProduct}
                      isSelected={selectedProduct?.id === product.id}
                    />
                  ))}
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Feedback Form Section */}
        <section className="py-20 md:py-32 bg-brand-900 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-800 rounded-full -mr-[200px] -mt-[200px] opacity-20 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-800 rounded-full -ml-[200px] -mb-[200px] opacity-20 blur-3xl" />
          
          <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
            <h2 className="text-3xl md:text-6xl font-serif font-bold mb-8">We Value Your Feedback.</h2>
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                console.log('Feedback Submitted:', Object.fromEntries(formData));
                showToast('Feedback Received!', 'success', 'Thank you for helping us improve.');
                e.currentTarget.reset();
              }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-3xl mx-auto text-left"
            >
              <div className="space-y-3">
                <label className="text-sm font-bold text-brand-300 uppercase tracking-widest">Name</label>
                <input 
                  name="name"
                  type="text" 
                  placeholder="Your Name" 
                  className="w-full px-8 py-5 rounded-2xl bg-white/5 border border-white/10 focus:outline-none focus:border-white focus:bg-white/10 transition-all"
                  required
                />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-bold text-brand-300 uppercase tracking-widest">Email</label>
                <input 
                  name="email"
                  type="email" 
                  placeholder="Your Email" 
                  className="w-full px-8 py-5 rounded-2xl bg-white/5 border border-white/10 focus:outline-none focus:border-white focus:bg-white/10 transition-all"
                  required
                />
              </div>
              <div className="md:col-span-2 space-y-3">
                <label className="text-sm font-bold text-brand-300 uppercase tracking-widest">Full Address</label>
                <input 
                  name="address"
                  type="text" 
                  placeholder="Street Address, Apartment, Suite, etc." 
                  className="w-full px-8 py-5 rounded-2xl bg-white/5 border border-white/10 focus:outline-none focus:border-white focus:bg-white/10 transition-all"
                  required
                />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-bold text-brand-300 uppercase tracking-widest">City</label>
                <input 
                  name="city"
                  type="text" 
                  placeholder="City" 
                  className="w-full px-8 py-5 rounded-2xl bg-white/5 border border-white/10 focus:outline-none focus:border-white focus:bg-white/10 transition-all"
                  required
                />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-bold text-brand-300 uppercase tracking-widest">Zip Code</label>
                <input 
                  name="zipCode"
                  type="text" 
                  placeholder="Zip Code" 
                  className="w-full px-8 py-5 rounded-2xl bg-white/5 border border-white/10 focus:outline-none focus:border-white focus:bg-white/10 transition-all"
                  required
                />
              </div>
              <div className="md:col-span-2 space-y-3">
                <label className="text-sm font-bold text-brand-300 uppercase tracking-widest">Message</label>
                <textarea 
                  name="message"
                  placeholder="Tell us what's on your mind..." 
                  rows={5}
                  className="w-full px-8 py-5 rounded-2xl bg-white/5 border border-white/10 focus:outline-none focus:border-white focus:bg-white/10 transition-all resize-none"
                  required
                />
              </div>
              <div className="md:col-span-2 pt-6">
                <button 
                  type="submit"
                  className="w-full py-6 bg-white text-brand-900 rounded-2xl font-bold text-xl hover:bg-brand-50 transition-all shadow-2xl shadow-black/20 transform hover:-translate-y-1"
                >
                  Send Feedback
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>

      <footer className="bg-white py-16 md:py-24 border-t border-brand-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <span className="text-2xl md:text-3xl font-bold font-serif text-brand-900">The Food Planet</span>
            <p className="text-xs md:text-sm text-slate-400 font-medium">© 2026 The Food Planet. Premium Food Collection.</p>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-[55] w-12 h-12 md:w-14 md:h-14 bg-brand-600 text-white rounded-2xl shadow-2xl shadow-brand-200 flex items-center justify-center hover:bg-brand-700 transition-all group"
          >
            <ArrowRight className="w-5 h-5 md:w-6 md:h-6 -rotate-90 group-hover:-translate-y-1 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>

      <Cart 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemove={removeFromCart}
        onCheckout={handleCheckout}
      />

      <OrderHistory 
        isOpen={isOrderHistoryOpen} 
        onClose={() => setIsOrderHistoryOpen(false)} 
      />

      <UserProfile 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
      />

      <AuthModal />

      {/* Toast System */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] px-8 py-5 rounded-2xl shadow-2xl flex items-center gap-4 min-w-[320px] ${
              toast.type === 'success' ? 'bg-green-600' : 
              toast.type === 'error' ? 'bg-red-600' : 'bg-slate-800'
            } text-white`}
          >
            <div className={`p-2 rounded-full ${toast.type === 'success' ? 'bg-white/20' : 'bg-white/10'}`}>
              {toast.type === 'success' ? <Check className="w-6 h-6" /> : 
               toast.type === 'error' ? <X className="w-6 h-6" /> : <Star className="w-6 h-6 fill-current" />}
            </div>
            <div className="flex-1">
              <p className="font-bold text-lg leading-tight">{toast.message}</p>
              {toast.subMessage && <p className="text-sm opacity-90 mt-0.5">{toast.subMessage}</p>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
