import { useImageUpload } from '@/components/I/uploadImage'
import { API } from '@/hooks/useApi'
import { useAuth } from '@/store/useAuth'
import { useNotification } from '@/store/useNotification'
import * as Dialog from '@radix-ui/react-dialog'
import { useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

type Category = {
  id: number
  name: string
}

export default function AddResourceDialog() {
  const { t } = useTranslation()
  const { accessToken } = useAuth()
  const { setNotification } = useNotification()
  const { uploadImage } = useImageUpload()
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const queryClient = useQueryClient()

  const [categories, setCategories] = useState<Category[]>([])
  const [categoryId, setCategoryId] = useState<number | ''>('')
  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [media, setMedia] = useState<string>('')
  const [fileName, setFileName] = useState<string | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [, setUploadError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${API}/categories`)
        setCategories(res?.data?.data || [])
      } catch (err) {
        console.error('Kategoriyalarni olishda xatolik:', err)
      }
    }
    fetchCategories()
  }, [])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setFileName(file.name)

    try {
      const data = await uploadImage(file)
      setImageUrl(data?.data)
    } catch (err) {
      console.error('Upload failed:', err)
      setUploadError('Upload failed')
    }
  }

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        `${API}/resources`,
        {
          name:title,
          description,
          media,
          image: `${API}/image/${imageUrl}`,
          categoryId: categoryId, 
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )

      if (response.status === 200 || response.status === 201) {
        setNotification(t("Resurs muvaffaqiyatli qo‘shildi"), 'success')
        queryClient.invalidateQueries({ queryKey: ['resources'] })
        setTitle('')
        setDescription('')
        setMedia('')
        setImageUrl(null)
        setCategoryId('')
        setFileName(null)
        setIsOpen(false) 
      }
    } catch (err: any) {

      setNotification(
        t("Xatolik yuz berdi:") + ' ' + (err?.response?.data?.message || err.message),
        'error'
      )
    }
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <button className='px-4 py-2 rounded text-white' style={{ backgroundColor: '#D56A42' }}>
          {t('Resurs qo‘shish')}
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className='fixed inset-0 bg-black/50 z-40 ' />
        <Dialog.Content className='fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] max-w-md bg-white dark:bg-gray-900 rounded-xl p-6 shadow-xl space-y-3'>
          <div className='flex justify-between items-start mb-2'>
            <div>
              <Dialog.Title className='text-lg font-semibold'>
                {t('Yangi resurs qo‘shish')}
              </Dialog.Title>
              <Dialog.Description className='text-sm text-gray-500'>
                {t('Iltimos, resurs haqidagi batafsil tavsifni kiriting.')}
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button className='text-gray-500 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white'>
                <X />
              </button>
            </Dialog.Close>
          </div>

          <select
            className='w-full border rounded px-3 py-2'
            value={categoryId}
            onChange={e => setCategoryId(Number(e.target.value))}
          >
            <option value=''>{t('Kategoriya tanlang')}</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <input
            type='text'
            placeholder={t('Resurs nomi')}
            className='w-full border rounded px-3 py-2'
            value={title}
            onChange={e => setTitle(e.target.value)}
          />

          <textarea
            placeholder={t('Tavsif')}
            className='w-full border rounded px-3 py-2 resize-none'
            value={description}
            onChange={e => setDescription(e.target.value)}
          />

          <input
            type='text'
            placeholder={t('Media havolasi')}
            className='w-full border rounded px-3 py-2'
            value={media}
            onChange={e => setMedia(e.target.value)}
          />

          <div>
            <p className='text-sm font-medium mb-1'>{t('Rasm (URL yoki fayl)')}</p>
            <input
              type='text'
              placeholder={t('Rasm havolasi')}
              className='w-full border rounded px-3 py-2 mb-2'
              value={imageUrl ?? ''}
              onChange={e => setImageUrl(e.target.value)}
              disabled={fileName !== null}
            />

            <div className='text-center text-sm text-gray-500'>– {t('YOKI')} –</div>

            <label className='mt-2 block'>
              <input
                type='file'
                accept='image/*'
                onChange={handleImageUpload}
                className='block w-full mt-2 text-sm'
              />
              {fileName && <p className='text-sm text-gray-700 mt-1'>{fileName}</p>}
              {imageUrl && (
                <img
                  src={`${API}/image/${imageUrl}`}
                  alt='Yuklangan rasm'
                  className='mt-2 w-32 h-32 object-cover rounded border'
                />
              )}
            </label>
          </div>

          <div className='flex justify-end gap-2 mt-4'>
            <Dialog.Close asChild>
              <button className='px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100'>
                {t('Bekor qilish')}
              </button>
            </Dialog.Close>
            <button
              className='px-4 py-2 rounded text-white hover:opacity-90'
              style={{ backgroundColor: '#D56A42' }}
              onClick={handleSubmit}
            >
              {t('Resurs qo‘shish')}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
