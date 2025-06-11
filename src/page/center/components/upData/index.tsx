// components/EditPopover.tsx
import * as Popover from '@radix-ui/react-popover'
import { Pencil } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import StarRating from '@/components/ui/star'
import axios from 'axios'
import { API } from '@/hooks/useApi'
import { useAuth } from '@/store/useAuth'
import { useNotification } from '@/store/useNotification'
import { useQueryClient } from '@tanstack/react-query'

interface Props {
  commentId: number
  initialText: string
  initialStar: number
}

export default function EditPopover({ commentId, initialText, initialStar }: Props) {
  const { t } = useTranslation()
  const [text, setText] = useState(initialText)
  const [star, setStar] = useState(initialStar)
  const { accessToken } = useAuth()
  const { setNotification } = useNotification()
  const queryClient = useQueryClient()

  const handleUpdate = async () => {
    const response = await axios.patch(
      `${API}/comments/${commentId}`,
      { text, star },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
    if (response.status >= 200 && response.status < 400) {
      setNotification(t('Sharh yangilandi'), 'success')
      queryClient.invalidateQueries({ queryKey: ['comments'] })
    }
  }

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button className="text-yellow-500 hover:text-yellow-600 duration-300">
          <Pencil size={16} />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          side="bottom"
          align="end"
          className="z-50 w-[300px] rounded-md border bg-white dark:bg-gray-800 dark:text-white p-4 shadow-xl"
        >
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full border rounded resize-none p-2 mb-2"
            rows={3}
          />
          <div className="mb-3">
            <StarRating rating={star} onChange={setStar} />
          </div>
          <div className="flex justify-end gap-2">
            <Popover.Close asChild>
              <button className="px-3 py-1 bg-gray-200 rounded text-sm">
                {t("Bekor qilish")}
              </button>
            </Popover.Close>
            <Popover.Close asChild>
              <button
                onClick={handleUpdate}
                className="px-3 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600"
              >
                {t("Saqlash")}
              </button>
            </Popover.Close>
          </div>
          <Popover.Arrow className="fill-white" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
