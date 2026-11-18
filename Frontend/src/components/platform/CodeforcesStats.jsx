import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getStats } from '../../api/api'
import { getUserId } from '../../api/auth'
import StatCard from '../dashboard/StatCard'
import DifficultyDonut from '../dashboard/DifficultyDonut'
import ContributionHeatmap from '../dashboard/ContributionHeatmap'
import TopicBars from '../dashboard/TopicBars'
import { buildHeatmap } from '../../data/buildHeatmap'


function RankCard({ label, value }) {
  return (
    <div className="backdrop-blur-xl bg-[#9CC0ED]/50 border border-[#9CC0ED] rounded-2xl p-5 hover:shadow-sm shadow-[#9CC0ED]">
      <p className="text-sm text-neutral-900">{label}</p>
      <p className="text-2xl font-bold text-[#2061B1] mt-2 capitalize">{value}</p>
    </div>
  )
}

function CodeforcesStats() {
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

  const profile = stats?.profiles.find((p) => p.platform === 'codeforces')
  const data = profile?.stats

  if (loading) return <p className="px-8 py-4">Loading...</p>
  if (error) return <p className="px-8 py-4 text-red-600">{error}</p>

  if (!profile) {
    return (
      <p className="px-8 py-4">
        Codeforces abhi link nahi hai.{' '}
        <Link to="/platform/connect" className="font-bold underline">Link karo</Link>
      </p>
    )
  }

  if (!data) {
    return (
      <p className="px-8 py-4">
        "{profile.handle}" ka data nahi mila. Handle galat ho sakta hai, ya Codeforces abhi respond nahi kar raha.
      </p>
    )
  }

  const heatmap = buildHeatmap(data.activity)
  const activeDays = heatmap.cells.filter((c) => c.count > 0).length

  
  return (
    <>
      <div className="flex justify-center items-center px-8 pb-4 gap-4 ">
        <StatCard label="Questions Solved" value={data.all ?? 0} />
        <StatCard label="Active Days" value={activeDays} />
        <StatCard label="Rating" value={data.rating ?? '—'} />
        <StatCard label="Max Rating" value={data.max_rating ?? '—'} />
        <RankCard label="Rank" value={data.rank ?? 'Unrated'} />
        <RankCard label="Max Rank" value={data.max_rank ?? 'Unrated'} />
      </div>

      <div className="grid grid-cols-[1fr_320px] gap-4 px-8 pb-4">
        <ContributionHeatmap heatmap={heatmap} />
        <DifficultyDonut
          difficulty={{
            total: data.all ?? 0,
            easy: data.easy ?? 0,
            medium: data.medium ?? 0,
            hard: data.hard ?? 0,
          }}
        />
      </div>

      <div className="px-8 pb-8">
        {(data.topics ?? []).length > 0 && (
          <TopicBars topics={data.topics.slice(0, 10)} />
        )}
      </div>
    </>
  )

}

export default CodeforcesStats
