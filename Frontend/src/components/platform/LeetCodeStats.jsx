import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getStats } from '../../api/api'
import { getUserId } from '../../api/auth'
import StatCard from '../dashboard/StatCard'
import DifficultyDonut from '../dashboard/DifficultyDonut'

function LeetCodeStats() {
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

  const profile = stats?.profiles.find((p) => p.platform === 'leetcode')
  const data = profile?.stats

  if (loading) return <p className="px-8 py-4">Loading...</p>
  if (error) return <p className="px-8 py-4 text-red-600">{error}</p>

  if (!profile) {
    return (
      <p className="px-8 py-4">
        LeetCode abhi link nahi hai.{' '}
        <Link to="/platform/connect" className="font-bold underline">Link karo</Link>
      </p>
    )
  }

  if (!data) {
    return (
      <p className="px-8 py-4">
        "{profile.handle}" ka data nahi mila. Handle galat ho sakta hai, ya LeetCode abhi respond nahi kar raha.
      </p>
    )
  }

  return (
    // _1fr
    <>
      <div className="grid grid-cols-[150px_320px] gap-4 px-8 pb-4">
        <div className="flex flex-col gap-4">
          <StatCard label="Questions Solved" value={data.all} />
          {/* <StatCard label="Active Days" value={dashboardData.stats.activeDays} /> */}
        </div>

        {/* <ContributionHeatmap heatmap={dashboardData.heatmap} /> */}

        <DifficultyDonut
          difficulty={{ total: data.all, easy: data.easy, medium: data.medium, hard: data.hard }}
        />
      </div>

      <div className="px-8 pb-8">
        {/* <TopicBars topics={dashboardData.topics} /> */}
      </div>
    </>
  )
}

export default LeetCodeStats
