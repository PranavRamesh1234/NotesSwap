import React, { useState } from 'react';
import { Upload, FileText, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/AuthContext';
import toast from 'react-hot-toast';

const SellNotes = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    price: '',
    description: '',
    file: null as File | null,
    isFree: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      if (!formData.file) {
        throw new Error('Please select a file');
      }

      // Validate file type
      if (!formData.file.name.toLowerCase().endsWith('.pdf')) {
        throw new Error('Only PDF files are allowed');
      }

      // Validate file size (10MB)
      if (formData.file.size > 10 * 1024 * 1024) {
        throw new Error('File size must be less than 10MB');
      }

      // Create a clean filename with only alphanumeric characters and extension
      const fileExt = 'pdf';
      const cleanFileName = `${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${cleanFileName}`;

      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('notes')
        .upload(filePath, formData.file, {
          cacheControl: '3600',
          contentType: 'application/pdf',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('notes')
        .getPublicUrl(filePath);

      // Create product in database
      const { error: dbError } = await supabase
        .from('products')
        .insert({
          title: formData.title,
          subject: formData.subject,
          price: formData.isFree ? 0 : parseFloat(formData.price),
          description: formData.description,
          file_url: publicUrl,
          preview_url: 'https://images.unsplash.com/photo-1532634993-15f421e42ec0',
          user_id: user.id,
          is_free: formData.isFree
        });

      if (dbError) throw dbError;

      toast.success('Note uploaded successfully!');
      navigate('/marketplace');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-16 min-h-screen bg-[#0A0A0A]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-white mb-8">
          Sell Your Notes
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-[#1a1a1a] rounded-xl border border-[#333333] p-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 bg-[#0A0A0A] border border-[#333333] rounded-lg text-white focus:outline-none focus:border-white"
                  required
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-2 bg-[#0A0A0A] border border-[#333333] rounded-lg text-white focus:outline-none focus:border-white"
                  required
                />
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-300 mb-1">
                  Price ($)
                </label>
                <input
                  type="number"
                  id="price"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-2 bg-[#0A0A0A] border border-[#333333] rounded-lg text-white focus:outline-none focus:border-white"
                  required={!formData.isFree}
                  min="0"
                  step="0.01"
                  disabled={formData.isFree}
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isFree"
                  checked={formData.isFree}
                  onChange={(e) => setFormData({ ...formData, isFree: e.target.checked })}
                  className="mr-2"
                />
                <label htmlFor="isFree" className="text-sm font-medium text-gray-300">
                  Make this note free
                </label>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 bg-[#0A0A0A] border border-[#333333] rounded-lg text-white focus:outline-none focus:border-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Upload Notes (PDF)
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-[#333333] border-dashed rounded-lg">
                  {formData.file ? (
                    <div className="flex items-center space-x-4">
                      <FileText className="h-8 w-8 text-white" />
                      <div>
                        <p className="text-white font-medium">{formData.file.name}</p>
                        <p className="text-gray-400 text-sm">
                          {(formData.file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, file: null })}
                        className="text-gray-400 hover:text-white"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-400">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer rounded-md font-medium text-white hover:text-gray-200"
                        >
                          <span>Upload a file</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            accept=".pdf"
                            onChange={(e) => setFormData({ ...formData, file: e.target.files?.[0] || null })}
                            required
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-400">
                        PDF up to 10MB
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              {loading ? 'Uploading...' : 'List for Sale'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SellNotes;