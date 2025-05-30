import { MagicCard } from '@/components/magicui/magic-card'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { lazy, Suspense } from 'react'
const Card = lazy(() => import('./card'))

type Field = {
  id: number
  name: string
  image: string
}

type MajorItem = {
  id: number
  majorId: number
  centerId: number
  createdAt: string
  updatedAt: string
}

type Center = {
  id: number
  name: string
  phone: string
  regionId: number
  address: string
  seoId: number
  image: string
  createdAt: string
  updatedAt: string
  majoritems: MajorItem
}

type Major = {
  id: number
  name: string
  image: string
  fieldId: number
  subjectId: number | null
  field: Field
  subject: any
  centers: Center[]
}

const Cards = () => {
  const getMajors = async (): Promise<Major[]> => {
    const response = await axios.get<{ data: Major[] }>(
      'https://findcourse.net.uz/api/major'
    )
    return response.data.data
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ['majors'],
    queryFn: getMajors,
  })


  const uniqueCentersMap = new Map<string, Center>()

  data?.forEach(major => {
    major.centers.forEach(center => {
      if (!uniqueCentersMap.has(center.name)) {
        uniqueCentersMap.set(center.name, center)
      }
    })
  })


  const uniqueCenters = Array.from(uniqueCentersMap.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  )

  return (
    <div className="mt-[100px] w-full px-[15px]">
      <div className="w-full grid md:grid-cols-2 lg:grid-cols-3 gap-[10px]">
        {uniqueCenters.map(center => (
          <Suspense
            key={center.id}
            fallback={
              <div className="w-full rounded-[10px] pt-0 shadow-lg animate-pulse">
                <div className="w-full h-40 bg-gray-300 rounded" />
                <div className="px-[15px] py-[15px]">
                  <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-full mb-1"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            }
          >
            <MagicCard
              gradientOpacity={0}
              className="rounded-[10px] shadow-lg overflow-hidden relative z-20 w-full p-[2px] pt-[2.5px]"
            >
              <Card center={center} />
            </MagicCard>
          </Suspense>
        ))}
      </div>
    </div>
  )
}

export default Cards
