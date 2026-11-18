import Header from '../components/dashboard/Header'
import StatCard from '../components/dashboard/StatCard'
import ContributionHeatmap from '../components/dashboard/ContributionHeatmap'
import DifficultyDonut from '../components/dashboard/DifficultyDonut'
import TopicBars from '../components/dashboard/TopicBars'
import { dashboardData } from '../data/dashboardData'
import { buildHeatmap } from '../data/buildHeatmap'

import { useState, useEffect } from 'react'
import { getStats } from '../api/api'
import { getUserId } from '../api/auth'


function Dashboard() {
  const [stats, setStats] = useState(null)
const [loading, setLoading] = useState(true)
const [error, setError] = useState('')

useEffect(() => {
  async function load() {
    try {
      setStats(await getStats(getUserId()))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  load()
}, [])
// console.log(stats)
const summary = stats?.summary ?? {}

const heatmap = buildHeatmap(summary.activity)


const profiles = stats?.profiles ?? []
const cf = profiles.find((p) => p.platform === 'codeforces')?.stats


const totalSolved = profiles.reduce((sum, p) => sum + (p.stats?.all ?? 0), 0)

const difficulty = profiles.reduce(
  (acc, p) => ({
    total: acc.total + (p.stats?.all ?? 0),
    easy: acc.easy + (p.stats?.easy ?? 0),
    medium: acc.medium + (p.stats?.medium ?? 0),
    hard: acc.hard + (p.stats?.hard ?? 0),
  }),
  { total: 0, easy: 0, medium: 0, hard: 0 }
)

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FCF2E9]">
        <Header items={dashboardData.problemPlatforms} />
        <p className="px-8 text-neutral-900">Loading...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#FCF2E9]">
        <Header items={dashboardData.problemPlatforms} />
        <p className="px-8 text-red-600">{error}</p>
      </div>
    )
  }


  return (
    <div className="min-h-screen bg-[#FCF2E9] text-neutral-100 ">
      <Header items={dashboardData.problemPlatforms} />


      <div className="flex px-8 pb-4">
        <div className="flex gap-4">
          <StatCard label="Questions Solved" value={totalSolved} />
          <StatCard label="Active Days" value={summary.active_days ?? 0} />
          {cf && (
            <>
              <StatCard label="Rating" value={cf.rating ?? '—'} />
              <StatCard label="Max Rating" value={cf.max_rating ?? '—'} />
              <StatCard label="Rank" value={cf.rank ?? 'Unrated'} />
              <StatCard label="Max Rank" value={cf.max_rank ?? 'Unrated'} />
            </>
          )}



        </div>

        {/* <ContributionHeatmap heatmap={dashboardData.heatmap} /> */}

        {/* <DifficultyDonut difficulty={dashboardData.difficulty} /> */}
      </div>

      <div className="grid grid-cols-[1fr_320px] gap-4 px-8 pb-4">
        <ContributionHeatmap heatmap={heatmap} />

        <DifficultyDonut difficulty={difficulty} />
      </div>

      <div className="px-8 pb-8">
        {(summary.topics ?? []).length > 0 && (
          <TopicBars topics={summary.topics.slice(0, 10)} />
        )}
      </div>

    </div>
  )
}

export default Dashboard
