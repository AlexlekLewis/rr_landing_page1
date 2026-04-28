import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Plus, Minus, RotateCcw } from 'lucide-react';
import { PRODUCT_SIZE_MAP, VANY_TOPS_KIDS } from './sizeData';
import { useCart } from './CartContext';
import SizeGuide from './SizeGuide';

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
  const [ageGroup, setAgeGroup]       = useState('senior');
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity]       = useState(1);
  const [added, setAdded]             = useState(false);
  const [sizeError, setSizeError]     = useState(false);
  const [showBack, setShowBack]       = useState(false);
  const { addItem } = useCart();

  const sizeConfig = PRODUCT_SIZE_MAP[product.id];
  const isVanyJunior = sizeConfig?.showVanyKids && ageGroup === 'junior';
  // VANY junior = kids by year; VANY senior = XXXXS–XXXL; Omtex = numbered/lettered
  const availableSizes = isVanyJunior
    ? VANY_TOPS_KIDS
    : (sizeConfig?.sizes[ageGroup] ?? []);
  const hasRealImages = !product.imagePlaceholder && product.images;

  // Reset selected size when age group changes
  const handleAgeGroupChange = (group) => {
    setAgeGroup(group);
    setSelectedSize(null);
    setSizeError(false);
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true);
      setTimeout(() => setSizeError(false), 2500);
      return;
    }
    addItem(product, isVanyJunior ? selectedSize : `${ageGroup === 'junior' ? 'JNR' : 'SNR'} ${selectedSize}`, quantity);
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
      {/* ── Product image ── */}
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

      {/* ── Product info ── */}
      <div className="p-5 flex flex-col flex-1 gap-3">

        {/* Name & price */}
        <div>
          <p className="text-xs font-bold text-rr-pink uppercase tracking-[0.25em] mb-1">{product.category}</p>
          <h3 className="font-black text-rr-dark uppercase tracking-tight leading-tight text-sm">{product.name}</h3>
          <p className="mt-1.5">
            {product.displayPrice === 'TBC'
              ? <span className="text-slate-400 text-sm font-bold">Price TBC</span>
              : <span className="text-xl font-black text-rr-dark">${(product.price / 100).toFixed(2)}</span>
            }
          </p>
        </div>

        <p className="text-xs text-rr-charcoal leading-relaxed">{product.description}</p>

        {/* ── Age group toggle ── */}
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Age Group</p>
          <div className="flex gap-2">
            {['junior', 'senior'].map(group => (
              <button
                key={group}
                onClick={() => handleAgeGroupChange(group)}
                className={`flex-1 py-2 rounded-xl text-xs font-black uppercase tracking-widest border-2 transition-all duration-200
                  ${ageGroup === group
                    ? 'border-rr-pink bg-rr-pink text-white'
                    : 'border-slate-200 text-slate-500 hover:border-rr-pink/50'
                  }`}
              >
                {group === 'junior' ? '👦 Junior' : '🧑 Senior'}
              </button>
            ))}
          </div>
          {ageGroup === 'junior' && (
            <p className="text-xs text-slate-400 mt-1.5 italic">
              {isVanyJunior
                ? 'Kids sized by age (2–14 years). Open the size guide below for chest measurements.'
                : 'Junior sizes are numbered (18–34). Use the size guide below to match by age or measurement.'}
            </p>
          )}
        </div>

        {/* ── Size selector ── */}
        <div>
          <p className={`text-xs font-bold uppercase tracking-widest mb-2 ${sizeError ? 'text-red-500' : 'text-slate-500'}`}>
            {sizeError ? '⚠ Please select a size first' : 'Select Size'}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {availableSizes.map(size => (
              <button
                key={size.label}
                onClick={() => { setSelectedSize(size.label); setSizeError(false); }}
                className={`px-2.5 py-2 rounded-lg text-xs font-bold border-2 transition-all duration-200 leading-tight text-center
                  ${selectedSize === size.label
                    ? 'border-rr-pink bg-rr-pink text-white'
                    : sizeError
                      ? 'border-red-200 text-slate-600 hover:border-rr-pink'
                      : 'border-slate-200 text-slate-600 hover:border-rr-pink'
                  }`}
              >
                {size.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Size guide (expandable) ── */}
        <SizeGuide productId={product.id} ageGroup={ageGroup} />

        {/* ── Quantity + Add to cart ── */}
        <div className="mt-auto pt-2 space-y-2">
          {/* Quantity row */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Qty</span>
            <div className="flex items-center rounded-xl overflow-hidden border-2 border-slate-200">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-rr-pink hover:bg-slate-50 transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-9 text-center font-black text-sm text-rr-dark border-x-2 border-slate-200 h-9 flex items-center justify-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(q => q + 1)}
                className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-rr-pink hover:bg-slate-50 transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Add to cart — full width, prominent */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.01 }}
            onClick={handleAddToCart}
            style={!added ? { background: 'linear-gradient(135deg, #E11F8F 0%, #c4177a 100%)' } : {}}
            className={`w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all duration-300 ${added ? 'bg-green-500 text-white shadow-[0_4px_20px_rgba(34,197,94,0.35)]' : 'text-white shadow-[0_4px_20px_rgba(229,6,149,0.25)] hover:shadow-[0_6px_28px_rgba(229,6,149,0.45)]'}`}
          >
            <motion.div
              key={added ? 'added' : 'default'}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-2.5"
            >
              {added ? (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                  Added to Cart
                </>
              ) : (
                <>
                  <ShoppingBag className="w-5 h-5" />
                  Add to Cart
                  {quantity > 1 && (
                    <span className="bg-white/20 rounded-full px-2 py-0.5 text-xs font-bold">
                      x{quantity}
                    </span>
                  )}
                </>
              )}
            </motion.div>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
