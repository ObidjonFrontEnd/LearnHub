import StarRating from '@/components/ui/star'
import StarStatic from '@/components/ui/starStatik'
import { API } from '@/hooks/useApi'
import { useUserStore } from '@/store/userData'
import {
	Calendar,
	MapPin,
	MessageSquareText,
	Phone,
	Star,
} from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import DeletePopover from '../deleteModal'
import axios from 'axios'
import { useAuth } from '@/store/useAuth'
import { useNotification } from '@/store/useNotification'
import { useQueryClient } from '@tanstack/react-query'
import EditPopover from '../upData'


export interface User {
	id: number
	firstName: string
	lastName: string
	image: string
}

export interface Comment {
	id: number
	text: string
	star: number
	updatedAt: string
	user: User
}

export interface Data {
	data: {
		id: number
		name: string
		address: string
		phone: string
	}
}

interface OngProps {
	data: Data
	averageStars: number
	filteredComments: Comment[]
}

const Ong = ({ data, averageStars, filteredComments = [] }: OngProps) => {
	const { t } = useTranslation()
	const [rating, setRating] = useState<number>(5)
	const { user: me } = useUserStore()
	const { accessToken } = useAuth()
	const { setNotification } = useNotification()
	const [text, setCommit] = useState<string>('')
	const queryClient = useQueryClient()

	const saveCommit = async (event: React.FormEvent) => {
		event.preventDefault()
		const response = await axios.post(
			`${API}/comments`,
			{
				text,
				star: rating,
				centerId: data?.data?.id,
			},
			{
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			}
		)
		if (response.status >= 200 && response.status < 400) {
			setNotification(t('Sharh muvofiaqatli saqlandi'), 'success')
			setCommit('')
			queryClient.invalidateQueries({ queryKey: ['comments'] })
		}
	}

	const deleteComment = async (id: number) => {
		const response = await axios.delete(`${API}/comments/${id}`, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		})
		if (response.status >= 200 && response.status < 400) {
			setNotification(response?.data?.message, 'success')
			queryClient.invalidateQueries({ queryKey: ['comments'] })
		}
	}

	return (
		<div className='w-full lg:w-[60%] pt-[25px] px-[15px]'>
			<div className='hidden lg:flex items-start w-full justify-between'>
				<div className=''>
					<h1 className='font-bold text-[25px]'>{data?.data?.name}</h1>
					<h2 className='text-[16px] text-gray-500 flex items-center gap-[10px]'>
						<MapPin /> {data?.data?.address}
					</h2>
				</div>
				<div className='flex items-center py-[5px] gap-[10px] text-yellow-400 px-[10px]  rounded-[15px] bg-[#D56A42]/75'>
					{' '}
					<Star className='fill-yellow-400' />{' '}
					<h2 className='text-black'>{averageStars}</h2>
				</div>
			</div>

			<div className='hidden lg:block mt-[15px] mb-[10px]'>
				<h2 className='text-[16px] text-gray-500 '>{t('Telefon')}</h2>
				<h2 className='flex gap-[10px] text-[18px] items-center font-bold'>
					<Phone size={20} /> {data?.data?.phone}
				</h2>
			</div>

			<form action='' onSubmit={saveCommit}>
				<h2 className='flex mb-[15px] text-[18px] font-bold gap-[10px] items-center h-full'>
					<MessageSquareText />
					{t('Sharhlar')}
				</h2>
				<textarea
					rows={5}
					value={text}
					className='resize-none outline-none border-gray-500 border w-full rounded-[8px] p-[10px]'
					onChange={e => {
						setCommit(e.target.value)
					}}
				></textarea>
				<div className='flex gap-[10px] items-center py-[10px]'>
					<h2>{t('Reyting')}:</h2>
					<StarRating rating={rating} onChange={setRating} />
				</div>

				<div className='text-end'>
					<button className='bg-[#D56A42] border-[#D56A42] border rounded-[8px] text-white hover:bg-white hover:text-[#D56A42] duration-300 px-[15px] py-[10px]'>
						{t('Saqlash')}
					</button>
				</div>
			</form>

			<div className='flex flex-col  gap-[10px]  w-full mt-[25px]'>
				{[...filteredComments]
					?.reverse()
					.map(({ text, id, user, updatedAt, star }) => {
						return (
							<div
								key={id}
								className='bg-gray-300 shadow-lg dark:bg-gray-800 px-[15px] h-[125px] md:h-[100px] w-full py-[10px] rounded-[8px] mb-2 dark:shadow-[0_0_20px_rgba(255,255,255,0.1)]'
							>
								<div className='flex flex-col md:flex-row md:justify-between '>
									<div className='flex gap-[10px] items-center'>
										<div className='w-[25px] h-[25px]'>
											<img
												src={`${API}/image/${user?.image}`}
												className='w-full h-full rounded-full'
												alt='User Photo'
											/>
										</div>
										<h2>
											{user?.firstName} {user?.lastName}
										</h2>
										<p>
											<StarStatic rating={star} />
										</p>
									</div>

									<div className=' flex md:flex-col justify-between md:justify-start md:items-end h-full gap-[10px]'>
										<p className='text-sm flex items-center gap-[8px] text-gray-600'>
											<Calendar size={16} />
											{new Date(updatedAt).toLocaleString()}
										</p>

										{me?.id === user?.id ? (
											<div className='flex gap-[10px] items-center  mt-[10px]'>
												<EditPopover
													commentId={id}
													initialText={text}
													initialStar={star}
												/>

												<DeletePopover
													onConfirm={() => {
														deleteComment(id)
													}}
												></DeletePopover>
											</div>
										) : (
											''
										)}
									</div>
								</div>
								<div className=''>
									<h2>{text}</h2>
								</div>
							</div>
						)
					})}
			</div>
		</div>
	)
}

export default Ong
