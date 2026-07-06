import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
const { priceId, email, userId, locale } = req.body;
  if (!priceId) {
    return res.status(400).json({ error: 'Price ID manquant' });
  }

  try {
 const session = await stripe.checkout.sessions.create({
  mode: 'subscription',
  payment_method_types: ['card'],
  line_items: [{ price: priceId, quantity: 1 }],
  subscription_data: {
    trial_period_days: 7,
    metadata: { userId: userId || '' },
  },
  metadata: { userId: userId || '' },
  customer_email: email || undefined,
  locale: locale === 'en' ? 'en' : 'fr',
  success_url: `${req.headers.origin}/?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${req.headers.origin}/`,
});

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Stripe error:', err);
    res.status(500).json({ error: err.message });
  }
}
