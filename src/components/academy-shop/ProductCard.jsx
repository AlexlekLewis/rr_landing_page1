import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Plus, Minus, RotateCcw } from 'lucide-react';
import { SIZES } from './shopConfig';
import { useCart } from './CartContext';

const PlaceholderImage = ({ productId }) => {
  const gradients = {
    'training-shirt':  'from-rr-blue/30 to-rr-pink/20',
    'training-shorts': 'from-rr-navy/40 to-rr-blue/30',
    'training-pants':  'from-rr-dark/60 to-rr-blue/30',
  };
  const gradient = gradients[productId] || 'from-rr-pink/20 to-rr-blue/20';
  return (
    <div className={`w-full h-full bg-gradient-to-br ${gradient} flex flex-col items-center justify-center gap-3`}>
      <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
        <ShoppingBag className="w-8 h-8 text-white/40" />
      </div>
      <p className="text-white/30 text-xs font-bold uppercase tracking-widest">Image Coming Soon</p>
    </div>
  );
};

const ProductCard = ({ product, index }) => {
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const [showBack, setShowBack] = useState(false);
  const { addItem } = useCart();

  const hasRealImages = !product.imagePlaceholder && product.images;

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true);
      setTimeout(() => setSizeError(false), 2000);
      return;
    }
    addItem(product, selectedSize, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col group"
    >
      {/* Product image */}
      <div className="relative aspect-square bg-rr-dark overflow-hidden">
        {hasRealImages ? (
          <>
            <motion.img
              key={showBack ? 'back' : 'front'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              src={showBack ? product.images.back : product.images.front}
              alt={`${product.name} ${showBack ? 'back' : 'front'}`}
              className="w-full h-full object-cover object-center"
            />
            <button
              onClick={() => setShowBack(v => !v)}
              className="absolute bottom-3 right-3 bg-black/50 hover:bg-black/70 text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full flex items-center gap-1.5 backdrop-blur-sm transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              {showBack ? 'Front' : 'Back'}
            </button>
          </>
        ) : (
          <PlaceholderImage productId={product.id} />
        )}
        <div className={`absolute top-3 left-3 ${product.badgeColor} text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full`}>
          {product.badge}
        </div>
      </div>

      {/* Product info */}
      <div className="p-6 flex flex-col flex-1 gap-4">
        <div>
          <p className="text-xs font-bold text-rr-pink uppercase tracking-[0.25em] mb-1">{product.category}</p>
          <h3 className="font-black text-rr-dark uppercase tracking-tight leading-tight text-base">{product.name}</h3>
          <p className="text-2xl font-black text-rr-dark mt-2">
            {product.displayPrice === 'TBC'
              ? <span className="text-slate-400 text-lg font-bold">Price TBC</span>
              : `$${(product.price / 100).toFixed(2)}`
            }
          </p>
        </div>

        <p className="text-sm text-rr-charcoal leading-relaxed">{product.description}</p>

        {/* Size selector */}
        <div>
          <p className={`text-xs font-bold uppercase tracking-widest mb-2 ${sizeError ? 'text-red-500' : 'text-slate-500'}`}>
            {sizeError ? '⚠ Please select a size' : 'Select Size'}
          </p>
          <div className="flex flex-wrap gap-2">
            {SIZES.map(size => (
              <button
                key={size}
                onClick={() => { setSelectedSize(size); setSizeError(false); }}
                className={`w-10 h-10 rounded-lg text-xs font-bold uppercase border-2 transition-all duration-200
                  ${selectedSize === size
                    ? 'border-rr-pink bg-rr-pink text-white'
                    : sizeError
                      ? 'border-red-300 text-slate-600 hover:border-rr-pink'
                      : 'border-slate-200 text-slate-600 hover:border-rr-pink'
                  }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Quantity + Add to Cart */}
        <div className="flex items-center gap-3 mt-auto">
          <div className="flex items-center border-2 border-slate-200 rounded-xl overflow-hidden">
            <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-9 h-10 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors">
              <Minus className="w-3 h-3" />
            </button>
            <span className="w-8 text-center font-bold text-sm text-rr-dark">{quantity}</span>
            <button onClick={() => setQuantity(q => q + 1)} className="w-9 h-10 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors">
              <Plus className="w-3 h-3" />
            </button>
          </div>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleAddToCart}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold uppercase text-xs tracking-widest transition-all duration-300
              ${added
                ? 'bg-green-500 text-white'
                : 'bg-rr-pink hover:bg-rr-light-pink text-white hover:shadow-[0_0_20px_rgba(229,6,149,0.35)]'
              }`}
          >
            <ShoppingBag className="w-4 h-4" />
            {added ? 'Added!' : 'Add to Cart'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
