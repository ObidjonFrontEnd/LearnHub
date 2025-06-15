import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import Card from '../card'
import { API } from '@/hooks/useApi'
import { useCategoryStore } from '@/store/useCategoryStore'
import { useUserStore } from '@/store/userData'
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '@/components/ui/pagination'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'

export type ResursType = {
	id: string | number
	name: string
	description?: string
	image?: string
	media?: string
	createdAt?: string
	categoryId: number | string
	user?: {
		firstName?: string
		id: string | number
	}
}

export type ResourcesResponse = {
	data: ResursType[]
}

const LIMIT = 9

const GetResurses: React.FC = () => {
	const [page, setPage] = useState<number>(1)
	const { selectedId } = useCategoryStore()
	const { user } = useUserStore()
	const { t } = useTranslation()
	const [searchParams] = useSearchParams()
	const searchQuery = searchParams.get('search')?.toLowerCase() || ''

	const getResources = async (page: number): Promise<ResursType[]> => {
		const response = await axios.get<ResourcesResponse>(
			`${API}/resources?page=${page}&limit=${LIMIT}`
		)
		return response?.data?.data ?? []
	}

	const { data } = useQuery<ResursType[], Error>({
		queryKey: ['resources', page],
		queryFn: () => getResources(page),
	})

	const hasNextPage = (data?.length ?? 0) === LIMIT


	const filteredResources = (data ?? []).filter((item) => {
		if (selectedId === -2 && item.user?.id != user?.id) return false
		if (selectedId && selectedId !== -2 && item.categoryId != selectedId) return false
		if (searchQuery && !item.name.toLowerCase().includes(searchQuery)) return false
		return true
	})

	return (
		<div className='max-w-[1280px] mx-auto px-[15px]'>
			{filteredResources.length === 0 ? (
				<p className='text-center py-10 text-gray-500 text-lg'>
					{t("Ma'lumot mavjud emas")}
				</p>
			) : (
				<div className='gap-y-[25px] grid-rows-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[10px]'>
					{filteredResources.map((resurs) => (
						<Card key={resurs.id} resurs={resurs} />
					))}
				</div>
			)}

			{filteredResources.length > 0 && (
				<Pagination className='mt-8 flex justify-center'>
					<PaginationContent>
						<PaginationItem>
							<PaginationPrevious
								href='#'
								onClick={(e) => {
									e.preventDefault()
									setPage((prev) => Math.max(1, prev - 1))
								}}
							/>
						</PaginationItem>

						<PaginationItem>
							<PaginationLink isActive>{page}</PaginationLink>
						</PaginationItem>

						{hasNextPage && (
							<PaginationItem>
								<PaginationNext
									href='#'
									onClick={(e) => {
										e.preventDefault()
										setPage((prev) => prev + 1)
									}}
								/>
							</PaginationItem>
						)}
					</PaginationContent>
				</Pagination>
			)}
		</div>
	)
}

export default GetResurses
