import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getProfiles } from '../../api/api'
import { getUserId } from '../../api/auth'
import { linkablePlatforms as linkable } from '../../data/linkablePlatforms'
const profilePrefix = {
  leetcode: 'https://leetcode.com/u/',
  codeforces: 'https://codeforces.com/profile/',
}


function PlatformStrip({ items, activeKey }) {
  const [profiles, setProfiles] = useState([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        setProfiles(await getProfiles(getUserId()))
        setLoaded(true)
      } catch {
        // fail ho to bas base URL chalega
      }
    }
    load()
  }, [])

  function profileUrl(item) {
    const linked = profiles.find((p) => p.platform === item.key)
    const prefix = profilePrefix[item.key]
    return linked && prefix ? prefix + linked.handle : item.url
  }

  // Linkable platform (leetcode/codeforces) ka profile add nahi hai -> connect page par bhejo
  function needsLink(item) {
    return loaded && linkable.includes(item.key) && !profiles.some((p) => p.platform === item.key)
  }

  return (
    <div className="flex items-center justify-center flex-wrap gap-4 shadow-sm p-1 rounded-full backdrop-blur-xl w-fit mx-auto my-5 font-sans">

      {items.map((item) => {
        const cardInner = (
          <>
            <img src={item.initials} alt={item.label} className="w-10 h-10 rounded-lg object-contain" />
            <span className="text-neutral-900 font-medium">{item.label}</span>
          </>
        )

        return (
          
          <div
            key={item.key}
            className={`flex items-stretch  rounded-full overflow-hidden ${item.key === activeKey ? 'bg-[#9CC0ED]/50' : 'hover:shadow-sm shadow-[#9CC0ED]'
              }`}
          >

            {item.to ? (
              <Link to={needsLink(item) ? '/platform/connect' : item.to} className="flex items-center gap-3 px-4 py-1">

                {cardInner}
              </Link>
            ) : (
              <a href={profileUrl(item)} target="_blank" rel="noreferrer" className="flex items-center gap-3 px-4 py-1">
                {cardInner}
              </a>
            )}

            {item.to && (
              needsLink(item) ? (
                <Link
                  to="/platform/connect"
                  aria-label={`Connect ${item.label}`}
                  className="flex items-center px-4  border-l border-[#9CC0ED]"
                >
                  <span className="material-symbols-outlined text-neutral-900 hover:text-[#9CC0ED]">open_in_new</span>
                </Link>
              ) : (
                <a
                  href={profileUrl(item)}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Open ${item.label}`}
                  className="flex items-center px-4  border-l border-[#9CC0ED]"
                >
                  <span className="material-symbols-outlined text-neutral-900 hover:text-[#9CC0ED]">open_in_new</span>
                </a>
              )
            )}
          </div>
        )
      })}
    </div>
  )
}

export default PlatformStrip
