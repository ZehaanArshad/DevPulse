import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getStats } from '../../api/api'
import { getUserId } from '../../api/auth'
import StatCard from '../dashboard/StatCard'
import ContributionHeatmap from '../dashboard/ContributionHeatmap'
import TopicBars from '../dashboard/TopicBars'
import { buildHeatmap } from '../../data/buildHeatmap'

function GitHubStats() {
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

  const profile = stats?.profiles.find((p) => p.platform === 'github')
  const data = profile?.stats

  if (loading) return <p className="px-8 py-4">Loading...</p>
  if (error) return <p className="px-8 py-4 text-red-600">{error}</p>

  if (!profile) {
    return (
      <p className="px-8 py-4">
        GitHub abhi link nahi hai.{' '}
        <Link to="/platform/connect" className="font-bold underline">Link karo</Link>
      </p>
    )
  }

  if (!data) {
    const rateLimited = profile.error === 'rate_limited'
    return (
      <p className="px-8 py-4">
        {rateLimited
          ? 'GitHub ne abhi limit laga di hai (rate limit). Thodi der baad dobara try karo.'
          : `"${profile.handle}" ka data nahi mila. Handle galat ho sakta hai, ya GitHub abhi respond nahi kar raha.`}
      </p>
    )
  }

  const heatmap = buildHeatmap(data.events)
  const activeDays = heatmap.cells.filter((c) => c.count > 0).length
  const languages = (data.languages ?? []).slice(0, 10)
  const topRepos = data.top_repos ?? []

  return (
    <>
      <div className="flex items-center gap-4 px-8 pb-4">
        {data.avatar_url && (
          <img
            src={data.avatar_url}
            alt={profile.handle}
            className="h-16 w-16 rounded-full border border-[#9CC0ED]"
          />
        )}
        <div>
          <h1 className="text-2xl font-bold">{data.name ?? profile.handle}</h1>
          <a
            href={`https://github.com/${profile.handle}`}
            target="_blank"
            rel="noreferrer"
            className="text-[#2061B1] underline"
          >
            @{profile.handle}
          </a>
        </div>
      </div>

      <div className="flex justify-center items-center flex-wrap px-8 pb-4 gap-4">
        <StatCard label="Public Repos" value={data.public_repos ?? 0} />
        <StatCard label="Stars Earned" value={data.stars ?? 0} />
        <StatCard label="Forks" value={data.forks ?? 0} />
        <StatCard label="Followers" value={data.followers ?? 0} />
        <StatCard label="Following" value={data.following ?? 0} />
        <StatCard label="Active Days (90d)" value={activeDays} />
      </div>

      <div className="px-8 pb-4">
        <ContributionHeatmap heatmap={heatmap} />
        <p className="mt-2 text-sm text-neutral-600">
          Based on public GitHub activity from roughly the last 90 days.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 px-8 pb-8">
        {languages.length > 0 && (
          <TopicBars topics={languages} title="Languages (by repository count)" />
        )}

        {topRepos.length > 0 && (
          <div className="backdrop-blur-xl bg-[#9CC0ED]/50 border border-[#9CC0ED] rounded-2xl p-6 hover:shadow-sm shadow-[#9CC0ED]">
            <h3 className="text-lg font-bold text-neutral-900 mb-6">Top Repositories</h3>
            <div className="flex flex-col gap-4">
              {topRepos.map((repo) => (
                <div key={repo.name} className="bg-[#FCF2E9]/50 rounded-md p-3">
                  <div className="flex items-center justify-between gap-4">
                    <a
                      href={repo.url}
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-[#2061B1] underline"
                    >
                      {repo.name}
                    </a>
                    <span className="text-sm font-semibold">★ {repo.stars}</span>
                  </div>
                  {repo.description && (
                    <p className="mt-1 text-sm text-neutral-700">{repo.description}</p>
                  )}
                  {repo.language && (
                    <p className="mt-1 text-xs text-neutral-600">{repo.language}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default GitHubStats
