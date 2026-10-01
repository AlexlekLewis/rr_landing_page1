// Shared browser side of /api/program-checkout. Any page selling a product
// from api/_lib/checkoutCatalog.js saves its booking row first (with an id it
// made itself, because anon inserts cannot read the row back), then calls
// this to go to Stripe.
//
// Same tab on purpose: the Instagram in-app browser silently refuses to open
// a new one.

export const newBookingId = () => (typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        return (c === 'x' ? r : ((r & 0x3) | 0x8)).toString(16);
    }));

const post = async (body) => {
    const res = await fetch('/api/program-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    return { ok: res.ok, status: res.status, data };
};

// Resolves only on failure (on success the browser leaves the page).
export const startCheckout = async ({ bookingId, product }) => {
    const { ok, data } = await post({ registration_id: bookingId, product });
    if (ok && data.url) {
        window.location.assign(data.url);
        return new Promise(() => {});
    }
    throw Object.assign(new Error(data.error || 'We could not start the payment.'), { paid: data.paid === true });
};

// What the pay page shows for a booking id: product name, price, first name,
// and whether it is already paid.
export const previewBooking = async (bookingId) => {
    const { ok, data } = await post({ registration_id: bookingId, preview: true });
    if (!ok) throw new Error(data.error || 'We could not find that booking.');
    return data;
};
