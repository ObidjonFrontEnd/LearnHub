import { API } from '@/hooks/useApi'
import { useAuth } from '@/store/useAuth'
import { useUserStore } from '@/store/userData'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { ChevronDown, LogOut, Pencil } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

export default function ProfileMenu() {
	const [isOpenProfileMenu, setOpenProfileMenu] = useState<boolean>(false)
	const { user, setUser } = useUserStore()
	const { clearTokens, accessToken } = useAuth()
	const { t } = useTranslation()

	const menuRef = useRef<HTMLDivElement>(null)

	const getUserData = async (accessToken: string | null) => {
		if (!accessToken) return null

		const response = await axios.get(`${API}/users/mydata`, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		})

		if (response.status === 200) {
			setUser(response.data.data)
		}
		return response.data
	}

	useQuery({
		queryKey: ['user'],
		queryFn: () => getUserData(accessToken),
		enabled: !!accessToken,
	})

	const logOut = () => {
		clearTokens()
	}

	const userImage =
		user?.image === 'default.jpg' ? user?.image : `${API}/image/${user?.image}`

	// Закрытие меню при клике вне
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
				setOpenProfileMenu(false)
			}
		}
		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [])

	return (
		<div ref={menuRef} className='relative inline-block text-left'>
			<button
				onClick={() => setOpenProfileMenu(!isOpenProfileMenu)}
				className='flex items-center gap-2 group px-4 py-2 rounded-full cursor-pointer transition'
			>
				<div className='w-8 h-8 rounded-full bg-gray-200 border border-purple-500 flex items-center justify-center overflow-hidden '>
					<img src={userImage} alt='user foto' className='h-full w-full' />
				</div>
				<span className='font-medium text-sm dark:text-white rounded-full text-gray-800'>
					{user?.firstName} <span className='hidden sm:inline-block'>{user?.lastName}</span>
				</span>
				<ChevronDown
					className={`${isOpenProfileMenu ? 'rotate-[180deg]' : ''} duration-[0.3s]`}
					size={16}
				/>
			</button>

			{isOpenProfileMenu && (
				<div className='absolute right-0 mt-2 w-64 dark:bg-gray-800 bg-white border rounded-xl shadow-lg z-10 p-4'>
					<div className='flex items-center gap-3'>
						<div className='w-8 h-8 rounded-full bg-gray-200 border border-purple-500 flex items-center justify-center overflow-hidden'>
							<img src={userImage} alt='user foto' className='w-full h-full' />
						</div>
						<div>
							<p className='font-semibold text-sm text-gray-900 dark:text-white'>
								{user?.firstName} <span className=''>{user?.lastName}</span>
							</p>
							<p className='text-xs text-gray-500'>{user?.email}</p>
						</div>
					</div>

					<div className='mt-4'>
						<Link
							to={'profile'}
							className='flex items-center text-purple-700 text-sm gap-2 hover:underline'
						>
							<Pencil size={16} /> {t('Profilni tahrirlash')}
						</Link>
					</div>

					<div className='mt-3 border-t pt-3'>
						<button
							onClick={logOut}
							className='flex items-center text-red-500 text-sm gap-2 hover:underline'
						>
							<LogOut size={16} /> {t('Chiqish')}
						</button>
					</div>
				</div>
			)}
		</div>
	)
}
