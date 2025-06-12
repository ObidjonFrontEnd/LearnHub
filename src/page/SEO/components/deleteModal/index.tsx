
import * as Popover from '@radix-ui/react-popover'
import { Trash } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { ReactNode } from 'react'

interface Props {
  onConfirm: () => void
  children?: ReactNode 
}

export default function DeletePopover({ onConfirm, children }: Props) {
  const { t } = useTranslation()

  return (
    <Popover.Root >
      <Popover.Trigger asChild onClick={e => {
            e.stopPropagation()
          }}>
        {children ?? (
          <button
          onClick={e => {
            e.stopPropagation()
          }}
          className='bg-white/80 p-1.5 rounded-full shadow hover:bg-white hover:scale-[1.1] duration-300'
        >
          <Trash size={16} className='text-red-600' />
        </button>
        )}
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content onClick={e => {
            e.stopPropagation()
          }}
          side="bottom"
          align="end"
          className="z-50 w-64 rounded-md border bg-white dark:bg-gray-800 dark:shadow-[0_0_20px_rgba(255,255,255,0.1)] p-4 shadow-xl"
        >
          <p className="text-sm text-gray-800 dark:text-white mb-3">
            {t("Haqiqatan ham oʻchirib tashlamoqchimisiz?")}
          </p>
          <div className="flex justify-end gap-2">
            <Popover.Close className="px-3 py-1 rounded dark:text-black bg-gray-200 text-sm">
              {t("Bekor qilish")}
            </Popover.Close>
            <button
              onClick={onConfirm}
              className="px-3 py-1 bg-red-500 dark:text-white text-white rounded hover:bg-red-600 text-sm"
            >
              {t("O'chirish")}
            </button>
          </div>
          <Popover.Arrow className="fill-white" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
