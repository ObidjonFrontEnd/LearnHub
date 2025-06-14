import { useUserStore } from '@/store/userData'
import { useAuth } from '@/store/useAuth'
import axios from 'axios'
import { useQueries } from '@tanstack/react-query'
import { API } from '@/hooks/useApi'
import { MapPin, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'

const fetchCenterById = async (centerId: number, token: string) => {
	const response = await axios.get(`${API}/centers/${centerId}`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	})
	return response.data
}

const LikedCenters = () => {
	const { user } = useUserStore()
	const { accessToken } = useAuth()

	const likeIds = user?.likes?.map(like => like.centerId) || []

	const centerQueries = useQueries({
  queries: likeIds.map(centerId => ({
    queryKey: ['center', centerId],
    queryFn: () => fetchCenterById(centerId, accessToken as string),
    enabled: !!accessToken && !!centerId,
  })),
});


	const isLoading = centerQueries.some(q => q.isLoading)


	const centers = centerQueries
		.filter(q => q.data)
		.map(q => q.data)

	console.log(centers);
	
		
	return (
		<div className=" mt-[150px]   mx-auto px-[15px]">
			<div className="grid gap-[10px] w-full max-w-[1280px] sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mx-auto">
				{centers?.map(center => (
					<Link to={`/center/${center?.data?.id}`} key={center?.data?.id} className="dark:shadow-[0_0_20px_rgba(255,255,255,0.1)] rounded-[8px] overflow-hidden shadow-lg">
						<div className="img w-full ">
							<img src={`${API}/image/${center?.data?.image}`} alt={center?.data?.name} className='w-full object-cover' />
						</div>

						<div className="px-[10px] py-[45px]">
							<h2 className='text-[20px] font-bold dark:text-[#D56A42] mb-[15px]'>{center?.data?.name}</h2>
							<h2 className='text-gray-500 mb-[10px] dark:text-white text-[14px] flex gap-[5px] items-center'><MapPin size={16} />{center?.data?.address}</h2>
							<h3 className='text-gray-500 dark:text-white text-[14px] flex gap-[5px] items-center'><Phone size={16} />{center?.data?.phone}</h3>
						</div>
						
					</Link>
				))}
			</div>

			{!isLoading && centers.length === 0 && (
				<p className="text-gray-500">Вы пока не лайкнули ни одного центра.</p>
			)}
		</div>
	)
}

export default LikedCenters
