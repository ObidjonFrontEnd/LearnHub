import { API } from '@/hooks/useApi'
import axios from 'axios'
import { useState } from 'react'

export function useImageUpload() {
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	
	const uploadImage = async (file: File) => {
		const formData = new FormData()
		formData.append('image', file)

		setLoading(true)
		setError(null)

		try {
			const response = await axios.post(
				`${API}/upload`,
				formData,
				{
					headers: {
						'Content-Type': 'multipart/form-data',
						accept: 'application/json',
					},
				}
			)

			return response.data
		} catch (err: any) {
			setError(
				err?.response?.data?.message || err.message || 'Image upload failed'
			)
			throw err
		} finally {
			setLoading(false)
		}
	}

	return { uploadImage, loading, error }
}
