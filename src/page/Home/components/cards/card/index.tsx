import { API } from '@/hooks/useApi'
import { useAuth } from '@/store/useAuth'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
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
type LikedCenter = {
	id: number
	centerId: number
}

const Card: React.FC<Props> = ({ center }) => {
	const { accessToken } = useAuth()
	
	
	const queryClient = useQueryClient()
	const getLike = async () => {
	const response = await axios.get(`${API}/liked`, {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	})

	return response?.data?.data?.map((item: any) => ({
		id: item.id,
		centerId: item.centerId,
	}))
}



	const { data: likedData } = useQuery<LikedCenter[]>({
	queryKey: ['getLike'],
	queryFn: getLike,
	enabled: !!accessToken, 
	retry: false,
})





const isCenterLiked = (likedData: LikedCenter[] | undefined, centerId: number): boolean => {
  if (!likedData || likedData.length === 0) return false
  return likedData.some(like => Number(like?.centerId) === Number(centerId))
}


const isLiked = isCenterLiked(likedData, center.id)


	const postLike = async (id:number) => {
		const response = await axios.post(
			'https://findcourse.net.uz/api/liked',
			{
				centerId: id,
			},
			{
				headers: {
					Authorization: `Bearer ${accessToken}`,
					'Content-Type': 'application/json',
					Accept: '*/*',
				},
			}
		)
		if(response.status >=200 && response.status<400){
			queryClient.invalidateQueries({queryKey:['getLike']})
		}
	
	}

	const deleteLike = async (id: number) => {
		try {
			await axios.delete(`${API}/liked/${id}`, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			})
		} catch (error) {
			console.error('Failed to unlike:', error)
		}
		queryClient.invalidateQueries({queryKey:['getLike']})
	}

	const handleLikeToggle = async (id:number) => {
		const likedItem = likedData?.find(like => like.centerId === center.id)
		

		if (likedItem) {
			await deleteLike(likedItem.id)
		} else {
			await postLike(id)
		}
	}

	return (
		<div className='relative'>
			<div
				className='absolute z-20 top-[20px] hover:scale-[1.2] duration-300 right-[20px] text-red-500 bg-gray-200 rounded-full px-[8px] py-[8px]'
				onClick={()=>{handleLikeToggle(center?.id)}}
			>
				<Heart fill={isLiked ? 'red' : 'none'} />
			</div>
			<Link
				to={`/center/${center?.id}`}
				className='w-full h-full rounded-[10px] overflow-hidden pt-0'
			>
				<div className='w-full  h-[250px] md:h-[280px] overflow-hidden'>
					<img
						src={`${API}/image/${center?.image}`}
						alt={center.name}
						className='w-full h-full rounded relative z-10'
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
