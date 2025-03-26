import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { supabase } from '../lib/supabase';
import { Product } from '../lib/types';
import toast from 'react-hot-toast';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const Checkout = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', productId)
          .single();

        if (error) throw error;
        setProduct(data);
      } catch (error) {
        toast.error('Error loading product');
        navigate('/marketplace');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, navigate]);

  const handlePayment = async () => {
    if (!product) return;

    try {
      if (product.is_free) {
        // Handle free product
        const { error } = await supabase
          .from('purchases')
          .insert({
            product_id: product.id,
            user_id: (await supabase.auth.getUser()).data.user?.id
          });

        if (error) throw error;
        toast.success('Successfully claimed free product!');
        navigate(`/product/${product.id}`);
        return;
      }

      // Create Stripe checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          price: product.price,
          title: product.title
        }),
      });

      const session = await response.json();
      const stripe = await stripePromise;
      
      if (!stripe) {
        throw new Error('Stripe failed to load');
      }

      const { error } = await stripe.redirectToCheckout({
        sessionId: session.id
      });

      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || 'Payment failed');
    }
  };

  if (loading) {
    return (
      <div className="pt-16 min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-16 min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <p className="text-white">Product not found</p>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-[#0A0A0A]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-[#1a1a1a] rounded-xl border border-[#333333] p-8">
          <h1 className="text-2xl font-bold text-white mb-6">Checkout</h1>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg text-white">{product.title}</h2>
              <p className="text-xl font-bold text-white">
                {product.is_free ? 'Free' : `$${product.price}`}
              </p>
            </div>

            <div className="border-t border-[#333333] my-4"></div>

            <button
              onClick={handlePayment}
              className="w-full px-6 py-3 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors"
            >
              {product.is_free ? 'Get for Free' : 'Proceed to Payment'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;