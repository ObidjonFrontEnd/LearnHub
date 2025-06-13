import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { API } from '@/hooks/useApi'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, Camera, Pencil } from 'lucide-react'
import { useImageUpload } from '@/components/I/uploadImage'
import { useAuth } from '@/store/useAuth'
import { useNotification } from '@/store/useNotification'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import DeletePopover from '../deleteModal'
import AddBranchPopover from '../addFilial'

// Типы
type Params = {
	id: string
}

type Center = {
	id: number
	name: string
	address: string
	phone: string
	image: string
	region?: {
		id: number
		name: string
	}
}

type Filial = {
	id: number
	name: string
	address: string
	phone: string
	image: string
}

const EditCenter: React.FC = () => {
	const { id } = useParams<Params>()
	const { t } = useTranslation()
	const { accessToken } = useAuth()
	const { setNotification } = useNotification()
	const [address, setAddress] = useState<string>('')
	const [name, setName] = useState<string>('')
	const [phone, setPhone] = useState<string>('')
	const [image, setImage] = useState<string>('')
	const queryClient = useQueryClient()

	const getCenterData = async (id: string): Promise<Center> => {
		const response = await axios.get(`${API}/centers/${id}`)
		return response?.data?.data
	}

	const { data: centerData } = useQuery<Center>({
		queryKey: ['center:id', id],
		queryFn: () => getCenterData(id as string),
		enabled: !!id,
	})

	useEffect(() => {
		if (centerData) {
			setName(centerData.name || '')
			setAddress(centerData.address || '')
			setPhone(centerData.phone || '')
			setImage(centerData.image || '')
		}
	}, [centerData])

	const {
		uploadImage,
		loading: imageLoading,
		error: imageError,
	} = useImageUpload()

	const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return
		try {
			const res = await uploadImage(file)
			const img = await res?.data
			setImage(img)
		} catch (err) {
			console.error('Rasm yuklashda xatolik', err)
		}
	}

	const submit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		const response = await axios.patch(
			`${API}/centers/${id}`,
			{ name, address, phone, image },
			{ headers: { Authorization: `Bearer ${accessToken}` } }
		)
		if (response.status >= 200 && response.status < 400) {
			setNotification(t('Markaz mufoqiatli ozgartirildi'), 'success')
			queryClient.invalidateQueries({ queryKey: ['center:id', id] })
		}
	}

	const getFilials = async (
		id: string,
		accessToken: string
	): Promise<Filial[]> => {
		const response = await axios.get(`${API}/filials`, {
			params: { centerId: id },
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		})
		return response.data.data
	}

	const { data: filials } = useQuery<Filial[]>({
		queryKey: ['filials', id],
		queryFn: () => getFilials(id as string, accessToken as string),
		enabled: !!id && !!accessToken,
	})

	const handleDelete = async (filialId: number) => {
		const response = await axios.delete(`${API}/filials/${filialId}`, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		})
		if (response.status >= 200 && response.status < 400) {
			setNotification(t('Filial mufoqiatli o‘chirildi'), 'success')
			queryClient.invalidateQueries({ queryKey: ['filials'] })
		}
	}

	return (
		<section className='mt-[150px] px-[15px] pb-[250px] md:pb-0'>
			<div className='mb-[20px]'>
				<Link
					to={'/seo/myCenters'}
					className='flex items-center gap-[5px] font-bold text-[20px] text-[#D56A42]'
				>
					<ArrowLeft size={25} />
					{t('Markaz tafsiflariga qaytish')}
				</Link>
			</div>

			<div className='border mx-auto p-6 mb-[25px] rounded-lg shadow-lg dark:shadow-[0_0_20px_rgba(255,255,255,0.1)]'>
				<div className='flex gap-6 flex-col md:flex-row'>
					<div className='w-full relative md:w-1/2'>
						<img
							src={`${API}/image/${image}`}
							alt='Center'
							className='rounded-lg w-full md:h-[500px] object-cover'
						/>
						<label className='absolute bottom-[15px] right-[15px] cursor-pointer flex items-center justify-center rounded-full w-[45px] h-[45px] bg-gray-300 text-[#D56A42]'>
							<Camera size={20} />
							<input type='file' className='hidden' onChange={handleImageChange} />
						</label>

						{imageLoading && (
							<p className='text-sm text-blue-500 mt-2'>
								{t('Rasm yuklanmoqda...')}
							</p>
						)}
						{imageError && (
							<p className='text-sm text-red-500 mt-2'>{imageError}</p>
						)}
					</div>

					<form onSubmit={submit} className='w-full md:w-1/2 space-y-4'>
						<h2 className='text-xl font-bold mb-4'>
							{t("Markaz ma'lumotlarini tahrirlash")}
						</h2>

						<div>
							<label className='block text-sm font-medium'>{t('Markaz nomi')}</label>
							<input
								type='text'
								value={name}
								onChange={e => setName(e.target.value)}
								className='w-full border rounded px-3 py-2 shadow-lg outline-none'
							/>
						</div>

						<div>
							<label className='block text-sm font-medium'>{t('Markaz manzili')}</label>
							<input
								type='text'
								value={address}
								onChange={e => setAddress(e.target.value)}
								className='w-full border rounded px-3 py-2 shadow-lg outline-none'
							/>
						</div>

						<div>
							<label className='block text-sm font-medium'>{t('Markaz telefon raqami')}</label>
							<input
								type='text'
								value={phone}
								onChange={e => setPhone(e.target.value)}
								className='w-full border rounded px-3 py-2 shadow-lg outline-none'
							/>
						</div>

						<button
							type='submit'
							className='bg-[#D56A42]/75 w-full text-white py-2 px-4 rounded hover:bg-[#D56A42] duration-300'
						>
							{t("O'zgarishlarni saqlash")}
						</button>
					</form>
				</div>
			</div>

			<div className='border mx-auto p-6 mb-[50px] rounded-lg shadow-lg dark:shadow-[0_0_20px_rgba(255,255,255,0.1)]'>
				<div className='flex justify-between items-center'>
					<h2 className='font-bold text-[25px]'>{t('Filiallar')}</h2>
					{centerData && <AddBranchPopover centerData={centerData} />}
				</div>

				<div className='mt-[25px] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
					{filials?.map(({ id, name, address, phone, image }) => (
						<div key={id} className='border p-[10px] rounded-[8px] shadow-lg dark:shadow-[0_0_20px_rgba(255,255,255,0.1)]'>
							<div className='flex justify-between items-start mb-[10px]'>
								<h2 className='font-bold'>{name}</h2>
								<div className='flex gap-[10px] items-center'>
									<button className='text-yellow-400 rounded-full bg-white/80 p-1.5 shadow hover:bg-white duration-300'>
										<Pencil size={16} />
									</button>
									<DeletePopover onConfirm={() => handleDelete(id)} />
								</div>
							</div>
							<div className='mb-[10px]'>
								<p className='text-gray-500'>{address}</p>
								<p className='text-gray-500'>{phone}</p>
							</div>
							<img src={`${API}/image/${image}`} alt={name} className='w-full rounded-[8px]' />
						</div>
					))}
				</div>
			</div>
		</section>
	)
}

export default EditCenter
