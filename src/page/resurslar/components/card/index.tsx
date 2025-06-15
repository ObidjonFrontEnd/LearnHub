import { Button } from '@/components/ui/button'
import { API } from '@/hooks/useApi'
import { useAuth } from '@/store/useAuth'
import { useNotification } from '@/store/useNotification'
import { useUserStore } from '@/store/userData'
import { useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { BookText, Download } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import DeletePopover from '../deleteModal'

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

type CardProps = {
	resurs: ResursType
}

const Card: React.FC<CardProps> = ({ resurs }) => {
	const { user } = useUserStore()
	const { t } = useTranslation()
	const { setNotification } = useNotification()
	const { accessToken } = useAuth()
	const queryClient = useQueryClient()

	const formatDate = (dateString: string): string => {
		const date = new Date(dateString)
		const day = String(date.getDate()).padStart(2, '0')
		const month = String(date.getMonth() + 1).padStart(2, '0')
		const year = date.getFullYear()
		return `${day}.${month}.${year}`
	}

	const handleDownload = () => {
		if (!resurs?.media) return
		const link = document.createElement('a')
		link.href = resurs.media
		link.download = resurs.name || 'resource'
		link.target = '_blank'
		link.rel = 'noopener noreferrer'
		document.body.appendChild(link)
		link.click()
		document.body.removeChild(link)
	}

	const handleDelete = async (id: string | number): Promise<void> => {
		try {
			const response = await axios.delete(`${API}/resources/${id}`, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			})

			if (response.status >= 200 && response.status < 300) {
				setNotification(response?.data?.message || 'Deleted successfully', 'success')
				queryClient.invalidateQueries({ queryKey: ['resources'] })
			}
		} catch (error: any) {
			const errorMessage =
				error?.response?.data?.message || error?.message || 'Something went wrong'
			setNotification(errorMessage, 'error')
			throw error
		}
	}

	return (
		<div className='border rounded-lg shadow-lg overflow-hidden flex flex-col bg-white dark:bg-gray-800 h-full min-h-[300px]'>
			<div className='w-full h-50 bg-gray-100 '>
				 <img
          src={`${resurs.image}`}
          alt={resurs.name}
          className="w-full h-50 object-cover"
        />
			</div>

			<div>
				<div className='px-[10px] py-[20px]'>
					<p className='text-xs text-gray-500 uppercase font-semibold flex items-center gap-[5px]'>
						<BookText size={16} /> {t('RESURS')}
					</p>
					<h3 className='text-lg font-semibold text-gray-800 dark:text-white'>
						{resurs?.name}
					</h3>
					<p className='text-sm text-gray-600 dark:text-white'>
						{t('by')} {resurs?.user?.firstName}
					</p>
					<p className='text-sm text-gray-600 dark:text-white'>
						{resurs?.description}
					</p>
					<p className='text-sm text-right text-gray-400'>
						{resurs?.createdAt ? formatDate(resurs.createdAt) : ''}
					</p>
				</div>

				<div className='flex justify-between items-center pt-4 bg-gray-400/15 px-[10px] py-[10px]'>
					<h2 className='text-sm'>{t('Oldindan ko‘rish')}</h2>
					<div className='flex gap-2'>
						{user?.id === resurs?.user?.id && (
							<DeletePopover onConfirm={() => handleDelete(resurs?.id)} />
						)}

						<Button
							variant='default'
							size='sm'
							onClick={handleDownload}
							className='bg-[#D56A42] border border-[#D56A42] hover:bg-transparent hover:text-[#D56A42] text-white flex items-center gap-1'
						>
							<Download size={16} /> {t('Yuklab olish')}
						</Button>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Card
