import { MagicCard } from '@/components/magicui/magic-card'
import { useAuth } from '@/store/useAuth'
import { useNotification } from '@/store/useNotification'
import { useUserStore } from '@/store/userData'
import axios from 'axios'
import { ArrowLeft, Save } from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'

const ProfileEdite = () => {
	const { t } = useTranslation()
	const { user, setUser } = useUserStore()
	const { accessToken } = useAuth()
	const [firstName, setFirstName] = useState<string | undefined>('')
	const [lastName, setLastName] = useState<string | undefined>('')
	const [phone, setPhone] = useState<string | undefined>('')
	const { setNotification } = useNotification()
	const navigate = useNavigate()
	useEffect(() => {
		setFirstName(user?.firstName)
		setLastName(user?.lastName)
		setPhone(user?.phone)
	}, [user])

	const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return
		const formData = new FormData()
		formData.append('image', file)

		const response = await axios.post(
			'https://findcourse.net.uz/api/upload',
			formData,
			{
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
				validateStatus: () => true,
			}
		)

		if (response.status === 201) {
			const responseImage = await axios.patch(
				`https://findcourse.net.uz/api/users/${user?.id}`,
				{
					image: response.data.data,
				},
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
					validateStatus: () => true,
				}
			)
			if (responseImage.status >= 200 && responseImage.status < 300) {
				setUser(responseImage?.data?.data)
				setNotification(t('Malumotlar rasim saqlandi'), 'success')
			} else {
				setNotification(response?.data?.message, 'error')
			}
		} else {
			setNotification(response?.data?.message, 'error')
		}
	}

	const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		const response = await axios.patch(
			`https://findcourse.net.uz/api/users/${user?.id}`,
			{
				firstName,
				lastName,
				phone,
			},
			{
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
				validateStatus: () => true,
			}
		)
		if (response.status >= 200 && response.status < 300) {
			setUser(response?.data?.data)
			setNotification(t('Malumotlar mufoqiatli saqlandi'), 'success')
			navigate('/profile')
		} else {
			setNotification(response?.data?.message, 'error')
		}
	}

	return (
		<div className='w-full h-full  mt-[150px] px-[15px]'>
			<div className='w-full md:w-[70%] mx-auto mb-[20px]'>
				<Link
					to={'/'}
					className='flex gap-[10px] items-center text-[#D56A42] font-bold text-[20px]'
				>
					{' '}
					<ArrowLeft />
					{t('Bosh sahifaga qaytish')}
				</Link>
			</div>
			<MagicCard
				gradientOpacity={0}
				className='md:w-[60%] bg-amber-300   mx-auto w-full min-h-[450px] shadow-lg rounded-[8px] p-[20px]'
			>
				<div className='w-full h-full '>
					<div className='flex w-full flex-col md:flex-row md:justify-between'>
						<h1 className='font-bold text-center md:text-start text-[36px]'>
							{t('Mening profilim')}
						</h1>
					</div>

					<div className='flex py-[25px] flex-col justify-between gap-[50px] md:flex-row mt-[25px]'>
						<div className='flex   flex-col'>
							<div className='img h-[110px] border-[1px] border-gray-400 p-[5px] rounded-full overflow-hidden mx-auto w-[110px]'>
								<img
									src={`${
										user?.image === 'default.jpg'
											? user?.image
											: `https://findcourse.net.uz/api/image/${user?.image}`
									}`}
									alt='user foto'
									className='w-full h-full rounded-full'
								/>
							</div>
							<label className='block text-center cursor-pointer text-[#D56A42]'>
								<span className='text-[12px]'>{t("Rasmni o'zgartirish")}</span>
								<input
									type='file'
									accept='image/*'
									className='hidden'
									onChange={handleChange}
								/>
							</label>
						</div>
						<form
							onSubmit={onSubmit}
							className='w-[80%] m-auto text-center md:text-start'
						>
							<div className='flex w-full flex-col md:flex-row mb-[20px] gap-[20px] justify-between'>
								<div className=' md:w-[50%]'>
									<h2 className='font-bold'>{t('Ism')}</h2>
									<input
										type='text'
										value={firstName}
										onChange={e => {
											setFirstName(e.target.value)
										}}
										className='w-full outline-none px-[10px] py-[5px] border-[1px] border-gray-200 rounded-[6px]'
									/>
								</div>
								<div className='md:w-[50%]'>
									<h2 className='font-bold'>{t('Familiya')}</h2>
									<input
										type='text'
										onChange={e => {
											setLastName(e.target.value)
										}}
										value={lastName}
										className='w-full outline-none px-[10px] py-[5px] border-[1px] border-gray-200 rounded-[6px]'
									/>
								</div>
							</div>

							<div className='flex w-full gap-[20px] flex-col md:flex-row mb-[20px]  justify-between'>
								<div className='md:w-[50%]'>
									<h2 className='font-bold'>{t('Elektron pochta')}</h2>
									<h3>{user?.email}</h3>
								</div>
								<div className='md:w-[50%]'>
									<h2 className='font-bold'>{t('Telefon')}</h2>
									<input
										type='text'
										value={phone}
										onChange={e => {
											setPhone(e.target.value)
										}}
										className='w-full outline-none px-[10px] py-[5px] border-[1px] border-gray-200 rounded-[6px]'
									/>
								</div>
							</div>

							<div className=''>
								<h2 className='font-bold'>{t('Rol')}</h2>
								<h3>{user?.role}</h3>
							</div>
							<div className='mt-[20px] flex gap-[20px]'>
								<button className='text-green-500 px-[15px] py-[8px] border-[1px] border-green-500 rounded-[10px] flex items-center justify-center gap-[20px]'>
									<Save />
									{t("O'zgarishni saqlash")}
								</button>

								<Link
									to={'/profile'}
									className='px-[15px] py-[8px] text-yellow-400 border-[1px] border-yellow-400 rounded-[10px]'
								>
									{t('Orqaga qaytish')}
								</Link>
							</div>
						</form>
					</div>
				</div>
				<div className='h-[100px] w-full mx-auto justify-center md:justify-start  flex items-end'></div>
			</MagicCard>
		</div>
	)
}

export default ProfileEdite
