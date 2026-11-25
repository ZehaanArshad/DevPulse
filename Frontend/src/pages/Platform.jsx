import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProfiles } from '../api/api'
import { getUserId } from '../api/auth'
import { linkablePlatforms } from '../data/linkablePlatforms'
import Header from '../components/dashboard/Header'
import { dashboardData } from '../data/dashboardData'
import LinkPlatform from './LinkPlatform'
import LeetCodeStats from '../components/platform/LeetCodeStats'
import CodeforcesStats from '../components/platform/CodeforcesStats'
import AtCoderStats from '../components/platform/AtCoderStats'



const groups = [
  { id: 'problem-solving', tabTo: '/', items: dashboardData.problemPlatforms },
  { id: 'development', tabTo: '/platform/github', items: dashboardData.devPlatforms },
  { id: 'connect', tabTo: '/platform/connect', items: dashboardData.connectLinks },
]

function Platform() {
  const { name } = useParams()
  const navigate = useNavigate()

  // Direct URL / tab se aaye aur profile add nahi hai -> connect page par bhejo
  useEffect(() => {
    if (!linkablePlatforms.includes(name)) return
    async function check() {
      try {
        const profiles = await getProfiles(getUserId())
        if (!profiles.some((p) => p.platform === name)) {
          navigate('/platform/connect', { replace: true })
        }
      } catch {
        // API fail ho to page waise hi dikhao
      }
    }
    check()
  }, [name, navigate])
  const group = groups.find((g) => g.id === name || g.items.some((item) => item.key === name))

  return (
    <div className="min-h-screen bg-[#FCF2E9] text-neutral-900">
      <Header activeTo={group?.tabTo} items={group?.items} activeKey={name} />
      
      
      {name === 'connect' ? (
        <LinkPlatform />
      ) : name === 'leetcode' ? (
      <LeetCodeStats />
    ) : name === 'codeforces' ? (
    <CodeforcesStats />
  ) : name === 'atcoder' ? (
    <AtCoderStats />
  ) : (
    <div className="px-8 py-4">
      <h1 className="text-3xl font-bold capitalize">{name}</h1>
      <p className="mt-2">Is platform ke stats yahan aayenge.</p>
      </div>
)}


    </div>
  )
}

export default Platform
