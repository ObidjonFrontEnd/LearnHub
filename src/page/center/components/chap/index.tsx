import { API } from '@/hooks/useApi'
import { useLikes } from '@/hooks/useLike'

import { useAuth } from '@/store/useAuth'
import { useNotification } from '@/store/useNotification'
import { Bookmark, Heart, MapPin, Phone, Star } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

type Major = {
	name: string
}

type Filial = {
	name: string
	address: string
	id: number
}

type CenterData = {
	id: number
	name: string
	image: string
	majors: Major[]
	filials: Filial[]
	address: string
	phone: string
}

type ChapProps = {
	data: {
		data: CenterData
		message?: string
	}
	setModal: (value: boolean) => void
	averageStars: number
}

const Chap = ({ data, setModal, averageStars }: ChapProps) => {
	const { accessToken } = useAuth()
	const { setNotification } = useNotification()
	const [radio, setRadio] = useState<string>('')
	const { isLiked, toggleLike } = useLikes()
	const { t } = useTranslation()

	useEffect(() => {
		setRadio(data?.data?.majors[0]?.name)
	}, [data])

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

	return (
		<div className='w-full lg:w-[35%]'>
			<div className='right w-full'>
				<div className='img w-full relative   overflow-hidden'>
					<img
						src={`${API}/image/${data?.data?.image}`}
						className='w-full '
						alt={data?.data?.name}
					/>
					<div
						className='absolute z-20 top-[20px] hover:scale-[1.2] duration-300 right-[20px] text-red-500 bg-gray-200 rounded-full px-[8px] py-[8px]'
						onClick={() => toggleLike(data?.data?.id)}
					>
						<Heart fill={isLiked(data?.data?.id) ? 'red' : 'none'} />
					</div>
				</div>

				<div className='px-[8px] sm:px-[15px]'>
					{/* Title and Address */}
					<div className='md:hidden mt-[15px] items-start flex justify-between'>
						<div>
							<h1 className='font-bold text-[25px]'>{data?.data?.name}</h1>
							<h2 className='text-[16px] text-gray-500 flex items-center gap-[10px]'>
								<MapPin /> {data?.data?.address}
							</h2>
						</div>
						<div className='flex items-center gap-[10px] text-yellow-400 px-[10px] py-[5px] rounded-[15px] bg-[#D56A42]/75'>
							<Star className='fill-yellow-400' />
							<h2 className='text-black'>{averageStars}</h2>
						</div>
					</div>

					{/* Phone */}
					<div className='md:hidden mt-[15px] mb-[10px]'>
						<h2 className='text-[16px] text-gray-500 '>{t('Telefon')}</h2>
						<h2 className='flex gap-[10px] text-[18px] items-center font-bold'>
							<Phone size={20} /> {data?.data?.phone}
						</h2>
					</div>

					{/* Filials */}
					<div className='mt-[15px] w-full mb-[25px]'>
						<h2 className='font-bold text-[20px]'>{t('Bizning filia')}</h2>
						<div className='flex flex-col gap-[10px] mt-[10px]'>
							{data?.data?.filials.map(({ name, address, id }) => (
								<Link
									to={`/filials/${id}`}
									className='bg-[#D56A42]/35 dark:bg-[#D56A42] dark:text-white text-black rounded-[6px] px-[15px] py-[10px]'
									key={id}
								>
									<h2 className='text-[18px] font-bold'>{name}</h2>
									<h3 className='text-[14px] dark:text-white text-gray-500'>
										{address}
									</h3>
								</Link>
							))}
						</div>
					</div>

					{/* Majors & Button */}
					<div className='flex flex-col gap-[10px]'>
						{data?.data?.majors.map(({ name }) => (
							<div
								key={name}
								onClick={() => setRadio(name)}
								className={`${
									radio === name
										? 'border-[1px] border-[#D56A42]'
										: 'border-white dark:border-gray-800 border-[1px]'
								} dark:shadow-[0_0_20px_rgba(255,255,255,0.1)] flex gap-[10px] px-[20px] py-[10px] rounded-[8px] hover:shadow-lg duration-300 shadow-md`}
							>
								<Bookmark />
								<h2>{name}</h2>
							</div>
						))}
						<button
							onClick={darsgaYozilishOpen}
							className='bg-[#D56A42] duration-300 hover:bg-amber-600 w-full rounded-[8px] py-[10px] font-bold text-white'
						>
							{t('Darsga yozilish')}
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Chap
