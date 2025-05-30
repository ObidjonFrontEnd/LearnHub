

import { useAuth } from '@/store/useAuth'
import { useUserStore } from '@/store/userData'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { ChevronDown, LogOut, Pencil } from 'lucide-react'; // Удалил неиспользуемый импорт User
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

export default function ProfileMenu() {
  const [isOpenProfileMenu,setOpenProfileMenu ] = useState<boolean>(false);
  const { setUser } = useUserStore.getState();
  const {clearTokens} = useAuth()
 
  

 const getUserData = async (accessToken: string) => { // Добавил явный тип
  const response = await axios.get(
    'https://findcourse.net.uz/api/users/mydata',
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
   
  );
   if (response.status === 200) {
       setUser(response.data.data);
    }
  return response.data;
};
   const { accessToken } = useAuth();

  const { data } = useQuery({
    queryKey: ['user'],
    queryFn: () => getUserData(accessToken),
    enabled: !!accessToken,
  });
  

  const logOut=()=>{
      clearTokens()
  }
    const { t } = useTranslation()
  return (
    <div className="relative inline-block text-left">
      <button
        onClick={()=>{setOpenProfileMenu(!isOpenProfileMenu)}}
        className="flex items-center gap-2 group px-4 py-2 rounded-full cursor-pointer  transition"
      >
        <div className="w-8 h-8 rounded-full group bg-gray-200 border border-purple-500 flex items-center justify-center" ><img src={`${data?.data?.image === "default.jpg" ? (data?.data?.image): (`https://findcourse.net.uz/api/image/${data?.data?.image}`)}`} alt="user foto" /></div>
        <span className="font-medium text-sm dark:text-white text-gray-800">{data?.data?.firstName} {data?.data?.lastName}</span>
        <ChevronDown className={`${isOpenProfileMenu ? "rotate-[180deg]" : ""}  duration-[0.3s]`} size={16} />
      </button>

      {isOpenProfileMenu && (
        <div className="absolute right-0 mt-2 w-64  dark:bg-gray-800 bg-white border rounded-xl shadow-lg z-10 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 border border-purple-500 flex justify-center items-center"><img src={`${data?.data?.image === "default.jpg" ? (data?.data?.image): (`https://findcourse.net.uz/api/image/${data?.data?.image}`)}`} alt="user foto" /></div>
            <div>
              <p className="font-semibold text-sm text-gray-900 dark:text-white">{data?.data?.firstName} {data?.data?.lastName}</p>
              <p className="text-xs text-gray-500">{data?.data?.email}</p>
            </div>
          </div>

          <div className="mt-4">
            <Link to={"profile"} className="flex items-center text-purple-700 text-sm gap-2 hover:underline">
              <Pencil size={16} /> {t("Profilni tahrirlash")}
            </Link>
          </div>

          <div className="mt-3 border-t pt-3">
            <button onClick={logOut} className="flex items-center text-red-500 text-sm gap-2 hover:underline">
              <LogOut size={16} /> {t("Chiqish")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
