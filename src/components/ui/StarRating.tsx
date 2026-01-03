import React from 'react';
import { Star, StarHalf } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  count?: number;
  size?: number;
}

export const StarRating: React.FC<StarRatingProps> = ({ rating, count, size = 4 }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className="flex items-center">
      <div className="flex text-yellow-500">
        {[...Array(5)].map((_, i) => {
          if (i < fullStars) {
            return <Star key={i} className={`w-${size} h-${size} fill-current`} />;
          } else if (i === fullStars && hasHalfStar) {
            return <StarHalf key={i} className={`w-${size} h-${size} fill-current`} />;
          } else {
            return <Star key={i} className={`w-${size} h-${size} text-gray-300`} />;
          }
        })}
      </div>
      {count !== undefined && (
        <span className="ml-2 text-sm text-blue-600 hover:underline cursor-pointer">
          {count.toLocaleString()} ratings
        </span>
      )}
    </div>
  );
};
