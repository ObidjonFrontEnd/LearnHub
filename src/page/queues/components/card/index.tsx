import { API } from '@/hooks/useApi'
import DeletePopover from '@/page/center/components/deleteModal'
import { useAuth } from '@/store/useAuth'
import { useNotification } from '@/store/useNotification'
import { useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { Bookmark, BookMarked, CalendarCheck2, MapPin } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const CardQueues = (data: any) => {
	const { t } = useTranslation()
	const { setNotification } = useNotification()
	const { accessToken } = useAuth()
	const queryClient = useQueryClient()

	const formattedDate = new Date(data?.data?.visitDate).toLocaleDateString()
	const visitDate = new Date(data?.data?.visitDate)
	const formattedTime = visitDate.toISOString().slice(11, 16)

	const deleteReja = async (id: number) => {
		const response = await axios.delete(`${API}/reseption/${id}`, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		})
		if (response.status >= 200 && response.status < 400) {
			setNotification(t("muvofiaqatli o'chirildi"), 'success')
			queryClient.invalidateQueries({ queryKey: ['user'] })
		}
	}

	return (
		<div className='mx-auto rounded-[8px] overflow-hidden border shadow-lg dark:shadow-[0_0_20px_rgba(255,255,255,0.1)]'>
			<div className='img'>
				<img
					src={`${API}/image/${data?.data?.center?.image}`}
					alt=''
					className='w-full'
				/>
			</div>
			<div className='px-[15px] py-[20px] relative'>
				<h2 className='text-[20px] font-bold mb-[15px]'>
					{data?.data?.center?.name}
				</h2>
				<h2 className='flex gap-[5px]'>
					<span className='font-bold flex gap-[5px]'>
						<MapPin /> {t('Manzil')}:
					</span>{' '}
					{data?.data?.center?.address}{' '}
				</h2>
				<h2 className='flex gap-[5px]'>
					<span className='font-bold flex gap-[5px]'>
						<CalendarCheck2 /> {t('Tashrif sanasi')}:{' '}
					</span>{' '}
					{formattedDate + ' ' + formattedTime}
				</h2>
				<h2 className='flex gap-[5px] mt-[10px]'>
					<span className='font-bold flex gap-[5px]'>
						<BookMarked /> {t("Yo'nalish")}:{' '}
					</span>
					{data?.data?.major?.name}
				</h2>
				<h2 className='text flex gap-[5px] mt-[10px] text-[#D56A42]'>
					<Bookmark fill='#D56A42' />
					{'Kutish'}
				</h2>

				<div className=' absolute bottom-[20px] right-[15px] '>
					<DeletePopover onConfirm={() => deleteReja(data?.data?.id)} />
				</div>
			</div>
		</div>
	)
}

export default CardQueues
