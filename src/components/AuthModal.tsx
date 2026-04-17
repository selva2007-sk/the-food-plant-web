import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, User, ArrowRight, MapPin, Home, Phone } from 'lucide-react';
import React, { useState } from 'react';
import { useUser } from '../context/UserContext';

export default function AuthModal() {
  const { isAuthOpen, setIsAuthOpen, login } = useUser();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && name) {
      login(email, name, { street, city, zip }, phone);
    } else if (email && !isSignUp) {
      // Mock login for existing users
      login(email, email.split('@')[0], undefined, '');
    }
  };

  return (
    <AnimatePresence>
      {isAuthOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsAuthOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60]"
          />
          <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full max-w-md bg-white rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden pointer-events-auto max-h-[95vh] flex flex-col"
            >
              <div className="relative p-6 sm:p-10 overflow-y-auto custom-scrollbar">
                <div className="flex justify-center mb-4 sm:hidden">
                  <div className="w-12 h-1 bg-slate-200 rounded-full" />
                </div>
                
                <button 
                  onClick={() => setIsAuthOpen(false)}
                  className="absolute right-6 top-6 p-2 hover:bg-slate-100 rounded-full transition-colors z-10 hidden sm:block"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>

                <div className="mb-8 text-center sm:text-left">
                  <h2 className="text-3xl sm:text-5xl font-serif font-bold text-slate-900 leading-tight">
                    {isSignUp ? 'Create Account' : 'Welcome Back'}
                  </h2>
                  <p className="text-slate-500 mt-2 text-base sm:text-xl">
                    {isSignUp ? 'Join our gourmet community' : 'Sign in to your account'}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {!isSignUp ? (
                    <>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2.5 ml-1">Email Address</label>
                        <div className="relative group">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-xl bg-slate-50 group-focus-within:bg-brand-50 transition-colors">
                            <Mail className="w-5 h-5 text-slate-400 group-focus-within:text-brand-500 transition-colors" />
                          </div>
                          <input 
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="john@example.com"
                            className="w-full pl-16 pr-4 py-4.5 bg-slate-50 border-2 border-transparent rounded-2xl focus:outline-none focus:border-brand-500 focus:bg-white transition-all text-base sm:text-lg"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <button type="button" className="text-sm font-bold text-brand-600 hover:underline decoration-2 underline-offset-4">Forgot Password?</button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2.5 ml-1">Full Name</label>
                        <div className="relative group">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-xl bg-slate-50 group-focus-within:bg-brand-50 transition-colors">
                            <User className="w-5 h-5 text-slate-400 group-focus-within:text-brand-500 transition-colors" />
                          </div>
                          <input 
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="John Doe"
                            className="w-full pl-16 pr-4 py-4.5 bg-slate-50 border-2 border-transparent rounded-2xl focus:outline-none focus:border-brand-500 focus:bg-white transition-all text-base sm:text-lg"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2.5 ml-1">Email Address</label>
                        <div className="relative group">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-xl bg-slate-50 group-focus-within:bg-brand-50 transition-colors">
                            <Mail className="w-5 h-5 text-slate-400 group-focus-within:text-brand-500 transition-colors" />
                          </div>
                          <input 
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="john@example.com"
                            className="w-full pl-16 pr-4 py-4.5 bg-slate-50 border-2 border-transparent rounded-2xl focus:outline-none focus:border-brand-500 focus:bg-white transition-all text-base sm:text-lg"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2.5 ml-1">Phone Number</label>
                        <div className="relative group">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-xl bg-slate-50 group-focus-within:bg-brand-50 transition-colors">
                            <Phone className="w-5 h-5 text-slate-400 group-focus-within:text-brand-500 transition-colors" />
                          </div>
                          <input 
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+1 (555) 000-0000"
                            className="w-full pl-16 pr-4 py-4.5 bg-slate-50 border-2 border-transparent rounded-2xl focus:outline-none focus:border-brand-500 focus:bg-white transition-all text-base sm:text-lg"
                          />
                        </div>
                      </div>

                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="space-y-6 pt-2"
                      >
                        <label className="block text-sm font-bold text-slate-700 -mb-4 ml-1">Delivery Details</label>
                        <div className="relative group">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-xl bg-slate-50 group-focus-within:bg-brand-50 transition-colors">
                            <Home className="w-5 h-5 text-slate-400 group-focus-within:text-brand-500 transition-colors" />
                          </div>
                          <input 
                            type="text"
                            value={street}
                            onChange={(e) => setStreet(e.target.value)}
                            placeholder="Street Address"
                            className="w-full pl-16 pr-4 py-4.5 bg-slate-50 border-2 border-transparent rounded-2xl focus:outline-none focus:border-brand-500 focus:bg-white transition-all text-base sm:text-lg"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-xl bg-slate-50 group-focus-within:bg-brand-50 transition-colors">
                              <MapPin className="w-5 h-5 text-slate-400 group-focus-within:text-brand-500 transition-colors" />
                            </div>
                            <input 
                              type="text"
                              value={city}
                              onChange={(e) => setCity(e.target.value)}
                              placeholder="City"
                              className="w-full pl-16 pr-4 py-4.5 bg-slate-50 border-2 border-transparent rounded-2xl focus:outline-none focus:border-brand-500 focus:bg-white transition-all text-base sm:text-lg"
                            />
                          </div>
                          <input 
                            type="text"
                            value={zip}
                            onChange={(e) => setZip(e.target.value)}
                            placeholder="Zip Code"
                            className="w-full px-6 py-4.5 bg-slate-50 border-2 border-transparent rounded-2xl focus:outline-none focus:border-brand-500 focus:bg-white transition-all text-base sm:text-lg"
                          />
                        </div>
                      </motion.div>
                    </>
                  )}

                  <div className="pt-6">
                    <button 
                      type="submit"
                      className="w-full bg-brand-600 text-white py-5 rounded-2xl font-bold text-xl flex items-center justify-center gap-3 hover:bg-brand-700 transition-all shadow-xl shadow-brand-100 active:scale-[0.98]"
                    >
                      {isSignUp ? 'Create Account' : 'Sign In'}
                      <ArrowRight className="w-6 h-6" />
                    </button>
                  </div>
                </form>

                <div className="mt-10 text-center">
                  <p className="text-slate-500">
                    {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                    <button 
                      onClick={() => setIsSignUp(!isSignUp)}
                      className="text-brand-600 font-bold hover:underline decoration-2 underline-offset-4"
                    >
                      {isSignUp ? 'Sign In' : 'Create one'}
                    </button>
                  </p>
                </div>
              </div>
              
              <div className="bg-slate-50 p-6 text-center border-t border-slate-100 mt-auto">
                <p className="text-xs text-slate-400 leading-relaxed">
                  By continuing, you agree to The Food Planet's <br />
                  <span className="underline cursor-pointer">Terms of Service</span> and <span className="underline cursor-pointer">Privacy Policy</span>.
                </p>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
