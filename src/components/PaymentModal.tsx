import React from 'react';
import { X } from 'lucide-react';
import { useStripe } from '@stripe/stripe-js';
import toast from 'react-hot-toast';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: number;
    title: string;
    price: number | 'Free';
  };
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, product }) => {
  const stripe = useStripe();

  const handlePayment = async () => {
    if (product.price === 'Free') {
      // Handle free product download
      toast.success('Note downloaded successfully!');
      onClose();
      return;
    }

    try {
      // Here you would typically create a payment intent on your server
      // and then use the client secret to confirm the payment
      toast.success('Payment successful! Downloading note...');
      onClose();
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-rich-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-chocolate-cosmos p-8 rounded-xl border border-rosewood w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X size={20} />
        </button>
        <h2 className="text-2xl font-bold text-white mb-6">
          {product.price === 'Free' ? 'Download Note' : 'Complete Purchase'}
        </h2>
        <div className="space-y-4">
          <div className="bg-rich-black rounded-lg p-4">
            <h3 className="text-white font-semibold">{product.title}</h3>
            <p className="text-selective-yellow text-xl font-bold mt-2">
              {product.price === 'Free' ? 'Free' : `$${product.price}`}
            </p>
          </div>
          <button
            onClick={handlePayment}
            className="w-full bg-selective-yellow text-rich-black py-2 rounded-lg hover:bg-orange-web transition-colors"
          >
            {product.price === 'Free' ? 'Download Now' : 'Pay Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;