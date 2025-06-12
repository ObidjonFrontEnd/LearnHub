import { useState, useEffect } from 'react'
import { UploadCloud } from 'lucide-react'
import axios from 'axios'
import { useImageUpload } from '@/components/I/uploadImage'
import { API } from '@/hooks/useApi'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/store/useAuth'
import { useNavigate } from 'react-router-dom'
import { useNotification } from '@/store/useNotification'

interface Region {
  id: number
  name: string
}

interface Major {
  id: number
  name: string
}
interface UploadedImage {
  data: string
}

export default function AddCenter() {
  const { t } = useTranslation()
  const { accessToken } = useAuth()
  const navigate = useNavigate()
  const { setNotification } = useNotification()

  const [fileName, setFileName] = useState('')
  const [previewUrl, setPreviewUrl] = useState('')
  const [imageUrl, setImageUrl] = useState<UploadedImage | null>(null)
  const [regions, setRegions] = useState<Region[]>([])
  const [majors, setMajors] = useState<Major[]>([])

  const [name, setName] = useState('')
  const [regionId, setRegionId] = useState<number | null>(null)
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('+998')
  const [selectedMajors, setSelectedMajors] = useState<number[]>([])

  const { uploadImage, loading, error } = useImageUpload()

  useEffect(() => {
    const fetchData = async () => {
      const [regionsRes, majorsRes] = await Promise.all([
        axios.get(`${API}/regions/search?page=1&limit=500`),
        axios.get(`${API}/major`)
      ])
      setRegions(regionsRes.data?.data || [])
      setMajors(majorsRes.data?.data || [])
    }

    fetchData()
  }, [])

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    setPreviewUrl(URL.createObjectURL(file))

    const uploaded = await uploadImage(file)
    setImageUrl(uploaded)
  }

  const handleMajorChange = (id: number) => {
    setSelectedMajors(prev =>
      prev.includes(id) ? prev.filter(mid => mid !== id) : [...prev, id]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const response = await axios.post(
      `${API}/centers`,
      {
        name,
        regionId,
        address,
        image: imageUrl?.data,
        majorsId: selectedMajors,
        phone
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    )

    if (response.status >= 200 && response.status < 300) {
      setNotification(t("Muvofiaqatli Markaz Yaratildi"), 'success')
      navigate('/seo/myCenters')
    }
  }

  return (
    <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg mt-[150px] dark:shadow-[0_0_20px_rgba(255,255,255,0.1)]">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-[#D56A42]">
        {t("O'quv Markaz Yaratish")}
      </h2>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="block mb-1 text-sm font-medium">{t("Markaz nomi")}</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Markaz nomini kiriting"
            className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:text-white shadow-lg"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">{t("Hudud")}</label>
          <select
            value={regionId ?? ''}
            onChange={e => {
              const value = e.target.value
              setRegionId(value === '' ? null : Number(value))
            }}
            className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:text-white shadow-lg"
          >
            <option value="">{t("Hududni tanlang")}</option>
            {regions.map(region => (
              <option key={region.id} value={region.id}>
                {region.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">{t("Manzil")}</label>
          <input
            type="text"
            value={address}
            onChange={e => setAddress(e.target.value)}
            placeholder={t("Manzilni kiriting")}
            className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:text-white shadow-lg"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">{t("Markaz rasmi")} *</label>
          <label className="block border-2 border-dashed rounded-md p-6 text-center cursor-pointer hover:border-[#D56A42] transition shadow-lg">
            <UploadCloud className="mx-auto text-[#D56A42]" size={36} />
            <p className="text-sm text-gray-500 mt-2">
              {t("Yuklash uchun bosing yoki faylni sudrab keling")}
            </p>
            {fileName && <p className="text-sm mt-2 text-green-500">{fileName}</p>}
            <input
              type="file"
              accept="image/*"
              className="hidden "
              onChange={handleImageChange}
            />
          </label>
          {previewUrl && <img src={previewUrl} alt="Preview" className="mt-4 h-32 object-cover rounded" />}
          {loading && <p className="text-yellow-500 mt-2">{t("Yuklanmoqda...")}</p>}
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">{t("Telefon raqami")}</label>
          <input
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:text-white shadow-lg"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">
            {t("Yo'nalishlar (kamida bittasini tanlang)")}
          </label>
          <div className="grid grid-cols-2 gap-2">
            {majors.map(major => (
              <label key={major.id} className="inline-flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={major.id}
                  checked={selectedMajors.includes(major.id)}
                  onChange={() => handleMajorChange(major.id)}
                  className="form-checkbox text-[#D56A42] "
                />
                <span className="text-gray-700 dark:text-white">{major.name}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-md bg-[#D56A42] text-white font-semibold hover:bg-[#bd532f] transition"
        >
          {t("Markaz qo'shish")}
        </button>
      </form>
    </div>
  )
}
