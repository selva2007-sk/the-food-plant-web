import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Plus, Heart, Star, ShoppingCart } from 'lucide-react';
import { Product } from '../types';
import { useUser } from '../context/UserContext';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number) => void;
  onSelect?: (product: Product) => void;
  isSelected?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onSelect, isSelected }) => {
  const { user, toggleWishlist } = useUser();
  const [isAdding, setIsAdding] = useState(false);
  const isWishlisted = user?.wishlist.includes(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAdding(true);
    onAddToCart(product, 1);
    setTimeout(() => {
      setIsAdding(false);
    }, 1000);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onClick={() => onSelect?.(product)}
      className={`group bg-white rounded-[2rem] overflow-hidden border transition-all duration-500 cursor-pointer ${
        isSelected ? 'border-brand-600 ring-4 ring-brand-100 shadow-2xl' : 'border-brand-100 hover:shadow-2xl hover:border-brand-200'
      }`}
    >
      <div className="relative aspect-square overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          referrerPolicy="no-referrer"
        />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          {product.discountPrice && (
            <motion.span 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-red-600 text-white text-[10px] font-black px-3 py-1.5 rounded-lg shadow-xl uppercase tracking-widest flex items-center gap-1"
            >
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
            </motion.span>
          )}
          <span className="bg-white/95 backdrop-blur-md text-slate-900 text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-sm uppercase tracking-wider border border-slate-100">
            {product.category}
          </span>
        </div>

        {/* Wishlist Button */}
        <button 
          onClick={handleWishlist}
          className={`absolute top-4 right-4 p-2.5 rounded-full shadow-lg transition-all duration-300 ${
            isWishlisted 
              ? 'bg-red-500 text-white scale-110' 
              : 'bg-white/90 backdrop-blur-sm text-slate-400 hover:text-red-500 hover:scale-110'
          }`}
        >
          <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Hover Actions Overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-4 gap-2">
          <div className="flex flex-col gap-2 translate-y-8 group-hover:translate-y-0 transition-transform duration-500 delay-75">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onSelect?.(product);
              }}
              className="w-full bg-white text-slate-900 py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-xl hover:bg-slate-50 transition-all active:scale-95"
            >
              <ShoppingCart className="w-4 h-4" />
              Quick View
            </button>
            <button 
              onClick={handleAddToCart}
              disabled={isAdding}
              className="w-full bg-brand-600 text-white py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-xl hover:bg-brand-700 transition-all active:scale-95"
            >
              {isAdding ? (
                <Check className="w-5 h-5" />
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Add to Cart
                </>
              )}
            </button>
          </div>
        </div>
        
        {/* Flying Item Animation Overlay */}
        <AnimatePresence>
          {isAdding && (
            <motion.div
              initial={{ scale: 1, x: 0, y: 0, opacity: 1 }}
              animate={{ 
                scale: 0.2, 
                x: 400, 
                y: -800, 
                opacity: 0,
                rotate: 360
              }}
              transition={{ duration: 0.8, ease: "easeIn" }}
              className="absolute inset-0 z-50 pointer-events-none"
            >
              <img 
                src={product.image} 
                className="w-full h-full object-cover rounded-2xl shadow-2xl"
                alt="flying"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1 text-amber-400">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-xs font-bold text-slate-600">{product.rating}</span>
            <span className="text-[10px] text-slate-400 font-medium">({product.reviews.length})</span>
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{product.weight}</span>
        </div>

        <h3 className="text-lg font-serif font-bold text-slate-900 group-hover:text-brand-600 transition-colors leading-tight mb-3 line-clamp-1">
          {product.name}
        </h3>

        <div className="flex items-center gap-3">
          {product.discountPrice ? (
            <>
              <span className="text-xl font-bold text-brand-700">${product.discountPrice}</span>
              <span className="text-sm text-slate-400 line-through">${product.price}</span>
            </>
          ) : (
            <span className="text-xl font-bold text-brand-700">${product.price}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
