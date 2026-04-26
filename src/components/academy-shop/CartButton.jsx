import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { useCart } from './CartContext';

const CartButton = () => {
  const { totalItems, setIsOpen } = useCart();

  return (
    <motion.button
      onClick={() => setIsOpen(true)}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.05 }}
      className="fixed bottom-6 right-6 z-30 bg-rr-pink text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:shadow-[0_0_28px_rgba(229,6,149,0.5)] transition-shadow duration-300"
      aria-label="Open cart"
    >
      <ShoppingBag className="w-6 h-6" />
      <AnimatePresence>
        {totalItems > 0 && (
          <motion.span
            key="badge"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -top-1 -right-1 bg-white text-rr-pink text-xs font-black w-5 h-5 rounded-full flex items-center justify-center shadow"
          >
            {totalItems > 9 ? '9+' : totalItems}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

export default CartButton;
