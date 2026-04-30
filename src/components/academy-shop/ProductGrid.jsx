import React from 'react';
import { PRODUCTS } from './shopConfig';
import ProductCard from './ProductCard';

const ProductGrid = () => {
  return (
    <section className="bg-slate-50 py-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section header */}
        <div className="mb-12">
          <p className="text-xs font-bold text-rr-pink uppercase tracking-[0.3em] mb-3">2025 / 2026 Season</p>
          <h2 className="text-4xl md:text-5xl font-black text-rr-dark uppercase tracking-tight leading-none">
            Official Kit
          </h2>
          <div className="w-12 h-px mt-4" style={{ background: 'linear-gradient(90deg, #E11F8F, #1226AA)' }} />
          <p className="text-rr-charcoal font-medium mt-4 max-w-xl">
            Kit up in official Rajasthan Royals colours. Select your size, add to cart, and check out in minutes.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PRODUCTS.map((product, index) => {
            // Hidden products show a contact placeholder card
            if (product.hidden) {
              return (
                <div key={product.id} className="bg-white rounded-2xl shadow-sm border-2 border-dashed border-rr-pink/30 overflow-hidden flex flex-col">
                  {/* Placeholder image area */}
                  <div className="aspect-square bg-gradient-to-br from-rr-pink/10 to-rr-blue/10 flex flex-col items-center justify-center gap-3 p-6">
                    <div className="w-16 h-16 rounded-full bg-rr-pink/10 flex items-center justify-center">
                      <svg className="w-8 h-8 text-rr-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-rr-pink text-xs font-black uppercase tracking-widest text-center">Contact Us to Order</p>
                  </div>
                  {/* Info */}
                  <div className="p-5 flex flex-col flex-1 gap-3">
                    <div>
                      <p className="text-xs font-bold text-rr-pink uppercase tracking-[0.25em] mb-1">{product.category}</p>
                      <h3 className="font-black text-rr-dark uppercase tracking-tight leading-tight text-sm">{product.name}</h3>
                    </div>
                    <p className="text-xs text-rr-charcoal leading-relaxed">
                      This item is temporarily unavailable in our online shop. Please contact us directly to register your interest.
                    </p>
                    <div className="mt-auto bg-rr-pink/5 border border-rr-pink/20 rounded-xl px-4 py-3">
                      <p className="text-xs font-bold text-rr-pink uppercase tracking-widest mb-1">Interested?</p>
                      <a
                        href="mailto:info@rramelbourne.com?subject=IPL Replica Shirt Enquiry"
                        className="text-sm font-black text-rr-dark hover:text-rr-pink transition-colors break-all"
                      >
                        info@rramelbourne.com
                      </a>
                    </div>
                  </div>
                </div>
              );
            }
            return <ProductCard key={product.id} product={product} index={index} />;
          })}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
