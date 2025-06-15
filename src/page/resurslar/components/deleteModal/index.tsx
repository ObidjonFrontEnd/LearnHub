
import * as Popover from '@radix-ui/react-popover'
import { Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { ReactNode } from 'react'
import { Button } from '@/components/ui/button'

interface Props {
  onConfirm: () => void
  children?: ReactNode 
}

export default function DeletePopover({ onConfirm, children }: Props) {
  const { t } = useTranslation()

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        {children ?? (
          <Button
							variant='destructive'
							size='sm'
							className='flex items-center gap-1'
						>
							<Trash2 size={16} /> {t("O‘chirish")}
					</Button>
        )}
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
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
