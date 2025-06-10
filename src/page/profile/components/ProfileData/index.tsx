import { MagicCard } from '@/components/magicui/magic-card'
import { useUserStore } from '@/store/userData'
import { Trash2, UserRoundPen } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import DeleteAccountModal from '../deleteModal'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { API } from '@/hooks/useApi'

const ProfileData = () => {
	const { t } = useTranslation()
	const { user } = useUserStore()
	const [showModal, setShowModal] = useState<boolean>(false);
	const closeModal = ()=>{
		setShowModal(false)
	}
	
	

	return (
		<div className='w-full h-full flex justify-center items-center mb-[50px]'>
			<MagicCard
				gradientOpacity={0}
				className='md:w-[60%] bg-amber-300   mx-auto w-full min-h-[450px] shadow-lg rounded-[8px] p-[20px]'
			>
				<div className='w-full h-full relative'>
					<div className='flex w-full flex-col md:flex-row md:justify-between'>
						<h1 className='font-bold text-center md:text-start text-[36px]'>
							{t('Mening profilim')}
						</h1>
						<Link to="/profile/edite" className='relative overflow-hidden px-6 py-[10px] rounded-xl text-white bg-[#D56A42] border border-[#D56A42] font-semibold group transition-colors duration-300 cursor-pointer'>
							<span className='relative z-10 transition-colors duration-300 group-hover:text-[#D56A42] flex items-center gap-[10px]'>
								<UserRoundPen /> {t('Profilni tahrirlash')}
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
						</Link>
					</div>

					<div className='flex  border-b-gray-300 border-b-[1px] py-[25px] flex-col justify-between gap-[50px] md:flex-row mt-[25px]'>
						<div className='img h-[110px] border-[1px] border-gray-400 p-[5px] rounded-full overflow-hidden mx-auto w-[110px]'>
							<img
								src={`${
									user?.image === 'default.jpg'
										? user?.image
										: `${API}/image/${user?.image}`
								}`}
								alt='user foto'
								className='w-full h-full rounded-full'
							/>
						</div>
						<div className='w-[80%] m-auto text-center md:text-start'>
							<div className='flex w-full flex-col md:flex-row mb-[20px] justify-between'>
								<div className=' md:w-[50%]'>
									<h2 className='font-bold'>{t('Ism')}</h2>
									<h3>{user?.firstName}</h3>
								</div>
								<div className='md:w-[50%]'>
									<h2 className='font-bold'>{t('Familiya')}</h2>
									<h3>{user?.lastName}</h3>
								</div>
							</div>

							<div className='flex w-full flex-col md:flex-row mb-[20px]  justify-between'>
								<div className='md:w-[50%]'>
									<h2 className='font-bold'>{t('Elektron pochta')}</h2>
									<h3>{user?.email}</h3>
								</div>
								<div className='md:w-[50%]'>
									<h2 className='font-bold'>{t('Telefon')}</h2>
									<h3>{user?.phone}</h3>
								</div>
							</div>

							<div className=''>
								<h2 className='font-bold'>{t('Rol')}</h2>
								<h3>{user?.role}</h3>
							</div>
						</div>
					</div>
				</div>
				<div className='h-[100px] w-full mx-auto justify-center md:justify-start  flex items-end'>
					<button type='button' className=' uppercase flex items-center justify-center border-red-500 border-[1px] text-red-500  bg-white  rounded-[6px] font-bold px-[15px] gap-[10px] py-[8px]' onClick={()=>{setShowModal(true)}}>
						<Trash2 size={20} /> {t("Akkountni o'chirish")}
					</button>
				</div>
			</MagicCard>

			<DeleteAccountModal
				isOpen={showModal}
				onClose={closeModal}
			/>
		</div>
	)
}

export default ProfileData
