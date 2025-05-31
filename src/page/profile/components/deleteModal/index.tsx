import { FC, MouseEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import axios from 'axios'
import { useAuth } from '@/store/useAuth'
import { useUserStore } from '@/store/userData'
import { useNavigate } from 'react-router-dom'

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
}

const DeleteAccountModal: FC<DeleteAccountModalProps> = ({ isOpen, onClose, onDelete }) => {
  const { t } = useTranslation();
	const {accessToken , clearTokens} = useAuth()
	const {user , clearUser} = useUserStore()
	const navigate = useNavigate()
	

  const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
	const handleDelete = async () =>{
		const response = await axios.delete(`https://findcourse.net.uz/api/users/${user?.id}`,{
			 headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: '*/*',
      },
		})

		if(response.status === 200){
			clearTokens()
			onClose()
			clearUser()
			navigate("/")
		}
	}

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/35 bg-opacity-50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleBackdropClick}
        >
          <motion.div
            className="modal bg-white dark:bg-[#1f1f1f] p-6 rounded-xl w-full max-w-md shadow-xl"
            initial={{ scale: 0.9, y: -50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: -50, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <h2 className="text-xl font-bold mb-2">
              {t("Akkountni o'chirishni tasdiqlash")}
            </h2>
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
              {t("Akkountingizni o'chirishni istaysizmi? Bu amalni bekor qilib bo'lmaydi va barcha ma'lumotlaringiz butunlay o'chiriladi.")}
            </p>

            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-sm"
              >
                {t("Bekor qilish")}
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="uppercase flex items-center justify-center border-red-500 border-[1px] text-red-500 bg-white rounded-[6px] font-bold px-[15px] gap-[10px] py-[8px]"
								
              >
                <Trash2 size={20} /> {t("Akkountni o'chirish")}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DeleteAccountModal;
