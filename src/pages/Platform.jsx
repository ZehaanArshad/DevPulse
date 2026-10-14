import { useParams } from 'react-router-dom'
import Header from '../components/dashboard/Header'
import PlatformStrip from '../components/dashboard/PlatformStrip'
import { dashboardData } from '../data/dashboardData'

const groups = [
  { tabTo: '/', items: dashboardData.problemPlatforms },
  { tabTo: '/section/development', items: dashboardData.devPlatforms },
]

function Platform() {
  const { name } = useParams()
  const group = groups.find((g) => g.items.some((item) => item.key === name))

  return (
    <div className="min-h-screen bg-[#FCF2E9] text-neutral-900">
      <Header activeTo={group?.tabTo} />

      {group && <PlatformStrip items={group.items} activeKey={name} />}

      <div className="px-8 py-4">
        <h1 className="text-3xl font-bold capitalize">{name}</h1>
        <p className="mt-2">Is platform ke stats yahan aayenge.</p>
      </div>
    </div>
  )
}

export default Platform
