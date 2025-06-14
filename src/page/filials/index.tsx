import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import {
	MapPin,
	Phone,
	Building,
	Calendar,
	User,
	AlertCircle,
} from 'lucide-react'
import { API } from '@/hooks/useApi'
import GoBack from '@/hooks/useGoBack'
import { useTranslation } from 'react-i18next'

type UserType = {
	id: number
	firstName: string
	lastName: string
	email: string
	phone: string
	role: string
	image: string
	isActive: boolean
	createdAt: string
	updatedAt: string
}

type ReceptionType = {
	id: number
	userId: number
	centerId: number
	filialId: number
	majorId: number
	visitDate: string
	status: string
	createdAt: string
	updatedAt: string
	user: UserType
}

type CenterType = {
	id: number
	name: string
	phone: string
	regionId: number
	address: string
	seoId: number
	image: string
	createdAt: string
	updatedAt: string
}

type RegionType = {
	id: number
	name: string
}

type FilialType = {
	id: number
	name: string
	phone: string
	regionId: number
	centerId: number
	address: string
	image: string
	createdAt: string
	updatedAt: string
	center?: CenterType
	region?: RegionType
	receptions?: ReceptionType[]
}

const fetchFilialById = async (id: string): Promise<FilialType> => {
	const res = await axios.get(`${API}/filials/${id}`, {
		headers: { Accept: '*/*' },
	})
	return res.data.data
}

const GetFillialsByid = () => {
	const { t } = useTranslation()
	const { id } = useParams<{ id: string }>()

	const { data, isLoading, isError } = useQuery<FilialType>({
		queryKey: ['filial', id],
		queryFn: () => fetchFilialById(id as string),
		enabled: !!id,
	})

	if (isLoading)
		return (
			<p className='text-[16px] text-center mt-[100px] text-gray-500 dark:text-gray-400'>
				{t('Yuklanmoqda...')}
			</p>
		)

	if (isError || !data)
		return (
			<p className='text-[16px] text-center mt-[100px] text-red-500 dark:text-red-400'>
				{t('Maʼlumotni yuklashda xatolik yuz berdi')}
			</p>
		)

	return (
		<section className='px-[15px] mt-[150px]'>
			<GoBack
				to={`/center/${data?.center?.id}`}
				className='px-[15px] mb-[35px] mx-auto max-w-[900px]'
			/>

			<div className='max-w-[800px] mx-auto mb-[50px] border rounded-[12px] shadow-lg dark:shadow-[0_0_30px_rgba(255,255,255,0.05)] bg-white dark:bg-gray-900 dark:border-gray-700 px-[30px] py-[25px] space-y-[20px]'>
				{data?.image && (
					<img
						src={`${API}/image/${data?.image}`}
						alt={data?.name}
						className='h-[160px] mx-auto mb-[20px] object-contain'
					/>
				)}

				<h2 className='text-[24px] font-bold text-center text-gray-900 dark:text-white'>
					{data?.name}
				</h2>

				<div className='space-y-[10px] text-gray-700 dark:text-gray-300'>
					{data?.region?.name && (
						<p className='flex items-center gap-[10px]'>
							<MapPin className='w-[20px] h-[20px] text-purple-600' />
							{data?.region?.name}
						</p>
					)}

					{data?.address && (
						<p className='flex items-center gap-[10px]'>
							<Building className='w-[20px] h-[20px] text-blue-600' />
							{data?.address}
						</p>
					)}

					{data?.phone && (
						<p className='flex items-center gap-[10px]'>
							<Phone className='w-[20px] h-[20px] text-green-600' />
							{data?.phone}
						</p>
					)}
				</div>

				<div className='mt-[30px]'>
					<h3 className='text-[20px] font-semibold mb-[10px] flex items-center gap-[10px] text-gray-800 dark:text-white'>
						<Building className='w-[20px] h-[20px]' /> {t('Markaz')}
					</h3>
					<p className='text-[16px]'>{data?.center?.name}</p>
				</div>

				<div className='mt-[30px]'>
					<h3 className='text-[20px] font-semibold mb-[10px] flex items-center gap-[10px] text-gray-800 dark:text-white'>
						<User className='w-[20px] h-[20px]' /> {t('Arizalar')}
					</h3>
					{data?.receptions?.length === 0 ? (
						<p className='text-gray-500 dark:text-gray-400 flex items-center gap-[10px]'>
							<AlertCircle className='w-[20px] h-[20px] text-gray-400' />
							{t('Arizalar mavjud emas')}
						</p>
					) : (
						<ul className='space-y-[10px]'>
							{data?.receptions?.map(rec => (
								<li
									key={rec?.id}
									className='border rounded-[8px] p-[15px] bg-gray-50 dark:bg-gray-800'
								>
									<p className='flex items-center gap-[8px] text-[15px]'>
										<User className='w-[16px] h-[16px] text-indigo-500' />
										{rec?.user?.firstName} {rec?.user?.lastName}
									</p>
									<p className='flex items-center gap-[8px] text-[15px]'>
										<Calendar className='w-[16px] h-[16px] text-rose-500' />
										{new Date(rec?.visitDate).toLocaleString()}
									</p>
									<p className='flex items-center gap-[8px] text-[15px]'>
										<AlertCircle className='w-[16px] h-[16px] text-yellow-500' />
										{t('Holati')}: {rec?.status}
									</p>
								</li>
							))}
						</ul>
					)}
				</div>
			</div>
		</section>
	)
}

export default GetFillialsByid
