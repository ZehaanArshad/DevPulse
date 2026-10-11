import { useState } from 'react'
import { Link } from 'react-router-dom'


function PlatformDropdown({ title, items, to}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative flex-1 border border-[#9CC0ED] rounded-2xl hover:bg-[#9CC0ED]/50">
      <div className="w-full flex  bg-[#9CC0ED]/50 rounded-xl overflow-hidden">
        <Link
          to={to}
          className="flex-1 text-neutral-900 px-5 py-3 font-semibold"
        >
          {title}
        </Link>
        <button
          onClick={() => setOpen(!open)}
          className="px-4 py-3 border-l-2 border-[#9CC0ED] text-neutral-900 hover:bg-[#9CC0ED]"
        >
          <span className="material-symbols-outlined cursor-pointer">
            {open ? 'arrow_drop_up' : 'arrow_drop_down'}
          </span>
        </button>
      </div>


      {open && (
        <div className="absolute z-10 mt-2 backdrop-blur-xl w-full bg-[#9CC0ED]/50 rounded-xl shadow-xl overflow-hidden border-2 border-[#9CC0ED]">
          {items.map((item) => (
            <div
              key={item.key}
              className="relative flex items-stretch justify-between pl-4 border-b-2 border-[#9CC0ED] last:border-0 hover:bg-[#9CC0ED]/50"

            >
              <div className="flex items-center gap-3 py-[8px]">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center text-white text-xs font-bold ${item.color}`}
                >
                  <img src={item.initials} alt={item.label}></img>
                  
                </div>
                {item.to ? (
                  <Link to={item.to} className="text-neutral-900 font-medium hover:underline after:absolute after:inset-0">

                    {item.label}</Link>
                    ) : (
  <a
    href={item.url}
    target="_blank"
    rel="noreferrer"
    className="text-neutral-900 font-medium hover:underline after:absolute after:inset-0"
  >
    {item.label}
  </a>
)}

              </div>
              <div className="flex items-stretch gap-5">
                {item.connected && (
                  <span className="w-5 h-5 rounded-full bg-green-500 text-white text-xs flex items-center justify-center self-center">
                    ✓
                  </span>
                )}
                <a href={item.url}
                target="_blank"
                rel="noreferrer"
                aria-label={`Open ${item.label}`}
                className="relative z-10 w-[58px] border-l-2 border-[#9CC0ED] flex items-center justify-center text-neutral-500 hover:bg-[#9CC0ED]"
>
                  <span className="material-symbols-outlined">open_in_new</span>
                </a>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default PlatformDropdown
