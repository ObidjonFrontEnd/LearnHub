import { useAuth } from '@/store/useAuth'
import axios from 'axios'
import { useEffect } from 'react'
import { API } from './useApi'

function TokenRefresher() {
	const { refreshToken, setTokens } = useAuth()

	async function refreshAccessToken() {
		if (!refreshToken) return

		const res = await axios.post(
			`${API}/users/refreshToken`,
			{ refreshToken },
			{
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
			}
		)

		if (res?.data?.accessToken) {
			setTokens(res.data.accessToken, refreshToken)
			console.log('✅ accessToken обновлён')
		}
	}

	useEffect(() => {
		refreshAccessToken()

		const intervalId = setInterval(() => {
			refreshAccessToken()
		}, 10 * 60 * 1000)

		return () => clearInterval(intervalId)
	}, [])

	return null
}

export default TokenRefresher
