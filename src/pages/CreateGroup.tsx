import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

const CreateGroup = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    topics: '',
    maxMembers: '',
    image: null as File | null,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('You must be signed in to create a group.');
      return;
    }

    setLoading(true);
    try {
      let imageUrl = '';
      if (formData.image) {
        // Upload image to Supabase storage
        const fileExt = formData.image.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `groups/${user.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('groups') // Use 'groups' bucket
          .upload(filePath, formData.image);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from('groups') // Use 'groups' bucket
          .getPublicUrl(filePath);

        imageUrl = publicUrlData.publicUrl;
      }

      // Insert group data into the database
      const { error: insertError } = await supabase
        .from('groups')
        .insert({
          name: formData.name,
          description: formData.description,
          topics: formData.topics.split(',').map((topic) => topic.trim()),
          max_members: parseInt(formData.maxMembers, 10),
          image_url: imageUrl,
          created_by: user.id, // Ensure this matches the authenticated user's ID
        });

      if (insertError) throw insertError;

      toast.success('Group created successfully!');
      navigate('/groups');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create group.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-16 min-h-screen bg-[#0A0A0A]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-white mb-8">Create Study Group</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-[#1a1a1a] rounded-xl border border-[#333333] p-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                  Group Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-[#0A0A0A] border border-[#333333] rounded-lg text-white focus:outline-none focus:border-white"
                  required
                />
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
                <label htmlFor="topics" className="block text-sm font-medium text-gray-300 mb-1">
                  Topics (comma-separated)
                </label>
                <input
                  type="text"
                  id="topics"
                  value={formData.topics}
                  onChange={(e) => setFormData({ ...formData, topics: e.target.value })}
                  className="w-full px-4 py-2 bg-[#0A0A0A] border border-[#333333] rounded-lg text-white focus:outline-none focus:border-white"
                  placeholder="e.g., Calculus, Linear Algebra, Statistics"
                  required
                />
              </div>

              <div>
                <label htmlFor="maxMembers" className="block text-sm font-medium text-gray-300 mb-1">
                  Maximum Members
                </label>
                <input
                  type="number"
                  id="maxMembers"
                  value={formData.maxMembers}
                  onChange={(e) => setFormData({ ...formData, maxMembers: e.target.value })}
                  className="w-full px-4 py-2 bg-[#0A0A0A] border border-[#333333] rounded-lg text-white focus:outline-none focus:border-white"
                  min="2"
                  max="100"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Group Cover Image
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-[#333333] border-dashed rounded-lg">
                  {formData.image ? (
                    <div className="flex items-center space-x-4">
                      <img
                        src={URL.createObjectURL(formData.image)}
                        alt="Preview"
                        className="h-16 w-16 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, image: null })}
                        className="text-gray-400 hover:text-white"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-400">
                        <label
                          htmlFor="image-upload"
                          className="relative cursor-pointer rounded-md font-medium text-white hover:text-gray-200"
                        >
                          <span>Upload an image</span>
                          <input
                            id="image-upload"
                            name="image-upload"
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] || null })}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-400">
                        PNG, JPG, GIF up to 5MB
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
              {loading ? 'Creating...' : 'Create Group'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGroup;