import { Link } from 'react-router-dom'

function PlatformStrip({ items, activeKey }) {

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
              <Link to={item.to} className="flex items-center gap-3 px-4 py-1">
                {cardInner}
              </Link>
            ) : (
              <a href={item.url} target="_blank" rel="noreferrer" className="flex items-center gap-3 px-4 py-1">
                {cardInner}
              </a>
            )}

            {item.to && (
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                aria-label={`Open ${item.label}`}
                className="flex items-center px-4"
              >
                <span className="material-symbols-outlined text-neutral-900 hover:text-[#9CC0ED]">open_in_new</span>
              </a>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default PlatformStrip
