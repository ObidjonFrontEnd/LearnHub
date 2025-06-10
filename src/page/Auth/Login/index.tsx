

import { useNotification } from '@/store/useNotification'
import { useAuth } from '@/store/useAuth'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { API } from '@/hooks/useApi'

const Login = () => {
	const { t } = useTranslation()
	const [email, setemail] = useState<string>('')
	const [password, setpassword] = useState<string>('')
	const navigate = useNavigate()

	const { setNotification } = useNotification()
	const { setTokens } = useAuth()

	type LoginResponse = {
		message?: string
		accessToken?: string
		refreshToken?: string
	}

	const loginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()


		
		const response = await fetch(
			`${API}/users/login`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					email,
					password
				}),
			}
		)


		
		const data: LoginResponse = await response.json()

		


		if (response.ok) {

			if (data.accessToken && data.refreshToken) {
				setTokens(data.accessToken, data.refreshToken)
				setNotification(data.message || 'Успешный вход', 'success')
			}
			setTimeout(() => {
				navigate('/')
			}, 1500)
		} else {
			setNotification(data?.message || 'Ошибка входа', 'error')
		}
 	
		
	}

	return (
		<section className='h-screen w-full flex items-center justify-center px-[10px]'>
			<form
				className='max-w-[500px] min-h-[500px] flex flex-col items-center mx-auto  px-[50px] py-[50px] rounded-[10px] shadow-lg w-full dark:text-white  dark:shadow-[0_0_20px_rgba(255,255,255,0.1)]'
				onSubmit={loginSubmit}
			>
				<h1 className='mb-[50px] font-bold text-[25px] text-[#D56A42]'>
					{t('Hisob kirish')}
				</h1>
			

				<input
					type='text'
					placeholder='Email'
					value={email}
					onChange={e => {
						setemail(e.target.value)
					}}
					className='px-[10px] w-full py-[5px] border-[2px] border-gray-400 rounded-[4px] outline-none font-semibold focus:text-[#D56A42] mb-[25px]'
				/>

				<input
					type='password'
					placeholder='Password'
					value={password}
					onChange={e => {
						setpassword(e.target.value)
					}}
					className='px-[10px] w-full py-[5px] border-[2px] border-gray-400 rounded-[4px] outline-none font-semibold focus:text-[#D56A42] mb-[25px] '
				/>

		

		


				<button className='relative overflow-hidden px-6 py-[10px] rounded-[10px] text-white bg-[#D56A42] border border-[#D56A42] font-semibold  group transition-colors duration-300 cursor-pointer w-full'>
					<span className='relative z-10 transition-colors duration-300 group-hover:text-[#D56A42]'>
						{t('Login')}
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
			</form>
		</section>
	)
}

export default Login
