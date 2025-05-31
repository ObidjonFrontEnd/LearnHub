import { ArrowLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import ProfileData from './components/ProfileData'


const Profile = () => {
	const { t } = useTranslation()

	return (
		<div className='mt-[150px] px-[15px]'>
			<div className='w-full md:w-[70%] mx-auto mb-[20px]'>
				<Link
					to={'/'}
					className='flex gap-[10px] items-center text-[#D56A42] font-bold text-[20px]'
				>
					{' '}
					<ArrowLeft />
					{t('Bosh sahifaga qaytish')}
				</Link>
				
			</div>
			<ProfileData />
	
		</div>
	)
}

export default Profile
