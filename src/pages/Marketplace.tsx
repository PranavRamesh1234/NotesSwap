import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, BookOpen, Filter, Search } from 'lucide-react';
import { Product } from '../lib/types';
import { supabase } from '../lib/supabase';

const Marketplace = () => {
  const [sortBy, setSortBy] = useState<'price' | 'rating' | 'reviews'>('rating');
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState<'all' | 'free' | 'paid'>('all');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*');
        
        if (error) throw error;
        setProducts(data || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredAndSortedProducts = products
    .filter(product => {
      const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.subject.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPrice = priceFilter === 'all' ||
                          (priceFilter === 'free' && product.is_free) ||
                          (priceFilter === 'paid' && !product.is_free);
      return matchesSearch && matchesPrice;
    })
    .sort((a, b) => {
      if (sortBy === 'price') {
        return (b.price) - (a.price);
      }
      // For now, return default sort until we implement ratings
      return 0;
    });

  if (loading) {
    return (
      <div className="pt-16 min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-b from-[#0A0A0A] to-[#1a1a1a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
            Notes Marketplace
          </h1>
          <Link
            to="/sell"
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg shadow-lg hover:opacity-90 transition-opacity"
          >
            Sell Your Notes
          </Link>
        </div>

        <div className="bg-gradient-to-r from-[#1a1a1a] to-[#333333] rounded-xl p-6 mb-8 shadow-lg">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[#0A0A0A] border border-[#333333] rounded-lg text-white focus:outline-none focus:border-white"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'price' | 'rating' | 'reviews')}
                className="px-4 py-2 bg-[#0A0A0A] border border-[#333333] rounded-lg text-white focus:outline-none focus:border-white"
              >
                <option value="rating">Sort by Rating</option>
                <option value="price">Sort by Price</option>
                <option value="reviews">Sort by Reviews</option>
              </select>
              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value as 'all' | 'free' | 'paid')}
                className="px-4 py-2 bg-[#0A0A0A] border border-[#333333] rounded-lg text-white focus:outline-none focus:border-white"
              >
                <option value="all">All Prices</option>
                <option value="free">Free Only</option>
                <option value="paid">Paid Only</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedProducts.map((product) => (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className="bg-[#1a1a1a] rounded-xl border border-[#333333] overflow-hidden shadow-lg transform transition-all hover:scale-110 hover:shadow-2xl hover:border-blue-500 duration-100"
            >
              <div className="aspect-video w-full overflow-hidden">
                <img
                  src={product.preview_url}
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform duration-100 hover:scale-115"
                />
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-1">
                      {product.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-2">
                      {product.subject}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-2xl font-bold text-white">
                    {product.is_free ? 'Free' : `$${product.price}`}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Marketplace;