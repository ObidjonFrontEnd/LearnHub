import { API } from '@/hooks/useApi'
import { useLikes } from '@/hooks/useLike'
import { useAuth } from '@/store/useAuth'
import { useNotification } from '@/store/useNotification'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { Heart, Pencil, Phone, Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import DeletePopover from '../deleteModal'

type Center = {
	id: number
	name: string
	address: string
	phone: string
	image: string
}

export default function GetMyCenters() {
	const { accessToken } = useAuth()
	const { isLiked, toggleLike } = useLikes()
	const navigate = useNavigate()
	const { setNotification } = useNotification()
	const { t } = useTranslation()
	const queryClient = useQueryClient()

	const getMyCenters = async (): Promise<Center[]> => {
		const response = await axios.get<{ data: Center[] }>(
			`${API}/users/mycenters`,
			{
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			}
		)
		return response.data.data
	}

	const { data, isLoading } = useQuery({
		queryKey: ['myCenters'],
		queryFn: getMyCenters,
	})

	const handleDelete = async (centerId: number) => {
		const response = await axios.delete(`${API}/centers/${centerId}`, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		})
		if (response.status >= 200 && response.status < 400) {
			setNotification(t("muvofiaqatli o'chirildi"), 'success')
			queryClient.invalidateQueries({ queryKey: ['myCenters'] })
		}
	}

	return (
		<div className='grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[25px] p-6 mt-[150px]'>
			<Link
				to={'/seo/addCenter'}
				className='flex flex-col justify-center items-center border-2 border-dashed border-gray-300 rounded-xl hover:border-gray-500 hover:scale-[1.02] cursor-pointer duration-300 p-4 hover:shadow-lg shadow-md min-h-[290px] dark:shadow-[0_0_20px_rgba(255,255,255,0.1)]'
			>
				<Plus size={36} className='text-gray-400 mb-2' />
				<p className='text-gray-500 font-medium'>{t("Yangi markaz qo'shing")}</p>
			</Link>

			{isLoading
				? Array.from({ length: 4 }).map((_, i) => (
						<div
							key={i}
							className='animate-pulse bg-white rounded-xl shadow-md w-full min-h-[290px] p-4 flex flex-col gap-4'
						>
							<div className='bg-gray-300 h-40 w-full rounded-md' />
							<div className='h-4 bg-gray-300 rounded w-3/4' />
							<div className='h-4 bg-gray-300 rounded w-1/2' />
							<div className='h-4 bg-gray-300 rounded w-1/3 mt-auto' />
						</div>
				  ))
				: data?.map(center => (
						<div
							key={center.id}
							onClick={() => navigate(`/center/${center.id}`)}
							className='relative bg-white rounded-xl shadow-md w-full overflow-hidden hover:scale-[1.05] duration-300 hover:shadow-lg cursor-pointer dark:shadow-[0_0_20px_rgba(255,255,255,0.1)]'
						>
							<img
								src={`${API}/image/${center.image}`}
								alt={center.name}
								className='w-full h-40 object-cover'
							/>

							<div className='absolute top-2 right-2 flex flex-col space-y-2'>
								<button
									onClick={e => {
										e.stopPropagation()
										toggleLike(center.id)
									}}
									className='bg-white/80 p-1.5 rounded-full shadow hover:bg-white hover:scale-[1.1] duration-300'
								>
									<Heart
										size={16}
										className={`transition-all duration-300 ${
											isLiked(center.id)
												? 'fill-red-500 text-red-500'
												: 'text-red-500'
										}`}
									/>
								</button>
								<Link
									to={`/seo/edite/${center.id}`}
									onClick={e => e.stopPropagation()}
									className='bg-white/80 p-1.5 rounded-full shadow hover:bg-white hover:scale-[1.1] duration-300'
								>
									<Pencil size={16} className='text-yellow-600' />
								</Link>

								<DeletePopover onConfirm={() => handleDelete(center.id)} />
							</div>

							<div className='p-4'>
								<h3 className='text-lg dark:text-black font-semibold'>
									{center.name}
								</h3>
								<p className='text-sm text-gray-500'>{center.address}</p>
								<p className='text-sm text-gray-600 mt-1 flex gap-[5px] items-center'>
									<Phone size={16} /> {center.phone}
								</p>
								<div className='flex justify-end items-center mt-2 text-xs text-gray-500'>
									⭐ 0.0
								</div>
							</div>
						</div>
				  ))}
		</div>
	)
}
