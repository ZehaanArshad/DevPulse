import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getStats } from '../../api/api'
import { getUserId } from '../../api/auth'
import StatCard from '../dashboard/StatCard'

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

  return (
    <div className="flex justify-center items-center px-8 pb-4 gap-4 ">
      <StatCard label="Rating" value={data.rating ?? '—'} />
      <StatCard label="Max Rating" value={data.max_rating ?? '—'} />
      <RankCard label="Rank" value={data.rank ?? 'Unrated'} />
      <RankCard label="Max Rank" value={data.max_rank ?? 'Unrated'} />
    </div>
  )
}

export default CodeforcesStats
