import { API } from '@/hooks/useApi'
import { useAuth } from '@/store/useAuth'
import { Heart, MapPin, Phone } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'

type MajorItem = {
	id: number
	majorId: number
	centerId: number
	createdAt: string
	updatedAt: string
}

export type Center = {
	id: number
	name: string
	phone: string
	regionId: number
	address: string
	seoId: number
	image: string
	createdAt: string
	updatedAt: string
	majoritems: MajorItem
}

type Props = {
	center: Center
	isLiked: boolean
	onToggleLike: () => void
}

const Card: React.FC<Props> = ({ center, isLiked, onToggleLike }) => {
	const { accessToken } = useAuth()

	const handleLikeToggle = (e: React.MouseEvent) => {
		e.preventDefault()
		if (!accessToken) return
		onToggleLike()
	}

	return (
		<div className='relative group'>
			{/* Like button */}
			<button
				onClick={handleLikeToggle}
				className='absolute z-20 top-4 right-4 text-red-500 bg-gray-200 hover:scale-110 transition-transform duration-300 rounded-full p-2'
			>
				<Heart
					className='w-5 h-5'
					fill={isLiked ? 'red' : 'none'}
				/>
			</button>

			{/* Card content */}
			<Link
				to={`/center/${center.id}`}
				className='block w-full h-full rounded-[10px] overflow-hidden bg-white shadow-md hover:shadow-xl transition-shadow duration-300'
			>
				<div className='w-full h-[250px] md:h-[280px] overflow-hidden'>
					<img
						src={`${API}/image/${center.image}`}
						alt={center.name}
						className='w-full h-full object-cover'
					/>
				</div>
				<div className='p-4 dark:text-white'>
					<h2 className='text-xl font-bold mb-2'>{center.name}</h2>
					<div className='text-sm text-gray-700 dark:text-white mb-2 flex items-center gap-2'>
						<MapPin size={18} /> {center.address}
					</div>
					<div className='text-sm text-gray-600 dark:text-white flex items-center gap-2'>
						<Phone size={18} /> {center.phone}
					</div>
				</div>
			</Link>
		</div>
	)
}

export default Card
