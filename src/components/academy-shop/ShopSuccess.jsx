import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowLeft, MapPin, Truck, Clock } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import Navbar from '../Navbar';
import Footer from '../Footer';
import { supabase } from '../../lib/supabase';

const ShopSuccess = () => {
  const [updated, setUpdated] = useState(false);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const fulfillment = params.get('fulfillment') || localStorage.getItem('shop_fulfillment');
  const pickupVenue = params.get('venue') || localStorage.getItem('shop_pickup_venue');

  useEffect(() => {
    window.scrollTo(0, 0);
    // Clear localStorage fallbacks
    localStorage.removeItem('shop_fulfillment');
    localStorage.removeItem('shop_pickup_venue');

    const updateOrders = async () => {
      const trainingId = localStorage.getItem('shop_order_id');
      if (trainingId) {
        try {
          await supabase.from('shop_orders_training')
            .update({ payment_status: 'completed' }).eq('id', trainingId);
          localStorage.removeItem('shop_order_id');
        } catch (e) { console.warn('Training order update failed:', e); }
      }

      const iplId = localStorage.getItem('shop_order_ipl_id');
      if (iplId) {
        try {
          await supabase.from('shop_orders_ipl')
            .update({ payment_status: 'completed' }).eq('id', iplId);
          localStorage.removeItem('shop_order_ipl_id');
        } catch (e) { console.warn('IPL order update failed:', e); }
      }

      if (trainingId || iplId) setUpdated(true);

      // Clear fulfillment details
      localStorage.removeItem('shop_fulfillment');
      localStorage.removeItem('shop_pickup_venue');
    };

    updateOrders();
  }, []);

  const isPickup = fulfillment === 'pickup';
  const isExpress = fulfillment === 'express';

  const venueDetails = pickupVenue === 'bundoora'
    ? { name: 'Cutting Edge Cricket — Bundoora', address: 'Unit 7, Factory 19, Enterprise Drive, Bundoora VIC 3083' }
    : pickupVenue === 'hallam'
      ? { name: 'Cricket Connect — Hallam', address: '22 Technology CCT, Hallam VIC 3803' }
      : null;

  return (
    <div className="min-h-screen bg-white text-rr-dark font-sans flex flex-col selection:bg-rr-pink selection:text-white">
      <Navbar variant="shop" />

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
            You're kitted up!
          </h1>

          <p className="text-rr-charcoal text-lg font-medium leading-relaxed mb-8">
            Thank you for your order. A confirmation has been sent to your email from Stripe.
          </p>

          {/* Fulfillment card */}
          <div className="bg-slate-50 rounded-2xl p-6 text-left mb-6 border border-slate-200">
            {isPickup && venueDetails ? (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #E11F8F, #1226AA)' }}>
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-black text-rr-dark uppercase tracking-tight">Academy Pickup</p>
                    <p className="text-xs text-slate-400 font-medium">Collect at your chosen location</p>
                  </div>
                </div>
                <div className="space-y-2 pl-1">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-rr-pink shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-rr-dark">{venueDetails.name}</p>
                      <p className="text-sm text-rr-charcoal font-medium mt-0.5">{venueDetails.address}</p>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-rr-dark mt-3 pl-7">
                    We'll send you a text message when your order is ready for pickup.
                  </p>
                  <p className="text-xs text-slate-400 pl-7">
                    Made-to-order items typically take 2–4 weeks to arrive from our supplier.
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #E11F8F, #1226AA)' }}>
                    <Truck className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-black text-rr-dark uppercase tracking-tight">
                      {isExpress ? 'Express Shipping' : 'Standard Shipping'}
                    </p>
                    <p className="text-xs text-slate-400 font-medium">Delivered to your address</p>
                  </div>
                </div>
                <div className="space-y-3 pl-1">
                  <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-rr-pink shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-rr-dark">In-stock items</p>
                      <p className="text-sm text-rr-charcoal font-medium">
                        {isExpress ? '1–3 business days' : '5–7 business days'} from date of purchase
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-rr-blue shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-rr-dark">Made-to-order items</p>
                      <p className="text-sm text-rr-charcoal font-medium">
                        2–4 weeks to arrive in Australia, then {isExpress ? '1–3 business days' : '5–7 business days'} to your door
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Contact */}
          <div className="bg-rr-pink/5 border border-rr-pink/20 rounded-2xl p-5 text-left mb-8">
            <p className="text-xs font-bold text-rr-pink uppercase tracking-widest mb-2">Questions about your order?</p>
            <a href="mailto:info@rramelbourne.com"
              className="text-sm font-bold text-rr-dark hover:text-rr-pink transition-colors">
              info@rramelbourne.com
            </a>
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
