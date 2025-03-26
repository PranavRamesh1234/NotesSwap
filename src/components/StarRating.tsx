import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, onRatingChange }) => {
  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onRatingChange(star)}
          className="focus:outline-none"
        >
          <Star
            className={`h-6 w-6 ${
              star <= rating
                ? 'text-yellow-400 fill-current'
                : 'text-gray-400'
            }`}
          />
        </button>
      ))}
    </div>
  );
};

export default StarRating;