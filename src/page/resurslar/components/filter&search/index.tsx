import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { cn } from '@/lib/utils'
import { useCategoryStore } from '@/store/useCategoryStore'
import { API } from '@/hooks/useApi'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { Input } from '@/components/ui/input'

type Category = {
	id: number
	name: string
	image?: string
}

const fetchCategories = async (): Promise<Category[]> => {
	const res = await axios.get(`${API}/categories`)
	return res?.data?.data || []
}

const Filter = () => {
	const { selectedId, setSelectedId, clearSelectedId } = useCategoryStore()
	const { data: categories = [] } = useQuery({
		queryKey: ['categories'],
		queryFn: fetchCategories,
	})
	const { t } = useTranslation()
	const [searchParams, setSearchParams] = useSearchParams()

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value
		searchParams.set('search', value)
		setSearchParams(searchParams)
	}

	return (
		<div className='space-y-4 w-full md:w-[70%] mx-auto mb-[50px]'>
			<Input
				type='text'
				placeholder={t('SEARCH') || 'Qidiruv...'}
				defaultValue={searchParams.get('search') || ''}
				onChange={handleSearchChange}
				className='w-full max-w-md mx-auto dark:text-white shadow-lg mb-[20px]'
			/>

			<div
				className={cn(
					'grid gap-4',
					categories.length === 0
						? 'grid-cols-2'
						: 'grid-cols-[repeat(auto-fit,minmax(110px,1fr))]'
				)}
			>
				<button
					onClick={clearSelectedId}
					className={cn(
						'w-full max-w-[150px] aspect-square flex flex-col items-center justify-center bg-muted rounded-xl border mx-auto transition-all dark:border-black',
						selectedId === '' &&
							'dark:bg-[#D56A42]/75 dark:text-white border-blue-500 bg-blue-50 shadow'
					)}
				>
					<div className='text-2xl'>🔍</div>
					<span className='text-sm font-medium mt-1 text-center'>
						{t('ALL_RESOURCES')}
					</span>
				</button>

				<button
					onClick={() => setSelectedId(-2)}
					className={cn(
						'w-full max-w-[150px] aspect-square flex flex-col items-center justify-center bg-muted rounded-xl border mx-auto transition-all dark:border-black',
						selectedId == -2 &&
							'dark:bg-[#D56A42]/75 dark:text-white border-blue-500 bg-blue-50 shadow'
					)}
				>
					<div className='text-2xl'>⭐</div>
					<span className='text-sm font-medium mt-1 text-center'>
						{t('MY_RESOURCES')}
					</span>
				</button>

				{categories.map(cat => (
					<button
						key={cat.id}
						onClick={() => setSelectedId(cat?.id)}
						className={cn(
							'w-full max-w-[150px] aspect-square flex flex-col items-center justify-center bg-muted rounded-xl border mx-auto transition-all',
							selectedId === cat?.id &&
								'dark:bg-[#D56A42]/75 dark:border-black dark:text-white border-blue-500 bg-blue-50 shadow'
						)}
					>
						<img
							src={cat?.image || ''}
							alt={cat?.name}
							className='w-7 h-7 object-contain'
						/>
						<span className='text-sm font-medium mt-1 text-center px-1'>
							{cat?.name}
						</span>
					</button>
				))}
			</div>
		</div>
	)
}

export default Filter
