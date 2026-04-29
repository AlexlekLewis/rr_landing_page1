import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Plus, Minus, Trash2, Truck, MapPin } from 'lucide-react';
import { useCart } from './CartContext';
import { supabase } from '../../lib/supabase';

const FULFILLMENT_OPTIONS = [
  { id: 'pickup', label: 'Academy Pickup', description: 'Collect at your next training session', icon: MapPin, price: 0 },
  { id: 'shipping', label: 'Standard Shipping', description: 'Delivered to your address (est. $10)', icon: Truck, price: 1000 },
];

const CartDrawer = () => {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, totalItems, totalPrice, clearCart } = useCart();
  const [fulfillment, setFulfillment] = useState('pickup');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);

  const fulfillmentCost = FULFILLMENT_OPTIONS.find(o => o.id === fulfillment)?.price ?? 0;
  const grandTotal = totalPrice + fulfillmentCost;

  const handleCheckout = async () => {
    if (items.length === 0) return;
    setIsCheckingOut(true);
    setCheckoutError(null);

    try {
      // Split items by product type
      const iplItems = items.filter(i => i.product.madeToOrder);
      const trainingItems = items.filter(i => !i.product.madeToOrder);

      const buildPayload = (lineItems) => ({
        items: lineItems.map(i => ({
          product_id: i.product.id,
          product_name: i.product.name,
          size: i.size,
          quantity: i.quantity,
          unit_price: i.product.price,
        })),
        fulfillment_method: fulfillment,
        subtotal: lineItems.reduce((s, i) => s + (i.product.price ?? 0) * i.quantity, 0),
        shipping_cost: fulfillmentCost,
        total: grandTotal,
        payment_status: 'pending',
      });

      // Log IPL shirt order to shop_orders_ipl
      if (iplItems.length > 0) {
        try {
          const { data } = await supabase
            .from('shop_orders_ipl')
            .insert([{ ...buildPayload(iplItems), supplier_status: 'awaiting_bulk_order' }])
            .select('id').single();
          if (data?.id) localStorage.setItem('shop_order_ipl_id', data.id);
        } catch (e) { console.warn('IPL order log failed:', e); }
      }

      // Log training kit order to shop_orders_training
      let orderData = null;
      if (trainingItems.length > 0) {
        try {
          const { data } = await supabase
            .from('shop_orders_training')
            .insert([{ ...buildPayload(trainingItems), fulfillment_status: 'unfulfilled' }])
            .select('id').single();
          orderData = data;
          if (data?.id) localStorage.setItem('shop_order_id', data.id);
        } catch (e) { console.warn('Training order log failed:', e); }
      }

      // Call Vercel serverless function to create Stripe Checkout Session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(i => ({
            product_id: i.product.id,
            quantity: i.quantity,
            size: i.size,
          })),
          fulfillment,
          orderId: localStorage.getItem('shop_order_id') || '',
          iplOrderId: localStorage.getItem('shop_order_ipl_id') || '',
        }),
      });

      const { url, error: stripeError } = await response.json();
      if (stripeError) throw new Error(stripeError);
      if (url) {
        window.location.href = url;
      } else {
        throw new Error('No checkout URL returned from Stripe');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setCheckoutError('Something went wrong. Please try again or contact us directly.');
      setIsCheckingOut(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-rr-pink" />
                <h2 className="font-black text-rr-dark uppercase tracking-tight">
                  Your Cart
                  {totalItems > 0 && (
                    <span className="ml-2 bg-rr-pink text-white text-xs font-bold rounded-full px-2 py-0.5">{totalItems}</span>
                  )}
                </h2>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            {/* Cart items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
                    <ShoppingBag className="w-8 h-8 text-slate-300" />
                  </div>
                  <p className="text-slate-400 font-medium">Your cart is empty</p>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-rr-pink font-bold text-sm uppercase tracking-widest hover:underline"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                items.map(item => (
                  <div key={item.key} className="flex gap-4 bg-slate-50 rounded-xl p-4">
                    {/* Mini placeholder image */}
                    <div className="w-16 h-16 rounded-lg bg-rr-dark flex items-center justify-center shrink-0">
                      <ShoppingBag className="w-6 h-6 text-white/30" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-rr-dark text-sm leading-tight truncate">{item.product.shortName}</p>
                      <p className="text-xs text-slate-400 font-medium mt-0.5">Size: {item.size}</p>
                      <p className="text-sm font-black text-rr-dark mt-1">
                        {item.product.displayPrice === 'TBC' ? 'Price TBC' : `$${((item.product.price * item.quantity) / 100).toFixed(2)}`}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <button onClick={() => removeItem(item.key)} className="text-slate-300 hover:text-red-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="flex items-center gap-1 border border-slate-200 rounded-lg overflow-hidden">
                        <button onClick={() => updateQuantity(item.key, item.quantity - 1)} className="w-7 h-7 flex items-center justify-center hover:bg-slate-100 transition-colors">
                          <Minus className="w-3 h-3 text-slate-500" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-rr-dark">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.key, item.quantity + 1)} className="w-7 h-7 flex items-center justify-center hover:bg-slate-100 transition-colors">
                          <Plus className="w-3 h-3 text-slate-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer — fulfillment + checkout */}
            {items.length > 0 && (
              <div className="border-t border-slate-100 px-6 py-6 space-y-4">
                {/* Fulfillment */}
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Fulfillment</p>
                  <div className="space-y-2">
                    {FULFILLMENT_OPTIONS.map(option => {
                      const Icon = option.icon;
                      return (
                        <button
                          key={option.id}
                          onClick={() => setFulfillment(option.id)}
                          className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left
                            ${fulfillment === option.id
                              ? 'border-rr-pink bg-rr-pink/5'
                              : 'border-slate-200 hover:border-slate-300'
                            }`}
                        >
                          <Icon className={`w-4 h-4 shrink-0 ${fulfillment === option.id ? 'text-rr-pink' : 'text-slate-400'}`} />
                          <div className="flex-1 min-w-0">
                            <p className={`text-xs font-bold uppercase tracking-wider ${fulfillment === option.id ? 'text-rr-pink' : 'text-rr-dark'}`}>
                              {option.label}
                            </p>
                            <p className="text-xs text-slate-400 mt-0.5">{option.description}</p>
                          </div>
                          <span className="text-xs font-bold text-rr-dark">
                            {option.price === 0 ? 'Free' : `+$${(option.price / 100).toFixed(0)}`}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Totals */}
                <div className="space-y-1">
                  <div className="flex justify-between text-sm text-slate-500">
                    <span>Subtotal</span>
                    <span className="font-medium">{totalPrice === 0 ? 'TBC' : `$${(totalPrice / 100).toFixed(2)}`}</span>
                  </div>
                  {fulfillmentCost > 0 && (
                    <div className="flex justify-between text-sm text-slate-500">
                      <span>Shipping</span>
                      <span className="font-medium">${(fulfillmentCost / 100).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-black text-rr-dark pt-2 border-t border-slate-100">
                    <span>Total</span>
                    <span>{grandTotal === 0 ? 'TBC' : `$${(grandTotal / 100).toFixed(2)}`}</span>
                  </div>
                </div>

                {/* Error message */}
                {checkoutError && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                    <p className="text-xs text-amber-700 font-medium">{checkoutError}</p>
                  </div>
                )}

                {/* Checkout button */}
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="w-full bg-rr-pink hover:bg-rr-light-pink text-white font-black uppercase tracking-widest py-4 rounded-xl transition-all duration-300 hover:shadow-[0_0_28px_rgba(229,6,149,0.45)] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isCheckingOut ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      Proceed to Checkout
                    </>
                  )}
                </motion.button>

                <p className="text-center text-xs text-slate-400">
                  Secure checkout via Stripe · SSL encrypted
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CartDrawer;
