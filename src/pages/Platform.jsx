import { Link, useParams } from 'react-router-dom'
import Header from '../components/dashboard/Header'
import PlatformDropdown from '../components/dashboard/PlatformDropdown'
import { dashboardData } from '../data/dashboardData'

function Platform() {
  const { name } = useParams()

  return (
    <div className="min-h-screen bg-[#FCF2E9] text-neutral-900">
      <Header />
      <div className="flex flex-wrap gap-4 px-8 py-4">
        <PlatformDropdown title="Problem Solving Stats" to="/" items={dashboardData.problemPlatforms} />
        <PlatformDropdown title="Development Stats" to="/section/development" items={dashboardData.devPlatforms} />
        <PlatformDropdown title="Connect with me" items={dashboardData.connectLinks} />
      </div>

      <h1 className="text-3xl font-bold mt-4 capitalize">{name}</h1>
      <p className="mt-2">Is platform ke stats yahan aayenge.</p>
    </div>
  )
}

export default Platform
