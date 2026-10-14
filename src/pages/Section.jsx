import { useParams } from 'react-router-dom'
import Header from '../components/dashboard/Header'
import PlatformStrip from '../components/dashboard/PlatformStrip'
import { dashboardData } from '../data/dashboardData'

const sections = {
  development: { title: 'Development Stats', items: dashboardData.devPlatforms },
  connect: { title: 'Connect with me', items: dashboardData.connectLinks },
}

function Section() {
  const { name } = useParams()
  const section = sections[name]

  return (
    <div className="min-h-screen bg-[#FCF2E9] text-neutral-900">
      <Header />

      <h1 className="text-3xl font-bold px-8 pt-6">{section ? section.title : 'Not found'}</h1>

      {section && <PlatformStrip items={section.items} />}
    </div>
  )
}

export default Section
