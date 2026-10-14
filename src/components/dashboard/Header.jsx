import logo from '../../assets/logo.gif'
import { Link, useLocation } from 'react-router-dom'

const tabs = [
  { id: 'problem-solving', title: 'Problem Solving Stats', to: '/' },
    { id: 'development', title: 'Development Stats', to: '/platform/github' },
    { id: 'connect', title: 'Connect with me', to: '/platform/connect' },

]

function Header({ activeTo }) {
  const { pathname } = useLocation()
  const onAuthPage = pathname === '/login' || pathname === '/signup'

  return (
    <header className="flex items-center justify-between px-8 py-4 border-b border-[#9CC0ED] flex-wrap ">
      <a href="/" className="flex items-center gap-3 cursor-pointer">
        <img src={logo} alt="Dev Pulse logo" className="w-25 h-10 rounded-lg object-cover" />
        <span className="text-xl font-extrabold uppercase tracking-widest text-[#8A1919] cursor-pointer">Dev Pulse</span>
      </a>

      {!onAuthPage && (
        <nav className="flex items-center gap-3 shadow-sm p-1 rounded-full backdrop-blur-xl">
          {tabs.map((tab) => {
            const isCurrentPage = pathname === tab.to
            const isHighlighted = (activeTo ?? pathname) === tab.to
            const classes = `px-4 py-2 text-sm font-semibold text-neutral-900 rounded-full ${
              isHighlighted ? 'bg-[#9CC0ED]/50' : ' hover:shadow-sm shadow-[#9CC0ED]'
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
        <input
          type="text"
          placeholder="Search..."
          className="bg-[#9CC0ED]/50 border border-[#9CC0ED] rounded-full px-4 py-2 text-sm text-neutral-900 placeholder-[#2061B1] w-100 outline-none hover:shadow-sm shadow-[#9CC0ED] focus:shadow"
        />
        <Link to={onAuthPage ? '/' : '/login'} className="w-10 h-10 rounded-full bg-[#9CC0ED]/50 border border-[#9CC0ED] flex items-center justify-center cursor-pointer hover:shadow-sm shadow-[#9CC0ED]">
          <span className="material-symbols-outlined text-black text-2xl -translate-x-0.5">Login</span>
        </Link>
      </div>
    </header>
  )
}

export default Header
