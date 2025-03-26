import React, { useState, useEffect } from 'react';
import { FileText, Download } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { GroupSharedFile, Product, Purchase } from '../lib/types';
import { useAuth } from '../lib/AuthContext';
import toast from 'react-hot-toast';

interface SharedFilesProps {
  groupId: string;
}

const SharedFiles: React.FC<SharedFilesProps> = ({ groupId }) => {
  const { user } = useAuth();
  const [sharedFiles, setSharedFiles] = useState<GroupSharedFile[]>([]);
  const [myPurchases, setMyPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        // Fetch shared files
        const { data: filesData, error: filesError } = await supabase
          .from('group_shared_files')
          .select(`
            *,
            products (*)
          `)
          .eq('group_id', groupId);

        if (filesError) throw filesError;
        setSharedFiles(filesData || []);

        // Fetch user's purchases
        if (user) {
          const { data: purchasesData, error: purchasesError } = await supabase
            .from('purchases')
            .select('*')
            .eq('user_id', user.id);

          if (purchasesError) throw purchasesError;
          setMyPurchases(purchasesData || []);
        }
      } catch (error) {
        console.error('Error fetching shared files:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [groupId, user]);

  const handleDownload = async (product: Product) => {
    try {
      const { data: { publicUrl }, error: urlError } = supabase.storage
        .from('notes')
        .getPublicUrl(product.file_url.split('notes/')[1]);

      if (urlError) throw urlError;

      // Create a temporary anchor element to trigger the download
      const link = document.createElement('a');
      link.href = publicUrl;
      link.setAttribute('download', ''); // This will suggest downloading rather than navigating
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error: any) {
      toast.error('Error downloading file. Please try again.');
      console.error('Download error:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sharedFiles.map((file) => (
          <div key={file.id} className="bg-[#1a1a1a] rounded-xl border border-[#333333] p-4">
            <div className="flex items-start space-x-4">
              <FileText className="h-8 w-8 text-white" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white">
                  {file.products?.title}
                </h3>
                <p className="text-gray-400 text-sm">
                  {file.products?.subject}
                </p>
                {myPurchases.some(p => p.product_id === file.product_id) && file.products && (
                  <button
                    onClick={() => handleDownload(file.products!)}
                    className="flex items-center text-white hover:text-gray-200 mt-4"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SharedFiles;