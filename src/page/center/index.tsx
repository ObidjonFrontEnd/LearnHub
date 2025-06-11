
import { useQuery} from '@tanstack/react-query'
import axios from 'axios'
import { useState } from 'react'
import {  Link, useParams } from 'react-router-dom'
import DarsgaYozilishModal from './components/modal'
import { API } from '@/hooks/useApi'
import Chap from './components/chap'
import { ArrowLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import Ong from './components/ong'



export interface Center {
  id: number;
  name: string;
  phone: string;
  regionId: number;
  address: string;
  image: string;
  seoId: number;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  image: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: number;
  text: string;
  star: number;
  userId: number;
  centerId: number;
  createdAt: string;
  updatedAt: string;
  user: User;
  center: Center;
}


const Center = () => {
	const { id } = useParams()
	const { t } = useTranslation()


	const getCenter = async (id: string) => {
		const response = await axios.get(`${API}/centers/${id}`)
		return response?.data
	}
	const { data } = useQuery({
		queryKey: ['Center', id],
		queryFn: () => getCenter(id!),
		enabled: !!id,
	})

	const [isModal, setModal] = useState<boolean>(false)


	const handelClose = (): void => {
		setModal(false)
	}

	const getCommnet = async () =>{
		const response = await axios.get(`${API}/comments`)
		return response?.data?.data
	}

	const { data:comments } = useQuery<Comment[]>({
	queryKey: ['comments'],
	queryFn: getCommnet,

})

	
const filteredComments: Comment[] | undefined = comments?.filter(
  (comment) => comment.centerId === Number(id)
);

	

	const getAverageStars = (comments: Comment[] | undefined): number => {
  if (!comments || comments.length === 0) return 0;

  const totalStars = comments.reduce((sum, comment) => sum + comment.star, 0);
  return parseFloat((totalStars / comments.length).toFixed(1));
};
	const averageStars = getAverageStars(filteredComments);
	
	

	

	return (
		<section className='mt-[150px] mb-[50px] px-[10px] w-full'>
			<Link
					to={'/'}
					className='flex gap-[10px] items-center text-[#D56A42] font-bold text-[20px]'
				>
					{' '}
					<ArrowLeft />
					{t('Bosh sahifaga qaytish')}
				</Link>
			<div className="mt-[25px] w-full h-full shadow-[0_0_10px_rgba(0,0,0,0.2)] rounded-[8px] overflow-hidden pb-[50px] dark:shadow-[0_0_20px_rgba(255,255,255,0.1)]">
				<DarsgaYozilishModal
				id={data?.data?.id}
				mojors={data?.data?.majors}
				filials={data?.data?.filials}
				isModal={isModal}
				close={handelClose}
			/>
				<div className="flex flex-col lg:flex-row gap-[30px]">
					<Chap data={data} averageStars={averageStars} setModal={setModal}/>
					<Ong data={data} averageStars={averageStars} filteredComments={filteredComments || []} />
				</div>
			</div>
		</section>
	)
}

export default Center
