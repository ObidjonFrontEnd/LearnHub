import { API } from '@/hooks/useApi'
import { useAuth } from '@/store/useAuth'
import { useNotification } from '@/store/useNotification'
import axios from 'axios'
import { X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

type MajorItem = {
	id: number
	majorId: number
	centerId: number
	createdAt: string
	updatedAt: string
}

type Major = {
	id: number
	name: string
	image: string
	fieldId: number
	subjectId: number | null
	majoritems: MajorItem
}

type Region = {
	id: number
	name: string
}

type Filial = {
	id: number
	name: string
	address: string
	centerId: number
	phone: string
	image: string
	createdAt: string
	updatedAt: string
	regionId: number
	region: Region
}

type Metod = {
	close: () => void
	isModal: boolean
	filials: Filial[]
	mojors: Major[]
	id: number
}

const DarsgaYozilishModal = ({
	close,
	isModal,
	filials,
	mojors,
	id,
}: Metod) => {
	const { t } = useTranslation()
	const [isBackBlur, setBackBlur] = useState<boolean>(false)

	useEffect(() => {
		let timeout: ReturnType<typeof setTimeout> | null = null

		if (isModal) {
			timeout = setTimeout(() => {
				setBackBlur(true)
			}, 300)
		} else {
			setBackBlur(false)
			if (timeout) clearTimeout(timeout)
		}

		return () => {
			if (timeout) clearTimeout(timeout)
		}
	}, [isModal])

	const handleClose = () => {
		setBackBlur(false)

		setTimeout(() => {
			close()
		}, 300)
	}

	const [filialId, setFilialId] = useState<number>()
	const [majorId, setMajorId] = useState<number>()
	const [kun, setKun] = useState<string>('')
	const [soat, setsoat] = useState<string>('')
	const today = new Date().toISOString().split('T')[0]

	const { accessToken } = useAuth()
	const { setNotification } = useNotification()

	const hundelSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
	e.preventDefault()

	const formattedVisitDate = kun + soat

	try {
		const response = await axios.post(
			`${API}/reseption`,
			{ centerId: id, filialId, majorId, visitDate: formattedVisitDate },
			{
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			}
		)

		console.log(response.data.data.message)

		if (response.status >= 200 && response.status < 400) {
			setNotification(response.data.message, 'success')
		} else {
			setNotification(response.data.message, 'error')
		}
	} catch (error: any) {
		const errorMessage =
			error.response?.data?.message || 'Something went wrong'
		setNotification(errorMessage, 'error')
	}
}


	return (
		<div
			className={`${isModal ? '' : 'scale-0'} ${
				isBackBlur ? 'bg-black/25 ' : ''
			} duration-300 w-full fon z-50 h-screen absolute top-0 left-0 px-[15px] flex items-center justify-center`}
			onClick={handleClose}
		>
			<div
				onClick={e => e.stopPropagation()}
				className='bg-white w-[400px] pb-[20px] overflow-hidden  rounded-[25px] dark:bg-gray-800 dark:text-white  min-h-[500px] dark:shadow-[0_0_20px_rgba(255,255,255,0.1)] shadow-lg '
			>
				<div className='w-full px-[20px] relative py-[20px] text-white  bg-[#D56A42]'>
					<h2 className='text-[20px] font-bold'>{t('Darsga yozilish')}</h2>
					<p>{t("O'zingizga qulay sana va vaqtni tanlang")}</p>
					<div
						className='absolute top-[23px] right-[20px]'
						onClick={() => {
							handleClose()
						}}
					>
						<X />
					</div>
				</div>

				<form className='px-[20px] mt-[25px]' onSubmit={hundelSubmit}>
					<label className='flex flex-col gap-[10px]'>
						<span className='px-[10px] font-bold text-[18px]'>
							{t('Filialni tanlang')}
						</span>
						<select
							className='w-full rounded-[8px] shadow-lg dark:shadow-[0_0_20px_rgba(255,255,255,0.1)] px-[10px] py-[5px] border outline-none'
							onChange={e => setFilialId(Number(e.target.value))}
							defaultValue=''
						>
							<option value='' disabled>
								{t('Filialni tanlang')}
							</option>
							{filials?.map(({ address, id }) => {
								return (
									<option className='text-black' key={id} value={id}>
										{address}
									</option>
								)
							})}
						</select>
					</label>

					<label className='flex flex-col gap-[10px] mt-[25px]'>
						<span className='px-[10px] font-bold text-[18px]'>
							{t("Yo'nalishni tanlang")}
						</span>
						<select
							className='w-full rounded-[8px] shadow-lg dark:shadow-[0_0_20px_rgba(255,255,255,0.1)] px-[10px] py-[5px] border outline-none  '
							onChange={e => setMajorId(Number(e.target.value))}
							defaultValue=''
						>
							<option value='' disabled>
								{t("Yo'nalishni tanlang")}
							</option>
							{mojors?.map(({ id, name }) => {
								return (
									<option className='text-black' key={id} value={id}>
										{name}
									</option>
								)
							})}
						</select>
					</label>

					<div className='flex gap-[10px] mt-[25px] flex-col md:flex-row'>
						<label className='flex flex-col w-full gap-[10px]'>
							<span className='px-[10px] font-bold text-[18px]'>
								{t('Sanani tanlang')}
							</span>
							<input
								min={today}
								type='date'
								className='w-full px-[10px]  py-2 border rounded-md text-center outline-none focus:ring-2 focus:ring-[#D56A42] appearance-none shadow-lg dark:shadow-[0_0_20px_rgba(255,255,255,0.1)]'
								placeholder='ДД.ММ.ГГГГ'
								onChange={e => {
									setKun(e.target.value)
								}}
							/>
						</label>

						<label className='flex flex-col w-full gap-[10px]'>
							<span className='px-[10px] font-bold text-[18px]'>
								{t('Vaqtni tanlang')}
							</span>
							<select
								className='shadow-lg w-full rounded-[8px] border py-2 outline-none px-[10px] dark:shadow-[0_0_20px_rgba(255,255,255,0.1)]'
								onChange={e => {
									setsoat(e.target.value)
								}}
								defaultValue={''}
							>
								<option value='' disabled>
									{t('Vaqtni tanlang')}
								</option>
								<option value='T10:00' className='dark:text-black'>
									10
								</option>
								<option value='T12:00' className='dark:text-black'>
									12
								</option>
								<option value='T14:00' className='dark:text-black'>
									14
								</option>
								<option value='T16:00' className='dark:text-black'>
									16
								</option>
								<option value='T18:00' className='dark:text-black'>
									18
								</option>
							</select>
						</label>
					</div>

					<div className='flex justify-end gap-[10px] mt-[30px]'>
						<button
							type='button'
							className='border text-[#D56A42] border-[#D56A42] rounded-[6px] px-[10px] py-[5px] hover:bg-[#D56A42] duration-300 hover:text-white shadow-lg dark:shadow-[0_0_20px_rgba(255,255,255,0.1)]'
							onClick={close}
						>
							{t('Bekor qilish')}
						</button>
						<button className='text-white border border-[#D56A42] hover:text-[#D56A42]  hover:bg-white duration-300 bg-[#D56A42] rounded-[6px] px-[10px] py-[5px] shadow-lg dark:shadow-[0_0_20px_rgba(255,255,255,0.1)] dark:hover:bg-gray-800'>
							{t('Saqlash')}
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}

export default DarsgaYozilishModal
