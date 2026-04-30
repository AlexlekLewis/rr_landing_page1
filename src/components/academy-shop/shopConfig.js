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
    madeToOrderNote: 'Made to order. Available for pickup at Cutting Edge Cricket (Bundoora) and Cricket Connect (Hallam), and for postage, approximately 18th May. You will be updated via text message on your order status.',
    imagePlaceholder: false,
    images: { front: '/shop/ipl-shirt-front.jpeg', back: null },
    // Stripe Price IDs — one per size (create in Stripe Dashboard → Products)
    stripePriceId: 'price_1TRJe7Io52UEA50yZ4i5OPwH',
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
    badge: 'In Stock',
    badgeColor: 'bg-green-600',
    imagePlaceholder: false,
    images: {
      front: '/shop/training-shirt-front.png',
      back: null,
    },
    stripePriceId: 'price_1TRJinIo52UEA50yaIwEA8Ni',
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
    badge: 'In Stock',
    badgeColor: 'bg-green-600',
    imagePlaceholder: false,
    images: { front: '/shop/training-shorts-front.png', back: null },
    stripePriceId: 'price_1TRJqhIo52UEA50ycGPuIieZ',
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
    badge: 'In Stock',
    badgeColor: 'bg-green-600',
    imagePlaceholder: false,
    images: {
      front: '/shop/training-pants-front.png',
      back: null,
    },
    stripePriceId: 'price_1TRJt4Io52UEA50ydwZmfUKh',
  },

  {
    id: 'pink-cap',
    name: 'RRA Melbourne Academy Cap',
    shortName: 'Academy Cap',
    description: 'Official Rajasthan Royals Academy Melbourne cap. One size fits all with adjustable strap.',
    price: 3850,
    displayPrice: '$38.50',
    category: 'Headwear',
    badge: 'In Stock',
    badgeColor: 'bg-green-600',
    madeToOrder: false,
    imagePlaceholder: false,
    images: { front: '/shop/pink-cap-front.png', back: null },
    oneSize: true,
    stripePriceId: 'price_1TRNozIo52UEA50yEkWYWKAq',
  },
  {
    id: 'fleece-jacket',
    name: 'RRA Melbourne Fleece Lined Jacket',
    shortName: 'Fleece Jacket',
    description: 'Navy fleece lined full-zip jacket in official RRA Melbourne colours. Warm, premium feel — ideal for cool mornings and post-training.',
    price: 9695,
    displayPrice: '$96.95',
    category: 'Outerwear',
    badge: 'Made to Order',
    badgeColor: 'bg-rr-blue',
    madeToOrder: true,
    madeToOrderNote: 'Made to order. Available for pickup at Cutting Edge Cricket (Bundoora) and Cricket Connect (Hallam), and for postage, approximately 18th May. You will be updated via text message on your order status.',
    imagePlaceholder: false,
    images: { front: '/shop/fleece-jacket-front.png', back: null },
    oneSize: false,
    sizingNote: '⚠️ This jacket runs small. We recommend ordering one size larger than usual — if you normally wear a L, order a XL.',
    stripePriceId: 'price_1TRNwaIo52UEA50yIChLyg1J',
  },
];

// ============================================================
// Stripe Configuration
// ============================================================
export const STRIPE_PUBLISHABLE_KEY = 'pk_live_51T2jKFIo52UEA50ybPM7ljCN7kDOm1tli62jH5GVXMSCW5qjnPt3u7JjLcPhSdHpXJ2F8rnE5pTAahpRt4guTH9N00GROLNXZc';

export const SHIPPING_RATES = {
  standard: 'shr_PLACEHOLDER_standard',
  express:  'shr_PLACEHOLDER_express',
};

export const STRIPE_SUCCESS_URL = 'https://rrlandingpage1.vercel.app/academy-shop/success?session_id={CHECKOUT_SESSION_ID}';
export const STRIPE_CANCEL_URL  = 'https://rrlandingpage1.vercel.app/academy-shop';
