import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, BookOpen, Share2, Heart } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/AuthContext';
import { Product, Review, Purchase } from '../lib/types';
import StarRating from '../components/StarRating';
import toast from 'react-hot-toast';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch product
        const { data: productData, error: productError } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();

        if (productError) throw productError;
        setProduct(productData);

        // Fetch reviews
        const { data: reviewsData, error: reviewsError } = await supabase
          .from('reviews')
          .select('*')
          .eq('product_id', id);

        if (reviewsError) throw reviewsError;
        setReviews(reviewsData);

        // Check if user has purchased
        if (user) {
          const { data: purchaseData, error: purchaseError } = await supabase
            .from('purchases')
            .select('*')
            .eq('product_id', id)
            .eq('user_id', user.id);

          // Instead of using .single(), check if we got any results
          setHasPurchased(purchaseData && purchaseData.length > 0);
        }
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, user]);

  const handleDownload = async () => {
    if (!product) return;

    try {
      const { data, error } = await supabase
        .storage
        .from('notes')
        .download(product.file_url.split('notes/')[1]);

      if (error) throw error;

      // Create a Blob URL for the downloaded file
      const blobUrl = URL.createObjectURL(data);

      // Create a temporary anchor element to trigger the download
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${product.title}.pdf`; // Set a filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Revoke the Blob URL after download
      URL.revokeObjectURL(blobUrl);

      toast.success('Download started!');
    } catch (error: any) {
      toast.error('Error downloading file. Please try again.');
      console.error('Download error:', error);
    }
  };

  const handlePurchase = async () => {
    if (!product) return;

    try {
      const options = {
        key: 'YOUR_RAZORPAY_KEY', // Replace with your Razorpay key
        amount: product.price * 100, // Amount in paise
        currency: 'INR',
        name: product.title,
        description: product.description,
        image: product.preview_url,
        handler: async function (response: any) {
          try {
            // Save payment details to the database
            const { error } = await supabase
              .from('payments')
              .insert({
                product_id: product.id,
                user_id: user?.id,
                razorpay_payment_id: response.razorpay_payment_id,
                amount: product.price,
              });

            if (error) throw error;

            toast.success('Payment successful!');
            navigate(`/thank-you/${product.id}`);
          } catch (dbError: any) {
            toast.error('Error saving payment details. Please contact support.');
            console.error('Database error:', dbError);
          }
        },
        prefill: {
          name: user?.name || 'Guest',
          email: user?.email || 'guest@example.com',
          contact: '9999999999', // Replace with user's phone number if available
        },
        theme: {
          color: '#3399cc',
        },
      };

      const razorpay = new Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      toast.error('Error initiating payment. Please try again.');
      console.error('Payment error:', error);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !product) return;

    try {
      const { error } = await supabase
        .from('reviews')
        .insert({
          product_id: product.id,
          user_id: user.id,
          rating: newReview.rating,
          comment: newReview.comment
        });

      if (error) throw error;

      const { data: newReviewData } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', product.id)
        .eq('user_id', user.id)
        .single();

      setReviews([...reviews, newReviewData]);
      setNewReview({ rating: 5, comment: '' });
      toast.success('Review submitted successfully!');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (loading) {
    return (
      <div className="pt-16 min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div> {/* Removed animation */}
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

  const averageRating = reviews.length > 0
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
    : 0;

  return (
    <div className="pt-16 min-h-screen bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="rounded-xl overflow-hidden">
            <img
              src={product.preview_url}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {product.title}
              </h1>
              <p className="text-gray-400">
                {product.subject}
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Star className="h-5 w-5 text-yellow-400 mr-1" />
                <span className="text-white font-semibold">{averageRating.toFixed(1)}</span>
              </div>
              <span className="text-gray-400">•</span>
              <div className="flex items-center text-gray-400">
                <BookOpen className="h-5 w-5 mr-1" />
                {reviews.length} reviews
              </div>
            </div>

            <div className="border-t border-[#333333] pt-6">
              <p className="text-gray-300">
                {product.description}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-white">
                {product.is_free ? 'Free' : `$${product.price}`}
              </span>
              <div className="flex space-x-4">
                <button className="p-2 rounded-lg border border-[#333333] text-gray-400 hover:text-white hover:border-white transition-colors">
                  <Heart className="h-5 w-5" />
                </button>
                <button className="p-2 rounded-lg border border-[#333333] text-gray-400 hover:text-white hover:border-white transition-colors">
                  <Share2 className="h-5 w-5" />
                </button>
                {hasPurchased ? (
                  <button
                    onClick={handleDownload}
                    className="px-6 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Download
                  </button>
                ) : (
                  <button
                    onClick={handlePurchase}
                    className="px-6 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    {product.is_free ? 'Get Free' : 'Buy Now'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-white mb-8">Reviews</h2>
          
          {/* Add Review Form */}
          {(hasPurchased || product.is_free) && (
            <form onSubmit={handleReviewSubmit} className="mb-8 bg-[#1a1a1a] rounded-xl border border-[#333333] p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Rating
                  </label>
                  <StarRating
                    rating={newReview.rating}
                    onRatingChange={(rating) => setNewReview({ ...newReview, rating })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Comment
                  </label>
                  <textarea
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 bg-[#0A0A0A] border border-[#333333] rounded-lg text-white focus:outline-none focus:border-white"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Submit Review
                </button>
              </div>
            </form>
          )}

          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="bg-[#1a1a1a] rounded-xl border border-[#333333] p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="h-10 w-10 rounded-full bg-[#333333] flex items-center justify-center">
                      <span className="text-white">U</span>
                    </div>
                    <div>
                      <p className="text-white font-medium">User</p>
                      <p className="text-gray-400 text-sm">
                        {new Date(review.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <StarRating rating={review.rating} onRatingChange={() => {}} />
                  </div>
                </div>
                <p className="text-gray-300">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;