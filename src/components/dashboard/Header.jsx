// import logo from '../../assets/logo2.gif'
import logo from '../../assets/logo.gif'

function Header() {
  return (
    <header className="flex items-center justify-between px-8 py-4 border-b border-neutral-800">
      <div className="flex items-center gap-3">
        {/* TODO: apna logo yahan daalo */}
        <img src={logo} alt="Dev Pulse logo" className="w-25 h-10 rounded-lg object-cover cursor-pointer" />

        <span className="text-xl font-extrabold uppercase tracking-widest text-[#8A1919]">Dev Pulse</span>
        
      </div>

      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Search..."
          className="bg-[#9CC0ED]/50 border border-[#9CC0ED] rounded-full px-4 py-2 text-sm text-neutral-300 placeholder-[#2061B1] w-100 outline-none"
        />
        {/* TODO: apna profile icon yahan daalo */}
        <div className="w-10 h-10 rounded-full bg-[#9CC0ED] flex items-center justify-center cursor-pointer">
            <span className="material-symbols-outlined text-black text-2xl -translate-x-0.5">Login</span>
            </div>
            
      </div>
    </header>
  )
}

export default Header
