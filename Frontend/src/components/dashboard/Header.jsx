import logo from '../../assets/logo.gif'
import { Link, useLocation } from 'react-router-dom'
import PlatformStrip from './PlatformStrip'
import lineAnimation from '../../assets/lineAnimation.gif'

const tabs = [
  { id: 'problem-solving', title: 'Problem Solving Stats', to: '/' },
  { id: 'development', title: 'Development Stats', to: '/platform/github' },
  { id: 'connect', title: 'Connect with me', to: '/platform/connect' },

]

function Header({ activeTo, items, activeKey }) {
  const { pathname } = useLocation()
  const onAuthPage = pathname === '/login' || pathname === '/signup'

  return (
    <header style={{ backgroundImage: `url(${lineAnimation})` }}
    className="flex items-center justify-between px-8 pt-2 pb-4 mb-4 flex-wrap font-sans">
      <a href="/" className="flex items-center gap-3 cursor-pointer">
        <img src={logo} alt="Dev Pulse logo" className="w-25 h-10 rounded-lg object-cover" />
        <span className="text-xl font-extrabold uppercase tracking-widest text-[#8A1919] cursor-pointer">Dev Pulse</span>
      </a>

      {!onAuthPage && (
        <nav className="flex items-center gap-3 shadow-sm p-1 rounded-full backdrop-blur-xl">
          {tabs.map((tab) => {
            const isCurrentPage = pathname === tab.to
            const isHighlighted = (activeTo ?? pathname) === tab.to
            const classes = `px-4 py-2 text-sm font-semibold text-neutral-900 rounded-full ${isHighlighted ? 'bg-[#9CC0ED]/50' : ' hover:shadow-sm shadow-[#9CC0ED]'
              } ${isCurrentPage ? 'cursor-default' : ''}`

            return isCurrentPage ? (
              <span key={tab.id} aria-current="page" className={classes}>
                {tab.title}
              </span>
            ) : (
              <Link key={tab.id} to={tab.to} className={classes}>
                {tab.title}
              </Link>
            )
          })}
        </nav>
      )}

      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center rounded-full text-sm text-neutral-900 shadow-sm focus-within:bg-[#9CC0ED]/50 backdrop-blur-xl">
          <span class="material-symbols-outlined text-[#9CC0ED] ml-2 my-2">search</span>
          <input
            type="text"
            placeholder="Search"
            className="w-50 h-10 outline-none placeholder-[#9CC0ED]"
          />
        </div>
        <Link to={onAuthPage ? '/' : '/login'} className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer shadow-sm focus-within:border border-[#9CC0ED] hover:bg-[#9CC0ED]/50 backdrop-blur-xl">
          <span class="material-symbols-outlined text-[#9CC0ED] text-2xl -translate-x-0.5">Login</span>
          
        </Link>
      </div>

      {items && <PlatformStrip items={items} activeKey={activeKey} />}
    </header>
  )
}

export default Header
