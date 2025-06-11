import { Star } from 'lucide-react';
import React from 'react';

interface StarRatingProps {
  rating: number; // Пример: 4.5
  max?: number;   // По умолчанию 5 звёзд
}

const StarStatic: React.FC<StarRatingProps> = ({ rating, max = 5 }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className="flex items-center gap-1">
      {[...Array(max)].map((_, i) => (
        <Star
          key={i}
          size={16}
          className={`${
            i < fullStars
              ? 'fill-yellow-400 text-yellow-400'
              : i === fullStars && hasHalfStar
              ? 'fill-yellow-400 text-yellow-200'
              : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );
};

export default StarStatic;
