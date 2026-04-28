// ============================================================
// RRA Melbourne — Academy Shop Product Configuration
// ============================================================
// To wire up Stripe: replace each stripePriceId with the
// actual Price ID from your Stripe Dashboard (e.g. price_1ABC...)
// ============================================================

export const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export const PRODUCTS = [
  {
    id: 'ipl-replica-shirt',
    name: '2026 Rajasthan Royals IPL Replica Playing Shirt',
    shortName: 'IPL Replica Shirt',
    description: 'The official 2026 IPL season playing shirt worn by the Rajasthan Royals. Premium quality replica in authentic team colours.',
    price: 9995,
    displayPrice: '$99.95',
    category: 'Shirts',
    badge: 'Made to Order',
    badgeColor: 'bg-rr-blue',
    madeToOrder: true,
    madeToOrderNote: 'This item is made to order. Please allow 2–3 weeks for delivery after your order is placed.',
    imagePlaceholder: false,
    images: {
      front: '/shop/ipl-shirt-front.jpeg',
      back: '/shop/ipl-shirt-back.jpeg',
    },
    // Stripe Price IDs — one per size (create in Stripe Dashboard → Products)
    stripePriceIds: {
      XS:  'price_PLACEHOLDER_ipl_xs',
      S:   'price_PLACEHOLDER_ipl_s',
      M:   'price_PLACEHOLDER_ipl_m',
      L:   'price_PLACEHOLDER_ipl_l',
      XL:  'price_PLACEHOLDER_ipl_xl',
      XXL: 'price_PLACEHOLDER_ipl_xxl',
    },
  },
  {
    id: 'training-shirt',
    madeToOrder: false,
    name: 'RRA Melbourne Training Shirt',
    shortName: 'Training Shirt',
    description: 'High-performance training shirt in official Rajasthan Royals Academy Melbourne branding. Moisture-wicking fabric built for the Australian climate.',
    price: 6295,
    displayPrice: '$62.95',
    category: 'Shirts',
    badge: 'Academy Kit',
    badgeColor: 'bg-rr-blue',
    imagePlaceholder: false,
    images: {
      front: '/shop/training-shirt-front.png',
      back: '/shop/training-shirt-back.png',
    },
    stripePriceIds: {
      XS:  'price_PLACEHOLDER_tshirt_xs',
      S:   'price_PLACEHOLDER_tshirt_s',
      M:   'price_PLACEHOLDER_tshirt_m',
      L:   'price_PLACEHOLDER_tshirt_l',
      XL:  'price_PLACEHOLDER_tshirt_xl',
      XXL: 'price_PLACEHOLDER_tshirt_xxl',
    },
  },
  {
    id: 'training-shorts',
    madeToOrder: false,
    name: 'RRA Melbourne Training Shorts',
    shortName: 'Training Shorts',
    description: 'Lightweight, breathable training shorts in official academy colours. Designed for maximum mobility on the training ground.',
    price: 5495,
    displayPrice: '$54.95',
    category: 'Bottoms',
    badge: 'Academy Kit',
    badgeColor: 'bg-rr-blue',
    imagePlaceholder: true,
    images: null,
    stripePriceIds: {
      XS:  'price_PLACEHOLDER_shorts_xs',
      S:   'price_PLACEHOLDER_shorts_s',
      M:   'price_PLACEHOLDER_shorts_m',
      L:   'price_PLACEHOLDER_shorts_l',
      XL:  'price_PLACEHOLDER_shorts_xl',
      XXL: 'price_PLACEHOLDER_shorts_xxl',
    },
  },
  {
    id: 'training-pants',
    madeToOrder: false,
    name: 'RRA Melbourne Training Pants',
    shortName: 'Training Pants',
    description: 'Full-length training pants in official academy colours. Perfect for warm-ups, cool conditions, and travel to and from the ground.',
    price: 7695,
    displayPrice: '$76.95',
    category: 'Bottoms',
    badge: 'Academy Kit',
    badgeColor: 'bg-rr-blue',
    imagePlaceholder: false,
    images: {
      front: '/shop/training-pants-front.png',
      back: '/shop/training-pants-back.png',
    },
    stripePriceIds: {
      XS:  'price_PLACEHOLDER_pants_xs',
      S:   'price_PLACEHOLDER_pants_s',
      M:   'price_PLACEHOLDER_pants_m',
      L:   'price_PLACEHOLDER_pants_l',
      XL:  'price_PLACEHOLDER_pants_xl',
      XXL: 'price_PLACEHOLDER_pants_xxl',
    },
  },
];

// ============================================================
// Stripe Configuration
// ============================================================
export const STRIPE_PUBLISHABLE_KEY = 'pk_PLACEHOLDER_YOUR_STRIPE_KEY';

export const SHIPPING_RATES = {
  standard: 'shr_PLACEHOLDER_standard',
  express:  'shr_PLACEHOLDER_express',
};

export const STRIPE_SUCCESS_URL = 'https://rrlandingpage1.vercel.app/academy-shop/success?session_id={CHECKOUT_SESSION_ID}';
export const STRIPE_CANCEL_URL  = 'https://rrlandingpage1.vercel.app/academy-shop';
