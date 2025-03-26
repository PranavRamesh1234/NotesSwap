import express from 'express';
import cors from 'cors';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

const PLATFORM_FEE_PERCENTAGE = 10; // Platform takes 10%

app.use(cors());
app.use(express.json());

// Create a Stripe Connect account for a seller
app.post('/api/create-connect-account', async (req, res) => {
  try {
    const { email } = req.body;

    const account = await stripe.accounts.create({
      type: 'express',
      email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    });

    // Store the Stripe account ID in your database
    await supabase
      .from('users')
      .update({ stripe_account_id: account.id })
      .eq('email', email);

    // Create an account link for onboarding
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${req.headers.origin}/profile`,
      return_url: `${req.headers.origin}/profile`,
      type: 'account_onboarding',
    });

    res.json({ url: accountLink.url });
  } catch (error) {
    console.error('Error creating Connect account:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create a checkout session
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { productId, price, title } = req.body;

    // Get the product seller's Stripe account ID
    const { data: product } = await supabase
      .from('products')
      .select('user_id')
      .eq('id', productId)
      .single();

    const { data: seller } = await supabase
      .from('users')
      .select('stripe_account_id')
      .eq('id', product.user_id)
      .single();

    if (!seller?.stripe_account_id) {
      throw new Error('Seller has not set up their payment account');
    }

    // Calculate platform fee
    const amount = Math.round(price * 100); // Convert to cents
    const platformFee = Math.round(amount * (PLATFORM_FEE_PERCENTAGE / 100));
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: title,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.origin}/product/${productId}?success=true`,
      cancel_url: `${req.headers.origin}/product/${productId}?canceled=true`,
      payment_intent_data: {
        application_fee_amount: platformFee,
        transfer_data: {
          destination: seller.stripe_account_id,
        },
      },
      metadata: {
        productId,
        sellerId: product.user_id,
      },
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: error.message });
  }
});

// Handle webhook events from Stripe
app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    // Handle successful payment
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const productId = session.metadata.productId;
      const customerId = session.customer;

      // Get customer email from Stripe
      const customer = await stripe.customers.retrieve(customerId);
      
      // Get user ID from Supabase using email
      const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('email', customer.email)
        .single();

      if (userData) {
        // Create purchase record
        await supabase
          .from('purchases')
          .insert({
            product_id: productId,
            user_id: userData.id,
          });
      }
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});