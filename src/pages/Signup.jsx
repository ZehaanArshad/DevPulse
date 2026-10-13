import { Link } from 'react-router-dom'
import Header from '../components/dashboard/Header'
import PlatformDropdown from '../components/dashboard/PlatformDropdown'
import { dashboardData } from '../data/dashboardData'

function Signup() {
  return (
    <div className="min-h-screen bg-[#FCF2E9] text-neutral-900">
      <Header />
      {/* <div className="flex flex-wrap gap-4 px-8 py-4">
        <PlatformDropdown title="Problem Solving Stats" to="/" items={dashboardData.problemPlatforms} />
        <PlatformDropdown title="Development Stats" to="/section/development" items={dashboardData.devPlatforms} />
        <PlatformDropdown title="Connect with me" items={dashboardData.connectLinks} />
      </div> */}

      <h1 className="text-3xl font-bold">Signup page</h1>
        <Link to="/login" className="text-indigo-400 hover:underline">
          Pehle se account hai? Login karo
        </Link>
    </div>
  )
}

export default Signup
