import { useUserStore } from '@/store/userData'
import CardQueues from './components/card'
import { useTranslation } from 'react-i18next'

const Queues = () => {
	const { user } = useUserStore()
	const { t } = useTranslation()
	const receptions = user?.receptions || []

	return (
		<section className='mt-[150px] w-full px-[15px]'>
			<div className='w-full flex justify-center'>
				<div className='w-full max-w-[1280px]'>
					{receptions.length === 0 ? (
						<div className='w-full h-[50vh] flex justify-center items-center'>
							<h2 className='text-center text-gray-500 text-xl'>
							{t("Sizda hali hech qanday uchrashuvlar yo'q")}
							</h2>
						</div>
					) : (
						<div className='grid gap-[10px] sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
							{receptions.map((data) => (
								<CardQueues key={data?.id} data={data} />
							))}
						</div>
					)}
				</div>
			</div>
		</section>
	)
}

export default Queues
