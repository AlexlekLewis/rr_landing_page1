import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../Navbar';
import Footer from '../Footer';
import { supabase } from '../../lib/supabase';

const ShopSuccess = () => {
  const [updated, setUpdated] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    // Stripe appends ?session_id={CHECKOUT_SESSION_ID} to the success URL.
    // Capture it on each order row so we can cross-reference with the Stripe dashboard.
    const sessionId = new URLSearchParams(window.location.search).get('session_id');

    const trainingOrderId = localStorage.getItem('shop_order_id');
    const iplOrderId = localStorage.getItem('shop_order_ipl_id');

    const completedFields = {
      payment_status: 'completed',
      ...(sessionId ? { stripe_session_id: sessionId } : {}),
    };

    const markCompleted = async (table, id, key) => {
      if (!id) return false;
      try {
        const { error } = await supabase.from(table).update(completedFields).eq('id', id);
        if (error) throw error;
        localStorage.removeItem(key);
        return true;
      } catch (err) {
        console.warn(`Could not update ${table}:`, err);
        return false;
      }
    };

    (async () => {
      const results = await Promise.all([
        markCompleted('shop_orders_training', trainingOrderId, 'shop_order_id'),
        markCompleted('shop_orders_ipl', iplOrderId, 'shop_order_ipl_id'),
      ]);
      if (results.some(Boolean)) setUpdated(true);
    })();
  }, []);

  return (
    <div className="min-h-screen bg-white text-rr-dark font-sans flex flex-col selection:bg-rr-pink selection:text-white">
      <Navbar variant="lp2" />

      <main className="flex-1 flex items-center justify-center py-24 px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="max-w-lg w-full text-center"
        >
          {/* Success icon */}
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8"
            style={{ background: 'linear-gradient(135deg, #E11F8F, #1226AA)' }}>
            <CheckCircle className="w-10 h-10 text-white" />
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-2 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shrink-0" />
            <span className="text-xs font-bold text-green-700 uppercase tracking-widest">Order Confirmed</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-rr-dark mb-4">
            You're all set!
          </h1>

          <p className="text-rr-charcoal text-lg font-medium leading-relaxed mb-8">
            Thank you for your order. You'll receive a confirmation email from Stripe shortly with your order details.
          </p>

          <div className="bg-slate-50 rounded-2xl p-6 text-left mb-8 space-y-3">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">What happens next</p>
            {[
              'Check your email for your Stripe order confirmation',
              'Our team will process your order within 2 business days',
              'Pickup orders: bring your confirmation to your next training session',
              'Shipping orders: allow 5–7 business days for delivery',
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: 'linear-gradient(135deg, #E11F8F, #1226AA)' }}>
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <p className="text-sm text-rr-charcoal font-medium">{step}</p>
              </div>
            ))}
          </div>

          <Link
            to="/academy-shop"
            className="inline-flex items-center gap-2 text-rr-pink font-bold uppercase text-sm tracking-widest hover:gap-3 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Shop
          </Link>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default ShopSuccess;
