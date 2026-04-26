import React, { useEffect } from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import ShopHero from './ShopHero';
import ProductGrid from './ProductGrid';
import CartDrawer from './CartDrawer';
import CartButton from './CartButton';
import { CartProvider } from './CartContext';

const AcademyShopInner = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="min-h-screen bg-white text-rr-dark font-sans flex flex-col selection:bg-rr-pink selection:text-white relative">
      <Navbar variant="lp2" />

      <main className="flex-1 w-full overflow-hidden">
        <ShopHero />
        <ProductGrid />
      </main>

      <Footer />

      {/* Cart UI — lives outside main so it overlays everything */}
      <CartDrawer />
      <CartButton />
    </div>
  );
};

// Wrap with CartProvider so all children share cart state
const AcademyShop = () => (
  <CartProvider>
    <AcademyShopInner />
  </CartProvider>
);

export default AcademyShop;
