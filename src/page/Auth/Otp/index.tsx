

import { useState} from 'react'
import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'
import { useEmailOtpStore } from '@/store/EmailForOtp'
import { useNotification } from '@/store/useNotification'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { useNavigate } from 'react-router-dom'
import { API } from '@/hooks/useApi'

const Otp = () => {
	const { t } = useTranslation()
	const [otp, setOtp] = useState<string>("")
	const { emailOtp } = useEmailOtpStore()
	const navigate = useNavigate()
	
	
	type RegisterResponse = {
		message: string
	}
		const { setNotification } = useNotification()
	

	const handleVerify = async () => {
		 const response = await fetch(`${API}/users/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email:emailOtp,
        otp,
      }),
    	})
			const data:RegisterResponse = await response.json()
			if(response.ok){
				setNotification(data?.message, 'success')
				setTimeout(() => {
				navigate('/login')
			}, 1500)
			}else{
				setNotification(data?.message, 'error')
			}
	}

	const handleResend = async() => {
		 const response = await fetch(`${API}/users/send-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email:emailOtp
      }),
    	})
			const data:RegisterResponse = await response.json()
			if(response.ok){
				setNotification(data?.message, 'success')
			}else{
				setNotification(data?.message, 'error')
			}
	}

	return (
		<div className="w-full h-screen flex justify-center items-center">
			<div className="flex flex-col items-center justify-center w-full max-w-md mx-auto p-6 bg-white dark:bg-black rounded-xl shadow-md  dark:text-white  dark:shadow-[0_0_20px_rgba(255,255,255,0.1)]">
			<h1 className="text-3xl font-bold text-center text-[#D56A42] mb-6">{t("Elektron pochtani tasdiqlang")}</h1>
			
			<h2 className='mb-[25px]'>{emailOtp}</h2>
			
		<div className="mb-[25px]">
			<InputOTP maxLength={5} onChange={setOtp}>
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} /> 
      </InputOTPGroup>
    </InputOTP>
		</div>
			
			<Button 
				className="w-full bg-[#D56A42] hover:bg-[#C25A32] text-white py-3 rounded-lg transition-colors mb-4"
				onClick={handleVerify}
			>
				Verify OTP
			</Button>
			
			<p className="text-gray-600 dark:text-gray-400">
				Didn't receive code? <button onClick={handleResend} className="text-[#D56A42] hover:underline font-medium">Resend OTP</button>
			</p>
		</div>
		</div>
	)
}

export default Otp
