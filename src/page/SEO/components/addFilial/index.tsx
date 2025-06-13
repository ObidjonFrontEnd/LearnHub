import { useImageUpload } from '@/components/I/uploadImage'
import { API } from '@/hooks/useApi'
import { useAuth } from '@/store/useAuth'
import { useNotification } from '@/store/useNotification'

import * as Popover from '@radix-ui/react-popover'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { Plus } from 'lucide-react'
import {
	useState,
	useEffect,
	useRef,
	type ChangeEvent,
	type FormEvent
} from 'react'
import { useTranslation } from 'react-i18next'

// Типы
type Region = {
	id: number
	name: string
}

type CenterData = {
	id: number
	name: string
	region?: {
		id: number
		name: string
	}
}

type AddBranchPopoverProps = {
	centerData: CenterData
}

export default function AddBranchPopover({ centerData }: AddBranchPopoverProps) {
	const closeRef = useRef<HTMLButtonElement>(null)
	const queryClient = useQueryClient()
	const { setNotification } = useNotification()
	const { t } = useTranslation()
	const [name, setName] = useState<string>('')
	const [customName, setCustomName] = useState<boolean>(false)
	const [region, setRegion] = useState<number | undefined>()
	const [phone, setPhone] = useState<string>('')
	const [address, setAddress] = useState<string>('')
	const [image, setImage] = useState<File | null>(null)
	const [isMobile, setIsMobile] = useState<boolean>(false)
	const { accessToken } = useAuth()

	const {
		uploadImage,
		loading: uploading,
		error: uploadError,
	} = useImageUpload()

	useEffect(() => {
		const handleResize = () => setIsMobile(window.innerWidth <= 768)
		handleResize()
		window.addEventListener('resize', handleResize)
		return () => window.removeEventListener('resize', handleResize)
	}, [])

	const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			setImage(e.target.files[0])
		}
	}

	const handleImageUpload = async (): Promise<string> => {
		if (!image) return ''
		const result = await uploadImage(image)
		return result?.data || ''
	}

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault()

		const uploadedImagePath = await handleImageUpload()

		const payload = {
			name: name || `${centerData?.name} - ${centerData?.region?.name}`,
			phone,
			regionId: region,
			address,
			image: uploadedImagePath,
			centerId: centerData?.id,
		}

		const res = await axios.post(`${API}/filials`, payload, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		})

		if (res.status >= 200 && res.status < 400) {
			setNotification(t('Fillial mufoqiatli yaratildi'), 'success')
			queryClient.invalidateQueries({ queryKey: ['filials'] })
			if (closeRef.current) closeRef.current.click()
		}
	}

	const getRegions = async (): Promise<Region[]> => {
		const response = await axios.get(`${API}/regions/search`)
		return response?.data?.data
	}

	const { data: regionsData } = useQuery<Region[]>({
		queryKey: ['getRegion'],
		queryFn: getRegions,
	})

	return (
		<Popover.Root>
			<Popover.Trigger asChild>
				<button className='flex items-center gap-2 px-4 py-2 bg-[#D56A42] text-white rounded duration-200'>
					<Plus size={16} />
					{t("Yangi filial qo'shish")}
				</button>
			</Popover.Trigger>

			<Popover.Portal>
				<Popover.Content
					onClick={e => e.stopPropagation()}
					side={isMobile ? 'top' : 'left'}
					align={isMobile ? 'center' : 'start'}
					sideOffset={8}
					className='z-50 w-[90vw] max-w-xl rounded-lg mr-[10px] border dark:shadow-[0_0_20px_rgba(255,255,255,0.1)] dark:bg-gray-800 bg-white p-6 
          				max-h-[90vh] overflow-y-auto shadow-lg mb-[15px]'
				>
					<form onSubmit={handleSubmit} className='space-y-6'>
						<h2 className='text-xl font-semibold'>{t('Yangi filial qo‘shish')}</h2>

						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							<div>
								<label className='block text-sm font-medium mb-1'>{t('Filial nomi')}</label>
								<input
									type='text'
									value={
										customName
											? name
											: `${centerData?.name} - ${centerData?.region?.name}`
									}
									onChange={e => setName(e.target.value)}
									disabled={!customName}
									className='w-full border rounded-md p-2 text-sm outline-none shadow-lg'
								/>
								<div className='mt-2 flex items-center gap-2'>
									<input
										id='customName'
										type='checkbox'
										checked={customName}
										onChange={() => setCustomName(!customName)}
									/>
									<label htmlFor='customName' className='text-sm text-gray-600'>
										{t('Filial nomini o‘zim kiritaman')}
									</label>
								</div>
							</div>

							<div>
								<label className='block text-sm font-medium mb-1'>{t('Telefon raqami')}</label>
								<input
									type='tel'
									value={phone}
									onChange={e => setPhone(e.target.value)}
									placeholder='90 123 45 67'
									className='w-full border rounded-md p-2 text-sm shadow-lg outline-none'
								/>
							</div>
						</div>

						<div>
							<label className='block text-sm font-medium mb-1'>{t('Hudud')}</label>
							<select
								defaultValue=''
								onChange={e => setRegion(Number(e.target.value))}
								className='w-full border rounded-md p-2 text-sm shadow-lg outline-none'
							>
								<option value='' disabled>
									{t('Shaxarni tanlang')}
								</option>
								{regionsData?.map(region => (
									<option key={region.id} value={region.id}>
										{region.name}
									</option>
								))}
							</select>
						</div>

						<div>
							<label className='block text-sm font-medium mb-1'>{t('Manzil')}</label>
							<input
								value={address}
								onChange={e => setAddress(e.target.value)}
								className='w-full border rounded-md p-2 text-sm outline-none shadow-lg'
							/>
						</div>

						<div>
							<label className='block text-sm font-medium mb-1'>{t('Filial rasmi')}</label>
							<input
								type='file'
								accept='image/*'
								onChange={handleImageChange}
								className='w-full border rounded-md p-2 text-sm'
							/>
							{uploading && (
								<p className='text-sm text-blue-600'>{t('Yuklanmoqda...')}</p>
							)}
							{uploadError && (
								<p className='text-sm text-red-600'>{uploadError}</p>
							)}
						</div>

						<div className='flex justify-end gap-2 pt-2'>
							<Popover.Close
								ref={closeRef}
								className='px-4 py-2 border rounded-md text-sm text-gray-700 hover:bg-gray-100'
							>
								{t('Bekor qilish')}
							</Popover.Close>
							<button
								type='submit'
								className='px-4 py-2 bg-[#D56A42] text-white text-sm rounded '
							>
								{t('Filial yaratish')}
							</button>
						</div>
					</form>

					<Popover.Arrow className='fill-white' />
				</Popover.Content>
			</Popover.Portal>
		</Popover.Root>
	)
}
