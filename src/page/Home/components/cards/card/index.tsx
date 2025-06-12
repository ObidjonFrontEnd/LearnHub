import { API } from '@/hooks/useApi'
import { useLikes } from '@/hooks/useLike'
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

type Center = {
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
}

const Card: React.FC<Props> = ({ center }) => {
	const { accessToken } = useAuth()
	const { isLiked, toggleLike } = useLikes() 

	const handleLikeToggle = async () => {
		if (!accessToken) return
		await toggleLike(center.id)
	}

	return (
		<div className='relative'>
			<div
				className='absolute z-20 top-[20px] hover:scale-[1.2] duration-300 right-[20px] text-red-500 bg-gray-200 rounded-full px-[8px] py-[8px]'
				onClick={handleLikeToggle}
			>
				<Heart fill={isLiked(center.id) ? 'red' : 'none'} />
			</div>

			<Link
				to={`/center/${center?.id}`}
				className='w-full h-full rounded-[10px] overflow-hidden pt-0'
			>
				<div className='w-full h-[250px] md:h-[280px] overflow-hidden'>
					<img
						src={`${API}/image/${center?.image}`}
						alt={center.name}
						className='w-full h-full rounded relative z-10 object-cover'
					/>
				</div>
				<div className='px-[15px] py-[15px] dark:text-white'>
					<h2 className='text-xl font-bold mb-2'>{center.name}</h2>
					<div className='text-sm text-gray-700 dark:text-white mb-[10px] flex items-center gap-[10px]'>
						<MapPin size={20} />
						{center.address}
					</div>
					<div className='text-sm dark:text-white text-gray-600 flex items-center gap-[10px]'>
						<Phone size={20} /> {center.phone}
					</div>
				</div>
			</Link>
		</div>
	)
}

export default Card
