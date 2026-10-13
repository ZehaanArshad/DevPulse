import Header from '../components/dashboard/Header'
import PlatformDropdown from '../components/dashboard/PlatformDropdown'
import StatCard from '../components/dashboard/StatCard'
import ContributionHeatmap from '../components/dashboard/ContributionHeatmap'
import DifficultyDonut from '../components/dashboard/DifficultyDonut'
import TopicBars from '../components/dashboard/TopicBars'
import { dashboardData } from '../data/dashboardData'

function Dashboard() {
  return (
    <div className="min-h-screen bg-[#FCF2E9] text-neutral-100">
      <Header />

      <div className="flex flex-wrap gap-4 px-8 py-4">
        <PlatformDropdown title="Problem Solving Stats" to="/" items={dashboardData.problemPlatforms} />
        <PlatformDropdown title="Development Stats" to="/section/development" items={dashboardData.devPlatforms} />
        <PlatformDropdown title="Connect with me" items={dashboardData.connectLinks} />

      </div>

      <div className="grid grid-cols-[150px_1fr_320px] gap-4 px-8 pb-4 ">
        <div className="flex flex-col gap-4">
          <StatCard label="Questions Solved" value={dashboardData.stats.questionsSolved} />
          <StatCard label="Active Days" value={dashboardData.stats.activeDays} />
        </div>

        <ContributionHeatmap heatmap={dashboardData.heatmap} />

        <DifficultyDonut difficulty={dashboardData.difficulty} />
      </div>

      <div className="px-8 pb-8">
        <TopicBars topics={dashboardData.topics} />
      </div>
    </div>
  )
}

export default Dashboard
