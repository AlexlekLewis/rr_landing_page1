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
            Pricing will be confirmed shortly. Select your size and add items to your cart — complete your order once prices are live.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PRODUCTS.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
