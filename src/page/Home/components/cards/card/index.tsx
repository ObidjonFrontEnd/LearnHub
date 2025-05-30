import { MapPin, Phone } from 'lucide-react'
import React from 'react'

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
	return (
		<div className=' w-full rounded-[10px] overflow-hidden  pt-0 '>
			<div className='w-full h-full overflow-hidden'>
				<img
					src={`https://findcourse.net.uz/api/image/1745612726234.png`}
					alt={center.name}
					className=' w-full h-auto rounded relative z-10'
				/>
			</div>
			<div className='px-[15px] py-[15px] dark:text-white'>
				<h2 className='text-xl font-bold mb-2'>{center.name}</h2>
				<p className='text-sm text-gray-700 dark:text-white mb-[10px] flex items-center gap-[10px]'>
					<MapPin size={20} />
					{center.address}
				</p>
				<p className='text-sm dark:text-white text-gray-600 flex items-center gap-[10px]'>
					<Phone size={20} /> {center.phone}
				</p>
			</div>
		</div>
	)
}

export default Card
