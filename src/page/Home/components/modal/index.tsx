import { useSearchModal } from '@/store/searchModal'
import { useFilterStore } from '@/store/filterStore'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

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

	const { selectedMajors, selectedRegions, setSelectedMajors, setSelectedRegions } = useFilterStore()
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
														checked={selectedMajors.includes(name)}
														onChange={e => {
															const { checked, value } = e.target
															setSelectedMajors(
																checked
																	? [...selectedMajors, value]
																	: selectedMajors.filter(item => item !== value)
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
													checked={selectedRegions.includes(name)}
													onChange={e => {
														const { checked, value } = e.target
														setSelectedRegions(
															checked
																? [...selectedRegions, value]
																: selectedRegions.filter(item => item !== value)
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
									type="button"
									className='relative overflow-hidden px-6 py-[10px] rounded-xl text-white bg-[#D56A42] border border-[#D56A42] font-semibold  group transition-colors duration-300 cursor-pointer hidden md:block'
									onClick={() => close()}
								>
									<span className='relative z-10 transition-colors duration-300 group-hover:text-[#D56A42]'>
										OK
									</span>

									<span className='absolute inset-0 w-full h-full translate-y-[100%] group-hover:translate-y-[0] transition-transform duration-700 ease-out z-0 pointer-events-none'>
										<svg
											className='absolute inset-0 w-[200%] h-full'
											viewBox='0 0 1200 100'
											preserveAspectRatio='none'
										>
											<path
												d='M0,10 C150,40 350,0 500,20 C650,40 850,0 1200,10 L1200,100 L0,100 Z'
												fill='#ffffff'
												style={{
													opacity: 0.6,
													animation: 'wave1 12s linear infinite',
												}}
											/>
											<path
												d='M0,20 C250,0 450,40 700,10 C950,40 1050,20 1200,20 L1200,100 L0,100 Z'
												fill='#ffffff'
												style={{
													opacity: 0.4,
													animation: 'wave2 10s linear infinite',
												}}
											/>
											<path
												d='M0,40 C350,10 450,40 650,30 C850,20 950,50 1200,40 L1200,100 L0,100 Z'
												fill='#ffffff'
												style={{
													opacity: 0.8,
													animation: 'wave3 8s linear infinite',
												}}
											/>
										</svg>
									</span>
								</button>
								

								<button
									className='relative overflow-hidden px-6 py-[10px] rounded-xl text-[#D56A42] border border-[#D56A42] font-semibold bg-transparent group transition-colors duration-300 cursor-pointer hidden md:block'
									onClick={e => {
										e.preventDefault()
										close()
									}}
								>
									<span className='relative z-10 transition-colors duration-300 group-hover:text-white'>
										{t('Bekor qilish')}
									</span>

									<span className='absolute inset-0 w-full h-full translate-y-[100%] group-hover:translate-y-[0] transition-transform duration-700 ease-out z-0 pointer-events-none'>
										<svg
											className='absolute inset-0 w-[200%] h-full'
											viewBox='0 0 1200 100'
											preserveAspectRatio='none'
										>
											<path
												d='M0,10 C150,40 350,0 500,20 C650,40 850,0 1200,10 L1200,100 L0,100 Z'
												fill='#D56A42'
												style={{
													opacity: 0.6,
													animation: 'wave1 12s linear infinite',
												}}
											/>
											<path
												d='M0,20 C250,0 450,40 700,10 C950,40 1050,20 1200,20 L1200,100 L0,100 Z'
												fill='#D56A42'
												style={{
													opacity: 0.4,
													animation: 'wave2 10s linear infinite',
												}}
											/>
											<path
												d='M0,40 C350,10 450,40 650,30 C850,20 950,50 1200,40 L1200,100 L0,100 Z'
												fill='#D56A42'
												style={{
													opacity: 0.8,
													animation: 'wave3 8s linear infinite',
												}}
											/>
										</svg>
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
