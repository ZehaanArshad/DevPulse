import { useState, useEffect } from 'react'
import { dashboardData } from '../data/dashboardData'
import { getProfiles, linkProfile, deleteProfile } from '../api/api'
import { getUserId } from '../api/auth'



const logos = [...dashboardData.devPlatforms, ...dashboardData.problemPlatforms]

const platforms = [
  { key: 'leetcode', label: 'LeetCode', prefix: 'https://leetcode.com/u/', supported: true },
  { key: 'codeforces', label: 'CodeForces', prefix: 'https://codeforces.com/profile/', supported: true },
  { key: 'atcoder', label: 'AtCoder', prefix: 'https://atcoder.jp/users/', supported: false },
  { key: 'geeksforgeeks', label: 'GeeksForGeeks', prefix: 'https://www.geeksforgeeks.org/user/', supported: false },
]

function logoFor(key) {
  return logos.find((p) => p.key === key)?.initials
}

function LinkPlatform() {
  const [handles, setHandles] = useState({})
  const [profiles, setProfiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busyKey, setBusyKey] = useState(null)
  
  useEffect(() => {
    async function load() {
    try {
      setProfiles(await getProfiles(getUserId()))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  load()
}, [])


  function handleChange(key, value) {
    setHandles({ ...handles, [key]: value })
  }

  async function handleSubmit(key) {
    const handle = (handles[key] ?? '').trim()
    if (!handle) {
      setError('Handle daalo')
      return
    }

    try {
      setBusyKey(key)
      setError('')
      const created = await linkProfile(getUserId(), key, handle)
      setProfiles([...profiles, created])
      setHandles({ ...handles, [key]: '' })
    } catch (err) {
      setError(err.message)
    } finally {
      setBusyKey(null)
    }
  }

  async function handleDelete(profileId) {
    if (!window.confirm('Ye profile hata dein?')) return

    try {
      setError('')
      await deleteProfile(getUserId(), profileId)
      setProfiles(profiles.filter((x) => x.id !== profileId))
    } catch (err) {
      setError(err.message)
    }
  }


  return (
    <div className="px-8 py-4 text-neutral-900">
      <h1 className="text-4xl font-semibold">Platforms</h1>
      <p className="mt-1 text-neutral-500">You can update and verify your platform details here.</p>

      <h2 className="mt-10 text-3xl font-semibold">Development</h2>
      <div className="mt-5 flex items-center gap-4">
        <img src={logoFor('github')} alt="GitHub" className="h-10 w-10" />
        <span className="w-48 text-xl font-semibold">GitHub</span>
        <button
          type="button"
          disabled
          className="rounded-md border border-neutral-300 bg-neutral-100 px-5 py-2 disabled:opacity-60"
        >
          Coming soon
        </button>
      </div>

      <hr className="my-8 border-t-4 border-neutral-300" />

      <h2 className="text-3xl font-semibold">Problem Solving</h2>
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      {loading && <p className="mt-3 text-neutral-500">Loading...</p>}
      <div className="mt-5 flex flex-col gap-4">
        {platforms.map((p) => {
  const linked = profiles.find((x) => x.platform === p.key)

  return (
    <div key={p.key} className="flex items-center gap-4">
      <img src={logoFor(p.key)} alt={p.label} className="h-10 w-10 object-contain" />
      <span className="w-48 text-xl font-semibold">{p.label}</span>

      {linked ? (
        <>
          <div className="flex flex-1 items-center rounded-md border border-green-300 bg-green-50 px-4 py-2">
            <span className="whitespace-nowrap">{p.prefix}</span>
            <span className="ml-1 font-semibold">{linked.handle}</span>
          </div>
          <button
            type="button"
            onClick={() => handleDelete(linked.id)}
            className="rounded-md border border-red-300 bg-white px-6 py-2 text-red-600 hover:bg-red-50"
          >
            Delete
          </button>
        </>
      ) : (
        <>
          <div className="flex flex-1 items-center rounded-md border border-neutral-300 bg-neutral-50 px-4 py-2">
            <span className="whitespace-nowrap">{p.prefix}</span>
            <input
              type="text"
              placeholder="zehaan"
              value={handles[p.key] ?? ''}
              onChange={(e) => handleChange(p.key, e.target.value)}
              className="ml-1 flex-1 bg-transparent outline-none placeholder:text-neutral-400"
            />
          </div>
          <button
            type="button"
            disabled={!p.supported || busyKey === p.key}
            onClick={() => handleSubmit(p.key)}
            className="rounded-md border border-neutral-300 bg-white px-6 py-2 disabled:opacity-50"
          >
            {!p.supported ? 'Coming soon' : busyKey === p.key ? 'Saving...' : 'Submit'}
          </button>
        </>
      )}
    </div>
  )
})}
      </div>
    </div>
  )
}

export default LinkPlatform
