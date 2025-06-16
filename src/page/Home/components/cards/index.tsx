import { MagicCard } from '@/components/magicui/magic-card'
import { API } from '@/hooks/useApi'
import { useLikes } from '@/hooks/useLike'
import { useFilterStore } from '@/store/filterStore'
import { useQuery } from '@tanstack/react-query'

import axios from 'axios'
import { lazy, Suspense } from 'react'
import { useSearchParams } from 'react-router-dom'

const Card = lazy(() => import('./card'))

type Field = {
	id: number
	name: string
	image: string
}

type MajorItem = {
	id: number
	majorId: number
	centerId: number
	createdAt: string
	updatedAt: string
}

export type Center = {
	id: number
	name: string
	phone: string
	regionId: number
	address: string
	seoId: number
	image: string
	createdAt: string
	updatedAt: string
	majoritems: MajorItem
}

type Major = {
	id: number
	name: string
	image: string
	fieldId: number
	subjectId: number | null
	field: Field
	subject: any
	centers: Center[]
}

const Cards = () => {
	const [searchParams] = useSearchParams()
	const search = searchParams.get('search') || ''

	const { selectedMajors, selectedRegions } = useFilterStore()
	const { isLiked, toggleLike } = useLikes()

	const getMajors = async (): Promise<Major[]> => {
		const response = await axios.get<{ data: Major[] }>(`${API}/major`)
		return response.data.data
	}

	const { data } = useQuery({
		queryKey: ['majors'],
		queryFn: getMajors,
	})

	const uniqueCentersMap = new Map<string, Center>()

	data?.forEach(major => {
		if (selectedMajors.length === 0 || selectedMajors.includes(major.name)) {
			major.centers.forEach(center => {
				if (!uniqueCentersMap.has(center.name)) {
					uniqueCentersMap.set(center.name, center)
				}
			})
		}
	})

	const uniqueCenters = Array.from(uniqueCentersMap.values()).sort((a, b) =>
		a.name.localeCompare(b.name)
	)

	const filteredCenters = uniqueCenters.filter(center => {
		const matchesSearch = center.name
			.toLowerCase()
			.includes(search.toLowerCase())

		if (selectedRegions.length === 0) return matchesSearch

		const regionData = data
			?.flatMap(major => major.centers.find(c => c.id === center.id))
			.filter(Boolean)

		return (
			matchesSearch &&
			regionData?.some(c =>
				selectedRegions.some(
					region =>
						c?.regionId.toString() === region ||
						data?.some(m =>
							m.centers.some(
								mc =>
									mc.id === c?.id &&
									selectedRegions.includes(mc.regionId.toString())
							)
						)
				)
			)
		)
	})

	return (
		<div className='mt-[100px] w-full px-[15px]'>
			<div className='w-full flex justify-center'>
				<div className='grid gap-[10px] w-full max-w-[1280px] sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 min-h-[300px]'>
					{filteredCenters.length > 0 ? (
						filteredCenters.map(center => (
							<Suspense
								key={center.id}
								fallback={
									<div className='w-full rounded-[10px] pt-0 shadow-lg animate-pulse'>
										<div className='w-full h-40 bg-gray-300 rounded' />
										<div className='px-[15px] py-[15px]'>
											<div className='h-6 bg-gray-300 rounded w-3/4 mb-2'></div>
											<div className='h-4 bg-gray-300 rounded w-full mb-1'></div>
											<div className='h-4 bg-gray-300 rounded w-1/2'></div>
										</div>
									</div>
								}
							>
								<MagicCard
									gradientOpacity={0}
									className='rounded-[10px] mx-auto shadow-lg overflow-hidden relative z-20 w-full p-[2px] pt-[2.5px]'
								>
									<Card
										center={center}
										isLiked={isLiked(center.id)}
										onToggleLike={() => toggleLike(center.id)}
									/>
								</MagicCard>
							</Suspense>
						))
					) : (
						<div className='col-span-full min-h-[500px] text-center text-gray-500 text-lg py-10'>
							Ma'lumot topilmadi
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

export default Cards
