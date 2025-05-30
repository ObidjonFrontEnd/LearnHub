
import { useSearchModal } from '@/store/searchModal'

import { ChevronDown } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'


const Search = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const [search , setSearch ] = useState<string>("")
		const { t } = useTranslation()
		const { setOpenSearchMenu } = useSearchModal()

		useEffect(() => {
			if (search) {
				setSearchParams({ search });
			} else {
				setSearchParams({});
			}
		}, [search]);

	return (
		<div className='flex w-full px-[15px] md:px-[0] md:w-[60%] flex-col md:flex-row mx-auto gap-[10px]'>
			<input
				type='text'
				value={search}
				className='rounded-[50px] w-full md:w-[65%] lg:w-[75%] px-[25px] py-[5px] border-[2px] border-[#D56A42] text-[20px] dark:text-[#D56A42] outline-none' onChange={(e)=>{setSearch(e.target.value)}}
			/>

			<button className='relative overflow-hidden md:w-[35%] lg:w-[25%] px-[25px] py-[5px] rounded-xl text-white bg-[#D56A42] border border-[#D56A42] font-semibold  group transition-colors duration-300 cursor-pointer group' onClick={setOpenSearchMenu}>
				<span className='relative z-10 transition-colors duration-300 group-hover:text-[#D56A42] flex items-center gap-[5px] justify-center'>
					 {t("Kurslar va hudud")}
					<ChevronDown className='group-hover:rotate-[180deg] duration-[0.3s]' />
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

			
		</div>
	)
}

export default Search
