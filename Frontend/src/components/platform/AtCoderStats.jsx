import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getStats } from '../../api/api'
import { getUserId } from '../../api/auth'
import StatCard from '../dashboard/StatCard'
import ContributionHeatmap from '../dashboard/ContributionHeatmap'
import { buildHeatmap } from '../../data/buildHeatmap'

// AtCoder ke colour tiers (backend 'rank' me colour ka naam bhejta hai)
const rankColors = {
  gray: '#808080',
  brown: '#804000',
  green: '#008000',
  cyan: '#00C0C0',
  blue: '#0000FF',
  yellow: '#C0C000',
  orange: '#FF8000',
  red: '#FF0000',
}

function RankCard({ label, value }) {
  return (
    <div className="backdrop-blur-xl bg-[#9CC0ED]/50 border border-[#9CC0ED] rounded-2xl p-5 hover:shadow-sm shadow-[#9CC0ED]">
      <p className="text-sm text-neutral-900">{label}</p>
      <p
        className="text-2xl font-bold mt-2 capitalize"
        style={{ color: rankColors[value] ?? '#2061B1' }}
      >
        {value ?? 'Unrated'}
      </p>
    </div>
  )
}

function AtCoderStats() {
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

  const profile = stats?.profiles.find((p) => p.platform === 'atcoder')
  const data = profile?.stats

  if (loading) return <p className="px-8 py-4">Loading...</p>
  if (error) return <p className="px-8 py-4 text-red-600">{error}</p>

  if (!profile) {
    return (
      <p className="px-8 py-4">
        AtCoder abhi link nahi hai.{' '}
        <Link to="/platform/connect" className="font-bold underline">Link karo</Link>
      </p>
    )
  }

  if (!data) {
    return (
      <p className="px-8 py-4">
        "{profile.handle}" ka data nahi mila. Handle galat ho sakta hai, ya AtCoder abhi respond nahi kar raha.
      </p>
    )
  }

  const heatmap = buildHeatmap(data.activity)
  const activeDays = heatmap.cells.filter((c) => c.count > 0).length

  return (
    <>
      <div className="flex justify-center items-center flex-wrap px-8 pb-4 gap-4">
        <StatCard label="Questions Solved" value={data.all ?? '—'} />
        <StatCard label="Active Days" value={activeDays} />
        <StatCard label="Contests" value={data.contests ?? 0} />
        <StatCard label="Rating" value={data.rating ?? '—'} />
        <StatCard label="Max Rating" value={data.max_rating ?? '—'} />
        <RankCard label="Rank" value={data.rank} />
        <RankCard label="Max Rank" value={data.max_rank} />
      </div>

      <div className="px-8 pb-8">
        <ContributionHeatmap heatmap={heatmap} />
      </div>
    </>
  )
}

export default AtCoderStats
