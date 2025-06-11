import { Star } from 'lucide-react'
import { useState } from 'react'

interface StarRatingProps {
  rating: number
  max?: number
  onChange: (rating: number) => void
}

const StarRating: React.FC<StarRatingProps> = ({ rating, max = 5, onChange }) => {
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <div className="flex gap-1">
      {[...Array(max)].map((_, i) => {
        const index = i + 1
        return (
          <Star
            key={index}
            size={20}
            className={`cursor-pointer transition-colors ${
              (hovered ?? rating) >= index
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
            onMouseEnter={() => setHovered(index)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => onChange(index)}
          />
        )
      })}
    </div>
  )
}

export default StarRating
