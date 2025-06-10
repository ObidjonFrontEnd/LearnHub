import { useAuth } from '@/store/useAuth'
import { useNotification } from '@/store/useNotification'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { Bookmark, Heart } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'
import DarsgaYozilishModal from './components/modal'
import { API } from '@/hooks/useApi'

const Center = () => {
	const { id } = useParams()
	const [raidio, setRadio] = useState<string>('')

	const getCenter = async (id: string) => {
		const response = await axios.get(`${API}/centers/${id}`)
		return response?.data
	}
	const { data } = useQuery({
		queryKey: ['Center', id],
		queryFn: () => getCenter(id!),
		enabled: !!id,
	})

	useEffect(() => {
		setRadio(data?.data?.majors[0]?.name)
	}, [data])

	const { t } = useTranslation()

	type Filial = {
		name: string
		address: string
		id: number
	}

	type Majors = {
		name: string
	}
	type LikedCenter = {
		id: number
		centerId: number
	}
	const { setNotification } = useNotification()

	const { accessToken } = useAuth()
	const [isModal, setModal] = useState<boolean>(false)

	const darsgaYozilishOpen = () => {
		if (!accessToken) {
			setNotification(
				data.message || 'darsga yozilishdan oldin, tizimga kiring',
				'error'
			)
		} else {
			setModal(true)
		}
	}
	const handelClose = (): void => {
		setModal(false)
	}

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
	})

	const isLiked = likedData?.some(like => like.centerId === data?.data?.id)

	const postLike = async (id: number) => {
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

		queryClient.invalidateQueries(['getLike'])
	}

	const deleteLike = async (id: number) => {
		try {
			await axios.delete(`${API}/liked/${id}`, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			})
			console.log('Successfully unliked')
		} catch (error) {
			console.error('Failed to unlike:', error)
		}
		queryClient.invalidateQueries(['getLike'])
	}

	const handleLikeToggle = async (id: number) => {
		const likedItem = likedData?.find(like => like.centerId === data?.data?.id)

		if (likedItem) {
			await deleteLike(likedItem.id)
		} else {
			await postLike(id)
		}
	}

	return (
		<section className='mt-[150px] px-[15px] w-full'>
			<DarsgaYozilishModal
				id={data?.data?.id}
				mojors={data?.data?.majors}
				filials={data?.data?.filials}
				isModal={isModal}
				close={handelClose}
			/>
			<div className=' flex w-full flex-col md:flex-row'>
				<div className='right'>
					<div className='img w-full relative h-[250px] rounded-[8px] overflow-hidden'>
						<img
							src={`${API}/image/${data?.data?.image}`}
							className='w-full h-full'
							alt={data?.data?.name}
						/>
						<div
							className='absolute z-20 top-[20px] hover:scale-[1.2] duration-300 right-[20px] text-red-500 bg-gray-200 rounded-full px-[8px] py-[8px]'
							onClick={() => {
								handleLikeToggle(data?.data?.id)
							}}
						>
							<Heart fill={isLiked ? 'red' : 'none'} />
						</div>
					</div>
					<div className='mt-[15px] w-full mb-[25px]'>
						<h2 className='font-bold text-[20px]'>{t('Bizning filia')}</h2>
						<div className='flex flex-col gap-[10px] mt-[10px]'>
							{data?.data?.filials.map(({ name, address, id }: Filial) => {
								return (
									<Link
										to={`/filials/${id}`}
										className='bg-[#D56A42]/35 dark:bg-[#D56A42] dark:text-white  text-black rounded-[6px] px-[15px] py-[10px]'
										key={id}
									>
										<h2 className='text-[18px] font-bold'>{name}</h2>
										<h3 className='text-[14px] dark:text-white text-gray-500'>
											{address}
										</h3>
									</Link>
								)
							})}
						</div>
					</div>

					<div className='flex flex-col gap-[10px]'>
						{data?.data?.majors.map(({ name }: Majors) => {
							return (
								<div
									key={name}
									onClick={() => setRadio(name)}
									className={`${
										raidio == name
											? 'border-[1px] border-[#D56A42]'
											: 'border-white dark:border-gray-800 border-[1px]'
									} dark:shadow-[0_0_20px_rgba(255,255,255,0.1)]  flex gap-[10px] px-[20px] py-[10px]  rounded-[8px] hover:shadow-lg duration-300 shadow-md`}
								>
									<Bookmark />
									<h2>{name}</h2>
								</div>
							)
						})}
						<button
							onClick={darsgaYozilishOpen}
							className='bg-[#D56A42] duration-300 hover:bg-amber-600 w-full rounded-[8px] py-[10px] font-bold text-white'
						>
							{t('Darsga yozilish')}
						</button>
					</div>
				</div>
			</div>
		</section>
	)
}

export default Center
