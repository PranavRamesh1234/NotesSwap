import React, { useEffect, useState } from 'react';
import { useAuth } from '../lib/AuthContext';
import { supabase } from '../lib/supabase';
import { Product } from '../lib/types';
import { FileText, Download, Star } from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user } = useAuth();
  const [myProducts, setMyProducts] = useState<Product[]>([]);
  const [purchasedProducts, setPurchasedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [stripeAccountId, setStripeAccountId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      try {
        // Fetch user's Stripe account ID
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('stripe_account_id')
          .eq('id', user.id)
          .single();

        if (!userError) {
          setStripeAccountId(userData?.stripe_account_id);
        }

        // Fetch products created by the user
        const { data: createdProducts, error: createdError } = await supabase
          .from('products')
          .select('*')
          .eq('user_id', user.id);

        if (createdError) throw createdError;
        setMyProducts(createdProducts || []);

        // Fetch products purchased by the user
        const { data: purchases, error: purchasesError } = await supabase
          .from('purchases')
          .select(`
            product_id,
            products (*)
          `)
          .eq('user_id', user.id);

        if (purchasesError) throw purchasesError;
        setPurchasedProducts(purchases?.map(p => p.products) || []);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  const handleStripeConnect = async () => {
    try {
      const response = await fetch('/api/create-connect-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user?.email,
        }),
      });

      const { url, error } = await response.json();
      if (error) throw new Error(error);

      // Redirect to Stripe Connect onboarding
      window.location.href = url;
    } catch (error: any) {
      toast.error(error.message || 'Failed to connect with Stripe');
    }
  };

  const handleDownload = async (product: Product) => {
    try {
      const fileKey = product.file_url.split('notes/')[1]; // Extract file key
      const { data: { publicUrl }, error: urlError } = supabase.storage
        .from('notes')
        .getPublicUrl(fileKey);

      if (urlError) throw urlError;

      const link = document.createElement('a');
      link.href = publicUrl;
      link.download = `${product.title}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Download started!');
    } catch (error: any) {
      toast.error('Error downloading file. Please try again.');
      console.error('Download error:', error);
    }
  };

  if (loading) {
    return (
      <div className="pt-16 min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-[#1a1a1a] rounded-xl border border-[#333333] p-8 mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
          <p className="text-gray-400">{user?.email}</p>
          
          {!stripeAccountId && myProducts.length > 0 && (
            <div className="mt-4">
              <button
                onClick={handleStripeConnect}
                className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors"
              >
                Connect with Stripe to Receive Payments
              </button>
              <p className="text-sm text-gray-400 mt-2">
                You need to connect your Stripe account to receive payments for your notes.
              </p>
            </div>
          )}
        </div>

        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">My Notes</h2>
            {myProducts.length === 0 ? (
              <p className="text-gray-400">You haven't uploaded any notes yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myProducts.map((product) => (
                  <div key={product.id} className="bg-[#1a1a1a] rounded-xl border border-[#333333] p-6">
                    <div className="flex items-start space-x-4">
                      <FileText className="h-8 w-8 text-white" />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white">{product.title}</h3>
                        <p className="text-gray-400 text-sm">{product.subject}</p>
                        <p className="text-white font-bold mt-2">
                          {product.is_free ? 'Free' : `$${product.price}`}
                        </p>
                        <button
                          onClick={() => handleDownload(product)}
                          className="flex items-center text-white hover:text-gray-200 mt-4"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Purchased Notes</h2>
            {purchasedProducts.length === 0 ? (
              <p className="text-gray-400">You haven't purchased any notes yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {purchasedProducts.map((product) => (
                  <div key={product.id} className="bg-[#1a1a1a] rounded-xl border border-[#333333] p-6">
                    <div className="flex items-start space-x-4">
                      <FileText className="h-8 w-8 text-white" />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white">{product.title}</h3>
                        <p className="text-gray-400 text-sm">{product.subject}</p>
                        <button
                          onClick={() => handleDownload(product)}
                          className="flex items-center text-white hover:text-gray-200 mt-4"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;