import * as Popover from '@radix-ui/react-popover'
import { Pencil } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { useImageUpload } from '@/components/I/uploadImage'
import { API } from '@/hooks/useApi'
import axios from 'axios'
import { useQueryClient } from '@tanstack/react-query'
import { useNotification } from '@/store/useNotification'
import { useAuth } from '@/store/useAuth'

type EditBranchPopoverProps = {
	initialData: {
		id: number
		name: string
		address: string
		phone: string
		image: string
		region?: string
		center_id?: number
	}
}

export default function EditBranchPopover({
	initialData,
}: EditBranchPopoverProps) {
	const { t } = useTranslation()
	const { accessToken } = useAuth()
	const { setNotification } = useNotification()
	const queryClient = useQueryClient()

	const [name, setName] = useState(initialData.name)
	const [phone, setPhone] = useState(initialData.phone)
	const [address, setAddress] = useState(initialData.address)
	const [region, setRegion] = useState(initialData.region || '')
	const [image, setImage] = useState(initialData.image)
	const [isCustomName, setIsCustomName] = useState(false)

	const { uploadImage, loading, error } = useImageUpload()

	const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return

		try {
			const data = await uploadImage(file)
			setImage(data?.data)
		} catch (err) {
			console.error('Image upload failed:', err)
		}
	}

	const handleSubmit = async (e?: React.FormEvent) => {
		e?.preventDefault()
		try {
			const updatedData = {
				name,
				phone,
				address,
				image,
				region,
			}

			await axios.patch(
				`https://findcourse.net.uz/api/filials/${initialData.id}`,
				updatedData,
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				}
			)

			setNotification(t('Filial muvaffaqiyatli yangilandi'), 'success')

			if (initialData.center_id) {
				queryClient.invalidateQueries({
					queryKey: ['filials', initialData.center_id],
				})
			}
		} catch (err: any) {
			setNotification(err?.response?.data?.message || t('Xatolik yuz berdi'),"error")
		}
	}

	return (
		<Popover.Root>
			<Popover.Trigger asChild>
				<button className='text-yellow-400 rounded-full bg-white/80 p-1.5 shadow hover:bg-white duration-300'>
					<Pencil size={16} />
				</button>
			</Popover.Trigger>
			<Popover.Portal>
				<Popover.Content
					side='bottom'
					align='end'
					className='z-50 w-[400px] rounded-xl border bg-white p-6 shadow-lg space-y-4'
				>
					<h2 className='text-lg font-semibold'>{t('Filialni tahrirlash')}</h2>

					<div className='space-y-2'>
						<label className='block text-sm font-medium'>
							{t('Filial nomi')}
						</label>
						<input
							type='text'
							value={name}
							onChange={e => setName(e.target.value)}
							disabled={!isCustomName}
							className={`w-full border rounded px-3 py-2 ${
								!isCustomName ? 'bg-gray-100 cursor-not-allowed' : ''
							}`}
						/>
						<div className='flex items-center gap-2'>
							<input
								type='checkbox'
								checked={isCustomName}
								onChange={e => setIsCustomName(e.target.checked)}
							/>
							<span className='text-sm text-gray-600'>
								{t("Filial nomini o'zim kiritaman")}
							</span>
						</div>

						<label className='block text-sm font-medium'>
							{t('Telefon raqami')}
						</label>
						<input
							type='text'
							value={phone}
							onChange={e => setPhone(e.target.value)}
							className='w-full border rounded px-3 py-2'
						/>

						<label className='block text-sm font-medium'>{t('Hudud')}</label>
						<input
							type='text'
							value={region}
							onChange={e => setRegion(e.target.value)}
							className='w-full border rounded px-3 py-2'
						/>

						<label className='block text-sm font-medium'>{t('Manzil')}</label>
						<input
							type='text'
							value={address}
							onChange={e => setAddress(e.target.value)}
							className='w-full border rounded px-3 py-2'
						/>

						<div>
							<label className='block text-sm font-medium mb-1'>
								{t('Filial rasmi')}
							</label>
							<div className='flex items-center gap-3'>
								{image && (
									<img
										src={`${API}/image/${image}`}
										alt='Preview'
										className='w-12 h-12 rounded object-cover'
									/>
								)}
								<label className='border px-3 py-1 rounded cursor-pointer relative'>
									{loading ? t('Yuklanmoqda...') : t("Rasmni o'zgartirish")}
									<input
										type='file'
										className='hidden'
										onChange={handleImageChange}
									/>
								</label>
							</div>
							{error && <p className='text-sm text-red-500 mt-1'>{error}</p>}
						</div>
					</div>

					<div className='flex justify-end gap-3'>
						<Popover.Close className='border px-4 py-1.5 rounded'>
							{t('Bekor qilish')}
						</Popover.Close>
						<button
							onClick={handleSubmit}
							className='bg-purple-700 text-white px-4 py-1.5 rounded hover:bg-purple-800 transition'
							disabled={loading}
						>
							{t('Filialni yangilash')}
						</button>
					</div>

					<Popover.Arrow className='fill-white' />
				</Popover.Content>
			</Popover.Portal>
		</Popover.Root>
	)
}
