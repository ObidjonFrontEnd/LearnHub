import { useSearchModal } from '@/store/searchModal'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AnimatePresence, motion } from 'framer-motion'

const Modal = () => {
	type Major = {
		id: number
		name: string
		image: string
		fieldId: number
		subjectId: number | null
	}

	type Field = {
		id: number
		name: string
		image: string
		majors: Major[]
	}

	type Center = {
		id: number
		name: string
		phone: string
		regionId: number
		address: string
		seoId: number
		image: string
		createdAt: string
	}

	type Region = {
		id: number
		name: string
		centers: Center[]
	}

	type ApiResponse = {
		data: Region[]
		total: number
	}

	const [selectedMajors, setSelectedMajors] = useState<string[]>([])
	const [selectedRegions, setSelectedRegions] = useState<string[]>([])
	const { isOpenSearchModal, setOpenSearchMenu } = useSearchModal()

	const fetchFields = async (): Promise<Field[]> => {
		const res = await axios.get<{ data: Field[] }>(
			'https://findcourse.net.uz/api/fields'
		)
		return res.data.data
	}

	const fetchRegions = async (): Promise<Region[]> => {
		const res = await axios.get<ApiResponse>(
			'https://findcourse.net.uz/api/regions/search'
		)
		return res.data.data
	}

	const { data } = useQuery({ queryKey: ['fields'], queryFn: fetchFields })
	const { data: regionsData } = useQuery({
		queryKey: ['regions'],
		queryFn: fetchRegions,
	})
	const { t } = useTranslation()

	const close = () => {
		setOpenSearchMenu()
	}

	return (
		<AnimatePresence>
			{isOpenSearchModal && (
				<motion.div
					onClick={e => {
						const target = e.target as HTMLElement
						if (target.classList.contains('modal-backdrop')) {
							close()
						}
					}}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.3 }}
					className='modal-backdrop fixed z-[50] top-0 left-0 w-full h-screen flex items-center justify-center px-[15px] bg-black/25'
				>
					<motion.div
						initial={{ scale: 0.95, y: -100, opacity: 0 }}
						animate={{ scale: 1, y: 0, opacity: 1 }}
						exit={{ scale: 0.95, y: -100, opacity: 0 }}
						transition={{ duration: 0.4, ease: 'easeOut' }}
						className='formClass md:w-[60%] dark:bg-gray-800 w-full rounded-[30px] h-[700px] px-[15px] py-[10px] bg-white md:px-[30px] overflow-y-auto shadow-lg dark:shadow-[0_0_20px_rgba(255,255,255,0.1)]'
					>
						<form action=''>
							<div className='flex flex-col md:flex-row md:justify-between'>
								<div className='md:w-[50%]'>
									<h1 className='font-bold text-[#D56A42] text-[25px]'>
										{t("Yo'nalishlarni tanlang")}
									</h1>
									<div className='px-[15px] flex flex-col gap-y-[10px] mt-[10px]'>
										{data?.map(({ majors }) =>
											majors?.map(({ id, name }) => (
												<label key={id} className='flex gap-[10px] text-[20px]'>
													<input
														type='checkbox'
														value={name}
														className='w-[20px]'
														onChange={e => {
															const { checked, value } = e.target
															setSelectedMajors(prev =>
																checked
																	? [...prev, value]
																	: prev.filter(item => item !== value)
															)
														}}
													/>
													<span>{name}</span>
												</label>
											))
										)}
									</div>
								</div>
								<div className='mt-[25px] md:w-[40%] md:mt-0'>
									<h1 className='font-bold text-[#D56A42] text-[25px]'>
										{t('Hududlarni tanlang')}
									</h1>
									<div className='px-[15px] flex flex-col gap-y-[10px] mt-[10px]'>
										{regionsData?.map(({ name, id }) => (
											<label key={id} className='flex gap-[10px] text-[20px]'>
												<input
													type='checkbox'
													value={name}
													className='w-[20px]'
													onChange={e => {
														const { checked, value } = e.target
														setSelectedRegions(prev =>
															checked
																? [...prev, value]
																: prev.filter(item => item !== value)
														)
													}}
												/>
												<span>{name}</span>
											</label>
										))}
									</div>
								</div>
							</div>

							<div className='mt-[50px] flex justify-between'>
								<button
									type='submit'
									className='relative overflow-hidden px-[25px] py-[5px] rounded-xl text-white bg-[#D56A42] border border-[#D56A42] font-semibold group transition-colors duration-300 cursor-pointer shadow-lg'
								>
									<span className='relative z-10 transition-colors duration-300 group-hover:text-[#D56A42] flex items-center gap-[5px] justify-center'>
										OK
									</span>
									<span className='absolute inset-0 w-full h-full translate-y-[100%] group-hover:translate-y-[0] transition-transform duration-700 ease-out z-0 pointer-events-none'>
										{/* waves */}
									</span>
								</button>

								<button
									className='relative overflow-hidden px-6 py-[10px] rounded-xl text-[#D56A42] border border-[#D56A42] font-semibold bg-transparent group transition-colors duration-300 cursor-pointer shadow-lg'
									onClick={e => {
										e.preventDefault()
										close()
									}}
								>
									<span className='relative z-10 transition-colors duration-300 group-hover:text-white'>
										{t('Bekor qilish')}
									</span>
									<span className='absolute inset-0 w-full h-full translate-y-[100%] group-hover:translate-y-[0] transition-transform duration-700 ease-out z-0 pointer-events-none'>
										{/* waves */}
									</span>
								</button>
							</div>
						</form>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	)
}

export default Modal
